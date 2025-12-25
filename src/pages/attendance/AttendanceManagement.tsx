import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyAttendance, useDeleteAttendance } from "@/queries/attendance/attendanceQueries";
import { useCompanyEmployees } from "@/queries/employee/employee";
import { CreateAttendanceDialog } from "@/components/attendance/CreateAttendanceDialog";
import { EditAttendanceDialog } from "@/components/attendance/EditAttendanceDialog";
import { DatePicker } from "@/components/ui/DatePicker";
import type { Attendance } from "@/types/attendance/attendance";
import { gsap } from "gsap";
import toast from "react-hot-toast";

export function AttendanceManagement() {
  const params = useParams<{ companyId: string }>();
  const { companyId: authCompanyId } = useAuth();
  const companyId = params.companyId || authCompanyId;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  // Convert dates to API format
  const dateRange = useMemo(() => ({
    start_date: startDate.toISOString().split("T")[0],
    end_date: endDate.toISOString().split("T")[0],
  }), [startDate, endDate]);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { data: employees } = useCompanyEmployees(companyId || "");
  const { data: attendance, isLoading } = useCompanyAttendance(companyId || "", dateRange);
  const deleteAttendanceMutation = useDeleteAttendance();

  // Filter attendance
  const filteredAttendance = useMemo(() => {
    if (!attendance || !Array.isArray(attendance)) return [];

    return attendance.filter((record) => {
      const matchesSearch =
        record.employee?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employee?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employee?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employee?.idd.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEmployee =
        selectedEmployee === "all" || record.employee_id === selectedEmployee;
      const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;

      return matchesSearch && matchesEmployee && matchesStatus;
    });
  }, [attendance, searchTerm, selectedEmployee, selectedStatus]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!attendance || !Array.isArray(attendance)) {
      return {
        total: 0,
        present: 0,
        absent: 0,
        leave: 0,
        avgWorkHours: 0,
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
    const roundedAvg = Math.round(avgWorkHours * 10) / 10;

    return {
      total,
      present,
      absent,
      leave,
      avgWorkHours: isNaN(roundedAvg) ? 0 : roundedAvg,
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

  const getStatusIcon = (status: Attendance["status"]) => {
    switch (status) {
      case "present":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "absent":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "leave":
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case "holiday":
        return <Calendar className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
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

  const handleDeleteClick = (attendanceId: string, employeeName: string) => {
    setDeleteConfirm({ id: attendanceId, name: employeeName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteAttendanceMutation.mutateAsync(deleteConfirm.id);
      toast.success("Attendance record deleted successfully");
    } catch (error) {
      toast.error("Failed to delete attendance record");
    } finally {
      setDeleteConfirm(null);
    }
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

      gsap.from(".attendance-card", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.05,
        delay: 0.4,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="space-y-6 p-4">
      {/* Header */}
      <div
        ref={headerRef}
        className="flex flex-col sm:flex-row gap-4 justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">
            Track and manage employee attendance
          </p>
        </div>
        <CreateAttendanceDialog companyId={companyId || ""} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Total Records</span>
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
              <span className="text-sm font-medium">On Leave</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.leave}</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Avg Hours</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.avgWorkHours}h</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>

        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Employees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employees</SelectItem>
            {employees?.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.first_name} {employee.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="leave">Leave</SelectItem>
            <SelectItem value="holiday">Holiday</SelectItem>
            <SelectItem value="half_day">Half Day</SelectItem>
          </SelectContent>
        </Select>

        <DatePicker
          date={startDate}
          onDateChange={(date) => date && setStartDate(date)}
          placeholder="Start date"
          disabled={isLoading}
        />

        <DatePicker
          date={endDate}
          onDateChange={(date) => date && setEndDate(date)}
          placeholder="End date"
          disabled={isLoading}
        />
      </div>

      {/* Attendance List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : filteredAttendance.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No attendance records found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedEmployee !== "all" || selectedStatus !== "all"
                ? "Try adjusting your filters"
                : "No attendance records for the selected date range"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredAttendance.map((record) => (
            <Card key={record.id} className="attendance-card hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">
                          {record.employee?.first_name} {record.employee?.last_name}
                        </h4>
                        <Badge variant={getStatusColor(record.status)} className="text-xs">
                          {record.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {record.employee?.idd} • {record.employee?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-medium">{formatDate(record.date)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Work Hours</p>
                        <p className="font-medium">{record.total_work_hours || 0}h</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <EditAttendanceDialog attendance={record} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDeleteClick(
                            record.id,
                            `${record.employee?.first_name} ${record.employee?.last_name}`
                          )
                        }
                        disabled={deleteAttendanceMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Attendance Record"
        description={`Are you sure you want to delete the attendance record for ${deleteConfirm?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
