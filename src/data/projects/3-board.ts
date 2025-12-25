import type { BoardColumn } from "./board"

export const boardColumns: BoardColumn[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "3",
        title: "Test data migration",
        assignee: "Alex Rodriguez",
        priority: "high",
        avatar: "AR",
      },
      {
        id: "4",
        title: "Update application queries",
        assignee: "Mike Chen",
        priority: "medium",
        avatar: "MC",
      },
      {
        id: "5",
        title: "Performance testing",
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
        id: "2",
        title: "Create migration scripts",
        assignee: "Emma Davis",
        priority: "urgent",
        avatar: "ED",
      },
    ],
  },
  {
    id: "review",
    title: "In Review",
    tasks: [],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "1",
        title: "Database schema analysis",
        assignee: "Emma Davis",
        priority: "high",
        avatar: "ED",
      },
    ],
  },
]

