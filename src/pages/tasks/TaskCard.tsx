import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card"
import { Badge } from "@repo/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar"
import { Clock, CalendarIcon, Flag } from "lucide-react"
import { cn } from "@repo/ui/lib"
import { statusConfig, priorityConfig, type AssignedTask } from "@/data/admin/task-assignment"

interface TaskCardProps {
  task: AssignedTask
}

export function TaskCard({ task }: TaskCardProps) {
  const StatusIcon = statusConfig[task.status].icon
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed"

  return (
    <Card className={cn("transition-all hover:shadow-md", isOverdue && "border-red-200")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{task.title}</CardTitle>
            <CardDescription className="text-sm mt-1">{task.project}</CardDescription>
          </div>
          <Badge
            variant="secondary"
            className={cn(priorityConfig[task.priority].bg, priorityConfig[task.priority].color)}
          >
            <Flag className="w-3 h-3 mr-1" />
            {priorityConfig[task.priority].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{task.description}</p>

        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={task.assignedTo.avatar || "/placeholder.svg"} alt={task.assignedTo.name} />
            <AvatarFallback>
              {task.assignedTo.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{task.assignedTo.name}</p>
            <p className="text-xs text-muted-foreground">{task.assignedTo.role}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{task.estimatedHours}h estimated</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            <span className={cn(isOverdue && "text-red-600 font-medium")}>
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <StatusIcon className={cn("w-4 h-4", statusConfig[task.status].color)} />
            <Badge variant="outline" className={statusConfig[task.status].bg}>
              {statusConfig[task.status].label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
