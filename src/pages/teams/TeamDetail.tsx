import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Users,
  Building2,
  User,
  Mail,
  AlertCircle,
  ArrowUpRight,
  FolderKanban,
} from "lucide-react";
import { useTeam, useUpdateTeamStatus } from "@/queries/teams/teamQueries";
import { useTeamProjects } from "@/queries/projects/projectQueries";
import { useDepartment } from "@/queries/departments/departmentQueries";
import { AddTeamMemberDialog } from "@/components/teams/AddTeamMemberDialog";
import type { Team } from "@/types/projects/project";
import { gsap } from "gsap";
import toast from "react-hot-toast";

export function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const teamId = id || "";

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { data: team, isLoading, error, refetch } = useTeam(teamId);
  const updateStatusMutation = useUpdateTeamStatus();
  
  // Extract members from team data
  const employees = team?.members?.map(member => ({
    id: member.employee.id,
    idd: member.employee.idd,
    first_name: member.employee.first_name,
    last_name: member.employee.last_name,
    email: member.employee.email,
    job_title: member.job_title,
    designation: member.designation,
    level: member.level,
  })) || [];

  const handleStatusChange = async (newStatus: Team["status"]) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: teamId,
        status: newStatus,
      });
      toast.success("Team status updated successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update team status");
    }
  };
  
  // Get department details to access company_id
  const { data: department } = useDepartment(team?.department_id || "");
  
  const { companyId: authCompanyId } = useAuth();
  const { data: projects, isLoading: projectsLoading } = useTeamProjects(
    teamId,
    department?.company_id || authCompanyId || ""
  );

  const getInitials = (firstName: string, lastName: string): string => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || "NA";
  };

  const getStatusColor = (
    status: Team["status"]
  ): "default" | "secondary" => {
    return status === "active" ? "default" : "secondary";
  };

  // Animations
  useEffect(() => {
    if (!team) return;

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
  }, [team]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="p-4">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-medium">Error loading team</p>
                <p className="text-sm text-muted-foreground">
                  {error?.message || "Failed to fetch team data"}
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
      {/* Header */}
      <div ref={headerRef} className="flex items-center gap-4">
        <Link to="/teams">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">{team.name}</h1>
            <Badge variant={getStatusColor(team.status)}>
              {team.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Change Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleStatusChange("active")}
                  disabled={team.status === "active" || updateStatusMutation.isPending}
                >
                  Mark as Active
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("inactive")}
                  disabled={team.status === "inactive" || updateStatusMutation.isPending}
                  className="text-destructive"
                >
                  Mark as Inactive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-muted-foreground mt-1">{team.code}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="detail-card">
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Description
                </h3>
                <p className="text-sm">{team.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Team Code
                  </h3>
                  <p className="text-sm font-medium">{team.code}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Status
                  </h3>
                  <Badge variant={getStatusColor(team.status)}>
                    {team.status}
                  </Badge>
                </div>
              </div>

              {team.department && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Department
                  </h3>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {team.department.name}
                    </span>
                  </div>
                </div>
              )}

              {team.lead && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Team Lead
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {team.lead.first_name} {team.lead.last_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {team.lead.email}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Members Section */}
          <Card className="detail-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members ({employees.length})</CardTitle>
                <AddTeamMemberDialog 
                  teamId={teamId} 
                  companyId={department?.company_id || authCompanyId || ""}
                  currentMembers={employees}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : employees.length > 0 ? (
                <div className="space-y-3">
                  {employees.map((employee: any) => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" alt={`${employee.first_name} ${employee.last_name}`} />
                          <AvatarFallback>
                            {getInitials(employee.first_name, employee.last_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {employee.first_name} {employee.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                      <Link to={`/employees/${employee.id}`}>
                        <Button variant="ghost" size="icon">
                          <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No team members yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="detail-card">
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Team Code</p>
                <p className="text-lg font-bold">{team.code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={getStatusColor(team.status)} className="mt-1">
                  {team.status}
                </Badge>
              </div>
              {team.department && (
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="text-sm font-medium mt-1">
                    {team.department.name}
                  </p>
                </div>
              )}
              {team.lead && (
                <div>
                  <p className="text-sm text-muted-foreground">Team Lead</p>
                  <p className="text-sm font-medium mt-1">
                    {team.lead.first_name} {team.lead.last_name}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assigned Projects Section */}
          <Card className="detail-card">
            <CardHeader>
              <CardTitle>Assigned Projects ({projects?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : projects && projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.map((project: any) => (
                    <div
                      key={project.id}
                      className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <FolderKanban className="w-5 h-5 text-primary mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{project.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {project.code}
                          </p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {project.status?.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                      <Link to={`/projects/${project.id}`}>
                        <Button variant="ghost" size="icon">
                          <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No projects assigned yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
