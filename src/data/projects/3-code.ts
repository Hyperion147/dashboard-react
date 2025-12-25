import type { Repository, CodeMetrics } from "./code"

export const repositories: Repository[] = [
  {
    name: "database-migration",
    url: "https://github.com/company/database-migration",
    branch: "main",
    commits: 68,
    lastUpdate: "3 days ago",
  },
]

export const codeMetrics: CodeMetrics[] = [
  { language: "SQL", files: 45, lines: 8920, percentage: 65 },
  { language: "Python", files: 23, lines: 3420, percentage: 25 },
  { language: "TypeScript", files: 12, lines: 1560, percentage: 10 },
]

export const recentCommits = [
  {
    message: "feat: Add migration scripts",
    author: "Emma Davis",
    time: "3 days ago",
  },
  {
    message: "fix: Update schema definitions",
    author: "Emma Davis",
    time: "4 days ago",
  },
  {
    message: "docs: Add migration documentation",
    author: "Emma Davis",
    time: "5 days ago",
  },
]

