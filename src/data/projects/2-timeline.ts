import type { TimelinePhase } from "./timeline"

export const phases: TimelinePhase[] = [
  {
    id: "1",
    name: "Research & Planning",
    startDate: "2025-11-01",
    endDate: "2025-11-10",
    status: "completed",
    progress: 100,
    tasks: 5,
    completedTasks: 5,
  },
  {
    id: "2",
    name: "API Integration",
    startDate: "2025-11-11",
    endDate: "2025-11-25",
    status: "in-progress",
    progress: 60,
    tasks: 10,
    completedTasks: 6,
  },
  {
    id: "3",
    name: "Testing & QA",
    startDate: "2025-11-26",
    endDate: "2025-11-30",
    status: "pending",
    progress: 0,
    tasks: 8,
    completedTasks: 0,
  },
]

export const milestones = [
  { name: "Research Completed", date: "2025-11-10", status: "completed" },
  { name: "Payment Integration", date: "2025-11-20", status: "pending" },
  { name: "Production Ready", date: "2025-11-30", status: "pending" },
]

