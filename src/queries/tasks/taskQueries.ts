
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";
import type { Task } from "@/types/tasks/task";

interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

// Get all tasks by company (fetch from all projects)
export const useCompanyTasks = (companyId: string, projectIds: string[]) => {
  return useQuery({
    queryKey: ["tasks", "company", companyId],
    queryFn: async () => {
      if (!projectIds || projectIds.length === 0) {
        return [];
      }

      // Fetch tasks for each project
      const tasksPromises = projectIds.map(projectId =>
        apiClient.get<ApiResponse<Task[]>>(`/tasks/project/${projectId}`)
          .then(res => res.data.data)
          .catch(() => [])
      );

      const tasksArrays = await Promise.all(tasksPromises);
      return tasksArrays.flat();
    },
    enabled: !!companyId && projectIds.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get tasks by project
export const useProjectTasks = (projectId: string) => {
  return useQuery({
    queryKey: ["tasks", "project", projectId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Task[]>>(`/tasks/project/${projectId}`);
      return response.data.data;
    },
    enabled: !!projectId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get tasks by employee
export const useEmployeeTasks = (employeeId: string) => {
  return useQuery({
    queryKey: ["tasks", "employee", employeeId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Task[]>>(`/tasks/employee/${employeeId}`);
      return response.data.data;
    },
    enabled: !!employeeId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get task by ID
export const useTask = (taskId: string) => {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${taskId}/view`);
      return response.data.data;
    },
    enabled: !!taskId,
  });
};

// Create task
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      project_id: string;
      team_id: string;
      assigned_to_employee_id: string;
      title: string;
      description: string;
      status: string;
      priority: string;
      due_date: string;
    }) => {
      const response = await apiClient.post<ApiResponse<Task>>("/tasks/create", data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "project", variables.project_id] });
    },
  });
};

// Update task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Task> & { id: string }) => {
      const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${id}/update`, data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", data.id] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "project", data.project_id] });
    },
  });
};

// Update task status
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${id}/updateStatus`, { status });
      return response.data.data;
    },
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueriesData({ queryKey: ["tasks"] });

      // Optimistically update all task queries
      queryClient.setQueriesData<Task[]>(
        { queryKey: ["tasks", "project"] },
        (old) => {
          if (!old) return old;
          return old.map((task) =>
            task.id === id ? { ...task, status: status as Task["status"] } : task
          );
        }
      );

      // Return context with the previous value
      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      // Rollback to the previous value on error
      if (context?.previousTasks) {
        context.previousTasks.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Refetch in the background to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

// Delete task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await apiClient.delete<ApiResponse<void>>(`/tasks/${taskId}/delete`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
