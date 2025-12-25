import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Download,
  DollarSign,
  Calendar,
  FileText,
  User,
} from "lucide-react";
import { useEmployeePayslips } from "@/queries/payroll/payrollQueries";
import type { Payslip } from "@/types/payroll/payroll";
import { format } from "date-fns";
import { gsap } from "gsap";

export function EmployeePayslips() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const empId = employeeId!;

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { data: payslips, isLoading, error } = useEmployeePayslips(empId);

  const formatCurrency = (amount: number | undefined) => {
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
    status: Payslip["status"]
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "paid":
        return "default";
      case "sent":
        return "secondary";
      case "generated":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
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

      gsap.from(".payslip-card", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.2,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [payslips]);

  if (!employeeId) {
    return (
      <div className="p-4">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="font-medium text-destructive">Invalid employee ID</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="font-medium text-destructive">
              Error loading payslips
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const employeeName =
    payslips && payslips.length > 0
      ? `${payslips[0].employee?.first_name} ${payslips[0].employee?.last_name}`
      : "Employee";

  return (
    <div ref={containerRef} className="space-y-6 p-4">
      {/* Header */}
      <div ref={headerRef} className="flex items-center gap-4">
        <Link to="/payslips">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">{employeeName} - Payslips</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            {payslips?.length || 0} payslip(s) found
          </p>
        </div>
      </div>

      {/* Payslips List */}
      {payslips && payslips.length > 0 ? (
        <div className="space-y-4">
          {payslips.map((payslip) => {
            const paymentDate = payslip.payment_date
              ? new Date(payslip.payment_date)
              : new Date();
            const isValidDate = !isNaN(paymentDate.getTime());

            return (
              <Card key={payslip.id} className="payslip-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Payslip -{" "}
                      {isValidDate ? format(paymentDate, "MMMM yyyy") : "N/A"}
                    </CardTitle>
                    <Badge variant={getStatusColor(payslip.status)}>
                      {payslip.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Payment Date
                        </p>
                      </div>
                      <p className="font-semibold">
                        {isValidDate
                          ? format(paymentDate, "MMM dd, yyyy")
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <p className="text-sm text-muted-foreground">
                          Base Pay
                        </p>
                      </div>
                      <p className="font-semibold text-blue-600">
                        {formatCurrency(payslip.base_pay)}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-muted-foreground">
                          Gross Pay
                        </p>
                      </div>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(payslip.gross_pay)}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-purple-600" />
                        <p className="text-sm text-muted-foreground">Net Pay</p>
                      </div>
                      <p className="font-semibold text-purple-600">
                        {formatCurrency(payslip.net_pay)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No payslips found</h3>
            <p className="text-muted-foreground">
              This employee doesn't have any payslips yet
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
