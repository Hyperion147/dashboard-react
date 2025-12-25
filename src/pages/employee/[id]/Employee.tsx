import { useEffect, useRef, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Edit,
  Loader2,
  Shield,
} from "lucide-react";
import { Link, NavLink, useParams } from "react-router-dom";
import { useEmployeeDetail } from "@/queries/employee/employee";
import {
  useEmployeeAttendance,
  useEmployeePunchLogs,
} from "@/queries/attendance/attendanceQueries";
import { useEmployeeTasks } from "@/queries/tasks/taskQueries";
import { gsap } from "gsap";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

// Available user roles
const USER_ROLES = [
  { value: "employee", label: "Employee", color: "bg-blue-500" },
  { value: "hr", label: "HR", color: "bg-green-500" },
  {
    value: "project_manager",
    label: "Project Manager",
    color: "bg-purple-500",
  },
  { value: "admin", label: "Admin", color: "bg-red-500" },
] as const;

type UserRole = "employee" | "hr" | "project_manager" | "admin";

interface EmployeeDetailProps {
  employeeId: string;
}

export function EmployeeDetail({
  employeeId: propEmployeeId,
}: EmployeeDetailProps) {
  const params = useParams<{ id: string }>();
  const employeeId = params.id || propEmployeeId || "";

  const [selectedRole, setSelectedRole] = useState<UserRole>("employee");

  const { data: employee, isLoading, error } = useEmployeeDetail(employeeId);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Admin and HR users can change roles
  const canChangeRoles = user?.type === "admin" || user?.type === "hr";

  // Initialize selected role from employee data
  useEffect(() => {
    if (employee?.userType) {
      setSelectedRole(employee.userType);
    }
  }, [employee]);

  // Mutation to update user role
  const updateRoleMutation = useMutation({
    mutationFn: async ({} : {
      userId: string;
      role: UserRole;
    }) => {
      // Mock update
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      toast.success("Role updated successfully!", { duration: 3000 });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update role");
      // Reset to previous value on error
      if (employee?.userType) {
        setSelectedRole(employee.userType);
      }
    },
  });

  const handleRoleChange = (newRole: UserRole) => {
    if (!employee) return;

    const fullName = `${employee.first_name} ${employee.last_name}`;
    const roleLabel =
      USER_ROLES.find((r) => r.value === newRole)?.label || newRole;
    const currentRole = employee.userType || "employee";

    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Confirm Role Change</p>
              <p className="text-sm text-muted-foreground mt-1">
                Change <span className="font-medium">{fullName}</span>'s role to{" "}
                <span className="font-medium">{roleLabel}</span>?
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.dismiss(t.id);
                // Reset to original value
                setSelectedRole(currentRole);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                toast.dismiss(t.id);
                updateRoleMutation.mutate({
                  userId: employee.user_id,
                  role: newRole,
                });
              }}
              disabled={updateRoleMutation.isPending}
            >
              Confirm
            </Button>
          </div>
        </div>
      ),
      {
        duration: 10000,
        position: "top-center",
      }
    );
  };

  // Get current month date range
  const currentMonth = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      start_date: start.toISOString().split("T")[0],
      end_date: end.toISOString().split("T")[0],
    };
  }, []);

  // Fetch attendance data for current month
  const { data: attendanceData, isLoading: attendanceLoading } =
    useEmployeeAttendance(employeeId, currentMonth);

  // Fetch punch logs for current month
  const { data: punchLogs, isLoading: punchLogsLoading } = useEmployeePunchLogs(
    employeeId,
    currentMonth
  );

  // Fetch employee tasks
  const { data: tasks, isLoading: tasksLoading } = useEmployeeTasks(employeeId);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Calculate attendance statistics
  const attendanceStats = useMemo(() => {
    if (!attendanceData) {
      return {
        thisMonth: { present: 0, late: 0, absent: 0, total: 0 },
        punctuality: 0,
      };
    }

    const present = attendanceData.filter((a) => a.status === "present").length;
    const absent = attendanceData.filter((a) => a.status === "absent").length;
    const total = attendanceData.length;

    // Calculate late arrivals from punch logs
    const lateCount =
      punchLogs?.filter((log) => {
        if (log.type !== "punch_in") return false;
        const punchTime = new Date(log.timestamp);
        const hours = punchTime.getHours();
        const minutes = punchTime.getMinutes();
        // Consider late if after 9:15 AM
        return hours > 9 || (hours === 9 && minutes > 15);
      }).length || 0;

    // Calculate punctuality percentage
    const punctuality =
      total > 0 ? Math.round(((total - lateCount) / total) * 100) : 0;

    return {
      thisMonth: { present, late: lateCount, absent, total },
      punctuality,
    };
  }, [attendanceData, punchLogs]);

  // Format recent attendance records
  const recentAttendance = useMemo(() => {
    if (!attendanceData) return [];

    return attendanceData.slice(0, 5).map((record) => {
      const punchIn = punchLogs?.find(
        (log) => log.attendance_id === record.id && log.type === "punch_in"
      );
      const punchOut = punchLogs?.find(
        (log) => log.attendance_id === record.id && log.type === "punch_out"
      );

      const checkIn = punchIn
        ? new Date(punchIn.timestamp).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "-";

      const checkOut = punchOut
        ? new Date(punchOut.timestamp).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "-";

      const hours = record.total_work_hours
        ? `${Math.floor(record.total_work_hours)}h ${Math.round(
            (record.total_work_hours % 1) * 60
          )}m`
        : "-";

      // Determine if late
      const isLate = punchIn
        ? (() => {
            const punchTime = new Date(punchIn.timestamp);
            const hours = punchTime.getHours();
            const minutes = punchTime.getMinutes();
            return hours > 9 || (hours === 9 && minutes > 15);
          })()
        : false;

      const status =
        record.status === "present" && isLate
          ? "late"
          : record.status === "present"
          ? "present"
          : "absent";

      return {
        date: new Date(record.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        checkIn,
        checkOut,
        hours,
        status: status as "present" | "late" | "absent",
      };
    });
  }, [attendanceData, punchLogs]);

  // Calculate performance metrics from tasks
  const performanceMetrics = useMemo(() => {
    if (!tasks) {
      return [
        { label: "Tasks Completed", value: 0, target: 50, percentage: 0 },
        { label: "In Progress", value: 0, target: 25, percentage: 0 },
        { label: "High Priority", value: 0, target: 15, percentage: 0 },
        { label: "Overdue Tasks", value: 0, target: 0, percentage: 0 },
      ];
    }

    const completed = tasks.filter((t) => t.status === "done").length;
    const inProgress = tasks.filter(
      (t) =>
        t.status === "in_progress" ||
        t.status === "code_review" ||
        t.status === "qa"
    ).length;
    const highPriority = tasks.filter(
      (t) => t.priority === "high" || t.priority === "urgent"
    ).length;
    const overdue = tasks.filter((t) => {
      const dueDate = new Date(t.due_date);
      const now = new Date();
      return dueDate < now && t.status !== "done";
    }).length;

    const totalTasks = tasks.length;

    return [
      {
        label: "Tasks Completed",
        value: completed,
        target: totalTasks || 50,
        percentage:
          totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0,
      },
      {
        label: "In Progress",
        value: inProgress,
        target: 25,
        percentage: Math.min(Math.round((inProgress / 25) * 100), 100),
      },
      {
        label: "High Priority",
        value: highPriority,
        target: 15,
        percentage: Math.min(Math.round((highPriority / 15) * 100), 100),
      },
      {
        label: "Overdue Tasks",
        value: overdue,
        target: 0,
        percentage: overdue > 0 ? 100 : 0,
      },
    ];
  }, [tasks]);

  // Initial page load animations - only run when employee data is loaded
  useEffect(() => {
    if (!employee || !containerRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: -60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
        );
      }

      if (profileCardRef.current) {
        gsap.fromTo(
          profileCardRef.current,
          { y: -40, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: 0.3,
            ease: "power3.out",
          }
        );
      }

      const avatar = containerRef.current?.querySelector(".employee-avatar");
      if (avatar) {
        gsap.fromTo(
          avatar,
          { scale: 0.5 },
          { scale: 1, duration: 0.8, delay: 0.5, ease: "back.out(1.7)" }
        );
      }

      const contactItems =
        containerRef.current?.querySelectorAll(".contact-item");
      if (contactItems && contactItems.length > 0) {
        gsap.fromTo(
          contactItems,
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            delay: 0.7,
            ease: "power2.out",
          }
        );
      }

      if (tabsRef.current) {
        gsap.fromTo(
          tabsRef.current,
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: "power3.out" }
        );
      }

      const statCards = containerRef.current?.querySelectorAll(".stat-card");
      if (statCards && statCards.length > 0) {
        gsap.fromTo(
          statCards,
          { y: -40, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            delay: 0.8,
            ease: "power3.out",
          }
        );
      }

      const attendanceRecords =
        containerRef.current?.querySelectorAll(".attendance-record");
      if (attendanceRecords && attendanceRecords.length > 0) {
        gsap.fromTo(
          attendanceRecords,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            delay: 1.2,
            ease: "power2.out",
          }
        );
      }

      const progressBars =
        containerRef.current?.querySelectorAll(".progress-bar");
      if (progressBars && progressBars.length > 0) {
        gsap.fromTo(
          progressBars,
          { scaleX: 0, transformOrigin: "left" },
          {
            scaleX: 1,
            duration: 1.2,
            delay: 1,
            stagger: 0.15,
            ease: "power2.out",
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [employee]);

  // Hover animations - only setup when employee data is loaded
  useEffect(() => {
    if (!employee || !containerRef.current) return;

    const statCards = containerRef.current.querySelectorAll(".stat-card");
    statCards.forEach((card) => {
      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -6,
          scale: 1.03,
          boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
          duration: 0.3,
          ease: "power2.out",
        });
      };
      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          duration: 0.3,
          ease: "power2.out",
        });
      };
      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);
    });

    const attendanceRecords =
      containerRef.current.querySelectorAll(".attendance-record");
    attendanceRecords.forEach((record) => {
      const handleMouseEnter = () => {
        gsap.to(record, {
          x: 4,
          opacity: 0.8,
          duration: 0.3,
          ease: "power2.out",
        });
        const icon = record.querySelector(".status-icon");
        if (icon)
          gsap.to(icon, {
            scale: 1.3,
            rotation: 10,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
      };
      const handleMouseLeave = () => {
        gsap.to(record, {
          x: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        const icon = record.querySelector(".status-icon");
        if (icon)
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out",
          });
      };
      record.addEventListener("mouseenter", handleMouseEnter);
      record.addEventListener("mouseleave", handleMouseLeave);
    });
  }, [employee]);

  // Loading state
  if (isLoading || attendanceLoading || punchLogsLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading employee details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">
              Error Loading Employee
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Failed to load employee details"}
            </p>
            <div className="flex gap-2">
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Link to="/employees">
                <Button variant="outline">Back to Employees</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No data state
  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Employee Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The employee you're looking for doesn't exist.
            </p>
            <Link to="/employees">
              <Button className="mt-4">Back to Employees</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format employee data for display
  const fullName = `${employee.first_name} ${employee.last_name}`;
  const initials = `${employee.first_name[0]}${employee.last_name[0]}`;

  return (
    <div ref={containerRef} className="space-y-6 p-4">
      {/* Header */}
      <div ref={headerRef} className="flex items-center gap-4">
        <NavLink to="/employees">
          <Button
            variant="ghost"
            size="icon"
            className="border rounded-xl shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </NavLink>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Employee Details</h1>
          <p className="text-muted-foreground">Detailed view and management</p>
        </div>
        <Link to={`/employees/${employeeId}/edit`}>
          <Button className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Employee
          </Button>
        </Link>
      </div>

      {/* Employee Info Card */}
      <Card ref={profileCardRef}>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <Avatar className="employee-avatar w-20 h-20">
              <AvatarImage src="/placeholder.svg" alt={fullName} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-semibold">{fullName}</h2>
                <p className="text-muted-foreground">
                  {employee.details?.job_title || "Employee"}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge
                    variant={
                      employee.status === "active" ? "default" : "secondary"
                    }
                  >
                    {employee.status}
                  </Badge>
                  {employee.details?.level && (
                    <Badge variant="outline">{employee.details.level}</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="contact-item flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{employee.email}</span>
                </div>
                <div className="contact-item flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{employee.company.phone || "N/A"}</span>
                </div>
                <div className="contact-item flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {employee.company.city}, {employee.company.state}
                  </span>
                </div>
                <div className="contact-item flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    Joined {new Date(employee.doj).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="attendance" className="space-y-6" ref={tabsRef}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-6">
          {/* Attendance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="stat-card cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {attendanceStats.thisMonth.present}/
                  {attendanceStats.thisMonth.total}
                </div>
                <p className="text-xs text-muted-foreground">Days Present</p>
              </CardContent>
            </Card>

            <Card className="stat-card cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Late Arrivals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {attendanceStats.thisMonth.late}
                </div>
                <p className="text-xs text-muted-foreground">This Month</p>
              </CardContent>
            </Card>

            <Card className="stat-card cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Punctuality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attendanceStats.punctuality}%
                </div>
                <p className="text-xs text-muted-foreground">On Time Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAttendance.map((record, index) => (
                  <div
                    key={index}
                    className="attendance-record flex items-center justify-between py-2 border-b last:border-b-0 cursor-pointer rounded-lg px-2"
                  >
                    <div className="flex items-center gap-4">
                      <div className="status-icon flex items-center justify-center w-8 h-8">
                        {record.status === "present" && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {record.status === "late" && (
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                        )}
                        {record.status === "absent" && (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <p className="font-medium">{record.date}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.checkIn} - {record.checkOut}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{record.hours}</p>
                      <Badge
                        variant={
                          record.status === "present"
                            ? "default"
                            : record.status === "late"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <p className="text-sm text-muted-foreground">
                Current month performance overview
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {metric.value}/{metric.target} ({metric.percentage}%)
                    </span>
                  </div>
                  <div className="progress-bar w-full overflow-hidden">
                    <Progress value={metric.percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          {/* Role Management - Only visible for admin users */}
          {canChangeRoles && (
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  User Role Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label htmlFor="user-role" className="text-sm font-medium">
                    Assign User Role
                  </Label>
                  <Select
                    value={selectedRole}
                    onValueChange={(value) => {
                      const newRole = value as UserRole;
                      setSelectedRole(newRole);
                      handleRoleChange(newRole);
                    }}
                    disabled={updateRoleMutation.isPending}
                  >
                    <SelectTrigger id="user-role" className="max-w-md">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${role.color}`}
                            />
                            {role.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    This determines the user's access level and permissions in
                    the system.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Employee Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Employee ID
                    </label>
                    <p className="text-sm">{employee.idd}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </label>
                    <p className="text-sm">{fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <p className="text-sm">{employee.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <p className="text-sm capitalize">{employee.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Join Date
                    </label>
                    <p className="text-sm">
                      {new Date(employee.doj).toLocaleDateString()}
                    </p>
                  </div>
                  {employee.doe && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Exit Date
                      </label>
                      <p className="text-sm">
                        {new Date(employee.doe).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {employee.details && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">
                    Professional Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Job Title
                      </label>
                      <p className="text-sm">{employee.details.job_title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Designation
                      </label>
                      <p className="text-sm">{employee.details.designation}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Level
                      </label>
                      <p className="text-sm">{employee.details.level}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Gender
                      </label>
                      <p className="text-sm">{employee.details.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Date of Birth
                      </label>
                      <p className="text-sm">
                        {new Date(employee.details.dob).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Blood Group
                      </label>
                      <p className="text-sm">{employee.details.blood_group}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Marital Status
                      </label>
                      <p className="text-sm">
                        {employee.details.marital_status}
                      </p>
                    </div>
                  </div>
                  {employee.details.profile_summary && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-muted-foreground">
                        Profile Summary
                      </label>
                      <p className="text-sm mt-1">
                        {employee.details.profile_summary}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold mb-3">
                  Company Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Company Name
                    </label>
                    <p className="text-sm">{employee.company.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Company Type
                    </label>
                    <p className="text-sm capitalize">
                      {employee.company.type}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Location
                    </label>
                    <p className="text-sm">
                      {employee.company.city}, {employee.company.state}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Company Email
                    </label>
                    <p className="text-sm">{employee.company.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
