import type { TimelinePhase } from "./timeline"

export const phases: TimelinePhase[] = [
  {
    id: "1",
    name: "Planning & Analysis",
    startDate: "2025-11-01",
    endDate: "2025-11-05",
    status: "completed",
    progress: 100,
    tasks: 8,
    completedTasks: 8,
  },
  {
    id: "2",
    name: "Script Development",
    startDate: "2025-11-06",
    endDate: "2025-11-10",
    status: "in-progress",
    progress: 60,
    tasks: 15,
    completedTasks: 9,
  },
  {
    id: "3",
    name: "Data Migration",
    startDate: "2025-11-11",
    endDate: "2025-11-20",
    status: "pending",
    progress: 0,
    tasks: 12,
    completedTasks: 0,
  },
  {
    id: "4",
    name: "Testing & Validation",
    startDate: "2025-11-21",
    endDate: "2025-12-01",
    status: "pending",
    progress: 0,
    tasks: 10,
    completedTasks: 0,
  },
]

export const milestones = [
  { name: "Schema Analysis", date: "2025-11-05", status: "completed" },
  { name: "Migration Ready", date: "2025-11-10", status: "pending" },
  { name: "Testing Complete", date: "2025-12-01", status: "pending" },
]

