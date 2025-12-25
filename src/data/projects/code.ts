export interface Repository {
  name: string
  url: string
  branch: string
  commits: number
  lastUpdate: string
}

export interface CodeMetrics {
  language: string
  files: number
  lines: number
  percentage: number
}

export const repositories: Repository[] = [
  {
    name: "mobile-app-redesign",
    url: "https://github.com/company/mobile-app-redesign",
    branch: "main",
    commits: 156,
    lastUpdate: "2 hours ago",
  },
  {
    name: "design-system",
    url: "https://github.com/company/design-system",
    branch: "develop",
    commits: 89,
    lastUpdate: "5 hours ago",
  },
]

export const codeMetrics: CodeMetrics[] = [
  { language: "TypeScript", files: 245, lines: 45230, percentage: 65 },
  { language: "CSS", files: 89, lines: 12450, percentage: 18 },
  { language: "JavaScript", files: 34, lines: 8920, percentage: 13 },
  { language: "JSON", files: 12, lines: 2340, percentage: 4 },
]

export const recentCommits = [
  {
    message: "feat: Add user authentication",
    author: "Mike Chen",
    time: "2 hours ago",
  },
  {
    message: "fix: Resolve API timeout issues",
    author: "Emma Davis",
    time: "4 hours ago",
  },
  {
    message: "docs: Update README with setup instructions",
    author: "Sarah Johnson",
    time: "1 day ago",
  },
  {
    message: "refactor: Optimize database queries",
    author: "Emma Davis",
    time: "2 days ago",
  },
]

