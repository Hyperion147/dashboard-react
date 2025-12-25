export interface Task {
  id: string;
  project_id: string;
  team_id: string;
  assigned_to_employee_id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "developed" | "code_review" | "deployment" | "qa" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  due_date: string;
  created_at: string;
  updated_at: string;
  project?: {
    id: string;
    name: string;
    code: string;
  };
  team?: {
    id: string;
    name: string;
    code: string;
  };
  assigned_to?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}
