import type { CompanyFormData, FormData } from "@/types/company/main-types";
import axiosClient from "../client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Create company mutation
async function createCompany(data: FormData) {
  try {
    const response = await axiosClient.post(`/companies/create`, {
      name: data.name,
      type: data.type,
      description: data.description,
      address_1: data.address_1,
      address_2: data.address_2,
      address_3: data.address_3,
      landmark: data.landmark,
      city: data.city,
      area: data.area,
      state: data.state,
      country: data.country,
      pincode: data.pincode,
      zone: data.zone,
      status: data.status,
    });
    return response.data;
  } catch {
    throw new Error("Failed to create company");
  }
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}

// Fetch single company details
export function useCompanyDetail(id: string) {
  return useQuery({
    queryKey: ["company-detail", id],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(`/companies/${id}/view`);
        return response.data.data;
      } catch {
        throw new Error("Failed to fetch company");
      }
    },
    enabled: !!id,
  });
}

// Update company details
export function useUpdateCompanyDetail(id: string) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, CompanyFormData>({
    mutationFn: async (data) => {
      try {
        const response = await axiosClient.patch(`/companies/${id}/update`, data);
        return response.data;
      } catch {
        throw new Error("Failed to update company");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-detail", id] });
    },
  });
}
