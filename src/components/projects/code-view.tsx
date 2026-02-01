import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GitBranch, GitCommit, Code2, ExternalLink } from "lucide-react"
import { getProjectRepositories, getProjectCodeMetrics, getProjectCommits } from "@/data/projects/get-project-data"
import { gsap } from "gsap"

export function ProjectCodeView({ projectId }: { projectId: string }) {
  const repositories = getProjectRepositories(projectId)
  const codeMetrics = getProjectCodeMetrics(projectId)
  const recentCommits = getProjectCommits(projectId)
  
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Repositories card animation
      gsap.fromTo(
        ".repo-card",
        {
          y: -40,
          opacity: 0,
          filter: "blur(15px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        }
      )

      // Stagger repository items
      gsap.fromTo(
        ".repo-item",
        {
          x: -30,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          delay: 0.3,
          ease: "power2.out",
        }
      )

      // Code metrics card
      gsap.fromTo(
        ".metrics-card",
        {
          y: -40,
          opacity: 0,
          filter: "blur(15px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
        }
      )

      // Stagger metric items
      gsap.fromTo(
        ".metric-item",
        {
          x: -20,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.6,
          ease: "power2.out",
        }
      )

      // Animate metrics bars
      gsap.fromTo(
        ".metric-bar",
        {
          scaleX: 0,
          transformOrigin: "left",
        },
        {
          scaleX: 1,
          duration: 1.2,
          delay: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        }
      )

      // Commits card
      gsap.fromTo(
        ".commits-card",
        {
          y: -40,
          opacity: 0,
          filter: "blur(15px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          delay: 0.4,
          ease: "power3.out",
        }
      )

      // Stagger commit items
      gsap.fromTo(
        ".commit-item",
        {
          x: -20,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          delay: 0.8,
          ease: "power2.out",
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [projectId])

  return (
    <div ref={containerRef} className="space-y-6">
      <Card className="repo-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Repositories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {repositories.map((repo) => (
            <div
              key={repo.name}
              className="repo-item flex items-start justify-between p-4 border rounded-none transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Code2 className="repo-icon w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">{repo.name}</p>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <GitCommit className="w-3 h-3" />
                    {repo.commits} commits
                  </span>
                  <span>Branch: {repo.branch}</span>
                  <span>Updated {repo.lastUpdate}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <ExternalLink className="w-4 h-4" />
                View
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="metrics-card">
        <CardHeader>
          <CardTitle>Code Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {codeMetrics.map((metric) => (
            <div key={metric.language} className="metric-item">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium">{metric.language}</p>
                  <p className="text-sm text-muted-foreground">
                    {metric.files} files • {metric.lines.toLocaleString()} lines
                  </p>
                </div>
                <Badge variant="outline">{metric.percentage}%</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="metric-bar h-2 rounded-full bg-accent" 
                  style={{ width: `${metric.percentage}%` }} 
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="commits-card">
        <CardHeader>
          <CardTitle>Recent Commits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentCommits.map((commit, i) => (
            <div key={i} className="commit-item flex items-start gap-3 pb-3 border-b last:border-b-0 cursor-pointer">
              <GitCommit className="commit-icon w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{commit.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {commit.author} • {commit.time}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
