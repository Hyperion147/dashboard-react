
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Payroll,
  Payslip,
  CreatePayrollData,
  UpdatePayrollData,
  CreatePayslipData,
} from "@/types/payroll/payroll";

const dummyPayroll: Payroll = {
    id: "payroll-001",
    company_id: "comp-001",
    month: "2024-01",
    status: "finalized",
    total_amount: 100000,
    created_at: "2024-01-31",
    updated_at: "2024-01-31",
    payslips: []
};

const dummyPayslip: Payslip = {
    id: "payslip-001",
    payroll_id: "payroll-001",
    employee_id: "emp-001",
    basic_salary: 50000,
    hra: 20000,
    allowances: 10000,
    deductions: 5000,
    net_salary: 75000,
    status: "paid",
    created_at: "2024-01-31",
    updated_at: "2024-01-31",
    employee: {
        id: "emp-001",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        idd: "EMP-001"
    }
};

// ============ PAYROLL QUERIES ============

// Get payrolls by company
export const useCompanyPayrolls = (companyId: string) => {
  return useQuery({
    queryKey: ["payrolls", "company", companyId],
    queryFn: async () => {
      // Mock payrolls
      return [dummyPayroll] as Payroll[];
    },
    enabled: !!companyId,
    initialData: ([dummyPayroll] as Payroll[]),
  });
};

// Get payroll by ID
export const usePayroll = (payrollId: string) => {
  return useQuery({
    queryKey: ["payrolls", payrollId],
    queryFn: async () => {
      return dummyPayroll as Payroll;
    },
    enabled: !!payrollId,
    initialData: (dummyPayroll as Payroll),
  });
};

// Create payroll
export const useCreatePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePayrollData) => {
      return { ...dummyPayroll, ...data } as Payroll;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["payrolls", "company", variables.company_id],
      });
    },
  });
};

// Update payroll
export const useUpdatePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: UpdatePayrollData & { id: string }) => {
       return { ...dummyPayroll, id, ...data } as Payroll;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["payrolls", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["payrolls", "company", data.company_id],
      });
    },
  });
};

// Delete payroll
export const useDeletePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payrollId: string) => {
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
    },
  });
};

// ============ PAYSLIP QUERIES ============

// Get payslips by payroll
export const usePayrollPayslips = (payrollId: string) => {
  return useQuery({
    queryKey: ["payslips", "payroll", payrollId],
    queryFn: async () => {
      return [dummyPayslip] as Payslip[];
    },
    enabled: !!payrollId,
    initialData: ([dummyPayslip] as Payslip[]),
  });
};

// Get payslips by employee
export const useEmployeePayslips = (employeeId: string) => {
  return useQuery({
    queryKey: ["payslips", "employee", employeeId],
    queryFn: async () => {
      return [dummyPayslip] as Payslip[];
    },
    enabled: !!employeeId,
    initialData: ([dummyPayslip] as Payslip[]),
  });
};

// Get payslip by ID
export const usePayslip = (payslipId: string) => {
  return useQuery({
    queryKey: ["payslips", payslipId],
    queryFn: async () => {
      return dummyPayslip as Payslip;
    },
    enabled: !!payslipId,
    initialData: (dummyPayslip as Payslip),
  });
};

// Create payslip
export const useCreatePayslip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
       return { ...dummyPayslip, ...data } as Payslip;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["payslips", "payroll", data.payroll_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["payslips", "employee", data.employee_id],
      });
    },
  });
};

// Update payslip
export const useUpdatePayslip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<CreatePayslipData> & { id: string }) => {
       return { ...dummyPayslip, id, ...data } as Payslip;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["payslips", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["payslips", "payroll", data.payroll_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["payslips", "employee", data.employee_id],
      });
    },
  });
};

// Delete payslip
export const useDeletePayslip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payslipId: string) => {
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payslips"] });
    },
  });
};
