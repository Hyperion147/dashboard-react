export interface PayrollEmployee {
  id: number
  name: string
  salary: string
  lastPay: string
  status: "Paid" | "Pending"
}

export interface PaymentHistory {
  date: string
  employee: string
  amount: string
  type: string
  status: string
}

export interface PayrollReport {
  name: string
  month: string
  employees: number
}

export const employees: PayrollEmployee[] = [
  { id: 1, name: "Sarah Chen", salary: "$8,500", lastPay: "Jan 15, 2024", status: "Paid" },
  { id: 2, name: "Mike Johnson", salary: "$9,200", lastPay: "Jan 15, 2024", status: "Paid" },
  { id: 3, name: "Emily Rodriguez", salary: "$8,800", lastPay: "Jan 15, 2024", status: "Paid" },
  { id: 4, name: "Alex Kumar", salary: "$7,500", lastPay: "Jan 15, 2024", status: "Pending" },
]

export const paymentHistory: PaymentHistory[] = [
  { date: "Jan 15, 2024", employee: "Sarah Chen", amount: "$8,500", type: "Regular", status: "Paid" },
  { date: "Jan 15, 2024", employee: "Mike Johnson", amount: "$9,200", type: "Regular", status: "Paid" },
  {
    date: "Jan 15, 2024",
    employee: "Emily Rodriguez",
    amount: "$8,800",
    type: "Regular",
    status: "Paid",
  },
  { date: "Jan 10, 2024", employee: "Sarah Chen", amount: "$1,500", type: "Bonus", status: "Paid" },
]

export const payrollReports: PayrollReport[] = [
  { name: "Monthly Payroll Report", month: "January 2024", employees: 4 },
  { name: "Tax Summary Report", month: "Q4 2023", employees: 4 },
  { name: "Deduction Report", month: "January 2024", employees: 4 },
]

export const payrollSummary = {
  totalPayroll: "$34,000",
  paid: "$25,500",
  pending: "$7,500",
  totalDeductions: "$13,920",
}

