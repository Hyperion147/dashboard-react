import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../client";
import type { Department } from "@/types/company/main-types";

export function useCompanyDepartments(companyId: string) {
  return useQuery<Department[]>({
    queryKey: ['departments', companyId],
    queryFn: async () => {
      const response = await axiosClient.get(`/departments/company/${companyId}`);
      return response.data.data;
    },
    enabled: Boolean(companyId),
  });
}

// Create department
export function useCreateDepartment(companyId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (departmentData: Omit<Department, 'id' | 'companyId'>) => {
      const response = await axiosClient.post('/departments/create', {
        company_id: companyId,
        name: departmentData.name,
        code: departmentData.code,
        description: departmentData.description,
        status: departmentData.status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments', companyId] });
    },
  });
}

// Update department
export function useUpdateCompanyDepartment(departmentId: string, companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (departmentData: Partial<Department>) => {
      const response = await axiosClient.patch(`/departments/${departmentId}/update`, {
        name: departmentData.name,
        code: departmentData.code,
        description: departmentData.description,
        status: departmentData.status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments', companyId] });
    },
  });
}

// Delete department
export function useDeleteDepartment(companyId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (departmentId: string) => {
      const response = await axiosClient.delete(`/departments/${departmentId}/delete`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments', companyId] });
    },
  });
}
