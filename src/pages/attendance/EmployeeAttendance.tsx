import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Skeleton } from "@repo/ui/skeleton";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useEmployeeAttendance, useEmployeePunchLogs } from "@/queries/attendance/attendanceQueries";
import type { Attendance } from "@/types/attendance/attendance";
import { gsap } from "gsap";

export function EmployeeAttendance() {
  const { id } = useParams<{ id: string }>();
  const employeeId = id || "";

  const [dateRange] = useState({
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { data: attendance, isLoading } = useEmployeeAttendance(employeeId, dateRange);
  const { data: punchLogs } = useEmployeePunchLogs(employeeId, dateRange);

  // Calculate stats
  const stats = useMemo(() => {
    if (!attendance || !Array.isArray(attendance)) {
      return {
        total: 0,
        present: 0,
        absent: 0,
        leave: 0,
        avgWorkHours: 0,
        attendanceRate: 0,
      };
    }

    const total = attendance.length;
    const present = attendance.filter((a) => a.status === "present").length;
    const absent = attendance.filter((a) => a.status === "absent").length;
    const leave = attendance.filter((a) => a.status === "leave").length;
    
    // Ensure we're working with numbers and handle NaN cases
    const totalWorkHours = attendance.reduce((sum, a) => {
      const hours = Number(a.total_work_hours);
      return sum + (isNaN(hours) ? 0 : hours);
    }, 0);
    
    const avgWorkHours = total > 0 ? totalWorkHours / total : 0;
    const attendanceRate = total > 0 ? (present / total) * 100 : 0;
    
    const roundedAvg = Math.round(avgWorkHours * 10) / 10;
    const roundedRate = Math.round(attendanceRate * 10) / 10;

    return {
      total,
      present,
      absent,
      leave,
      avgWorkHours: isNaN(roundedAvg) ? 0 : roundedAvg,
      attendanceRate: isNaN(roundedRate) ? 0 : roundedRate,
    };
  }, [attendance]);

  const getStatusColor = (
    status: Attendance["status"]
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "present":
        return "secondary";
      case "absent":
        return "destructive";
      case "leave":
        return "outline";
      case "holiday":
        return "default";
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

  const formatTime = (timestamp: string): string => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.from(".stat-card", {
        opacity: 0,
        y: -30,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.2,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const employeeName = attendance?.[0]?.employee
    ? `${attendance[0].employee.first_name} ${attendance[0].employee.last_name}`
    : "Employee";

  return (
    <div ref={containerRef} className="space-y-6 p-4">
      {/* Header */}
      <div ref={headerRef} className="flex items-center gap-4">
        <Link to="/attendance">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{employeeName} - Attendance</h1>
          <p className="text-muted-foreground">
            Attendance records and statistics
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Total Days</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Present</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.present}</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium">Absent</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.absent}</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Leave</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.leave}</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Avg Hours</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.avgWorkHours}h</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Rate</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.attendanceRate}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : attendance && attendance.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {attendance.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusColor(record.status)}>
                        {record.status.replace("_", " ").toUpperCase()}
                      </Badge>
                      <div>
                        <p className="font-medium">{formatDate(record.date)}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.total_work_hours}h worked
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No attendance records found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Punch Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Punch Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {punchLogs && punchLogs.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {punchLogs.slice(0, 10).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium capitalize">
                        {log.type.replace("_", " ")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(log.timestamp)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {formatDate(log.timestamp)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No punch logs found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
