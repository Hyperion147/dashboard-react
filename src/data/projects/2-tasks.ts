import type { Task } from "./tasks"

export const tasks: Task[] = [
  {
    id: "1",
    title: "Research payment gateways",
    assignee: "Mike Chen",
    status: "done",
    priority: "high",
    dueDate: "2025-11-10",
    subtasks: 4,
    completedSubtasks: 4,
  },
  {
    id: "2",
    title: "Design API integration flow",
    assignee: "Emma Davis",
    status: "in-progress",
    priority: "urgent",
    dueDate: "2025-11-15",
    subtasks: 6,
    completedSubtasks: 3,
  },
  {
    id: "3",
    title: "Implement Stripe payment",
    assignee: "Mike Chen",
    status: "todo",
    priority: "high",
    dueDate: "2025-11-20",
    subtasks: 8,
    completedSubtasks: 0,
  },
  {
    id: "4",
    title: "Setup analytics tracking",
    assignee: "Lisa Park",
    status: "in-progress",
    priority: "medium",
    dueDate: "2025-11-25",
    subtasks: 5,
    completedSubtasks: 3,
  },
]

