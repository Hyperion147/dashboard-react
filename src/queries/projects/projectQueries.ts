
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Project, ProjectWithTeams, ProjectTeam } from "@/types/projects/project";
import { dummyProjects } from "@/data/dummy";

// Get projects by company
export const useCompanyProjects = (companyId: string) => {
  return useQuery({
    queryKey: ["projects", "company", companyId],
    queryFn: async () => {
      // Mock return
      return dummyProjects;
    },
    enabled: !!companyId,
    initialData: dummyProjects
  });
};

// Get project by ID with teams
export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      // Mock return single project
      // Add fake empty teams array to satisfy type
      const project = dummyProjects.find(p => p.id === projectId) || dummyProjects[0];
      return { ...project, teams: [] } as unknown as ProjectWithTeams;
    },
    enabled: !!projectId,
    initialData: { ...dummyProjects[0], teams: [] } as unknown as ProjectWithTeams,
  });
};

// Get teams assigned to a project
export const useProjectTeams = (projectId: string) => {
  return useQuery({
    queryKey: ["project-teams", projectId],
    queryFn: async () => {
      return [] as ProjectTeam[];
    },
    enabled: !!projectId,
    initialData: [] as ProjectTeam[],
  });
};

// Get projects assigned to a team (filter from all projects)
export const useTeamProjects = (teamId: string, companyId: string) => {
  return useQuery({
    queryKey: ["projects", "team", teamId],
    queryFn: async () => {
      return [] as (Project & { projectTeams: ProjectTeam[] })[];
    },
    enabled: !!teamId && !!companyId,
    initialData: [] as (Project & { projectTeams: ProjectTeam[] })[], 
  });
};

// Create project
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return { ...dummyProjects[0], ...data } as Project;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects", "company", variables.company_id] });
    },
  });
};

// Update project
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      return { ...dummyProjects[0], id, ...data } as Project;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["projects", "company"] });
    },
  });
};

// Update project status
export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Project["status"] }) => {
      return { ...dummyProjects[0], id, status } as Project;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects", data.id] });
      queryClient.invalidateQueries({ queryKey: ["projects", "company"] });
    },
  });
};

// Assign team to project
export const useAssignTeamToProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
       return {} as ProjectTeam;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project-teams", variables.project_id] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.project_id] });
    },
  });
};

// Remove team from project
export const useRemoveTeamFromProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectTeamId: string) => {
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-teams"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
