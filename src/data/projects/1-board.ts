import type { BoardColumn } from "./board"

export const boardColumns: BoardColumn[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "4",
        title: "Setup API endpoints",
        assignee: "Emma Davis",
        priority: "high",
        avatar: "ED",
      },
      {
        id: "6",
        title: "Create user documentation",
        assignee: "Alex Rodriguez",
        priority: "medium",
        avatar: "AR",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      {
        id: "3",
        title: "Implement authentication flow",
        assignee: "Mike Chen",
        priority: "urgent",
        avatar: "MC",
      },
      {
        id: "2",
        title: "Create design system components",
        assignee: "Sarah Johnson",
        priority: "high",
        avatar: "SJ",
      },
    ],
  },
  {
    id: "review",
    title: "In Review",
    tasks: [
      {
        id: "5",
        title: "API integration testing",
        assignee: "Lisa Park",
        priority: "high",
        avatar: "LP",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "1",
        title: "Design wireframes for main screens",
        assignee: "Sarah Johnson",
        priority: "high",
        avatar: "SJ",
      },
      {
        id: "7",
        title: "Database schema design",
        assignee: "Emma Davis",
        priority: "medium",
        avatar: "ED",
      },
    ],
  },
]

