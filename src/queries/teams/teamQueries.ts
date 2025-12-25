import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";
import type { Team } from "@/types/projects/project";

interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

// Get all teams by company (fetch from all departments)
export const useCompanyTeams = (companyId: string) => {
  return useQuery({
    queryKey: ["teams", "company", companyId],
    queryFn: async () => {
      // First get all departments
      const deptResponse = await apiClient.get<ApiResponse<any[]>>(`/departments/company/${companyId}`);
      const departments = deptResponse.data.data;
      
      // Then fetch teams for each department
      const teamsPromises = departments.map(dept => 
        apiClient.get<ApiResponse<Team[]>>(`/teams/department/${dept.id}`)
          .then(res => res.data.data)
          .catch(() => [])
      );
      
      const teamsArrays = await Promise.all(teamsPromises);
      return teamsArrays.flat();
    },
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get teams by department
export const useDepartmentTeams = (departmentId: string) => {
  return useQuery({
    queryKey: ["teams", "department", departmentId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Team[]>>(`/teams/department/${departmentId}`);
      return response.data.data;
    },
    enabled: !!departmentId,
  });
};

// Note: Team members are now included in the team data from /teams/{id}/view
// No separate API call needed for team employees

// Get team by ID
export const useTeam = (teamId: string) => {
  return useQuery({
    queryKey: ["teams", teamId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Team>>(`/teams/${teamId}/view`);
      return response.data.data;
    },
    enabled: !!teamId,
  });
};

// Get team members by team ID
export const useTeamMembers = (teamId: string) => {
  return useQuery({
    queryKey: ["teams", teamId, "members"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<any>>(`/teams/${teamId}/view`);
      const teamData = response.data.data;
      
      // Extract employee information from members array
      const members = teamData.members?.map((member: any) => ({
        id: member.employee.id,
        employee_id: member.employee_id,
        first_name: member.employee.first_name,
        last_name: member.employee.last_name,
        email: member.employee.email,
        job_title: member.job_title,
        designation: member.designation,
        level: member.level,
        status: member.status,
      })) || [];
      
      return members;
    },
    enabled: !!teamId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Create team
export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      department_id: string;
      name: string;
      code: string;
      description: string;
      status: string;
    }) => {
      const response = await apiClient.post<ApiResponse<Team>>("/teams/create", data);
      return response.data.data;
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
    mutationFn: async ({ id, ...data }: Partial<Team> & { id: string }) => {
      const response = await apiClient.patch<ApiResponse<Team>>(`/teams/${id}/update`, data);
      return response.data.data;
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
      const response = await apiClient.patch<ApiResponse<Team>>(`/teams/${id}/updateStatus`, { status });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["teams", data.id] });
      queryClient.invalidateQueries({ queryKey: ["teams", "department"] });
      queryClient.invalidateQueries({ queryKey: ["teams", "company"] });
    },
  });
};
