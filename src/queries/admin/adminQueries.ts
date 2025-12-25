import axiosClient from '../client';

// Dashboard stats interface
export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingLeaves: number;
  upcomingDeadlines: number;
}

// Employee stats interface
export interface EmployeeStats {
  total: number;
  active: number;
  onLeave: number;
  remote: number;
  departments: Array<{
    name: string;
    count: number;
    present: number;
    percentage: number;
  }>;
}

// Project and task stats interface
export interface ProjectTaskStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
}

// Attendance stats interface
export interface AttendanceStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  remoteToday: number;
  attendanceRate: number;
}

// Recent activity interface
export interface RecentActivity {
  id: string;
  employee: string;
  action: string;
  status: 'present' | 'late' | 'early' | 'remote' | 'absent';
  time: string;
  timestamp: string;
}

// Pending leave interface
export interface PendingLeave {
  id: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Upcoming deadline interface
export interface UpcomingDeadline {
  id: string;
  projectName: string;
  taskName: string;
  deadline: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on-track' | 'at-risk' | 'overdue';
}

// Birthday interface
export interface UpcomingBirthday {
  id: string;
  employeeName: string;
  department: string;
  date: string;
  daysUntil: number;
}

// Get dashboard stats
export const getDashboardStats = async (companyId: string): Promise<DashboardStats> => {
  try {
    const response = await axiosClient.get(`/admin/stats/dashboard/${companyId}`);
    return response.data.data || {};
  } catch (error) {
    console.warn('Failed to fetch dashboard stats:', error);
    return {} as DashboardStats;
  }
};

// Get employee stats
export const getEmployeeStats = async (companyId: string): Promise<EmployeeStats> => {
  try {
    const response = await axiosClient.get(`/admin/stats/employees/${companyId}`);
    const data = response.data.data || {};
    return {
      ...data,
      departments: Array.isArray(data.departments) ? data.departments : []
    };
  } catch (error) {
    console.warn('Failed to fetch employee stats:', error);
    return {
      total: 0,
      active: 0,
      onLeave: 0,
      remote: 0,
      departments: []
    } as EmployeeStats;
  }
};

// Get project and task stats
export const getProjectTaskStats = async (companyId: string): Promise<ProjectTaskStats> => {
  try {
    const response = await axiosClient.get(`/admin/stats/projects-tasks/${companyId}`);
    return response.data.data || {};
  } catch (error) {
    console.warn('Failed to fetch project task stats:', error);
    return {} as ProjectTaskStats;
  }
};

// Get attendance stats
export const getAttendanceStats = async (companyId: string): Promise<AttendanceStats> => {
  try {
    const response = await axiosClient.get(`/admin/stats/attendance/${companyId}`);
    return response.data.data || {};
  } catch (error) {
    console.warn('Failed to fetch attendance stats:', error);
    return {} as AttendanceStats;
  }
};

// Get recent activity
export const getRecentActivity = async (companyId: string, page = 1, limit = 10): Promise<RecentActivity[]> => {
  const response = await axiosClient.get(`/admin/stats/activity/${companyId}?page=${page}&limit=${limit}`);
  const data = response.data.data;
  return Array.isArray(data) ? data : [];
};

// Get pending leaves
export const getPendingLeaves = async (companyId: string): Promise<PendingLeave[]> => {
  try {
    const response = await axiosClient.get(`/admin/stats/leaves/pending/${companyId}`);
    const data = response.data.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn('Failed to fetch pending leaves:', error);
    return [];
  }
};

// Get upcoming deadlines
export const getUpcomingDeadlines = async (companyId: string, days = 30): Promise<UpcomingDeadline[]> => {
  const response = await axiosClient.get(`/admin/stats/projects/upcoming-deadlines/${companyId}?days=${days}`);
  const data = response.data.data;
  return Array.isArray(data) ? data : [];
};

// Get upcoming birthdays/anniversaries
export const getUpcomingBirthdays = async (userId: string): Promise<UpcomingBirthday[]> => {
  const response = await axiosClient.get(`/admin/stats/events/anniversaries/${userId}`);
  return response.data.data;
};

// Get all company employees
export const getAllCompanyEmployees = async (companyId: string) => {
  const response = await axiosClient.get(`/admin/stats/employees/all/${companyId}`);
  return response.data.data;
};

// Get all company tasks
export const getAllCompanyTasks = async (companyId: string) => {
  const response = await axiosClient.get(`/admin/stats/tasks/all/${companyId}`);
  return response.data.data;
};

// Get resource allocation
export const getResourceAllocation = async (companyId: string) => {
  const response = await axiosClient.get(`/admin/stats/resources/${companyId}`);
  return response.data.data;
};