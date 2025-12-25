export interface Project {
  id: string;
  company_id: string;
  name: string;
  code: string;
  description: string;
  manager_id: string;
  start_date: string;
  end_date: string;
  status: "planning" | "in_progress" | "on_hold" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  manager?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  company?: {
    id: string;
    name: string;
  };
}

export interface Team {
  id: string;
  department_id: string;
  name: string;
  code: string;
  description: string;
  lead_id: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  lead?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  department?: {
    id: string;
    name: string;
  };
  members?: Array<{
    employee_id: string;
    job_title: string;
    designation: string;
    level: string;
    phone_number: string | null;
    status: string;
    employee: {
      id: string;
      idd: string;
      first_name: string;
      last_name: string;
      email: string;
      doj: string;
      status: string;
    };
  }>;
  teamLead?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  projects?: Array<any>;
}

export interface ProjectTeam {
  id: string;
  project_id: string;
  team_id: string;
  start_date: string;
  end_date: string;
  status: "assigned" | "active" | "completed" | "removed";
  created_at: string;
  updated_at: string;
  team?: Team;
  project?: Project;
}

export interface ProjectWithTeams extends Project {
  teams: ProjectTeam[];
}
