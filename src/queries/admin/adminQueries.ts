
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
export const getDashboardStats = async (_companyId: string): Promise<DashboardStats> => {
  return {
    totalEmployees: 25,
    presentToday: 23,
    totalProjects: 5,
    activeProjects: 3,
    totalTasks: 45,
    completedTasks: 30,
    pendingLeaves: 2,
    upcomingDeadlines: 3,
  };
};

// Get employee stats
export const getEmployeeStats = async (_companyId: string): Promise<EmployeeStats> => {
  return {
    total: 25,
    active: 24,
    onLeave: 1,
    remote: 4,
    departments: [
      { name: "Engineering", count: 12, present: 11, percentage: 48 },
      { name: "Design", count: 5, present: 5, percentage: 20 },
      { name: "Product", count: 4, present: 4, percentage: 16 },
      { name: "HR", count: 2, present: 2, percentage: 8 },
      { name: "Marketing", count: 2, present: 1, percentage: 8 }
    ]
  };
};

// Get project and task stats
export const getProjectTaskStats = async (_companyId: string): Promise<ProjectTaskStats> => {
  return {
    totalProjects: 5,
    activeProjects: 3,
    completedProjects: 2,
    totalTasks: 120,
    completedTasks: 85,
    inProgressTasks: 25,
    overdueTasks: 10
  };
};

// Get attendance stats
export const getAttendanceStats = async (_companyId: string): Promise<AttendanceStats> => {
  return {
    totalEmployees: 25,
    presentToday: 20,
    absentToday: 1,
    lateToday: 2,
    remoteToday: 2,
    attendanceRate: 96
  };
};

// Get recent activity
export const getRecentActivity = async (_companyId: string, _page = 1, _limit = 10): Promise<RecentActivity[]> => {
  return [
    { id: "1", employee: "John Doe", action: "Clocked in", status: "present", time: "09:00 AM", timestamp: new Date().toISOString() },
    { id: "2", employee: "Alice Smith", action: "Clocked in", status: "late", time: "09:15 AM", timestamp: new Date().toISOString() },
    { id: "3", employee: "Bob Johnson", action: "Clocked out", status: "early", time: "05:30 PM", timestamp: new Date().toISOString() },
  ];
};

// Get pending leaves
export const getPendingLeaves = async (_companyId: string): Promise<PendingLeave[]> => {
  return [
    { id: "1", employeeName: "Charlie Brown", leaveType: "Sick Leave", startDate: "2026-01-10", endDate: "2026-01-12", days: 3, reason: "Flu", status: "pending" },
    { id: "2", employeeName: "Diana Prince", leaveType: "Vacation", startDate: "2026-02-01", endDate: "2026-02-10", days: 10, reason: "Vacation", status: "pending" },
  ];
};

// Get upcoming deadlines
export const getUpcomingDeadlines = async (_companyId: string, _days = 30): Promise<UpcomingDeadline[]> => {
  return [
    { id: "1", projectName: "Project Alpha", taskName: "Frontend Setup", deadline: "2026-01-15", assignee: "John Doe", priority: "high", status: "on-track" },
    { id: "2", projectName: "Project Beta", taskName: "Database Schema", deadline: "2026-01-20", assignee: "Bob Johnson", priority: "medium", status: "at-risk" },
  ];
};

// Get upcoming birthdays/anniversaries
export const getUpcomingBirthdays = async (_userId: string): Promise<UpcomingBirthday[]> => {
  return [
     { id: "1", employeeName: "John Doe", department: "Engineering", date: "2026-01-20", daysUntil: 5 },
  ];
};

// Get all company employees
export const getAllCompanyEmployees = async (_companyId: string) => {
  return [];
};

// Get all company tasks
export const getAllCompanyTasks = async (_companyId: string) => {
  return [];
};

// Get resource allocation
export const getResourceAllocation = async (_companyId: string) => {
  return [
      { name: "Engineering", allocated: 80, total: 100 },
      { name: "Design", allocated: 50, total: 100 },
  ];
};