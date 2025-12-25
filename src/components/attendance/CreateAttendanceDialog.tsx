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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useCreateAttendance } from "@/queries/attendance/attendanceQueries";
import { useCompanyEmployees } from "@/queries/employee/employee";
import { DatePicker } from "@/components/ui/DatePicker";
import toast from "react-hot-toast";

interface CreateAttendanceDialogProps {
  companyId: string;
}

export function CreateAttendanceDialog({ companyId }: CreateAttendanceDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    employee_id: "",
    status: "present" as const,
    total_work_hours: 8,
  });

  const createAttendanceMutation = useCreateAttendance();
  const { data: employees } = useCompanyEmployees(companyId);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedDate(new Date());
      setFormData({
        employee_id: "",
        status: "present",
        total_work_hours: 8,
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.employee_id || !selectedDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createAttendanceMutation.mutateAsync({
        employee_id: formData.employee_id,
        company_id: companyId,
        date: selectedDate.toISOString().split("T")[0],
        status: formData.status,
        total_work_hours: formData.total_work_hours,
      });
      toast.success("Attendance record created successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create attendance record");
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Attendance
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Attendance Record</DialogTitle>
          <DialogDescription>
            Create a new attendance record for an employee
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="employee">
              Employee <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.employee_id}
              onValueChange={(value) => handleChange("employee_id", value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees?.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name} ({employee.idd})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">
              Date <span className="text-destructive">*</span>
            </Label>
            <DatePicker
              date={selectedDate}
              onDateChange={(date) => date && setSelectedDate(date)}
              placeholder="Select date"
            />
          </div>

          <div>
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="leave">Leave</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
                <SelectItem value="half_day">Half Day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="work_hours">
              Total Work Hours <span className="text-destructive">*</span>
            </Label>
            <Input
              id="work_hours"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={formData.total_work_hours}
              onChange={(e) => handleChange("total_work_hours", parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="submit"
              disabled={createAttendanceMutation.isPending}
              className="flex-1"
            >
              {createAttendanceMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Attendance"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createAttendanceMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
