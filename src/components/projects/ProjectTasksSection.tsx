import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Skeleton } from "@repo/ui/skeleton";
import { CheckCircle2, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useProjectTasks } from "@/queries/tasks/taskQueries";
import { CreateTaskDialog } from "./CreateTaskDialog";
import type { Task } from "@/types/tasks/task";

interface ProjectTasksSectionProps {
  projectId: string;
  companyId?: string;
}

export function ProjectTasksSection({ projectId, companyId: _companyId }: ProjectTasksSectionProps) {
  const { data: tasks, isLoading } = useProjectTasks(projectId);

  const getStatusColor = (
    status: Task["status"]
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "done":
        return "secondary";
      case "in_progress":
      case "developed":
      case "code_review":
        return "default";
      case "deployment":
      case "qa":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: Task["status"]): string => {
    switch (status) {
      case "todo":
        return "To Do";
      case "in_progress":
        return "In Progress";
      case "developed":
        return "Developed";
      case "code_review":
        return "Code Review";
      case "deployment":
        return "Deployment";
      case "qa":
        return "QA";
      case "done":
        return "Done";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: Task["priority"]): string => {
    switch (priority) {
      case "urgent":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const taskStats = {
    total: tasks?.length || 0,
    completed: tasks?.filter((t) => t.status === "done").length || 0,
    inProgress: tasks?.filter((t) => 
      t.status === "in_progress" || 
      t.status === "developed" || 
      t.status === "code_review" || 
      t.status === "deployment" || 
      t.status === "qa"
    ).length || 0,
    blocked: 0, // Backend doesn't have blocked status
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tasks</CardTitle>
          <CreateTaskDialog projectId={projectId} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Task Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 bg-muted rounded-md">
            <p className="text-lg font-bold">{taskStats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-md">
            <p className="text-lg font-bold text-blue-600">{taskStats.inProgress}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-md">
            <p className="text-lg font-bold text-green-600">{taskStats.completed}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-md">
            <p className="text-lg font-bold text-red-600">{taskStats.blocked}</p>
            <p className="text-xs text-muted-foreground">Blocked</p>
          </div>
        </div>

        {/* Task List */}
        {tasks && tasks.length > 0 ? (
          <div className="space-y-3 grid grid-cols-4">
            {tasks.slice(0, 5).map((task) => (
              <Link
                to={`/managetasks`}
                className="block transition-transform hover:scale-[1.02]"
              >
                <Card className="border hover:border-primary hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium truncate">{task.title}</h4>
                          <Badge variant={getStatusColor(task.status)} className="text-xs">
                            {getStatusLabel(task.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {task.assigned_to && (
                            <span>
                              Assigned: {task.assigned_to.first_name} {task.assigned_to.last_name}
                            </span>
                          )}
                          <span className={getPriorityColor(task.priority)}>
                            {task.priority.toUpperCase()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(task.due_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {tasks.length > 5 && (
              <Link to={`/projects/${projectId}/tasks`}>
                <Button variant="outline" className="w-full">
                  View All {tasks.length} Tasks
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No tasks yet</p>
            <div className="mt-2">
              <CreateTaskDialog projectId={projectId} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
