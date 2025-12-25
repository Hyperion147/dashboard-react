import type { Repository, CodeMetrics } from "./code"

export const repositories: Repository[] = [
  {
    name: "security-audit",
    url: "https://github.com/company/security-audit",
    branch: "main",
    commits: 94,
    lastUpdate: "2 weeks ago",
  },
]

export const codeMetrics: CodeMetrics[] = [
  { language: "Markdown", files: 18, lines: 3420, percentage: 45 },
  { language: "JSON", files: 12, lines: 2340, percentage: 30 },
  { language: "Python", files: 8, lines: 1890, percentage: 25 },
]

export const recentCommits = [
  {
    message: "docs: Final security report",
    author: "Alex Rodriguez",
    time: "2 weeks ago",
  },
  {
    message: "chore: Archive security findings",
    author: "Alex Rodriguez",
    time: "2 weeks ago",
  },
  {
    message: "docs: Update vulnerability database",
    author: "Lisa Park",
    time: "2 weeks ago",
  },
]

