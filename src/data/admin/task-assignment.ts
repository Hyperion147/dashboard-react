import { Circle, Play, CheckCircle2, AlertCircle } from "lucide-react"

export interface Employee {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  department: string
  workload: number
}

export interface TaskTemplate {
  id: string
  title: string
  description: string
  estimatedHours: number
  priority: "low" | "medium" | "high" | "urgent"
  tags: string[]
  project: string
}

export interface AssignedTask {
  id: string
  title: string
  description: string
  assignedTo: Employee
  status: "todo" | "in-progress" | "completed" | "blocked"
  priority: "low" | "medium" | "high" | "urgent"
  dueDate: string
  estimatedHours: number
  actualHours: number
  tags: string[]
  project: string
  createdAt: string
}

export const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@company.com",
    avatar: "/professional-man-developer.png",
    role: "Senior Developer",
    department: "Engineering",
    workload: 85,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@company.com",
    avatar: "/professional-woman-developer.png",
    role: "Frontend Developer",
    department: "Engineering",
    workload: 70,
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@company.com",
    avatar: "/professional-designer.png",
    role: "UI/UX Designer",
    department: "Design",
    workload: 60,
  },
]

export const mockTaskTemplates: TaskTemplate[] = [
  {
    id: "1",
    title: "Code Review",
    description: "Review pull request and provide feedback",
    estimatedHours: 2,
    priority: "medium",
    tags: ["Review", "Quality"],
    project: "General",
  },
  {
    id: "2",
    title: "Bug Fix",
    description: "Investigate and fix reported bug",
    estimatedHours: 4,
    priority: "high",
    tags: ["Bug", "Maintenance"],
    project: "General",
  },
  {
    id: "3",
    title: "Feature Implementation",
    description: "Implement new feature according to specifications",
    estimatedHours: 8,
    priority: "medium",
    tags: ["Feature", "Development"],
    project: "General",
  },
]

export const mockAssignedTasks: AssignedTask[] = [
  {
    id: "1",
    title: "Implement user authentication",
    description: "Create login/logout functionality with JWT tokens",
    assignedTo: mockEmployees[0],
    status: "in-progress",
    priority: "high",
    dueDate: "2024-01-15",
    estimatedHours: 8,
    actualHours: 5,
    tags: ["Backend", "Security"],
    project: "User Management",
    createdAt: "2024-01-08",
  },
  {
    id: "2",
    title: "Design mobile interface",
    description: "Create responsive design for mobile devices",
    assignedTo: mockEmployees[2],
    status: "todo",
    priority: "medium",
    dueDate: "2024-01-20",
    estimatedHours: 12,
    actualHours: 0,
    tags: ["Design", "Mobile"],
    project: "UI/UX",
    createdAt: "2024-01-09",
  },
]

export const priorityConfig = {
  low: { color: "text-green-600", bg: "bg-green-100", label: "Low" },
  medium: { color: "text-yellow-600", bg: "bg-yellow-100", label: "Medium" },
  high: { color: "text-orange-600", bg: "bg-orange-100", label: "High" },
  urgent: { color: "text-red-600", bg: "bg-red-100", label: "Urgent" },
}

export const statusConfig = {
  todo: { icon: Circle, color: "text-muted-foreground", bg: "bg-muted", label: "To Do" },
  "in-progress": { icon: Play, color: "text-blue-600", bg: "bg-blue-100", label: "In Progress" },
  completed: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100", label: "Completed" },
  blocked: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100", label: "Blocked" },
}

