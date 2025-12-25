export interface Payroll {
  id: string;
  payroll_id: string;
  company_id: string;
  pay_period_start: string;
  pay_period_end: string;
  payment_date: string;
  status: "draft" | "paid";
  total_gross: number;
  total_deductions: number;
  total_net: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Payslip {
  id: string;
  payroll_id: string;
  employee_id: string;
  base_pay: number;
  gross_pay: number;
  net_pay: number;
  payment_date: string;
  status: "generated" | "sent" | "paid" | "cancelled";
  created_at: string;
  updated_at: string;
  employee?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    idd: string;
  };
}

export interface CreatePayrollData {
  company_id: string;
  pay_period_start: string;
  pay_period_end: string;
  payment_date: string;
  status: "draft" | "paid";
  total_gross: number;
  total_deductions: number;
  total_net: number;
  notes?: string;
}

export interface UpdatePayrollData {
  payment_date?: string;
  status?: "draft" | "paid";
  total_gross?: number;
  total_deductions?: number;
  total_net?: number;
  notes?: string;
}

export interface CreatePayslipData {
  payroll_id: string;
  employee_id: string;
  base_pay: number;
  gross_pay: number;
  net_pay: number;
  payment_date: string;
  status: "generated" | "sent" | "paid" | "cancelled";
}
