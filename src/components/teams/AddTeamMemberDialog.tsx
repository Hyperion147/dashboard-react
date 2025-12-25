import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useCompanyEmployees } from "@/queries/employee/employee";
import { useUpdateEmployee } from "@/queries/employee/employee";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface AddTeamMemberDialogProps {
  teamId: string;
  companyId: string;
  currentMembers?: any[];
}

export function AddTeamMemberDialog({ 
  teamId, 
  companyId,
  currentMembers = []
}: AddTeamMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const queryClient = useQueryClient();
  const { data: allEmployees } = useCompanyEmployees(companyId);
  const updateEmployeeMutation = useUpdateEmployee();

  // Filter out employees already in the team
  const availableEmployees = allEmployees?.filter(
    (emp) => !currentMembers.some((member) => member.id === emp.id)
  );

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedEmployee("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployee) {
      toast.error("Please select an employee");
      return;
    }

    try {
      await updateEmployeeMutation.mutateAsync({
        id: selectedEmployee,
        team_id: teamId,
      });
      
      // Invalidate team data to refetch with updated members
      await queryClient.invalidateQueries({
        queryKey: ["teams", teamId],
      });
      
      await queryClient.refetchQueries({
        queryKey: ["teams", teamId],
        type: 'active',
      });
      
      toast.success("Team member added successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add team member");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Select an employee to add to this team
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="employee">
              Employee <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedEmployee}
              onValueChange={setSelectedEmployee}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {availableEmployees && availableEmployees.length > 0 ? (
                  availableEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.first_name} {employee.last_name} ({employee.idd})
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No available employees
                  </div>
                )}
              </SelectContent>
            </Select>
            {availableEmployees && availableEmployees.length === 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                All employees are already assigned to this team
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="submit"
              disabled={updateEmployeeMutation.isPending || !selectedEmployee}
              className="flex-1"
            >
              {updateEmployeeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Member"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={updateEmployeeMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
