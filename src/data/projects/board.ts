export interface BoardTask {
  id: string
  title: string
  assignee: string
  priority: "low" | "medium" | "high" | "urgent"
  avatar: string
  labels?: string[]
  comments?: number
  attachments?: number
}


export interface BoardColumn {
  id: string
  title: string
  tasks: BoardTask[]
}

export const boardColumns: BoardColumn[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "1",
        title: "Setup API endpoints",
        assignee: "Emma Davis",
        priority: "high",
        avatar: "ED",
        labels: ["Backend", "API"],
        comments: 3,
        attachments: 1,
      },
      {
        id: "2",
        title: "Create user documentation",
        assignee: "Alex Rodriguez",
        priority: "medium",
        avatar: "AR",
        labels: ["Documentation"],
        comments: 0,
        attachments: 2,
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
        labels: ["Security", "Backend"],
        comments: 5,
        attachments: 0,
      },
      {
        id: "4",
        title: "Create design system components",
        assignee: "Sarah Johnson",
        priority: "high",
        avatar: "SJ",
        labels: ["UI", "Design System"],
        comments: 2,
        attachments: 3,
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
        labels: ["Testing", "QA"],
        comments: 7,
        attachments: 1,
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "6",
        title: "Design wireframes for main screens",
        assignee: "Sarah Johnson",
        priority: "high",
        avatar: "SJ",
        labels: ["Design", "UX"],
        comments: 4,
        attachments: 8,
      },
      {
        id: "7",
        title: "Database schema design",
        assignee: "Emma Davis",
        priority: "medium",
        avatar: "ED",
        labels: ["Database", "Backend"],
        comments: 2,
        attachments: 1,
      },
    ],
  },
]

export const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}
