// Company interface
interface Company {
  id: string;
  idd: string;
  parent_company_id: string | null;
  name: string;
  type: string;
  description: string;
  address_1: string;
  address_2: string;
  address_3: string;
  landmark: string;
  city: string;
  area: string;
  state: string;
  country: string;
  pincode: string;
  zone: string;
  phone: string;
  website: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Employee Details interface
export interface EmployeeDetails {
  id: string;
  employee_id: string;
  gender: string;
  dob: string;
  blood_group: string;
  marital_status: string;
  job_title: string;
  level: string;
  designation: string;
  department_id: string;
  team_id: string;
  profile_summary: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  team?: {
    id: string;
    name: string;
    code: string;
  };
}

// Employee interface matching your API response
export interface Employee {
  id: string;
  idd: string;
  user_id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  doj: string; // Date of joining
  doe: string | null; // Date of exit
  status: "active" | "inactive";
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  company: Company;
  details?: EmployeeDetails;
  userType?: "admin" | "hr" | "project_manager" | "employee";
}