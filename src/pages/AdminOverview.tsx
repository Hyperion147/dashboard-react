import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Calendar,
  DollarSign,
  Target,
  TrendingUp,
  Clock,
  Briefcase,
  UserPlus,
  BarChart3,
  PieChart,
  Activity,
  ArrowRight,
} from "lucide-react";
import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getEmployeeStats,
  getProjectTaskStats,
  getAttendanceStats,
  getRecentActivity,
  getPendingLeaves,
  getUpcomingDeadlines,
} from "@/queries/admin/adminQueries";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import { useAuth } from "@/contexts/AuthContext";

export function AdminOverview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  // Validate token on dashboard visit
  useTokenValidation();

  // Get company ID from auth context
  const { companyId } = useAuth();

  // API queries
  const { isLoading: isDashboardLoading } = useQuery({
    queryKey: ["dashboard-stats", companyId],
    queryFn: () => getDashboardStats(companyId || ""),
    enabled: !!companyId,
    retry: 1,
    retryOnMount: false,
  });

  const { data: employeeStats, isLoading: isEmployeeLoading } = useQuery({
    queryKey: ["employee-stats", companyId],
    queryFn: () => getEmployeeStats(companyId || ""),
    enabled: !!companyId,
    retry: 1,
    retryOnMount: false,
  });

  const { data: projectTaskStats, isLoading: isProjectTaskLoading } = useQuery({
    queryKey: ["project-task-stats", companyId],
    queryFn: () => getProjectTaskStats(companyId || ""),
    enabled: !!companyId,
    retry: 1,
    retryOnMount: false,
  });

  const { data: attendanceStats, isLoading: isAttendanceLoading } = useQuery({
    queryKey: ["attendance-stats", companyId],
    queryFn: () => getAttendanceStats(companyId || ""),
    enabled: !!companyId,
    retry: 1,
    retryOnMount: false,
  });

  const { data: recentActivity = [], isLoading: isActivityLoading } = useQuery({
    queryKey: ["recent-activity", companyId],
    queryFn: () => getRecentActivity(companyId || "", 1, 10),
    enabled: !!companyId,
    retry: 1,
    retryOnMount: false,
  });

  const { data: pendingLeaves = [], isLoading: isPendingLeavesLoading } =
    useQuery({
      queryKey: ["pending-leaves", companyId],
      queryFn: () => getPendingLeaves(companyId || ""),
      enabled: !!companyId,
      retry: 1,
      retryOnMount: false,
    });

  const { data: upcomingDeadlines = [], isLoading: isDeadlinesLoading } =
    useQuery({
      queryKey: ["upcoming-deadlines", companyId],
      queryFn: () => getUpcomingDeadlines(companyId || "", 30),
      enabled: !!companyId,
      retry: 1,
      retryOnMount: false,
    });

  const isLoading =
    isDashboardLoading ||
    isEmployeeLoading ||
    isProjectTaskLoading ||
    isAttendanceLoading ||
    isActivityLoading ||
    isPendingLeavesLoading ||
    isDeadlinesLoading;

  // Skeleton components
  const StatCardSkeleton = () => (
    <Card className="stat-card shadow-sm border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );

  const ActivityCardSkeleton = () => (
    <Card className="dashboard-card shadow-md border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-20" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const ListCardSkeleton = () => (
    <Card className="dashboard-card shadow-md border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-20" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2 p-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const DepartmentCardSkeleton = () => (
    <Card className="dashboard-card shadow-md border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-8" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const MetricsCardSkeleton = () => (
    <Card className="dashboard-card shadow-md border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-8" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-3 rounded-lg border bg-card">
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-6 w-12 mb-2" />
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-3" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const AttendanceCardSkeleton = () => (
    <Card className="dashboard-card shadow-md border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-8" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg border bg-card text-center">
              <Skeleton className="h-10 w-10 rounded-full mx-auto mb-2" />
              <Skeleton className="h-3 w-12 mx-auto mb-1" />
              <Skeleton className="h-5 w-8 mx-auto mb-1" />
              <Skeleton className="h-5 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Static animations (Quick Actions)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const actionButtons = document.querySelectorAll(".quick-action-btn");
      actionButtons.forEach((btn) => {
        btn.addEventListener("mouseenter", () => {
          gsap.to(btn.querySelector(".action-icon"), {
            scale: 1.2,
            duration: 0.3,
            ease: "back.out(1)",
          });
        });

        btn.addEventListener("mouseleave", () => {
          gsap.to(btn.querySelector(".action-icon"), {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Dynamic animations (Stats, Cards, Items) - Runs when data loads
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate stats cards
      gsap.fromTo(
        ".stat-card",
        {
          y: -20,
          opacity: 0,
          filter: "blur(20px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".quick-action-btn",
        {
          y: -20,
          opacity: 0,
          filter: "blur(20px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.5,
          stagger: 0.05,
          ease: "power3.out",
          delay: 0.2,
        }
      );

      // Stagger dashboard cards
      gsap.fromTo(
        ".dashboard-card",
        {
          y: -20,
          opacity: 0,
          filter: "blur(20px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.2, // Reduced delay
        }
      );

      // Animate progress bars
      gsap.fromTo(
        ".progress-bar",
        {
          scaleX: 0,
          transformOrigin: "left",
        },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power2.out",
          delay: 0.5,
        }
      );

      // Animate list items inside cards
      gsap.fromTo(
        ".animate-item",
        {
          y: -20,
          opacity: 0,
          filter: "blur(20px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.5, // Faster duration for items
          stagger: 0.03, // Tighter stagger
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [
    isLoading,
    employeeStats,
    projectTaskStats,
    attendanceStats,
    recentActivity,
    pendingLeaves,
    upcomingDeadlines,
  ]);

  return (
    <div ref={containerRef} className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <Card
        ref={quickActionsRef}
        className="dashboard-card shadow-sm border hover:shadow-md transition-shadow"
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              {
                icon: UserPlus,
                label: "Add Employee",
                color: "bg-blue-100 text-blue-600",
                link: "/employees/add",
              },
              {
                icon: Briefcase,
                label: "New Project",
                color: "bg-purple-100 text-purple-600",
                link: "/projects/create",
              },
              {
                icon: Users,
                label: "Create Team",
                color: "bg-green-100 text-green-600",
                link: "/teams/create",
              },
              {
                icon: Target,
                label: "Assign Task",
                color: "bg-orange-100 text-orange-600",
                link: "/managetasks",
              },
              {
                icon: Calendar,
                label: "Attendance",
                color: "bg-pink-100 text-pink-600",
                link: "/attendance",
              },
              {
                icon: DollarSign,
                label: "Payroll",
                color: "bg-yellow-100 text-yellow-600",
                link: "/managepayroll",
              },
              {
                icon: Users,
                label: "Employees",
                color: "bg-indigo-100 text-indigo-600",
                link: "/employees",
              },
              {
                icon: BarChart3,
                label: "Reports",
                color: "bg-teal-100 text-teal-600",
                link: "/",
              },
            ].map(({ icon: Icon, label, color, link }, idx) => (
              <Link
                key={idx}
                to={link}
                className="quick-action-btn hover:shadow-lg transition-all duration-300 rounded-xl"
              >
                <Button
                  variant="outline"
                  className="h-20 w-full flex flex-col gap-2 relative overflow-hidden"
                >
                  <div
                    className={`action-icon w-8 h-8 rounded-full flex items-center justify-center ${color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">{label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <Card className="stat-card shadow-sm border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Employees
                    </p>
                    <p className="text-2xl font-bold">
                      {employeeStats?.total || 0}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card shadow-sm border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Present Today
                    </p>
                    <p className="text-2xl font-bold">
                      {attendanceStats?.presentToday || 0}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card shadow-sm border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Projects
                    </p>
                    <p className="text-2xl font-bold">
                      {projectTaskStats?.activeProjects || 0}
                    </p>
                  </div>
                  <Briefcase className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card shadow-sm border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Pending Leaves
                    </p>
                    <p className="text-2xl font-bold">
                      {pendingLeaves?.length || 0}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        {isActivityLoading ? (
          <ActivityCardSkeleton />
        ) : (
          <Card className="dashboard-card shadow-md border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-semibold text-base">
                Recent Activity
              </CardTitle>
              <Link to="/employees">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  View All
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.isArray(recentActivity) &&
                  recentActivity.slice(0, 5).map((activity, index) => (
                    <div
                      key={activity.id || index}
                      className="animate-item flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {activity.employee}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.action}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            activity.status === "late"
                              ? "destructive"
                              : activity.status === "early"
                              ? "default"
                              : activity.status === "remote"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
                {(!Array.isArray(recentActivity) ||
                  recentActivity.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Deadlines */}
        {isDeadlinesLoading ? (
          <ListCardSkeleton />
        ) : (
          <Card className="dashboard-card shadow-md border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-semibold text-base">
                Upcoming Deadlines
              </CardTitle>
              <Link to="/projects">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  View All
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(upcomingDeadlines) &&
                  upcomingDeadlines.slice(0, 4).map((deadline) => (
                    <div
                      key={deadline.id}
                      className="animate-item space-y-2 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {deadline.projectName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {deadline.taskName} • {deadline.assignee}
                          </p>
                        </div>
                        <Badge
                          variant={
                            deadline.status === "on-track"
                              ? "default"
                              : deadline.status === "at-risk"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {deadline.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(deadline.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                {(!Array.isArray(upcomingDeadlines) ||
                  upcomingDeadlines.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No upcoming deadlines
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Leaves */}
        {isPendingLeavesLoading ? (
          <ListCardSkeleton />
        ) : (
          <Card className="dashboard-card shadow-md border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-semibold text-base">
                Pending Leaves
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8">
                <BarChart3 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(pendingLeaves) &&
                  pendingLeaves.slice(0, 4).map((leave) => (
                    <div
                      key={leave.id}
                      className="animate-item space-y-2 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {leave.employeeName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {leave.leaveType} • {leave.days} days
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {leave.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(leave.startDate).toLocaleDateString()} -{" "}
                        {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                {(!Array.isArray(pendingLeaves) ||
                  pendingLeaves.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No pending leaves
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Department Stats & Task Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Attendance */}
        {isEmployeeLoading ? (
          <DepartmentCardSkeleton />
        ) : (
          <Card className="dashboard-card shadow-md border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-semibold text-base">
                Department Overview
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8">
                <PieChart className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(employeeStats?.departments) &&
                  employeeStats.departments.map((dept) => (
                    <div key={dept.name} className="animate-item space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{dept.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {dept.present}/{dept.count} ({dept.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="progress-bar h-2 rounded-full bg-blue-500"
                          style={{ width: `${dept.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                {(!Array.isArray(employeeStats?.departments) ||
                  employeeStats.departments.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No department data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Task Metrics */}
        {isProjectTaskLoading ? (
          <MetricsCardSkeleton />
        ) : (
          <Card className="dashboard-card shadow-md border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-semibold text-base">
                Task Metrics
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8">
                <Activity className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="animate-item p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Tasks
                  </p>
                  <p className="text-xl font-bold">
                    {projectTaskStats?.totalTasks || 0}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Target className="w-3 h-3 text-blue-600" />
                    <span className="text-xs text-blue-600">All tasks</span>
                  </div>
                </div>
                <div className="animate-item p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                  <p className="text-xs text-muted-foreground mb-1">
                    Completed
                  </p>
                  <p className="text-xl font-bold">
                    {projectTaskStats?.completedTasks || 0}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">Finished</span>
                  </div>
                </div>
                <div className="animate-item p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                  <p className="text-xs text-muted-foreground mb-1">
                    In Progress
                  </p>
                  <p className="text-xl font-bold">
                    {projectTaskStats?.inProgressTasks || 0}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-orange-600" />
                    <span className="text-xs text-orange-600">Active</span>
                  </div>
                </div>
                <div className="animate-item p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                  <p className="text-xs text-muted-foreground mb-1">Overdue</p>
                  <p className="text-xl font-bold">
                    {projectTaskStats?.overdueTasks || 0}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Activity className="w-3 h-3 text-red-600" />
                    <span className="text-xs text-red-600">Late</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Attendance Overview */}
      {isAttendanceLoading ? (
        <AttendanceCardSkeleton />
      ) : (
        <Card className="dashboard-card shadow-md border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-semibold text-base">
              Attendance Overview
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8">
              <Activity className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="animate-item p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors text-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">Present</p>
                <p className="text-lg font-bold">
                  {attendanceStats?.presentToday || 0}
                </p>
                <Badge variant="default" className="text-xs mt-1">
                  {attendanceStats?.attendanceRate || 0}%
                </Badge>
              </div>
              <div className="animate-item p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors text-center">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">Absent</p>
                <p className="text-lg font-bold">
                  {attendanceStats?.absentToday || 0}
                </p>
                <Badge variant="destructive" className="text-xs mt-1">
                  Absent
                </Badge>
              </div>
              <div className="animate-item p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors text-center">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">Late</p>
                <p className="text-lg font-bold">
                  {attendanceStats?.lateToday || 0}
                </p>
                <Badge variant="secondary" className="text-xs mt-1">
                  Late
                </Badge>
              </div>
              <div className="animate-item p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors text-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">Remote</p>
                <p className="text-lg font-bold">
                  {attendanceStats?.remoteToday || 0}
                </p>
                <Badge variant="outline" className="text-xs mt-1">
                  Remote
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
