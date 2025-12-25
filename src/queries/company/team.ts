import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../client";
import type { Team } from "@/types/company/main-types";

// Fetch teams by department
export function useDepartmentTeams(departmentId: string) {
  return useQuery({
    queryKey: ["department-teams", departmentId],
    queryFn: async () => {
      const response = await axiosClient.get<Team[]>(`/departments/${departmentId}/teams`);
      return response.data;
    },
    enabled: !!departmentId,
  });
}

// Update team
export function useUpdateDepartmentTeam(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Team) => {
      const response = await axiosClient.put<Team>(`/teams/${teamId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["department-teams", variables.departmentId] 
      });
    },
  });
}

// Create team
export function useCreateDepartmentTeam(departmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Team, "id">) => {
      const response = await axiosClient.post<Team>(`/departments/${departmentId}/teams`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["department-teams", departmentId] 
      });
    },
  });
}

// Delete team
export function useDeleteDepartmentTeam(departmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: string) => {
      await axiosClient.delete(`/teams/${teamId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["department-teams", departmentId] 
      });
    },
  });
}
