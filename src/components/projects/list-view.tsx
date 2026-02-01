import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, ChevronDown, Clock, User, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DueDatePicker } from "../custom/due-date"
import {
  assignees,
  statusColors,
  priorityColors,
  type Task,
} from "@/data/projects/tasks"
import { getProjectTasks } from "@/data/projects/get-project-data"
import { gsap } from "gsap"

export function ProjectListView({ projectId }: { projectId: string }) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null)
  const [tasksState, setTasksState] = useState(getProjectTasks(projectId))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    assignee: assignees[0],
    status: "todo" as const,
    priority: "medium" as const,
    dueDate: "",
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      toast.error("Please fill in all fields")
      return
    }

    const task: Task = {
      id: String(tasksState.length + 1),
      title: newTask.title,
      assignee: newTask.assignee,
      status: newTask.status,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      subtasks: 0,
      completedSubtasks: 0,
    }

    setTasksState([...tasksState, task])
    setNewTask({
      title: "",
      assignee: assignees[0],
      status: "todo",
      priority: "medium",
      dueDate: "",
    })
    setIsDialogOpen(false)
  }

  const toggleExpand = (taskId: string) => {
    const isExpanding = expandedTask !== taskId
    
    if (expandedTask) {
      // Collapse current expanded task
      const currentExpanded = document.querySelector(`#subtasks-${expandedTask}`)
      gsap.to(currentExpanded, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      })
      
      const currentChevron = document.querySelector(`#chevron-${expandedTask}`)
      gsap.to(currentChevron, {
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    if (isExpanding) {
      setExpandedTask(taskId)
      
      // Expand new task
      setTimeout(() => {
        const subtasks = document.querySelector(`#subtasks-${taskId}`)
        if (subtasks) {
          gsap.fromTo(
            subtasks,
            { height: 0, opacity: 0 },
            { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" }
          )
          
          gsap.fromTo(
            subtasks.querySelectorAll(".subtask-item"),
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3, stagger: 0.08, delay: 0.2, ease: "power2.out" }
          )
        }
        
        const chevron = document.querySelector(`#chevron-${taskId}`)
        gsap.to(chevron, {
          rotation: 180,
          duration: 0.3,
          ease: "power2.out",
        })
      }, 50)
    } else {
      setExpandedTask(null)
    }
  }

  // Initial animations
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

      // Stagger task cards
      gsap.fromTo(
        ".task-card",
        {
          x: -30,
          opacity: 0,
          filter: "blur(10px)",
        },
        {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.6,
          stagger: 0.08,
          delay: 0.3,
          ease: "power3.out",
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [projectId])

  // Dialog animation
  useEffect(() => {
    if (isDialogOpen) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".dialog-wrapper",
          {
            scale: 0.9,
            opacity: 0,
            y: -20,
          },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "back.out(1.7)",
          }
        )

        gsap.fromTo(
          ".dialog-field",
          {
            x: -20,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            delay: 0.2,
            ease: "power2.out",
          }
        )
      })

      return () => ctx.revert()
    }
  }, [isDialogOpen])

  // Hover animations
  useEffect(() => {
    const taskCards = document.querySelectorAll(".task-card")
    taskCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -4,
          scale: 1.01,
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
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

    // Checkbox hover
    const checkboxes = document.querySelectorAll(".task-checkbox")
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("mouseenter", () => {
        gsap.to(checkbox, {
          scale: 1.15,
          duration: 0.2,
          ease: "back.out(1.7)",
        })
      })

      checkbox.addEventListener("mouseleave", () => {
        gsap.to(checkbox, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        })
      })
    })
  }, [tasksState])

  return (
    <div ref={containerRef} className="space-y-6">
      <div ref={headerRef} className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Tasks</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {tasksState.filter(t => t.status === 'done').length} of {tasksState.length} tasks completed
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="dialog-wrapper">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Add a new task to this project</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="dialog-field">
                <Label htmlFor="task-title">Task Title</Label>
                <Input
                  id="task-title"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="dialog-field">
                <Label htmlFor="task-assignee">Assignee</Label>
                <Select value={newTask.assignee} onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assignees.map((assignee) => (
                      <SelectItem key={assignee} value={assignee}>
                        {assignee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="dialog-field">
                  <Label htmlFor="task-status">Status</Label>
                  <Select
                    value={newTask.status}
                    onValueChange={(value) => setNewTask({ ...newTask, status: value as typeof newTask.status })}
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">In Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="dialog-field">
                  <Label htmlFor="task-priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value as typeof newTask.priority })}
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="dialog-field">
                <Label htmlFor="task-duedate">Due Date</Label>
                <DueDatePicker
                  dueDate={newTask.dueDate}
                  setDueDate={(date) => setNewTask({ ...newTask, dueDate: date })}
                />
              </div>
              <Button onClick={handleAddTask} className="w-full dialog-field">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {tasksState.map((task) => (
          <Card key={task.id} className="task-card hover:shadow-md transition-shadow overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-start gap-4 p-4">
                <Checkbox className="task-checkbox mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-base leading-tight">{task.title}</h4>
                      
                      <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          <span>{task.assignee}</span>
                        </div>
                        
                        {task.subtasks > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{task.completedSubtasks}/{task.subtasks} subtasks</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={statusColors[task.status]}>
                          {task.status}
                        </Badge>
                        <Badge variant="outline" className={priorityColors[task.priority]}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(task.id)}
                      className="shrink-0"
                    >
                      <ChevronDown id={`chevron-${task.id}`} className="w-4 h-4" />
                    </Button>
                  </div>

                  <div 
                    id={`subtasks-${task.id}`}
                    className="overflow-hidden"
                    style={{ height: expandedTask === task.id ? 'auto' : 0, opacity: expandedTask === task.id ? 1 : 0 }}
                  >
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <p className="text-sm font-semibold">Subtasks</p>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="subtask-item flex items-center gap-3 text-sm p-2 rounded-none hover:bg-muted/50 transition-colors">
                          <Checkbox className="task-checkbox" />
                          <span>Subtask {i}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
