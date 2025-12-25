import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";
import type {
  Payroll,
  Payslip,
  CreatePayrollData,
  UpdatePayrollData,
  CreatePayslipData,
} from "@/types/payroll/payroll";

interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

// ============ PAYROLL QUERIES ============

// Get payrolls by company
export const useCompanyPayrolls = (companyId: string) => {
  return useQuery({
    queryKey: ["payrolls", "company", companyId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Payroll[]>>(
        `/payrolls/company/${companyId}`
      );
      return response.data.data;
    },
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get payroll by ID
export const usePayroll = (payrollId: string) => {
  return useQuery({
    queryKey: ["payrolls", payrollId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Payroll>>(
        `/payrolls/${payrollId}`
      );
      return response.data.data;
    },
    enabled: !!payrollId,
  });
};

// Create payroll
export const useCreatePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePayrollData) => {
      const response = await apiClient.post<ApiResponse<Payroll>>(
        "/payrolls",
        data
      );
      return response.data.data;
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
      const response = await apiClient.put<ApiResponse<Payroll>>(
        `/payrolls/${id}`,
        data
      );
      return response.data.data;
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
      const response = await apiClient.delete<ApiResponse<void>>(
        `/payrolls/${payrollId}`
      );
      return response.data;
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
      const response = await apiClient.get<ApiResponse<Payslip[]>>(
        `/payslips/payroll/${payrollId}`
      );
      return response.data.data;
    },
    enabled: !!payrollId,
  });
};

// Get payslips by employee
export const useEmployeePayslips = (employeeId: string) => {
  return useQuery({
    queryKey: ["payslips", "employee", employeeId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Payslip[]>>(
        `/payslips/employee/${employeeId}`
      );
      return response.data.data;
    },
    enabled: !!employeeId,
  });
};

// Get payslip by ID
export const usePayslip = (payslipId: string) => {
  return useQuery({
    queryKey: ["payslips", payslipId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Payslip>>(
        `/payslips/${payslipId}`
      );
      return response.data.data;
    },
    enabled: !!payslipId,
  });
};

// Create payslip
export const useCreatePayslip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePayslipData) => {
      const response = await apiClient.post<ApiResponse<Payslip>>(
        "/payslips",
        data
      );
      return response.data.data;
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
      const response = await apiClient.put<ApiResponse<Payslip>>(
        `/payslips/${id}`,
        data
      );
      return response.data.data;
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
      const response = await apiClient.delete<ApiResponse<void>>(
        `/payslips/${payslipId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payslips"] });
    },
  });
};
