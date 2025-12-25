import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Edit, Loader2 } from "lucide-react";
import { useUpdateAttendance } from "@/queries/attendance/attendanceQueries";
import { DatePicker } from "@/components/ui/DatePicker";
import type { Attendance } from "@/types/attendance/attendance";
import toast from "react-hot-toast";

interface EditAttendanceDialogProps {
  attendance: Attendance;
}

export function EditAttendanceDialog({ attendance }: EditAttendanceDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(attendance.date));
  const [formData, setFormData] = useState({
    status: attendance.status,
    total_work_hours: attendance.total_work_hours,
  });

  const updateAttendanceMutation = useUpdateAttendance();

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedDate(new Date(attendance.date));
      setFormData({
        status: attendance.status,
        total_work_hours: attendance.total_work_hours,
      });
    }
  }, [open, attendance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateAttendanceMutation.mutateAsync({
        id: attendance.id,
        date: selectedDate.toISOString().split("T")[0],
        ...formData,
      });
      toast.success("Attendance record updated successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update attendance record");
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          <DialogTitle>Edit Attendance Record</DialogTitle>
          <DialogDescription>
            Update attendance record for {attendance.employee?.first_name}{" "}
            {attendance.employee?.last_name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              disabled={updateAttendanceMutation.isPending}
              className="flex-1"
            >
              {updateAttendanceMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Attendance"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={updateAttendanceMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
