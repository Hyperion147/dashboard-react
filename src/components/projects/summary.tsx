import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card"
import { Badge } from "@repo/ui/badge"
import { Progress } from "@repo/ui/progress"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { getProjectTeam, getProjectSummary as getSummary } from "@/data/projects/get-project-data"
import { gsap } from "gsap"

interface ProjectSummaryProps {
  projectId: string
}

export function ProjectSummary({ projectId }: ProjectSummaryProps) {
  const teamMembers = getProjectTeam(projectId)
  const projectSummary = getSummary(projectId)
  
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger stats cards
      gsap.fromTo(
        ".stat-card",
        {
          y: -50,
          opacity: 0,
          filter: "blur(15px)",
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        }
      )

      // Animate stat numbers with counter effect
      const statNumbers = document.querySelectorAll(".stat-number")
      statNumbers.forEach((element) => {
        gsap.from(element, {
          textContent: 0,
          duration: 1.5,
          delay: 0.5,
          snap: { textContent: 1 },
          ease: "power2.out",
          onUpdate: function() {
            const value = Math.round(gsap.getProperty(element, "textContent") as number)
            element.textContent = value.toString()
          }
        })
      })

      // Animate progress bar
      gsap.fromTo(
        ".progress-bar",
        {
          scaleX: 0,
          transformOrigin: "left",
        },
        {
          scaleX: 1,
          duration: 1.2,
          delay: 0.8,
          ease: "power2.out",
        }
      )

      // Stagger detail cards
      gsap.fromTo(
        ".detail-card",
        {
          y: -40,
          opacity: 0,
          filter: "blur(12px)",
          scale: 0.97,
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          delay: 0.4,
          ease: "power3.out",
        }
      )

      // Stagger detail items
      gsap.fromTo(
        ".detail-item",
        {
          x: -20,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          delay: 0.7,
          ease: "power2.out",
        }
      )

      // Team members card
      gsap.fromTo(
        ".team-card",
        {
          y: -30,
          opacity: 0,
          filter: "blur(10px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.7,
          delay: 0.8,
          ease: "power3.out",
        }
      )

      // Stagger team members
      gsap.fromTo(
        ".team-member",
        {
          x: -20,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          delay: 1.1,
          ease: "power2.out",
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [projectId])

  // Interactive hover animations
  useEffect(() => {
    // Stat cards hover
    const statCards = document.querySelectorAll(".stat-card")
    statCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -6,
          scale: 1.03,
          boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
          duration: 0.3,
          ease: "power2.out",
        })
      })

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          duration: 0.3,
          ease: "power2.out",
        })
      })
    })

    // Detail cards hover
    const detailCards = document.querySelectorAll(".detail-card")
    detailCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -4,
          scale: 1.01,
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          duration: 0.3,
          ease: "power2.out",
        })
      })

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          duration: 0.3,
          ease: "power2.out",
        })
      })
    })

    // Task breakdown icons
    const taskIcons = document.querySelectorAll(".task-icon")
    taskIcons.forEach((icon) => {
      const parent = icon.closest(".detail-item")
      parent?.addEventListener("mouseenter", () => {
        gsap.to(icon, {
          scale: 1.3,
          rotation: 10,
          duration: 0.3,
          ease: "back.out(1.7)",
        })
      })

      parent?.addEventListener("mouseleave", () => {
        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out",
        })
      })
    })
  }, [projectId])

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stat-card cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              <span className="stat-number">{projectSummary.overallProgress}</span>%
            </div>
            <div className="progress-bar mt-2">
              <Progress value={projectSummary.overallProgress} />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold stat-number">{projectSummary.teamMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">Active contributors</p>
          </CardContent>
        </Card>

        <Card className="stat-card cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold stat-number">{projectSummary.totalTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="stat-number">{projectSummary.completedTasks}</span> completed
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Due Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{projectSummary.dueDate}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="stat-number">{projectSummary.daysRemaining}</span> days remaining
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="detail-card">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="detail-item">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="mt-1 bg-green-100 text-green-800">{projectSummary.status}</Badge>
            </div>
            <div className="detail-item">
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium mt-1">{projectSummary.startDate}</p>
            </div>
            <div className="detail-item">
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium mt-1">{projectSummary.endDate}</p>
            </div>
            <div className="detail-item">
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="font-medium mt-1">{projectSummary.budget}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="detail-card">
          <CardHeader>
            <CardTitle>Task Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="detail-item flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="task-icon w-4 h-4 text-green-500" />
                <span className="text-sm">Completed</span>
              </div>
              <span className="font-medium">{projectSummary.taskBreakdown.completed}</span>
            </div>
            <div className="detail-item flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Clock className="task-icon w-4 h-4 text-blue-500" />
                <span className="text-sm">In Progress</span>
              </div>
              <span className="font-medium">{projectSummary.taskBreakdown.inProgress}</span>
            </div>
            <div className="detail-item flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <AlertCircle className="task-icon w-4 h-4 text-yellow-500" />
                <span className="text-sm">Pending</span>
              </div>
              <span className="font-medium">{projectSummary.taskBreakdown.pending}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="team-card">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Active contributors on this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div key={member.name} className="team-member flex items-center justify-between p-2 rounded-lg cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="team-avatar w-8 h-8 bg-accent rounded-full flex items-center justify-center text-xs font-medium">
                    {member.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
