import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, Users, AlertCircle, Plus, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyTeams } from "@/queries/teams/teamQueries";
import { useCompanyDepartments } from "@/queries/departments/departmentQueries";
import { gsap } from "gsap";

export function TeamManagement() {
  const params = useParams<{ companyId: string }>();
  const { companyId: authCompanyId } = useAuth();
  const companyId = params.companyId || authCompanyId;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: departments, isLoading: departmentsLoading } = useCompanyDepartments(companyId || "");
  const { data: allTeams, isLoading: teamsLoading, error, refetch } = useCompanyTeams(companyId || "");

  const isLoading = departmentsLoading || teamsLoading;

  const filteredTeams = useMemo(() => {
    if (!allTeams || !Array.isArray(allTeams)) {
      return [];
    }

    let filtered = allTeams;

    // Filter by department if selected
    if (selectedDepartment && selectedDepartment !== "all") {
      filtered = filtered.filter((team) => team.department_id === selectedDepartment);
    }

    // Filter by search term
    if (searchTerm && searchTerm.trim() !== "") {
      const lowerTerm = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((team) => {
        const name = (team.name ?? "").toLowerCase();
        const code = (team.code ?? "").toLowerCase();
        const description = (team.description ?? "").toLowerCase();
        const leadName = team.lead
          ? `${team.lead.first_name} ${team.lead.last_name}`.toLowerCase()
          : "";

        return (
          name.includes(lowerTerm) ||
          code.includes(lowerTerm) ||
          description.includes(lowerTerm) ||
          leadName.includes(lowerTerm)
        );
      });
    }

    return filtered;
  }, [allTeams, selectedDepartment, searchTerm]);



  useEffect(() => {
    if (!allTeams || filteredTeams.length === 0) return;

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

      gsap.from(".team-card", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.3,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [allTeams, filteredTeams]);

  const TeamCardSkeleton = () => (
    <Card className="team-card-skeleton">
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
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">
            Manage teams across departments
          </p>
        </div>
        <Link to="/teams/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Team
          </Button>
        </Link>
      </div>

      <div ref={searchRef} className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
            disabled={departmentsLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments?.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search teams by name, code, or lead..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-medium">Error loading teams</p>
                <p className="text-sm text-muted-foreground">
                  {error.message || "Failed to fetch team data"}
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
            <TeamCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!isLoading && !error && allTeams && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Card
              key={team.id}
              className="team-card hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {team.code}
                    </p>
                  </div>
                  <Badge variant={team.status === "active" ? "default" : "secondary"}>
                    {team.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {team.description}
                </p>

                {team.lead && (
                  <div className="flex items-center gap-2 text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Lead:</span>
                    <span className="font-medium">
                      {team.lead.first_name} {team.lead.last_name}
                    </span>
                  </div>
                )}

                {team.department && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="font-medium">{team.department.name}</span>
                  </div>
                )}

                <Link to={`/teams/${team.id}`}>
                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && !error && filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">
            {searchTerm
              ? "No teams found matching your search."
              : selectedDepartment !== "all"
                ? "No teams found in this department."
                : "No teams found. Create your first team to get started."}
          </p>
          {!searchTerm && (
            <Link to="/teams/create">
              <Button className="mt-4 gap-2">
                <Plus className="w-4 h-4" />
                Create First Team
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
