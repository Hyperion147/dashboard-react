import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Skeleton } from "@repo/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import {
  Search,
  Users,
  Calendar,
  AlertCircle,
  Plus,
  FolderKanban,
  MoreVertical,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyProjects, useUpdateProjectStatus } from "@/queries/projects/projectQueries";
import type { Project } from "@/types/projects/project";
import { gsap } from "gsap";
import toast from "react-hot-toast";

export function ProjectManagement() {
  const params = useParams<{ companyId: string }>();
  const { companyId: authCompanyId } = useAuth();
  const companyId = params.companyId || authCompanyId;

  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const {
    data: projects,
    isLoading,
    error,
    refetch,
  } = useCompanyProjects(companyId || "");

  const updateStatusMutation = useUpdateProjectStatus();

  const handleStatusChange = async (projectId: string, newStatus: Project["status"]) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: projectId,
        status: newStatus,
      });
      toast.success("Project status updated successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update project status");
    }
  };

  const getStatusColor = (
    status: Project["status"]
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "in_progress":
        return "default";
      case "completed":
        return "secondary";
      case "on_hold":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
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

  const filteredProjects = useMemo(() => {
    if (!projects || !Array.isArray(projects)) {
      return [];
    }

    if (!searchTerm || searchTerm.trim() === "") {
      return projects;
    }

    const lowerTerm = searchTerm.toLowerCase().trim();

    return projects.filter((project) => {
      const name = (project.name ?? "").toLowerCase();
      const code = (project.code ?? "").toLowerCase();
      const description = (project.description ?? "").toLowerCase();
      const managerName = project.manager
        ? `${project.manager.first_name} ${project.manager.last_name}`.toLowerCase()
        : "";

      return (
        name.includes(lowerTerm) ||
        code.includes(lowerTerm) ||
        description.includes(lowerTerm) ||
        managerName.includes(lowerTerm)
      );
    });
  }, [projects, searchTerm]);

  const projectStats = useMemo(() => {
    if (!projects || !Array.isArray(projects)) {
      return {
        total: 0,
        inProgress: 0,
        completed: 0,
        onHold: 0,
        planning: 0,
      };
    }

    return {
      total: projects.length,
      inProgress: projects.filter((p) => p.status === "in_progress").length,
      completed: projects.filter((p) => p.status === "completed").length,
      onHold: projects.filter((p) => p.status === "on_hold").length,
      planning: projects.filter((p) => p.status === "planning").length,
    };
  }, [projects]);

  useEffect(() => {
    if (!projects || filteredProjects.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.from(searchRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.6,
        delay: 0.2,
        ease: "power2.out",
      });

      gsap.from(".project-card", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.3,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [projects, filteredProjects]);

  const ProjectCardSkeleton = () => (
    <Card className="project-card-skeleton">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );

  return (
    <div ref={containerRef} className="space-y-6 p-4">
      <div
        ref={headerRef}
        className="flex flex-col sm:flex-row gap-4 justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Project Management</h1>
          <p className="text-muted-foreground">
            Manage projects and assign teams
          </p>
        </div>
        <Link to="/projects/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      {!isLoading && projects && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{projectStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{projectStats.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{projectStats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{projectStats.onHold}</p>
                <p className="text-sm text-muted-foreground">On Hold</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{projectStats.planning}</p>
                <p className="text-sm text-muted-foreground">Planning</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div ref={searchRef} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search projects by name, code, or manager..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-medium">Error loading projects</p>
                <p className="text-sm text-muted-foreground">
                  {error.message || "Failed to fetch project data"}
                </p>
              </div>
              <Button variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!isLoading && !error && projects && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="project-card hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.code}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(project.status)}>
                      {project.status.replace("_", " ")}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(project.id, "planning");
                          }}
                          disabled={project.status === "planning" || updateStatusMutation.isPending}
                        >
                          Mark as Planning
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(project.id, "in_progress");
                          }}
                          disabled={project.status === "in_progress" || updateStatusMutation.isPending}
                        >
                          Mark as In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(project.id, "on_hold");
                          }}
                          disabled={project.status === "on_hold" || updateStatusMutation.isPending}
                        >
                          Mark as On Hold
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(project.id, "completed");
                          }}
                          disabled={project.status === "completed" || updateStatusMutation.isPending}
                        >
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(project.id, "cancelled");
                          }}
                          disabled={project.status === "cancelled" || updateStatusMutation.isPending}
                          className="text-destructive"
                        >
                          Mark as Cancelled
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>

                {project.manager && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Manager:</span>
                    <span className="font-medium">
                      {project.manager.first_name} {project.manager.last_name}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(project.start_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>→</span>
                    <span>{formatDate(project.end_date)}</span>
                  </div>
                </div>

                <Link to={`/projects/${project.id}`}>
                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && !error && filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderKanban className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">
            {searchTerm
              ? "No projects found matching your search."
              : "No projects found. Create your first project to get started."}
          </p>
          {!searchTerm && (
            <Link to="/projects/create">
              <Button className="mt-4 gap-2">
                <Plus className="w-4 h-4" />
                Create First Project
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
