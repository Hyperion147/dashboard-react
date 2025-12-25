export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "on-hold"
  progress: number
  team: number
  dueDate: string
  color: string
}

export const projects: Project[] = [
  {
    id: "1",
    name: "Mobile App Redesign",
    description: "Complete redesign of the mobile application UI/UX",
    status: "active",
    progress: 65,
    team: 5,
    dueDate: "2025-12-15",
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "API Integration",
    description: "Integrate third-party payment and analytics APIs",
    status: "active",
    progress: 45,
    team: 3,
    dueDate: "2025-11-30",
    color: "bg-purple-500",
  },
  {
    id: "3",
    name: "Database Migration",
    description: "Migrate from PostgreSQL to MongoDB",
    status: "on-hold",
    progress: 20,
    team: 2,
    dueDate: "2025-12-01",
    color: "bg-orange-500",
  },
  {
    id: "4",
    name: "Security Audit",
    description: "Comprehensive security audit and vulnerability assessment",
    status: "completed",
    progress: 100,
    team: 4,
    dueDate: "2025-10-15",
    color: "bg-green-500",
  },
]

export const statusColors = {
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  "on-hold": "bg-yellow-100 text-yellow-800",
}

export const colors = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-green-500",
  "bg-red-500",
  "bg-pink-500",
]

