
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "@/types/tasks/task";

export const dummyTask: Task = {
  id: "task-001",
  project_id: "proj-001",
  team_id: "team-001",
  assigned_to_employee_id: "emp-001",
  title: "Setup Project",
  description: "Initial setup",
  status: "in_progress",
  priority: "high",
  due_date: "2024-02-01",
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
  assigned_to: {
      id: "emp-001",
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com"
  }
};

// Get all tasks by company (fetch from all projects)
export const useCompanyTasks = (companyId: string, projectIds: string[]) => {
  return useQuery({
    queryKey: ["tasks", "company", companyId],
    queryFn: async () => {
      // Mock tasks
      return [dummyTask] as Task[];
    },
    enabled: !!companyId && projectIds.length > 0,
    initialData: [dummyTask] as Task[],
  });
};

// Get tasks by project
export const useProjectTasks = (projectId: string) => {
  return useQuery({
    queryKey: ["tasks", "project", projectId],
    queryFn: async () => {
      return [dummyTask] as Task[];
    },
    enabled: !!projectId,
    initialData: ([dummyTask] as Task[]),
  });
};

// Get tasks by employee
export const useEmployeeTasks = (employeeId: string) => {
  return useQuery({
    queryKey: ["tasks", "employee", employeeId],
    queryFn: async () => {
      return [dummyTask] as Task[];
    },
    enabled: !!employeeId,
    initialData: ([dummyTask] as Task[]),
  });
};

// Get task by ID
export const useTask = (taskId: string) => {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: async () => {
      return dummyTask as Task;
    },
    enabled: !!taskId,
    initialData: (dummyTask as Task),
  });
};

// Create task
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
       return { ...dummyTask, ...data } as Task;
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
    mutationFn: async ({ id, ...data }: any) => {
       return { ...dummyTask, id, ...data } as Task;
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
      return { ...dummyTask, id, status } as Task;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

// Delete task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_taskId: string) => {
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
