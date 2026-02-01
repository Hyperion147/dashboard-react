import { useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Users, AlertCircle } from "lucide-react";
import { useCreateTeam } from "@/queries/teams/teamQueries";
import { useCompanyDepartments } from "@/queries/departments/departmentQueries";
import { gsap } from "gsap";
import toast from "react-hot-toast";

type TeamFormData = {
  department_id: string;
  name: string;
  code: string;
  description: string;
  status: "active" | "inactive";
};

export function CreateTeam() {
  const navigate = useNavigate();
  const params = useParams<{ companyId: string }>();
  const { companyId: authCompanyId } = useAuth();
  const companyId = params.companyId || authCompanyId;

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const createTeamMutation = useCreateTeam();
  const { data: departments, isLoading: isDepartmentsLoading } = useCompanyDepartments(companyId || "");

  const form = useForm<TeamFormData>({
    defaultValues: {
      department_id: "",
      name: "",
      code: "",
      description: "",
      status: "active",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.from(".form-field", {
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.3,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const onSubmit = form.handleSubmit(async (data) => {
    // Trim and format data
    const formattedData = {
      department_id: data.department_id,
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      description: data.description.trim(),
      status: data.status,
    };

    try {
      await createTeamMutation.mutateAsync(formattedData);
      toast.success("Team created successfully!");
      navigate("/teams");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to create team";
      toast.error(errorMessage);
    }
  });

  return (
    <div ref={containerRef} className="space-y-6 p-4 pt-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/teams">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-none">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Create New Team</h1>
            <p className="text-muted-foreground">Add a new team to your department</p>
          </div>
        </div>
      </div>

      {isDepartmentsLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading departments...</p>
          </CardContent>
        </Card>
      ) : !departments || departments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Departments Available</h3>
            <p className="text-muted-foreground mb-4">
              You need to create a department before creating a team.
            </p>
            <Button onClick={() => navigate("/company")}>
              Go to Company Settings
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card ref={formRef}>
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="form-field">
                <Label htmlFor="department">
                  Department <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.watch("department_id")}
                  onValueChange={(value) => form.setValue("department_id", value, { shouldValidate: true })}
                >
                  <SelectTrigger className={`w-full ${form.formState.errors.department_id ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments?.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{dept.name}</span>
                          <span className="text-xs text-muted-foreground">({dept.code})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.department_id && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.department_id.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Select the department this team belongs to
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-field">
                  <Label htmlFor="name">
                    Team Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Frontend Development Team"
                    {...form.register("name", {
                      required: "Team name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 100,
                        message: "Name must not exceed 100 characters",
                      },
                    })}
                    className={form.formState.errors.name ? "border-red-500" : ""}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="form-field">
                  <Label htmlFor="code">
                    Team Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="code"
                    placeholder="e.g., FE-TEAM-01"
                    {...form.register("code", {
                      required: "Team code is required",
                      minLength: {
                        value: 2,
                        message: "Code must be at least 2 characters",
                      },
                      maxLength: {
                        value: 20,
                        message: "Code must not exceed 20 characters",
                      },
                      pattern: {
                        value: /^[A-Z0-9_-]+$/,
                        message: "Code must be uppercase letters, numbers, underscores, or hyphens",
                      },
                    })}
                    className={form.formState.errors.code ? "border-red-500" : ""}
                    onChange={(e) => {
                      e.target.value = e.target.value.toUpperCase();
                      form.setValue("code", e.target.value, { shouldValidate: true });
                    }}
                  />
                  {form.formState.errors.code && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.code.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Use a unique code to identify this team
                  </p>
                </div>
              </div>

              <div className="form-field">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the team's responsibilities, focus areas, and objectives..."
                  className={`resize-none ${form.formState.errors.description ? "border-red-500" : ""}`}
                  {...form.register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Description must be at least 10 characters",
                    },
                    maxLength: {
                      value: 500,
                      message: "Description must not exceed 500 characters",
                    },
                  })}
                  rows={4}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.description.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {form.watch("description")?.length || 0}/500 characters
                </p>
              </div>

              <div className="form-field">
                <Label htmlFor="status">
                  Status <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.watch("status")}
                  onValueChange={(value) => form.setValue("status", value as "active" | "inactive")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        Inactive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Only active teams will be available for task assignment
                </p>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button
                  type="submit"
                  disabled={createTeamMutation.isPending || !form.formState.isValid}
                  className="flex-1"
                >
                  {createTeamMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Team...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Create Team
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/teams")}
                  disabled={createTeamMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
