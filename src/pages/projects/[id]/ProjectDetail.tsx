import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DatePicker } from "@/components/ui/DatePicker";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Skeleton } from "@repo/ui/skeleton";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Users,
  FolderKanban,
  Plus,
  X,
  Edit,
  Save,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import { Label } from "@repo/ui/label";
import { useProject, useProjectTeams, useAssignTeamToProject, useRemoveTeamFromProject, useUpdateProject } from "@/queries/projects/projectQueries";
import { useDepartmentTeams } from "@/queries/teams/teamQueries";
import { useCompanyDepartments } from "@/queries/departments/departmentQueries";
import type { Project } from "@/types/projects/project";
import { ProjectTasksSection } from "@/components/projects/ProjectTasksSection";
import { gsap } from "gsap";
import toast from "react-hot-toast";

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const projectId = id || "";

  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [removeConfirm, setRemoveConfirm] = useState<{ id: string; name: string } | null>(null);
  const [isEditingProject, setIsEditingProject] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { data: project, isLoading, error, refetch } = useProject(projectId);
  const { data: projectTeams, isLoading: teamsLoading } = useProjectTeams(projectId);
  const { data: departments } = useCompanyDepartments(project?.company_id || "");
  const { data: departmentTeams } = useDepartmentTeams(selectedDepartment);
  
  const assignTeamMutation = useAssignTeamToProject();
  const removeTeamMutation = useRemoveTeamFromProject();
  const updateProjectMutation = useUpdateProject();

  const projectForm = useForm({
    defaultValues: {
      name: "",
      description: "",
      status: "planning" as Project["status"],
      start_date: undefined as Date | undefined,
      end_date: undefined as Date | undefined,
    },
  });

  // Update form when project data loads
  useEffect(() => {
    if (project) {
      projectForm.reset({
        name: project.name,
        description: project.description,
        status: project.status,
        start_date: project.start_date ? new Date(project.start_date) : undefined,
        end_date: project.end_date ? new Date(project.end_date) : undefined,
      });
    }
  }, [project, projectForm]);

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

  const handleAssignTeam = async () => {
    if (!selectedTeam || !startDate || !endDate) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await assignTeamMutation.mutateAsync({
        project_id: projectId,
        team_id: selectedTeam,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: "assigned",
      });
      toast.success("Team assigned successfully");
      setIsAssignDialogOpen(false);
      setSelectedDepartment("");
      setSelectedTeam("");
      setStartDate(undefined);
      setEndDate(undefined);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to assign team");
    }
  };

  const handleRemoveTeamClick = (projectTeamId: string, teamName: string) => {
    setRemoveConfirm({ id: projectTeamId, name: teamName });
  };

  const handleRemoveTeamConfirm = async () => {
    if (!removeConfirm) return;

    try {
      await removeTeamMutation.mutateAsync(removeConfirm.id);
      toast.success("Team removed successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to remove team");
    } finally {
      setRemoveConfirm(null);
    }
  };

  const handleUpdateProject = projectForm.handleSubmit(async (data) => {
    if (!data.start_date || !data.end_date) {
      toast.error("Please select both start and end dates");
      return;
    }

    try {
      await updateProjectMutation.mutateAsync({
        id: projectId,
        name: data.name.trim(),
        description: data.description.trim(),
        status: data.status,
        start_date: data.start_date.toISOString().split('T')[0],
        end_date: data.end_date.toISOString().split('T')[0],
      });
      toast.success("Project updated successfully!");
      setIsEditingProject(false);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to update project";
      toast.error(errorMessage);
    }
  });

  const handleCancelEdit = () => {
    if (project) {
      projectForm.reset({
        name: project.name,
        description: project.description,
        status: project.status,
        start_date: project.start_date ? new Date(project.start_date) : undefined,
        end_date: project.end_date ? new Date(project.end_date) : undefined,
      });
    }
    setIsEditingProject(false);
  };

  useEffect(() => {
    if (!project) return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.from(".detail-card", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.2,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [project]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-4">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-medium">Error loading project</p>
                <p className="text-sm text-muted-foreground">
                  {error?.message || "Failed to fetch project data"}
                </p>
              </div>
              <Button variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6 p-4">
      <div ref={headerRef} className="flex items-center gap-4">
        <Link to="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <FolderKanban className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <Badge variant={getStatusColor(project.status)}>
              {project.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{project.code}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="detail-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Project Details</CardTitle>
                {!isEditingProject ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProject(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={updateProjectMutation.isPending}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleUpdateProject}
                      disabled={updateProjectMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {updateProjectMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditingProject ? (
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Project Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      {...projectForm.register("name", {
                        required: "Project name is required",
                        minLength: {
                          value: 3,
                          message: "Name must be at least 3 characters",
                        },
                      })}
                      className="mt-1"
                    />
                    {projectForm.formState.errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {projectForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      {...projectForm.register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 10,
                          message: "Description must be at least 10 characters",
                        },
                      })}
                      rows={4}
                      className="mt-1 resize-none"
                    />
                    {projectForm.formState.errors.description && (
                      <p className="text-sm text-red-500 mt-1">
                        {projectForm.formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-sm font-medium">
                      Status <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={projectForm.watch("status")}
                      onValueChange={(value) => projectForm.setValue("status", value as Project["status"])}
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Start Date <span className="text-destructive">*</span>
                      </Label>
                      <DatePicker
                        date={projectForm.watch("start_date")}
                        onDateChange={(date) => projectForm.setValue("start_date", date)}
                        placeholder="Select start date"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        End Date <span className="text-destructive">*</span>
                      </Label>
                      <DatePicker
                        date={projectForm.watch("end_date")}
                        onDateChange={(date) => projectForm.setValue("end_date", date)}
                        placeholder="Select end date"
                        className="mt-1"
                        disabled={!projectForm.watch("start_date")}
                      />
                    </div>
                  </div>
                </form>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Description
                    </h3>
                    <p className="text-sm">{project.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Start Date
                      </h3>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(project.start_date)}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        End Date
                      </h3>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(project.end_date)}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {project.manager && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Project Manager
                  </h3>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {project.manager.first_name} {project.manager.last_name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({project.manager.email})
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
        <div className="space-y-6">
          <Card className="detail-card">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Teams</p>
                <p className="text-2xl font-bold">{projectTeams?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={getStatusColor(project.status)} className="mt-1">
                  {project.status.replace("_", " ")}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-sm font-medium mt-1">
                  {formatDate(project.start_date)} - {formatDate(project.end_date)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
          <Card className="detail-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Assigned Teams</CardTitle>
                <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Assign Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign Team to Project</DialogTitle>
                      <DialogDescription>
                        Select a team and set the assignment period
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Department <span className="text-destructive">*</span></Label>
                        <Select
                          value={selectedDepartment}
                          onValueChange={(value) => {
                            setSelectedDepartment(value);
                            setSelectedTeam(""); // Reset team when department changes
                          }}
                        >
                          <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments && departments.length > 0 ? (
                              departments
                                .filter((dept) => dept.status === "active")
                                .map((dept) => (
                                  <SelectItem key={dept.id} value={dept.id}>
                                    {dept.name} ({dept.code})
                                  </SelectItem>
                                ))
                            ) : (
                              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                No departments available
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedDepartment && (
                        <div>
                          <Label>Team <span className="text-destructive">*</span></Label>
                          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                            <SelectTrigger className="mt-1 w-full">
                              <SelectValue placeholder="Select team" />
                            </SelectTrigger>
                            <SelectContent>
                              {departmentTeams && departmentTeams.length > 0 ? (
                                departmentTeams
                                  .filter((team) => team.status === "active")
                                  .map((team) => (
                                    <SelectItem key={team.id} value={team.id}>
                                      {team.name} ({team.code})
                                    </SelectItem>
                                  ))
                              ) : (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                  No teams available in this department
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <Label>Start Date <span className="text-destructive">*</span></Label>
                        <DatePicker
                          date={startDate}
                          onDateChange={setStartDate}
                          placeholder="Select start date"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>End Date <span className="text-destructive">*</span></Label>
                        <DatePicker
                          date={endDate}
                          onDateChange={setEndDate}
                          placeholder="Select end date"
                          className="mt-1"
                          disabled={!startDate}
                        />
                      </div>

                      <Button
                        onClick={handleAssignTeam}
                        className="w-full"
                        disabled={assignTeamMutation.isPending}
                      >
                        {assignTeamMutation.isPending ? "Assigning..." : "Assign Team"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {teamsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : projectTeams && projectTeams.length > 0 ? (
                <div className="space-y-3">
                  {projectTeams.map((pt) => (
                    <Card key={pt.id} className="border">
                      <CardContent>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Link 
                                to={`/teams/${pt.team_id}`}
                                className="font-medium hover:text-primary transition-colors"
                              >
                                {pt.team?.name}
                              </Link>
                              <Badge variant="outline" className="text-xs">
                                {pt.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {pt.team?.code}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{formatDate(pt.start_date)}</span>
                              <span>→</span>
                              <span>{formatDate(pt.end_date)}</span>
                            </div>
                            <Link 
                              to={`/teams/${pt.team_id}`}
                              className="text-xs text-primary hover:underline mt-2 inline-flex items-center gap-1"
                            >
                              View team details
                              <ArrowLeft className="w-3 h-3 rotate-180" />
                            </Link>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveTeamClick(pt.id, pt.team?.name || "")}
                            disabled={removeTeamMutation.isPending}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No teams assigned yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <ProjectTasksSection projectId={projectId} companyId={project.company_id} />
      </div>

      <ConfirmDialog
        open={!!removeConfirm}
        onOpenChange={(open) => !open && setRemoveConfirm(null)}
        onConfirm={handleRemoveTeamConfirm}
        title="Remove Team"
        description={`Are you sure you want to remove ${removeConfirm?.name} from this project? This action cannot be undone.`}
        confirmText="Remove"
      />
    </div>
  );
}
