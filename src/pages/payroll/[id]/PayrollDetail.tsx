import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  Trash2,
  Download,
} from "lucide-react";
import {
  usePayroll,
  usePayrollPayslips,
  useDeletePayslip,
} from "@/queries/payroll/payrollQueries";
import { CreatePayslipDialog } from "@/components/payroll/CreatePayslipDialog";
import type { Payroll, Payslip } from "@/types/payroll/payroll";
import { format } from "date-fns";
import { gsap } from "gsap";
import toast from "react-hot-toast";

export function PayrollDetail() {
  const { id } = useParams<{ id: string }>();
  const payrollId = id!;

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const { data: payroll, isLoading, error } = usePayroll(payrollId);
  const { data: payslips, isLoading: payslipsLoading } = usePayrollPayslips(payrollId);
  const deletePayslipMutation = useDeletePayslip();

  // If no ID, show error
  if (!id) {
    return (
      <div className="p-4">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <p className="font-medium">Invalid payroll ID</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    const numAmount = Number(amount);
    if (isNaN(numAmount)) {
      return "$0.00";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numAmount);
  };

  const getStatusColor = (
    status: Payroll["status"] | Payslip["status"]
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "paid":
        return "default";
      case "sent":
        return "secondary";
      case "draft":
      case "generated":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleDeletePayslipClick = (payslipId: string, employeeName: string) => {
    setDeleteConfirm({ id: payslipId, name: employeeName });
  };

  const handleDeletePayslipConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await deletePayslipMutation.mutateAsync(deleteConfirm.id);
      toast.success("Payslip deleted successfully");
    } catch (error) {
      toast.error("Failed to delete payslip");
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.from(".detail-card", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.2,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [payroll]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full lg:col-span-2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !payroll) {
    return (
      <div className="p-4">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <p className="font-medium">Error loading payroll</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6 p-4">
      {/* Header */}
      <div ref={headerRef} className="flex items-center gap-4">
        <Link to="/managepayroll">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">
              Payroll: {format(new Date(payroll.pay_period_start), "MMM dd")} -{" "}
              {format(new Date(payroll.pay_period_end), "MMM dd, yyyy")}
            </h1>
            <Badge variant={getStatusColor(payroll.status)}>{payroll.status}</Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Payment Date: {format(new Date(payroll.payment_date), "MMM dd, yyyy")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payroll Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="detail-card">
            <CardHeader>
              <CardTitle>Payroll Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Gross</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(payroll.total_gross)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Deductions</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(payroll.total_deductions)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Net</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(payroll.total_net)}
                  </p>
                </div>
              </div>

              {payroll.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{payroll.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payslips */}
          <Card className="detail-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Employee Payslips ({payslips?.length || 0})</CardTitle>
                <CreatePayslipDialog
                  payrollId={payrollId}
                  companyId={payroll.company_id}
                  paymentDate={payroll.payment_date}
                />
              </div>
            </CardHeader>
            <CardContent>
              {payslipsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : payslips && payslips.length > 0 ? (
                <div className="space-y-3">
                  {payslips.map((payslip) => (
                    <div
                      key={payslip.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">
                            {payslip.employee?.first_name} {payslip.employee?.last_name}
                          </p>
                          <Badge variant={getStatusColor(payslip.status)} className="text-xs">
                            {payslip.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {payslip.employee?.idd} • {payslip.employee?.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Gross</p>
                          <p className="font-semibold">
                            {formatCurrency(payslip.gross_pay)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Net</p>
                          <p className="font-semibold text-green-600">
                            {formatCurrency(payslip.net_pay)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDeletePayslipClick(
                                payslip.id,
                                `${payslip.employee?.first_name} ${payslip.employee?.last_name}`
                              )
                            }
                            disabled={deletePayslipMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No payslips created yet</p>
                  <p className="text-sm mt-1">Add payslips for employees in this payroll period</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="detail-card">
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Period</p>
                <p className="font-medium">
                  {format(new Date(payroll.pay_period_start), "MMM dd")} -{" "}
                  {format(new Date(payroll.pay_period_end), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Date</p>
                <p className="font-medium">
                  {format(new Date(payroll.payment_date), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={getStatusColor(payroll.status)} className="mt-1">
                  {payroll.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employees</p>
                <p className="text-2xl font-bold">{payslips?.length || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="detail-card">
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Gross Salary</p>
                  <p className="font-semibold">{formatCurrency(payroll.total_gross)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Deductions</p>
                  <p className="font-semibold">{formatCurrency(payroll.total_deductions)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Net Salary</p>
                  <p className="font-semibold text-blue-600">
                    {formatCurrency(payroll.total_net)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        onConfirm={handleDeletePayslipConfirm}
        title="Delete Payslip"
        description={`Are you sure you want to delete the payslip for ${deleteConfirm?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
