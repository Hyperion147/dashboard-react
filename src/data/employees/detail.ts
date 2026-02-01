export interface EmployeeDetail {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone: string
  location: string
  joinDate: string
  status: "active" | "inactive"
  avatar: string
}

export interface AttendanceStats {
  thisMonth: { present: number; late: number; absent: number; total: number }
  thisWeek: { present: number; late: number; absent: number; total: number }
  avgHours: number
  punctuality: number
}

export interface RecentAttendance {
  date: string
  checkIn: string
  checkOut: string
  hours: string
  status: "present" | "late" | "absent"
}

export interface PerformanceMetric {
  label: string
  value: number
  target: number
  percentage: number
}

export function getEmployeeDetail(employeeId: string): EmployeeDetail {
  return {
    id: employeeId,
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    department: "Engineering",
    email: "sarah.chen@company.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinDate: "March 15, 2022",
    status: "active",
    avatar: "/professional-woman-developer.png",
  }
}

export const attendanceStats: AttendanceStats = {
  thisMonth: { present: 18, late: 2, absent: 1, total: 21 },
  thisWeek: { present: 4, late: 1, absent: 0, total: 5 },
  avgHours: 7.8,
  punctuality: 85,
}

export const recentAttendance: RecentAttendance[] = [
  { date: "2026-01-15", checkIn: "9:15 AM", checkOut: "6:30 PM", hours: "8h 15m", status: "present" },
  { date: "2026-01-14", checkIn: "10:45 AM", checkOut: "7:00 PM", hours: "8h 15m", status: "late" },
  { date: "2026-01-13", checkIn: "9:00 AM", checkOut: "6:15 PM", hours: "8h 15m", status: "present" },
  { date: "2026-01-12", checkIn: "8:45 AM", checkOut: "6:00 PM", hours: "8h 15m", status: "present" },
  { date: "2026-01-11", checkIn: "-", checkOut: "-", hours: "-", status: "absent" },
]

export const performanceMetrics: PerformanceMetric[] = [
  { label: "Tasks Completed", value: 47, target: 50, percentage: 94 },
  { label: "Code Reviews", value: 23, target: 25, percentage: 92 },
  { label: "Bug Fixes", value: 12, target: 15, percentage: 80 },
  { label: "Team Collaboration", value: 18, target: 20, percentage: 90 },
]

