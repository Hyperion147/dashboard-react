import { useState } from "react";
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
import { Textarea } from "@repo/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { useCreatePayroll } from "@/queries/payroll/payrollQueries";
import { DatePicker } from "@/components/ui/DatePicker";
import toast from "react-hot-toast";

interface CreatePayrollDialogProps {
  companyId: string;
}

export function CreatePayrollDialog({ companyId }: CreatePayrollDialogProps) {
  const [open, setOpen] = useState(false);
  const [periodStart, setPeriodStart] = useState<Date | undefined>(undefined);
  const [periodEnd, setPeriodEnd] = useState<Date | undefined>(undefined);
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    status: "draft" as const,
    total_gross: 0,
    total_deductions: 0,
    total_net: 0,
    notes: "",
  });

  const createPayrollMutation = useCreatePayroll();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!periodStart || !periodEnd || !paymentDate) {
      toast.error("Please fill in all required date fields");
      return;
    }

    if (periodEnd < periodStart) {
      toast.error("Period end date must be after start date");
      return;
    }

    try {
      await createPayrollMutation.mutateAsync({
        company_id: companyId,
        pay_period_start: periodStart.toISOString().split("T")[0],
        pay_period_end: periodEnd.toISOString().split("T")[0],
        payment_date: paymentDate.toISOString().split("T")[0],
        status: formData.status,
        total_gross: Number(formData.total_gross) || 0,
        total_deductions: Number(formData.total_deductions) || 0,
        total_net: Number(formData.total_net) || 0,
        notes: formData.notes,
      });
      toast.success("Payroll created successfully");
      setOpen(false);
      // Reset form
      setPeriodStart(undefined);
      setPeriodEnd(undefined);
      setPaymentDate(undefined);
      setFormData({
        status: "draft",
        total_gross: 0,
        total_deductions: 0,
        total_net: 0,
        notes: "",
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create payroll");
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
          Create Payroll
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Payroll</DialogTitle>
          <DialogDescription>
            Create a new payroll period for your company
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="period_start">
                Period Start <span className="text-destructive">*</span>
              </Label>
              <DatePicker
                date={periodStart}
                onDateChange={setPeriodStart}
                placeholder="Select start date"
              />
            </div>

            <div>
              <Label htmlFor="period_end">
                Period End <span className="text-destructive">*</span>
              </Label>
              <DatePicker
                date={periodEnd}
                onDateChange={setPeriodEnd}
                placeholder="Select end date"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="payment_date">
              Payment Date <span className="text-destructive">*</span>
            </Label>
            <DatePicker
              date={paymentDate}
              onDateChange={setPaymentDate}
              placeholder="Select payment date"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="gross_salary">
                Total Gross Salary <span className="text-destructive">*</span>
              </Label>
              <Input
                id="gross_salary"
                type="number"
                step="0.01"
                min="0"
                value={formData.total_gross}
                onChange={(e) =>
                  handleChange("total_gross", parseFloat(e.target.value) || 0)
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="deductions">
                Total Deductions <span className="text-destructive">*</span>
              </Label>
              <Input
                id="deductions"
                type="number"
                step="0.01"
                min="0"
                value={formData.total_deductions}
                onChange={(e) =>
                  handleChange("total_deductions", parseFloat(e.target.value) || 0)
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="net_salary">
                Total Net Salary <span className="text-destructive">*</span>
              </Label>
              <Input
                id="net_salary"
                type="number"
                step="0.01"
                min="0"
                value={formData.total_net}
                onChange={(e) =>
                  handleChange("total_net", parseFloat(e.target.value) || 0)
                }
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              className="resize-none"
              placeholder="Add any notes about this payroll..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="submit"
              disabled={createPayrollMutation.isPending}
              className="flex-1"
            >
              {createPayrollMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Payroll"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createPayrollMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
