import { useQuery } from "@tanstack/react-query";
import apiClient from "../client";

interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

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
      const response = await apiClient.get<ApiResponse<Department[]>>(`/departments/company/${companyId}`);
      return response.data.data;
    },
    enabled: !!companyId,
  });
};

// Get department by ID
export const useDepartment = (departmentId: string) => {
  return useQuery({
    queryKey: ["departments", departmentId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Department>>(`/departments/${departmentId}/view`);
      return response.data.data;
    },
    enabled: !!departmentId,
  });
};
