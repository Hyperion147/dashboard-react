
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Team } from "@/types/projects/project";
import { dummyTeamData } from "@/data/dummy";

// Get all teams by company (fetch from all departments)
export const useCompanyTeams = (companyId: string) => {
  return useQuery({
    queryKey: ["teams", "company", companyId],
    queryFn: async () => {
      // Return dummy team
      return [dummyTeamData] as Team[];
    },
    enabled: !!companyId,
    initialData: [dummyTeamData] as Team[],
  });
};

// Get teams by department
export const useDepartmentTeams = (departmentId: string) => {
  return useQuery({
    queryKey: ["teams", "department", departmentId],
    queryFn: async () => {
      return [dummyTeamData] as Team[];
    },
    enabled: !!departmentId,
    initialData: [dummyTeamData] as Team[],
  });
};

// Get team by ID
export const useTeam = (teamId: string) => {
  return useQuery({
    queryKey: ["teams", teamId],
    queryFn: async () => {
      return dummyTeamData as Team;
    },
    enabled: !!teamId,
    initialData: dummyTeamData as Team,
  });
};

// Get team members by team ID
export const useTeamMembers = (teamId: string) => {
  return useQuery({
    queryKey: ["teams", teamId, "members"],
    queryFn: async () => {
      return [] as any[];
    },
    enabled: !!teamId,
    initialData: [],
  });
};

// Create team
export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return { ...dummyTeamData, ...data } as Team;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teams", "department", variables.department_id] });
    },
  });
};

// Update team
export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
       return { ...dummyTeamData, id, ...data } as Team;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teams", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["teams", "department"] });
      queryClient.invalidateQueries({ queryKey: ["teams", "company"] });
    },
  });
};

// Update team status
export const useUpdateTeamStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Team["status"] }) => {
      return { ...dummyTeamData, id, status } as Team;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["teams", data.id] });
      queryClient.invalidateQueries({ queryKey: ["teams", "department"] });
      queryClient.invalidateQueries({ queryKey: ["teams", "company"] });
    },
  });
};
