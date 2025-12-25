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
import { useCreatePayslip } from "@/queries/payroll/payrollQueries";
import { useCompanyEmployees } from "@/queries/employee/employee";
import { DatePicker } from "@/components/ui/DatePicker";
import toast from "react-hot-toast";

interface CreatePayslipDialogProps {
  payrollId: string;
  companyId: string;
  paymentDate: string;
}

export function CreatePayslipDialog({
  payrollId,
  companyId,
  paymentDate,
}: CreatePayslipDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(paymentDate));
  const [formData, setFormData] = useState({
    employee_id: "",
    base_pay: 0,
    gross_pay: 0,
    net_pay: 0,
    status: "generated" as const,
  });

  const createPayslipMutation = useCreatePayslip();
  const { data: employees } = useCompanyEmployees(companyId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.employee_id) {
      toast.error("Please select an employee");
      return;
    }

    try {
      await createPayslipMutation.mutateAsync({
        payroll_id: payrollId,
        employee_id: formData.employee_id,
        base_pay: Number(formData.base_pay) || 0,
        gross_pay: Number(formData.gross_pay) || 0,
        net_pay: Number(formData.net_pay) || 0,
        payment_date: selectedDate.toISOString().split("T")[0],
        status: formData.status,
      });
      toast.success("Payslip created successfully");
      setOpen(false);
      // Reset form
      setFormData({
        employee_id: "",
        base_pay: 0,
        gross_pay: 0,
        net_pay: 0,
        status: "generated",
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create payslip");
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate net pay: base_pay + allowances - deductions = net_pay
      // For now, gross_pay = base_pay (can add allowances later)
      if (field === "base_pay") {
        updated.gross_pay = Number(value) || 0;
        updated.net_pay = updated.gross_pay;
      }
      
      return updated;
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Payslip
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Employee Payslip</DialogTitle>
          <DialogDescription>
            Add a payslip for an employee in this payroll period
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
              <SelectTrigger>
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
            <Label htmlFor="base_pay">
              Base Pay <span className="text-destructive">*</span>
            </Label>
            <Input
              id="base_pay"
              type="number"
              step="0.01"
              min="0"
              value={formData.base_pay}
              onChange={(e) =>
                handleChange("base_pay", parseFloat(e.target.value) || 0)
              }
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Employee's base salary
            </p>
          </div>

          <div>
            <Label htmlFor="gross_pay">
              Gross Pay <span className="text-destructive">*</span>
            </Label>
            <Input
              id="gross_pay"
              type="number"
              step="0.01"
              min="0"
              value={formData.gross_pay}
              onChange={(e) =>
                handleChange("gross_pay", parseFloat(e.target.value) || 0)
              }
              required
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Auto-calculated from base pay
            </p>
          </div>

          <div>
            <Label htmlFor="net_pay">
              Net Pay <span className="text-destructive">*</span>
            </Label>
            <Input
              id="net_pay"
              type="number"
              step="0.01"
              min="0"
              value={formData.net_pay}
              onChange={(e) =>
                handleChange("net_pay", parseFloat(e.target.value) || 0)
              }
              required
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Final amount after deductions
            </p>
          </div>

          <div>
            <Label htmlFor="payment_date">
              Payment Date <span className="text-destructive">*</span>
            </Label>
            <DatePicker
              date={selectedDate}
              onDateChange={(date) => date && setSelectedDate(date)}
              placeholder="Select payment date"
            />
          </div>

          <div>
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="generated">Generated</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="submit"
              disabled={createPayslipMutation.isPending}
              className="flex-1"
            >
              {createPayslipMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Payslip"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createPayslipMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
