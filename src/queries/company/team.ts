
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Team } from "@/types/company/main-types";
import { dummyTeamData } from "@/data/dummy";

// Fetch teams by department
export function useDepartmentTeams(departmentId: string) {
  return useQuery({
    queryKey: ["department-teams", departmentId],
    queryFn: async () => {
      // return list of dummy teams
      return [dummyTeamData] as unknown as Team[];
    },
    enabled: !!departmentId,
    initialData: ([dummyTeamData] as unknown as Team[]),
  });
}

// Update team
export function useUpdateDepartmentTeam(_teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return { ...dummyTeamData, ...data } as unknown as Team;
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
    mutationFn: async (data: any) => {
      return { ...dummyTeamData, ...data } as unknown as Team;
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
    mutationFn: async (_teamId: string) => {
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["department-teams", departmentId] 
      });
    },
  });
}
