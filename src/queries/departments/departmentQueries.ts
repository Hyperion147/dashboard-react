
import { useQuery } from "@tanstack/react-query";
import { dummyDepartment } from "@/data/dummy";

export interface Department {
  id: string;
  company_id: string;
  name: string;
  code: string;
  description: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

// Get departments by company
export const useCompanyDepartments = (companyId: string) => {
  return useQuery({
    queryKey: ["departments", "company", companyId],
    queryFn: async () => {
      // Cast dummyDepartment to Department list (array)
      return [dummyDepartment] as unknown as Department[];
    },
    enabled: !!companyId,
    initialData: ([dummyDepartment] as unknown as Department[]),
  });
};

// Get department by ID
export const useDepartment = (departmentId: string) => {
  return useQuery({
    queryKey: ["departments", departmentId],
    queryFn: async () => {
       return dummyDepartment as unknown as Department;
    },
    enabled: !!departmentId,
    initialData: (dummyDepartment as unknown as Department),
  });
};
