import type { TimelinePhase } from "./timeline"

export const phases: TimelinePhase[] = [
  {
    id: "1",
    name: "Discovery & Planning",
    startDate: "2025-10-01",
    endDate: "2025-10-15",
    status: "completed",
    progress: 100,
    tasks: 8,
    completedTasks: 8,
  },
  {
    id: "2",
    name: "Design Phase",
    startDate: "2025-10-16",
    endDate: "2025-11-05",
    status: "in-progress",
    progress: 70,
    tasks: 12,
    completedTasks: 8,
  },
  {
    id: "3",
    name: "Development",
    startDate: "2025-11-06",
    endDate: "2025-11-30",
    status: "pending",
    progress: 0,
    tasks: 20,
    completedTasks: 0,
  },
  {
    id: "4",
    name: "Testing & QA",
    startDate: "2025-12-01",
    endDate: "2025-12-10",
    status: "pending",
    progress: 0,
    tasks: 15,
    completedTasks: 0,
  },
  {
    id: "5",
    name: "Deployment",
    startDate: "2025-12-11",
    endDate: "2025-12-15",
    status: "pending",
    progress: 0,
    tasks: 5,
    completedTasks: 0,
  },
]

export const milestones = [
  { name: "Design Approval", date: "2025-10-15", status: "completed" },
  { name: "Development Kickoff", date: "2025-11-06", status: "pending" },
  { name: "Beta Release", date: "2025-12-01", status: "pending" },
  { name: "Production Launch", date: "2025-12-15", status: "pending" },
]

