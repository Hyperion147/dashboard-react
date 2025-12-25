import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../client";
import type { Employee } from "@/types/employees/employee";

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

// Fetch all employees by company ID
export function useCompanyEmployees(companyId: string) {
  return useQuery({
    queryKey: ["company-employees", companyId],
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponse<Employee[]>>(
        `/employees/company/${companyId}`
      );
      return response.data.data;
    },
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch single employee by ID
export function useEmployeeDetail(employeeId: string) {
  return useQuery({
    queryKey: ["employee-detail", employeeId],
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponse<Employee>>(
        `/employees/${employeeId}/view`
      );
      return response.data.data;
    },
    enabled: !!employeeId && employeeId !== "",
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

// Update employee
export function useUpdateEmployee(employeeId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Employee> & { id?: string; team_id?: string }) => {
      const id = data.id || employeeId;
      if (!id) throw new Error("Employee ID is required");
      
      const { id: _, ...updateData } = data;
      const response = await axiosClient.patch<ApiResponse<Employee>>(
        `/employees/${id}/update`,
        updateData
      );
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch the specific team's employees if team_id was updated
      if (variables.team_id) {
        queryClient.invalidateQueries({
          queryKey: ["employees", "team", variables.team_id],
        });
      }
      
      // Invalidate employee detail
      queryClient.invalidateQueries({
        queryKey: ["employee-detail", data.id],
      });
      
      // Invalidate company employees
      queryClient.invalidateQueries({
        queryKey: ["company-employees", data.company_id],
      });
    },
  });
}

// Create employee
export function useCreateEmployee(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Employee, "id" | "createdAt" | "updatedAt" | "deletedAt" | "company">) => {
      const response = await axiosClient.post<ApiResponse<Employee>>("/employees", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["company-employees", companyId],
      });
    },
  });
}

// Delete employee
export function useDeleteEmployee(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeId: string) => {
      await axiosClient.delete(`/employees/${employeeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["company-employees", companyId],
      });
    },
  });
}
