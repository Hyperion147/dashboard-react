import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";
import type { Project, ProjectWithTeams, ProjectTeam } from "@/types/projects/project";

interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

// Get projects by company
export const useCompanyProjects = (companyId: string) => {
  return useQuery({
    queryKey: ["projects", "company", companyId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Project[]>>(`/projects/company/${companyId}`);
      return response.data.data;
    },
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get project by ID with teams
export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ProjectWithTeams>>(`/projects/${projectId}/view`);
      return response.data.data;
    },
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get teams assigned to a project
export const useProjectTeams = (projectId: string) => {
  return useQuery({
    queryKey: ["project-teams", projectId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ProjectTeam[]>>(`/project-teams/project/${projectId}`);
      return response.data.data;
    },
    enabled: !!projectId,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

// Get projects assigned to a team (filter from all projects)
export const useTeamProjects = (teamId: string, companyId: string) => {
  return useQuery({
    queryKey: ["projects", "team", teamId],
    queryFn: async () => {
      // Get all company projects
      const projectsResponse = await apiClient.get<ApiResponse<Project[]>>(`/projects/company/${companyId}`);
      const projects = projectsResponse.data.data;
      
      // Limit concurrent requests to avoid rate limiting
      const batchSize = 3;
      const projectsWithTeams: (Project & { projectTeams: ProjectTeam[] } | null)[] = [];
      
      for (let i = 0; i < projects.length; i += batchSize) {
        const batch = projects.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async (project) => {
            try {
              const teamsResponse = await apiClient.get<ApiResponse<ProjectTeam[]>>(`/project-teams/project/${project.id}`);
              const teams = teamsResponse.data.data;
              const hasTeam = teams.some(pt => pt.team_id === teamId);
              return hasTeam ? { ...project, projectTeams: teams.filter(pt => pt.team_id === teamId) } : null;
            } catch {
              return null;
            }
          })
        );
        projectsWithTeams.push(...batchResults);
        
        // Add small delay between batches to avoid rate limiting
        if (i + batchSize < projects.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      return projectsWithTeams.filter((p): p is Project & { projectTeams: ProjectTeam[] } => p !== null);
    },
    enabled: !!teamId && !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutes - don't refetch too often
    gcTime: 1000 * 60 * 10, // 10 minutes cache
  });
};

// Create project
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      company_id: string;
      name: string;
      code: string;
      description: string;
      manager_id: string;
      start_date: string;
      end_date: string;
      status: string;
    }) => {
      const response = await apiClient.post<ApiResponse<Project>>("/projects/create", data);
      return response.data.data;
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
    mutationFn: async ({ id, ...data }: Partial<Project> & { id: string }) => {
      const response = await apiClient.patch<ApiResponse<Project>>(`/projects/${id}/update`, data);
      return response.data.data;
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
      const response = await apiClient.patch<ApiResponse<Project>>(`/projects/${id}/updateStatus`, { status });
      return response.data.data;
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
    mutationFn: async (data: {
      project_id: string;
      team_id: string;
      start_date: string;
      end_date: string;
      status: string;
    }) => {
      const response = await apiClient.post<ApiResponse<ProjectTeam>>("/project-teams/create", data);
      return response.data.data;
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
      const response = await apiClient.delete<ApiResponse<void>>(`/project-teams/${projectTeamId}/delete`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-teams"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
