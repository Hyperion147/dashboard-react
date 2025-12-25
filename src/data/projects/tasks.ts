export interface Task {
  id: string
  title: string
  assignee: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "urgent"
  dueDate: string
  subtasks: number
  completedSubtasks: number
}

export const tasks: Task[] = [
  {
    id: "1",
    title: "Design wireframes for main screens",
    assignee: "Sarah Johnson",
    status: "done",
    priority: "high",
    dueDate: "2025-10-15",
    subtasks: 5,
    completedSubtasks: 5,
  },
  {
    id: "2",
    title: "Create design system components",
    assignee: "Sarah Johnson",
    status: "in-progress",
    priority: "high",
    dueDate: "2025-10-30",
    subtasks: 8,
    completedSubtasks: 5,
  },
  {
    id: "3",
    title: "Implement authentication flow",
    assignee: "Mike Chen",
    status: "in-progress",
    priority: "urgent",
    dueDate: "2025-10-25",
    subtasks: 6,
    completedSubtasks: 3,
  },
  {
    id: "4",
    title: "Setup API endpoints",
    assignee: "Emma Davis",
    status: "todo",
    priority: "high",
    dueDate: "2025-11-05",
    subtasks: 10,
    completedSubtasks: 0,
  },
  {
    id: "5",
    title: "Database schema design",
    assignee: "Emma Davis",
    status: "done",
    priority: "medium",
    dueDate: "2025-10-20",
    subtasks: 4,
    completedSubtasks: 4,
  },
]

export const statusColors = {
  todo: "bg-gray-100 text-gray-800",
  "in-progress": "bg-blue-100 text-blue-800",
  review: "bg-purple-100 text-purple-800",
  done: "bg-green-100 text-green-800",
}

export const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

export const assignees = [
  "Sarah Johnson",
  "Mike Chen",
  "Emma Davis",
  "Alex Rodriguez",
  "Lisa Park",
]

