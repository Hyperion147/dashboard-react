
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Department } from "@/types/company/main-types";
import { dummyDepartment } from "@/data/dummy";

export function useCompanyDepartments(companyId: string) {
  return useQuery<Department[]>({
    queryKey: ['departments', companyId],
    queryFn: async () => {
      // return dummy
      return [dummyDepartment] as unknown as Department[];
    },
    enabled: Boolean(companyId),
    initialData: ([dummyDepartment] as unknown as Department[]),
  });
}

// Create department
export function useCreateDepartment(companyId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (departmentData: any) => {
      return { ...dummyDepartment, ...departmentData } as unknown as Department;
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
    mutationFn: async (departmentData: any) => {
      return { ...dummyDepartment, ...departmentData } as unknown as Department;
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
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments', companyId] });
    },
  });
}
