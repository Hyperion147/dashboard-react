
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Employee } from "@/types/employees/employee";
import { dummyEmployee, dummyEmployeesList } from "@/data/dummy";

// Fetch all employees by company ID
export function useCompanyEmployees(companyId: string) {
  return useQuery({
    queryKey: ["company-employees", companyId],
    queryFn: async () => {
      // Return dummy list
      return dummyEmployeesList as Employee[];
    },
    enabled: !!companyId,
    initialData: dummyEmployeesList as Employee[],
  });
}

// Fetch single employee by ID
export function useEmployeeDetail(employeeId: string) {
  return useQuery({
    queryKey: ["employee-detail", employeeId],
    queryFn: async () => {
      // Return dummy single employee
      return dummyEmployee as Employee;
    },
    enabled: !!employeeId && employeeId !== "",
    initialData: dummyEmployee as Employee,
  });
}

// Update employee
export function useUpdateEmployee(employeeId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Employee> & { id?: string; team_id?: string }) => {
      // Mock update
      return { ...dummyEmployee, ...data } as Employee;
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
    mutationFn: async (data: any) => {
      // Mock create
      return { ...dummyEmployee, ...data } as Employee;
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
      // Mock delete
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["company-employees", companyId],
      });
    },
  });
}
