import type { BoardColumn } from "./board"

export const boardColumns: BoardColumn[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [],
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
        title: "Vulnerability scanning",
        assignee: "Alex Rodriguez",
        priority: "urgent",
        avatar: "AR",
      },
      {
        id: "2",
        title: "Penetration testing",
        assignee: "Alex Rodriguez",
        priority: "urgent",
        avatar: "AR",
      },
      {
        id: "3",
        title: "Code security review",
        assignee: "Emma Davis",
        priority: "high",
        avatar: "ED",
      },
      {
        id: "4",
        title: "Security documentation",
        assignee: "Lisa Park",
        priority: "medium",
        avatar: "LP",
      },
      {
        id: "5",
        title: "Final security report",
        assignee: "Alex Rodriguez",
        priority: "high",
        avatar: "AR",
      },
    ],
  },
]

