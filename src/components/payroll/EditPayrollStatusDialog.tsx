import { useState } from "react";
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
import { Edit, Loader2 } from "lucide-react";
import { useUpdatePayroll } from "@/queries/payroll/payrollQueries";
import type { Payroll } from "@/types/payroll/payroll";
import toast from "react-hot-toast";

interface EditPayrollStatusDialogProps {
  payroll: Payroll;
}

export function EditPayrollStatusDialog({
  payroll,
}: EditPayrollStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Payroll["status"]>(payroll.status);

  const updatePayrollMutation = useUpdatePayroll();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === payroll.status) {
      toast.error("No changes to save");
      return;
    }

    try {
      await updatePayrollMutation.mutateAsync({
        id: payroll.payroll_id || payroll.id || "",
        status,
      });
      toast.success("Payroll status updated successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update payroll status"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Payroll Status</DialogTitle>
          <DialogDescription>
            Change the status of this payroll period
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as Payroll["status"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              Current status:{" "}
              <span className="font-medium capitalize">{payroll.status}</span>
            </p>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="submit"
              disabled={
                updatePayrollMutation.isPending || status === payroll.status
              }
              className="flex-1"
            >
              {updatePayrollMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={updatePayrollMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
