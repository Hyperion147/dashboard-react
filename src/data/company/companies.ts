import type { Company } from "@/types/types"

export const mockCompanies: Company[] = [
  {
    id: "1",
    idd: "HQ-001",
    name: "TechCorp Headquarters",
    type: "headquarters",
    description: "Main headquarters for TechCorp",
    city: "San Francisco",
    country: "USA",
    status: "active",
    employees: 250,
  },
  {
    id: "2",
    idd: "BR-001",
    name: "TechCorp India Branch",
    type: "branch",
    description: "Development center in India",
    city: "Bangalore",
    country: "India",
    status: "active",
    employees: 150,
  },
  {
    id: "3",
    idd: "SUB-001",
    name: "TechCorp Solutions",
    type: "subsidiary",
    description: "Subsidiary for consulting services",
    city: "New York",
    country: "USA",
    status: "active",
    employees: 80,
  },
  {
    id: "4",
    idd: "DIV-001",
    name: "Cloud Services Division",
    type: "division",
    description: "Cloud infrastructure division",
    city: "Seattle",
    country: "USA",
    status: "inactive",
    employees: 45,
  },
]

