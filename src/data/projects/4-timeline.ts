import type { TimelinePhase } from "./timeline"

export const phases: TimelinePhase[] = [
  {
    id: "1",
    name: "Initial Assessment",
    startDate: "2025-10-01",
    endDate: "2025-10-05",
    status: "completed",
    progress: 100,
    tasks: 6,
    completedTasks: 6,
  },
  {
    id: "2",
    name: "Penetration Testing",
    startDate: "2025-10-06",
    endDate: "2025-10-08",
    status: "completed",
    progress: 100,
    tasks: 8,
    completedTasks: 8,
  },
  {
    id: "3",
    name: "Code Review",
    startDate: "2025-10-09",
    endDate: "2025-10-10",
    status: "completed",
    progress: 100,
    tasks: 12,
    completedTasks: 12,
  },
  {
    id: "4",
    name: "Documentation",
    startDate: "2025-10-11",
    endDate: "2025-10-12",
    status: "completed",
    progress: 100,
    tasks: 4,
    completedTasks: 4,
  },
  {
    id: "5",
    name: "Final Report",
    startDate: "2025-10-13",
    endDate: "2025-10-15",
    status: "completed",
    progress: 100,
    tasks: 5,
    completedTasks: 5,
  },
]

export const milestones = [
  { name: "Assessment Complete", date: "2025-10-05", status: "completed" },
  { name: "Testing Complete", date: "2025-10-08", status: "completed" },
  { name: "Review Complete", date: "2025-10-10", status: "completed" },
  { name: "Project Delivered", date: "2025-10-15", status: "completed" },
]

