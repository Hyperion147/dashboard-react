
import type { CompanyFormData, FormData } from "@/types/company/main-types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dummyCompany } from "@/data/dummy";

// Create company mutation
async function createCompany(data: FormData) {
  // Mock create
  return { ...dummyCompany, ...data };
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
      return dummyCompany;
    },
    enabled: !!id,
    initialData: dummyCompany,
  });
}

// Update company details
export function useUpdateCompanyDetail(id: string) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, CompanyFormData>({
    mutationFn: async (data) => {
      // Mock update
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-detail", id] });
    },
  });
}
