import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle } from "lucide-react"
import { getProjectPhases, getProjectMilestones } from "@/data/projects/get-project-data"
import { gsap } from "gsap"

const statusIcons = {
  completed: <CheckCircle2 className="w-5 h-5 text-green-500" />,
  "in-progress": <Circle className="w-5 h-5 text-blue-500 fill-blue-500" />,
  pending: <Circle className="w-5 h-5 text-gray-300" />,
}

const statusColors = {
  completed: "bg-green-100 text-green-800",
  "in-progress": "bg-blue-100 text-blue-800",
  pending: "bg-gray-100 text-gray-800",
}

export function ProjectTimelineView({ projectId }: { projectId: string }) {
  const phases = getProjectPhases(projectId)
  const milestones = getProjectMilestones(projectId)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
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

      // Stagger phase cards
      gsap.fromTo(
        ".phase-card",
        {
          x: -40,
          opacity: 0,
          filter: "blur(12px)",
        },
        {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: 0.15,
          delay: 0.3,
          ease: "power3.out",
        }
      )

      // Animate phase icons
      gsap.fromTo(
        ".phase-icon",
        {
          scale: 0,
          rotation: -180,
        },
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.5,
          ease: "back.out(1.7)",
        }
      )

      // Animate progress bars
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
          stagger: 0.15,
          ease: "power2.out",
        }
      )

      // Animate connectors
      gsap.fromTo(
        ".timeline-connector",
        {
          scaleY: 0,
          transformOrigin: "top",
        },
        {
          scaleY: 1,
          duration: 0.4,
          stagger: 0.15,
          delay: 0.7,
          ease: "power2.out",
        }
      )

      // Milestones card
      gsap.fromTo(
        ".milestones-card",
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
          delay: 0.6,
          ease: "power3.out",
        }
      )

      // Stagger milestone items
      gsap.fromTo(
        ".milestone-item",
        {
          x: -20,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          delay: 0.9,
          ease: "power2.out",
        }
      )

      // Animate milestone icons
      gsap.fromTo(
        ".milestone-icon",
        {
          scale: 0,
        },
        {
          scale: 1,
          duration: 0.4,
          stagger: 0.08,
          delay: 1.1,
          ease: "back.out(1.7)",
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [projectId])

  // Hover animations
  useEffect(() => {
    const phaseCards = document.querySelectorAll(".phase-card")
    phaseCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          x: 4,
          scale: 1.01,
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          duration: 0.3,
          ease: "power2.out",
        })

        const icon = card.querySelector(".phase-icon")
        gsap.to(icon, {
          scale: 1.15,
          rotation: 10,
          duration: 0.3,
          ease: "back.out(1.7)",
        })
      })

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          x: 0,
          scale: 1,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          duration: 0.3,
          ease: "power2.out",
        })

        const icon = card.querySelector(".phase-icon")
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
      <h3 ref={headerRef} className="text-xl font-bold">Project Timeline</h3>

      <div className="space-y-4">
        {phases.map((phase, index) => (
          <Card key={phase.id} className="phase-card cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="phase-icon flex-shrink-0 mt-1">{statusIcons[phase.status]}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-base">{phase.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(phase.startDate).toLocaleDateString()} -{" "}
                        {new Date(phase.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={statusColors[phase.status]}>{phase.status}</Badge>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{phase.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                      <div
                        className="progress-bar h-2.5 rounded-full bg-accent transition-all"
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {phase.completedTasks}/{phase.tasks} tasks completed
                    </span>
                  </div>
                </div>
              </div>

              {index < phases.length - 1 && (
                <div className="flex justify-center mt-4">
                  <div className="timeline-connector w-0.5 h-8 bg-border" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="milestones-card">
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {milestones.map((milestone, i) => (
            <div key={i} className="milestone-item flex items-center justify-between p-3 border rounded-none cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="milestone-icon">
                  {milestone.status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{milestone.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(milestone.date).toLocaleDateString()}</p>
                </div>
              </div>
              <Badge variant={milestone.status === "completed" ? "default" : "outline"}>{milestone.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
