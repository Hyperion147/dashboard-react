import type { Repository, CodeMetrics } from "./code"

export const repositories: Repository[] = [
  {
    name: "api-integration",
    url: "https://github.com/company/api-integration",
    branch: "feature/payment-integration",
    commits: 42,
    lastUpdate: "1 hour ago",
  },
]

export const codeMetrics: CodeMetrics[] = [
  { language: "TypeScript", files: 89, lines: 12450, percentage: 72 },
  { language: "JavaScript", files: 28, lines: 3420, percentage: 18 },
  { language: "JSON", files: 15, lines: 890, percentage: 10 },
]

export const recentCommits = [
  {
    message: "feat: Add Stripe integration",
    author: "Mike Chen",
    time: "1 hour ago",
  },
  {
    message: "fix: Handle payment webhooks",
    author: "Emma Davis",
    time: "3 hours ago",
  },
  {
    message: "chore: Update dependencies",
    author: "Mike Chen",
    time: "5 hours ago",
  },
]

