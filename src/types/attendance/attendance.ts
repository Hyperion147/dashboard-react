export interface Attendance {
  id: string;
  employee_id: string;
  company_id: string;
  date: string;
  status: "present" | "absent" | "leave" | "holiday" | "half_day";
  total_work_hours: number;
  created_at: string;
  updated_at: string;
  employee?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    idd: string;
  };
  company?: {
    id: string;
    name: string;
  };
  punch_logs?: PunchLog[];
}

export interface PunchLog {
  id: string;
  attendance_id: string;
  employee_id: string;
  type: "punch_in" | "punch_out" | "break_start" | "break_end" | "afk_start" | "afk_end";
  timestamp: string;
  location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceStats {
  total_days: number;
  present_days: number;
  absent_days: number;
  leave_days: number;
  holiday_days: number;
  average_work_hours: number;
  attendance_percentage: number;
}
