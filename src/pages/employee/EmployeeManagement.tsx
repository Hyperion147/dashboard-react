import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { Search, Mail, Phone, MapPin, Clock, AlertCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyEmployees } from "@/queries/employee/employee";
import type { Employee } from "@/types/employees/employee";
import { gsap } from "gsap";

export function EmployeeManagement() {
  const params = useParams<{ companyId: string }>();
  const { companyId: authCompanyId } = useAuth();
  const companyId = params.companyId || authCompanyId;

  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const {
    data: employees,
    isLoading,
    error,
    refetch,
  } = useCompanyEmployees(companyId || "");

  const getFullName = (employee: Employee): string => {
    return `${employee.first_name} ${employee.last_name}`.trim();
  };

  // Helper function to get initials
  const getInitials = (firstName: string, lastName: string): string => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || "NA";
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter employees by search term
  const filteredEmployees = useMemo(() => {
    if (!employees || !Array.isArray(employees)) {
      return [];
    }

    if (!searchTerm || searchTerm.trim() === "") {
      return employees;
    }

    const lowerTerm = searchTerm.toLowerCase().trim();

    return employees.filter((employee) => {
      const fullName = getFullName(employee).toLowerCase();
      const email = (employee.email ?? "").toLowerCase();
      const idd = (employee.idd ?? "").toLowerCase();
      const companyName = (employee.company?.name ?? "").toLowerCase();

      return (
        fullName.includes(lowerTerm) ||
        email.includes(lowerTerm) ||
        idd.includes(lowerTerm) ||
        companyName.includes(lowerTerm)
      );
    });
  }, [employees, searchTerm]);

  useEffect(() => {
    if (!employees || filteredEmployees.length === 0) return;

    const ctx = gsap.context(() => {
      // Animate header
      gsap.from(headerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power2.out",
      });

      // Animate search bar
      gsap.from(searchRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.6,
        delay: 0.2,
        ease: "power2.out",
      });

      // Animate employee cards
      gsap.from(".employee-card", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.3,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [employees, filteredEmployees]);

  // Skeleton Loading Component
  const EmployeeCardSkeleton = () => (
    <Card className="employee-card-skeleton">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );

  return (
    <div ref={containerRef} className="space-y-6 p-4">
      {/* Header */}
      <div
        ref={headerRef}
        className="flex flex-col sm:flex-row gap-4 justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all employees
          </p>
        </div>
        <Link to={`/employees/add`}>
          <Button className="hover-lift-btn">Add Employee</Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div ref={searchRef} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search employees..."
            className="pl-10 search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-medium">Error loading employees</p>
                <p className="text-sm text-muted-foreground">
                  {error.message || "Failed to fetch employee data"}
                </p>
              </div>
              <Button variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State - Skeleton Cards */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <EmployeeCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Employee Cards Grid */}
      {!isLoading && !error && employees && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card
              key={employee.id}
              className="employee-card hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="employee-avatar">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={getFullName(employee)}
                      />
                      <AvatarFallback>
                        {getInitials(employee.first_name, employee.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {getFullName(employee)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {employee.idd}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <Badge
                    className="employee-badge"
                    variant={
                      employee.status === "active" ? "default" : "secondary"
                    }
                  >
                    {employee.status}
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  {employee.company?.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Phone className="w-4 h-4" />
                      <span>{employee.company.phone}</span>
                    </div>
                  )}
                  {employee.company?.city && (
                    <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {employee.company.city}, {employee.company.state}
                      </span>
                    </div>
                  )}
                  {employee.doj && (
                    <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Clock className="w-4 h-4" />
                      <span>Joined: {formatDate(employee.doj)}</span>
                    </div>
                  )}
                </div>

                {/* Company */}
                {employee.company && (
                  <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Company
                    </span>
                    <p className="text-sm font-medium">
                      {employee.company.name}
                    </p>
                  </div>
                )}



                {/* Action Button */}
                <Link to={`/employees/${employee.id}`}>
                  <Button
                    className="w-full bg-transparent action-btn"
                    variant="outline"
                  >
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {searchTerm
              ? "No employees found matching your search."
              : "No employees found. Add your first employee to get started."}
          </p>
          {!searchTerm && (
            <Link to={`/company/${companyId}/employees/add`}>
              <Button className="mt-4">Add First Employee</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
