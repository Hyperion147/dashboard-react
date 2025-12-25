import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";
import type { Attendance, PunchLog } from "@/types/attendance/attendance";

interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

// Get attendance by employee ID
export const useEmployeeAttendance = (
  employeeId: string,
  params?: {
    status?: string;
    date?: string;
    start_date?: string;
    end_date?: string;
  }
) => {
  return useQuery({
    queryKey: ["attendance", "employee", employeeId, params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append("status", params.status);
      if (params?.date) queryParams.append("date", params.date);
      if (params?.start_date) queryParams.append("start_date", params.start_date);
      if (params?.end_date) queryParams.append("end_date", params.end_date);

      const queryString = queryParams.toString();
      const url = `/attendance/employee/${employeeId}${queryString ? `?${queryString}` : ""}`;
      
      const response = await apiClient.get<ApiResponse<Attendance[]>>(url);
      return response.data.data;
    },
    enabled: !!employeeId,
  });
};

// Get attendance by company ID
export const useCompanyAttendance = (
  companyId: string,
  params?: {
    date?: string;
    start_date?: string;
    end_date?: string;
  }
) => {
  return useQuery({
    queryKey: ["attendance", "company", companyId, params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.date) queryParams.append("date", params.date);
      if (params?.start_date) queryParams.append("start_date", params.start_date);
      if (params?.end_date) queryParams.append("end_date", params.end_date);

      const queryString = queryParams.toString();
      const url = `/attendance/company/${companyId}${queryString ? `?${queryString}` : ""}`;
      
      const response = await apiClient.get<ApiResponse<Attendance[]>>(url);
      return response.data.data;
    },
    enabled: !!companyId,
  });
};

// Get attendance by ID
export const useAttendance = (attendanceId: string) => {
  return useQuery({
    queryKey: ["attendance", attendanceId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Attendance>>(`/attendance/${attendanceId}/view`);
      return response.data.data;
    },
    enabled: !!attendanceId,
  });
};

// Get punch logs by employee ID
export const useEmployeePunchLogs = (
  employeeId: string,
  params?: {
    start_date?: string;
    end_date?: string;
    type?: string;
  }
) => {
  return useQuery({
    queryKey: ["punch-logs", "employee", employeeId, params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.start_date) queryParams.append("start_date", params.start_date);
      if (params?.end_date) queryParams.append("end_date", params.end_date);
      if (params?.type) queryParams.append("type", params.type);

      const queryString = queryParams.toString();
      const url = `/punch-logs/employee/${employeeId}${queryString ? `?${queryString}` : ""}`;
      
      const response = await apiClient.get<ApiResponse<PunchLog[]>>(url);
      return response.data.data;
    },
    enabled: !!employeeId,
  });
};

// Get punch logs by attendance ID
export const useAttendancePunchLogs = (attendanceId: string) => {
  return useQuery({
    queryKey: ["punch-logs", "attendance", attendanceId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<PunchLog[]>>(`/punch-logs/attendance/${attendanceId}`);
      return response.data.data;
    },
    enabled: !!attendanceId,
  });
};

// Create attendance
export const useCreateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      employee_id: string;
      company_id: string;
      date: string;
      status: string;
      total_work_hours: number;
    }) => {
      const response = await apiClient.post<ApiResponse<Attendance>>("/attendance/create", data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "employee", variables.employee_id] });
      queryClient.invalidateQueries({ queryKey: ["attendance", "company", variables.company_id] });
    },
  });
};

// Update attendance
export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Attendance> & { id: string }) => {
      const response = await apiClient.patch<ApiResponse<Attendance>>(`/attendance/${id}/update`, data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attendance", data.id] });
      queryClient.invalidateQueries({ queryKey: ["attendance", "employee", data.employee_id] });
      queryClient.invalidateQueries({ queryKey: ["attendance", "company", data.company_id] });
    },
  });
};

// Delete attendance
export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attendanceId: string) => {
      const response = await apiClient.delete<ApiResponse<void>>(`/attendance/${attendanceId}/delete`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};

// Create punch log
export const useCreatePunchLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      attendance_id: string;
      employee_id: string;
      type: string;
      timestamp: string;
      location?: string;
      notes?: string;
    }) => {
      const response = await apiClient.post<ApiResponse<PunchLog>>("/punch-logs/create", data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["punch-logs", "attendance", data.attendance_id] });
      queryClient.invalidateQueries({ queryKey: ["punch-logs", "employee", data.employee_id] });
    },
  });
};
