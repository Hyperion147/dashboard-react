import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    Clock,
    CheckCircle2,
    AlertCircle,
    FolderKanban,
    Users,
    Calendar,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { dummyProjects } from "@/data/dummy";
import {
    useCompanyTasks,
    useProjectTasks,
    useUpdateTaskStatus,
} from "@/queries/tasks/taskQueries";
import { CreateTaskDialog } from "@/components/projects/CreateTaskDialog";
import type { Task } from "@/types/tasks/task";
import { gsap } from "gsap";
import toast from "react-hot-toast";

export function TaskAssginment() {
    const params = useParams<{ companyId: string }>();
    const { companyId: authCompanyId } = useAuth();
    const companyId = params.companyId || authCompanyId;

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProject, setSelectedProject] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedPriority, setSelectedPriority] = useState<string>("all");

    const containerRef = useRef<HTMLDivElement>(null);

    // Mock useCompanyProjects
    const { data: projects, isLoading: projectsLoading } = {
        data: dummyProjects,
        isLoading: false,
    };

    // Get all project IDs for fetching all tasks
    const projectIds = projects?.map((p) => p.id) || [];

    // Fetch tasks based on selection
    const { data: allTasks, isLoading: allTasksLoading } = useCompanyTasks(
        companyId || "",
        projectIds
    );
    const { data: projectTasks, isLoading: projectTasksLoading } =
        useProjectTasks(selectedProject !== "all" ? selectedProject : "");

    const updateTaskStatusMutation = useUpdateTaskStatus();

    // Use the appropriate tasks based on selection
    const tasks = selectedProject === "all" ? allTasks : projectTasks;
    const tasksLoading =
        selectedProject === "all" ? allTasksLoading : projectTasksLoading;
    const isLoading = projectsLoading || tasksLoading;

    // Filter tasks
    const filteredTasks = useMemo(() => {
        if (!tasks || !Array.isArray(tasks)) return [];

        return tasks.filter((task) => {
            const matchesSearch =
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                task.assigned_to?.first_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                task.assigned_to?.last_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                selectedStatus === "all" || task.status === selectedStatus;
            const matchesPriority =
                selectedPriority === "all" ||
                task.priority === selectedPriority;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [tasks, searchTerm, selectedStatus, selectedPriority]);

    // Calculate stats
    const stats = useMemo(() => {
        if (!tasks || !Array.isArray(tasks)) {
            return {
                total: 0,
                inProgress: 0,
                completed: 0,
                overdue: 0,
            };
        }

        const now = new Date();
        return {
            total: tasks.length,
            inProgress: tasks.filter(
                (t) =>
                    t.status === "in_progress" ||
                    t.status === "developed" ||
                    t.status === "code_review" ||
                    t.status === "deployment" ||
                    t.status === "qa"
            ).length,
            completed: tasks.filter((t) => t.status === "done").length,
            overdue: tasks.filter(
                (t) => new Date(t.due_date) < now && t.status !== "done"
            ).length,
        };
    }, [tasks]);

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
                return "text-red-600 bg-red-50";
            case "high":
                return "text-orange-600 bg-orange-50";
            case "medium":
                return "text-yellow-600 bg-yellow-50";
            default:
                return "text-gray-600 bg-gray-50";
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

    const isOverdue = (dueDate: string, status: string): boolean => {
        return new Date(dueDate) < new Date() && status !== "done";
    };

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        try {
            await updateTaskStatusMutation.mutateAsync({
                id: taskId,
                status: newStatus,
            });
            toast.success("Task status updated");
        } catch (error) {
            toast.error("Failed to update task status");
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".initial-animation",
                {
                    y: -20,
                    opacity: 0,
                    filter: "blur(20px)",
                },
                {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.8,
                    stagger: 0.05,
                    ease: "power3.out",
                    delay: 0.2,
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="space-y-6 p-4">
            {/* Header */}
            <div
                className="flex flex-col sm:flex-row gap-4 justify-between initial-animation"
            >
                <div>
                    <h1 className="text-2xl font-bold">Task Assignment</h1>
                    <p className="text-muted-foreground">
                        Manage and assign tasks across projects
                    </p>
                </div>
                {selectedProject && selectedProject !== "all" && (
                    <CreateTaskDialog projectId={selectedProject} />
                )}
            </div>

            {/* Stats */}
            <div
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
                <Card className="initial-animation">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <FolderKanban className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">
                                Total Tasks
                            </span>
                        </div>
                        <p className="text-2xl font-bold mt-2">{stats.total}</p>
                    </CardContent>
                </Card>
                <Card className="initial-animation">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium">
                                In Progress
                            </span>
                        </div>
                        <p className="text-2xl font-bold mt-2">
                            {stats.inProgress}
                        </p>
                    </CardContent>
                </Card>
                <Card className="initial-animation">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">
                                Completed
                            </span>
                        </div>
                        <p className="text-2xl font-bold mt-2">
                            {stats.completed}
                        </p>
                    </CardContent>
                </Card>
                <Card className="initial-animation">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium">Overdue</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">
                            {stats.overdue}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 initial-animation">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks or employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                    />
                </div>

                <div className="w-full sm:w-40 initial-animation">
                    <Select
                        value={selectedProject}
                        onValueChange={setSelectedProject}
                        disabled={projectsLoading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Projects</SelectItem>
                            {projects?.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                    {project.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full sm:w-40 initial-animation">
                    <Select
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in_progress">
                                In Progress
                            </SelectItem>
                            <SelectItem value="developed">Developed</SelectItem>
                            <SelectItem value="code_review">
                                Code Review
                            </SelectItem>
                            <SelectItem value="deployment">
                                Deployment
                            </SelectItem>
                            <SelectItem value="qa">QA</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full sm:w-40 initial-animation">
                    <Select
                        value={selectedPriority}
                        onValueChange={setSelectedPriority}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue
                                placeholder="Priority"
                                className="w-full"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priority</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Tasks List */}
            {isLoading ? (
                <div className="space-y-4 initial-animation">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
            ) : filteredTasks.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center initial-animation">
                        <FolderKanban className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                            No tasks found
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm ||
                            selectedStatus !== "all" ||
                            selectedPriority !== "all"
                                ? "Try adjusting your filters"
                                : selectedProject === "all"
                                ? "Select a project to view tasks"
                                : "No tasks in this project yet"}
                        </p>
                        {selectedProject && selectedProject !== "all" && (
                            <CreateTaskDialog projectId={selectedProject} />
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredTasks.map((task) => (
                        <Card
                            key={task.id}
                            className="task-card hover:shadow-md transition-shadow initial-animation"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <CardTitle className="text-lg">
                                                {task.title}
                                            </CardTitle>
                                            <Badge
                                                variant={getStatusColor(
                                                    task.status
                                                )}
                                            >
                                                {getStatusLabel(task.status)}
                                            </Badge>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-none font-medium ${getPriorityColor(
                                                    task.priority
                                                )}`}
                                            >
                                                {task.priority.toUpperCase()}
                                            </span>
                                            {isOverdue(
                                                task.due_date,
                                                task.status
                                            ) && (
                                                <Badge
                                                    variant="destructive"
                                                    className="text-xs"
                                                >
                                                    OVERDUE
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {task.description}
                                        </p>
                                    </div>
                                    <Select
                                        value={task.status}
                                        onValueChange={(value) =>
                                            handleStatusChange(task.id, value)
                                        }
                                        disabled={
                                            updateTaskStatusMutation.isPending
                                        }
                                    >
                                        <SelectTrigger className="w-60">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todo">
                                                To Do
                                            </SelectItem>
                                            <SelectItem value="in_progress">
                                                In Progress
                                            </SelectItem>
                                            <SelectItem value="developed">
                                                Developed
                                            </SelectItem>
                                            <SelectItem value="code_review">
                                                Code Review
                                            </SelectItem>
                                            <SelectItem value="deployment">
                                                Deployment
                                            </SelectItem>
                                            <SelectItem value="qa">
                                                QA
                                            </SelectItem>
                                            <SelectItem value="done">
                                                Done
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    {task.assigned_to && (
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Assigned to
                                                </p>
                                                <p className="font-medium">
                                                    {
                                                        task.assigned_to
                                                            .first_name
                                                    }{" "}
                                                    {task.assigned_to.last_name}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {task.team && (
                                        <div className="flex items-center gap-2">
                                            <FolderKanban className="w-4 h-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Team
                                                </p>
                                                <p className="font-medium">
                                                    {task.team.name}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Due Date
                                            </p>
                                            <p
                                                className={`font-medium ${
                                                    isOverdue(
                                                        task.due_date,
                                                        task.status
                                                    )
                                                        ? "text-red-600"
                                                        : ""
                                                }`}
                                            >
                                                {formatDate(task.due_date)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
