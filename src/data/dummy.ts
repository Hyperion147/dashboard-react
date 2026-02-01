
import type { Employee } from "@/types/employees/employee";
import type { Project, Team } from "@/types/projects/project";
import type { CompanyOverview } from "@/types/company/main-types";

// Dummy logged in user
export const dummyUser = {
  id: "user-123",
  email: "admin@example.com",
  type: "admin" as const,
};

// Dummy company
export const dummyCompany = {
  id: "comp-001",
  idd: "COMP001",
  parent_company_id: null,
  name: "Acme Corp",
  type: "Private",
  description: "A leading innovation company",
  address_1: "123 Innovation Dr",
  address_2: "Suite 100",
  address_3: "",
  landmark: "Tech Park",
  city: "San Francisco",
  area: "Downtown",
  state: "CA",
  country: "USA",
  pincode: "94105",
  zone: "West",
  phone: "+1 555-0123",
  website: "https://acme.example.com",
  email: "contact@acme.example.com",
  status: "active",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-06-15T00:00:00Z",
  deletedAt: null,
};

// Dummy department
export const dummyDepartment = {
  id: "dept-001",
  name: "Engineering",
  code: "ENG",
  description: "Engineering Department",
  status: "active",
  companyId: "comp-001"
};

// Dummy team
export const dummyTeamData: Team = {
  id: "team-001",
  department_id: "dept-001",
  name: "Frontend Team",
  code: "FE",
  description: "Frontend Development Team",
  lead_id: "emp-001",
  status: "active",
  created_at: "2023-01-10T00:00:00Z",
  updated_at: "2023-01-10T00:00:00Z",
  department: {
    id: "dept-001",
    name: "Engineering",
  },
  lead: {
    id: "emp-001",
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
  },
  members: [],
  projects: []
};

// Dummy logged in employee
export const dummyEmployee: Employee = {
  id: "emp-001",
  idd: "EMP001",
  user_id: "user-123",
  company_id: "comp-001",
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  doj: "2023-01-01",
  doe: null,
  status: "active",
  emergency_contact_name: "Jane Doe",
  emergency_contact_phone: "+1 555-9876",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
  deletedAt: null,
  company: dummyCompany,
  details: {
    id: "det-001",
    employee_id: "emp-001",
    job_title: "Senior Developer",
    designation: "Tech Lead",
    department_id: "dept-001",
    team_id: "team-001",
    gender: "Male",
    dob: "1990-01-01",
    blood_group: "O+",
    marital_status: "Single",
    level: "L4",
    profile_summary: "Experienced developer",
    status: "active",
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    deletedAt: null,
    department: {
      id: "dept-001",
      name: "Engineering",
      code: "ENG",
    },
    team: {
      id: "team-001",
      name: "Frontend Team",
      code: "FE",
    },
  },
  userType: "admin",
};

export const dummyEmployeesList: Employee[] = [
  dummyEmployee,
  {
    ...dummyEmployee,
    id: "emp-002",
    idd: "EMP002",
    first_name: "Alice",
    last_name: "Smith",
    email: "alice@example.com",
    details: {
        ...dummyEmployee.details!,
        id: "det-002",
        employee_id: "emp-002",
        job_title: "Product Designer",
    }
  },
    {
    ...dummyEmployee,
    id: "emp-003",
    idd: "EMP003",
    first_name: "Bob",
    last_name: "Johnson",
    email: "bob@example.com",
    details: {
        ...dummyEmployee.details!,
        id: "det-003",
        employee_id: "emp-003",
        job_title: "Backend Engineer",
    }
  }
];

export const dummyProjects: Project[] = [
  {
    id: "proj-001",
    company_id: "comp-001",
    name: "Dashboard Revamp",
    code: "DR-2026",
    description: "Revamping the main dashboard for better UX",
    manager_id: "emp-001",
    start_date: "2026-01-01",
    end_date: "2026-06-30",
    status: "in_progress",
    created_at: "2023-12-15T00:00:00Z",
    updated_at: "2023-12-15T00:00:00Z",
    manager: {
      id: "emp-001",
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
    },
    company: {
      id: "comp-001",
      name: "Acme Corp",
    },
  },
    {
    id: "proj-002",
    company_id: "comp-001",
    name: "Mobile App V2",
    code: "mob-v2",
    description: "Next gen mobile app",
    manager_id: "emp-002",
    start_date: "2026-02-01",
    end_date: "2026-08-30",
    status: "planning",
    created_at: "2023-12-20T00:00:00Z",
    updated_at: "2023-12-20T00:00:00Z",
    manager: {
      id: "emp-002",
      first_name: "Alice",
      last_name: "Smith",
      email: "alice@example.com",
    },
    company: {
      id: "comp-001",
      name: "Acme Corp",
    },
  }
];

export const dummyCompanies: CompanyOverview[] = [
  {
    id: "comp-001",
    idd: "COMP001",
    name: "Acme Corp",
    type: "headquarters",
    status: "active",
    description: "Generates everything you need",
    city: "New York",
    country: "USA",
    employees: 150
  },
   {
    id: "comp-002",
    idd: "COMP002",
    name: "Beta Inc",
    type: "subsidiary",
    status: "active",
    description: "Testing new waters",
    city: "London",
    country: "UK",
    employees: 50
  }
];
