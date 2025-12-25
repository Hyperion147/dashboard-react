import type { BoardColumn } from "./board"

export const boardColumns: BoardColumn[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "3",
        title: "Implement Stripe payment",
        assignee: "Mike Chen",
        priority: "high",
        avatar: "MC",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      {
        id: "2",
        title: "Design API integration flow",
        assignee: "Emma Davis",
        priority: "urgent",
        avatar: "ED",
      },
      {
        id: "4",
        title: "Setup analytics tracking",
        assignee: "Lisa Park",
        priority: "medium",
        avatar: "LP",
      },
    ],
  },
  {
    id: "review",
    title: "In Review",
    tasks: [
      {
        id: "5",
        title: "Security review for payment API",
        assignee: "Alex Rodriguez",
        priority: "high",
        avatar: "AR",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "1",
        title: "Research payment gateways",
        assignee: "Mike Chen",
        priority: "high",
        avatar: "MC",
      },
    ],
  },
]

