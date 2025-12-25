import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";
import { Input } from "@repo/ui/input";
import { Skeleton } from "@repo/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import {
  Search,
  Trash2,
  Calendar as CalendarIcon,
  FileText,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { format } from "date-fns";
import { gsap } from "gsap";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  useCompanyPayrolls,
  useDeletePayroll,
} from "@/queries/payroll/payrollQueries";
import { CreatePayrollDialog } from "@/components/payroll/CreatePayrollDialog";
import { EditPayrollStatusDialog } from "@/components/payroll/EditPayrollStatusDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Payroll } from "@/types/payroll/payroll";
import toast from "react-hot-toast";

export function PayrollManagement() {
  const params = useParams<{ companyId: string }>();
  const { companyId: authCompanyId } = useAuth();
  const companyId = params.companyId || authCompanyId;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; period: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { data: payrolls, isLoading } = useCompanyPayrolls(companyId || "");
  const deletePayrollMutation = useDeletePayroll();

  // Filter payrolls
  const filteredPayrolls = useMemo(() => {
    if (!payrolls) return [];

    return payrolls.filter((payroll) => {
      const matchesSearch =
        format(new Date(payroll.pay_period_start), "MMM yyyy")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payroll.notes?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || payroll.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payrolls, searchTerm, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!payrolls || payrolls.length === 0) {
      return {
        totalPayroll: 0,
        totalGross: 0,
        totalDeductions: 0,
        totalNet: 0,
        paid: 0,
        draft: 0,
      };
    }

    const totalGross = payrolls.reduce((sum, p) => {
      const amount = Number(p.total_gross);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    const totalDeductions = payrolls.reduce((sum, p) => {
      const amount = Number(p.total_deductions);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    const totalNet = payrolls.reduce((sum, p) => {
      const amount = Number(p.total_net);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    const paid = payrolls.filter((p) => p.status === "paid").length;
    const draft = payrolls.filter((p) => p.status === "draft").length;

    return {
      totalPayroll: payrolls.length,
      totalGross,
      totalDeductions,
      totalNet,
      paid,
      draft,
    };
  }, [payrolls]);

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
    status: Payroll["status"]
  ): "default" | "secondary" | "outline" => {
    switch (status) {
      case "paid":
        return "default";
      case "draft":
        return "outline";
      default:
        return "outline";
    }
  };

  const handleDeleteClick = (payrollId: string | undefined, period: string) => {
    if (!payrollId) {
      toast.error("Invalid payroll ID");
      return;
    }
    setDeleteConfirm({ id: payrollId, period });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await deletePayrollMutation.mutateAsync(deleteConfirm.id);
      toast.success("Payroll deleted successfully");
    } catch (error) {
      toast.error("Failed to delete payroll");
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

      gsap.from(".stat-card", {
        opacity: 0,
        y: -30,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.2,
        ease: "power2.out",
      });

      gsap.from(".payroll-item", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.05,
        delay: 0.4,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [filteredPayrolls]);

  return (
    <div ref={containerRef} className="space-y-6 p-4">
      {/* Header */}
      <div
        ref={headerRef}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold">Payroll Management</h2>
          <p className="text-muted-foreground">
            Manage company payroll and payments
          </p>
        </div>
        <CreatePayrollDialog companyId={companyId || ""} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Payrolls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayroll}</div>
            <p className="text-xs text-muted-foreground">
              {stats.paid} paid, {stats.draft} draft
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Gross
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalGross)}
            </div>
            <p className="text-xs text-muted-foreground">Before deductions</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Deductions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(stats.totalDeductions)}
            </div>
            <p className="text-xs text-muted-foreground">Taxes & Benefits</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Net
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.totalNet)}
            </div>
            <p className="text-xs text-muted-foreground">After deductions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Payroll Records</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payrolls..."
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filteredPayrolls.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No payrolls found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first payroll to get started"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <CreatePayrollDialog companyId={companyId || ""} />
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPayrolls.map((payroll) => {
                // Handle both 'id' and 'payroll_id' field names
                const payrollId = payroll.id || (payroll as any).payroll_id;
                
                return (
                <div
                  key={payrollId}
                  className="payroll-item flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Link 
                    to={`/payroll/${payrollId}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      <h4 className="font-semibold">
                        {format(
                          new Date(payroll.pay_period_start),
                          "MMM dd"
                        )}{" "}
                        -{" "}
                        {format(new Date(payroll.pay_period_end), "MMM dd, yyyy")}
                      </h4>
                      <Badge variant={getStatusColor(payroll.status)}>
                        {payroll.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Payment Date:{" "}
                      {format(new Date(payroll.payment_date), "MMM dd, yyyy")}
                    </p>
                    {payroll.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {payroll.notes}
                      </p>
                    )}
                  </Link>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Gross</p>
                      <p className="font-semibold">
                        {formatCurrency(payroll.total_gross)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Net</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(payroll.total_net)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <EditPayrollStatusDialog payroll={{ ...payroll, id: payrollId }} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteClick(
                            payrollId,
                            format(
                              new Date(payroll.pay_period_start),
                              "MMM yyyy"
                            )
                          );
                        }}
                        disabled={deletePayrollMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Payroll"
        description={`Are you sure you want to delete payroll for ${deleteConfirm?.period}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
