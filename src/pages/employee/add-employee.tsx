import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm, Controller } from "react-hook-form";
import {
  ArrowLeft,
  User,
  Building2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Calendar,
  Briefcase,
  Users as UsersIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/DatePicker";
import { DatePickerWithYearMonth } from "@/components/ui/DatePickerWithYearMonth";
import { useCompanyDepartments } from "@/queries/departments/departmentQueries";
import { useDepartmentTeams } from "@/queries/teams/teamQueries";
import toast from "react-hot-toast";

interface EmployeeFormData {
  first_name: string;
  last_name: string;
  email: string;
  status: "active" | "inactive";
  doj: Date | string | undefined;
  company_id?: string;
  department_id?: string;
  team_id?: string;
  job_title?: string;
  designation?: string;
  level?: string;
  dob?: Date | string | undefined;
  gender?: string;
  blood_group?: string;
  marital_status?: string;
  profile_summary?: string;
}

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("basic");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { companyId } = useAuth();

  // Fetch departments and teams
  const { data: departments } = useCompanyDepartments(companyId || "");
  const { data: teams } = useDepartmentTeams(selectedDepartment);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EmployeeFormData>({
    defaultValues: {
      status: "active",
      company_id: companyId || undefined,
    },
  });

  // Watch department changes
  const watchDepartment = watch("department_id");

  useEffect(() => {
    if (watchDepartment) {
      setSelectedDepartment(watchDepartment);
    }
  }, [watchDepartment]);

  const onSubmit = async (_data: EmployeeFormData) => {
    try {
      setIsSubmitting(true);

      // Ensure company_id is available
      if (!companyId) {
        toast.error(
          "Company information not available. Please refresh and try again."
        );
        return;
      }

      // Convert Date objects to ISO strings for API
      // const formattedData = {
      //   ...data,
      //   company_id: companyId,
      //   doj:
      //     data.doj instanceof Date
      //       ? data.doj.toISOString().split("T")[0]
      //       : data.doj,
      //   dob:
      //     data.dob instanceof Date
      //       ? data.dob.toISOString().split("T")[0]
      //       : data.dob,
      // };

      // Create employee via API
      // Create employee via API - MOCK
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = { data: { success: true } };

      if (response.data.success) {
        toast.success("Employee added successfully!");
        navigate("/employees");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBasicComplete =
    watch("first_name") && watch("last_name") && watch("email") && watch("doj");
  const isProfessionalComplete = true; // No longer checking for role

  // Show loading state if companyId is not available
  if (!companyId) {
    return (
      <div className="m-4 max-w-5xl mx-auto pb-4">
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">
              Loading company information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="m-4 max-w-5xl mx-auto pb-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/employees">
            <Button
              variant="ghost"
              size="icon"
              className="border hover:border-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-none">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Add New Employee</h1>
                <p className="text-muted-foreground">
                  Fill in the details to onboard a new team member
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 ${
                    isBasicComplete ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isBasicComplete
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {isBasicComplete ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">1</span>
                    )}
                  </div>
                  <span className="text-sm font-medium">Basic Info</span>
                </div>
                <div
                  className={`h-px w-12 ${
                    isBasicComplete ? "bg-primary" : "bg-muted"
                  }`}
                />
                <div
                  className={`flex items-center gap-2 ${
                    isProfessionalComplete
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isProfessionalComplete
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {isProfessionalComplete ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">2</span>
                    )}
                  </div>
                  <span className="text-sm font-medium">Professional</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Step {currentTab === "basic" ? "1" : "2"} of 2
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2 h-11">
              <TabsTrigger value="basic" className="gap-2">
                <User className="w-4 h-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="professional" className="gap-2">
                <Briefcase className="w-4 h-4" />
                Professional
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card className="border-2">
                <CardHeader className="bg-muted/50">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Enter employee's personal and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Name Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>Personal Details</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="first_name"
                          className="text-sm font-medium"
                        >
                          First Name <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                          name="first_name"
                          control={control}
                          rules={{
                            required: "First name is required",
                            minLength: {
                              value: 2,
                              message:
                                "First name must be at least 2 characters",
                            },
                            maxLength: {
                              value: 50,
                              message:
                                "First name must not exceed 50 characters",
                            },
                          }}
                          render={({ field }) => (
                            <>
                              <Input
                                {...field}
                                id="first_name"
                                placeholder="John"
                                className={
                                  errors.first_name ? "border-destructive" : ""
                                }
                              />
                              {errors.first_name && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.first_name.message}
                                </p>
                              )}
                            </>
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="last_name"
                          className="text-sm font-medium"
                        >
                          Last Name <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                          name="last_name"
                          control={control}
                          rules={{
                            required: "Last name is required",
                            minLength: {
                              value: 2,
                              message:
                                "Last name must be at least 2 characters",
                            },
                            maxLength: {
                              value: 50,
                              message:
                                "Last name must not exceed 50 characters",
                            },
                          }}
                          render={({ field }) => (
                            <>
                              <Input
                                {...field}
                                id="last_name"
                                placeholder="Doe"
                                className={
                                  errors.last_name ? "border-destructive" : ""
                                }
                              />
                              {errors.last_name && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.last_name.message}
                                </p>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>Contact Information</span>
                    </div>
                    <div className="space-y-2 max-w-md">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name="email"
                        control={control}
                        rules={{
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        }}
                        render={({ field }) => (
                          <>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                {...field}
                                id="email"
                                type="email"
                                placeholder="john.doe@company.com"
                                className={`pl-10 ${
                                  errors.email ? "border-destructive" : ""
                                }`}
                              />
                            </div>
                            {errors.email && (
                              <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.email.message}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              This will be used for login credentials
                            </p>
                          </>
                        )}
                      />
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Additional Details</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dob" className="text-sm font-medium">
                          Date of Birth
                        </Label>
                        <Controller
                          name="dob"
                          control={control}
                          render={({ field }) => (
                            <DatePickerWithYearMonth
                              date={
                                field.value instanceof Date
                                  ? field.value
                                  : field.value
                                  ? new Date(field.value)
                                  : undefined
                              }
                              onDateChange={field.onChange}
                              placeholder="Select date of birth"
                              fromYear={1950}
                              toYear={new Date().getFullYear() - 18}
                            />
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-medium">
                          Gender
                        </Label>
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger id="gender" className="w-full">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    Male
                                  </div>
                                </SelectItem>
                                <SelectItem value="female">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-pink-500" />
                                    Female
                                  </div>
                                </SelectItem>
                                <SelectItem value="other">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    Other
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="blood_group">Blood Group</Label>
                      <Controller
                        name="blood_group"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger id="blood_group">
                              <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="marital_status">Marital Status</Label>
                      <Controller
                        name="marital_status"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger id="marital_status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  {/* Employment Details */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span>Employment Details</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doj" className="text-sm font-medium">
                          Date of Joining{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                          name="doj"
                          control={control}
                          rules={{ required: "Date of joining is required" }}
                          render={({ field }) => (
                            <>
                              <DatePicker
                                date={
                                  field.value instanceof Date
                                    ? field.value
                                    : field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onDateChange={field.onChange}
                                placeholder="Select joining date"
                                className={
                                  errors.doj ? "border-destructive" : ""
                                }
                              />
                              {errors.doj && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.doj.message}
                                </p>
                              )}
                            </>
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-sm font-medium">
                          Status <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                          name="status"
                          control={control}
                          rules={{ required: "Status is required" }}
                          render={({ field }) => (
                            <>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger
                                  id="status"
                                  className={
                                    errors.status ? "border-destructive" : ""
                                  }
                                >
                                  <SelectValue placeholder="Select status" />
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
                                      <div className="w-2 h-2 rounded-full bg-gray-500" />
                                      Inactive
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              {errors.status && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.status.message}
                                </p>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      type="button"
                      onClick={() => setCurrentTab("professional")}
                      disabled={!isBasicComplete}
                    >
                      Continue to Professional Details
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Professional Tab */}
            <TabsContent value="professional" className="space-y-6">
              <Card className="border-2">
                <CardHeader className="bg-muted/50">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Professional Details
                  </CardTitle>
                  <CardDescription>
                    Enter employee's work-related information and organizational
                    structure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Position Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span>Position Details</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="job_title"
                          className="text-sm font-medium"
                        >
                          Job Title
                        </Label>
                        <Controller
                          name="job_title"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="job_title"
                              placeholder="e.g., Senior Frontend Developer"
                            />
                          )}
                        />
                        <p className="text-xs text-muted-foreground">
                          Official job title
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="designation"
                          className="text-sm font-medium"
                        >
                          Designation
                        </Label>
                        <Controller
                          name="designation"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="designation"
                              placeholder="e.g., Tech Lead"
                            />
                          )}
                        />
                        <p className="text-xs text-muted-foreground">
                          Internal designation
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span>Experience Level</span>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level" className="text-sm font-medium">
                        Seniority Level
                      </Label>
                      <Controller
                        name="level"
                        control={control}
                        render={({ field }) => (
                          <>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger id="level">
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Junior">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    Junior
                                  </div>
                                </SelectItem>
                                <SelectItem value="Mid">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    Mid
                                  </div>
                                </SelectItem>
                                <SelectItem value="Senior">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                                    Senior
                                  </div>
                                </SelectItem>
                                <SelectItem value="Lead">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    Lead
                                  </div>
                                </SelectItem>
                                <SelectItem value="Principal">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    Principal
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                              Seniority level in the organization
                            </p>
                          </>
                        )}
                      />
                    </div>
                  </div>

                  {/* Organization Structure */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <UsersIcon className="w-4 h-4" />
                      <span>Organization Structure</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="department_id"
                          className="text-sm font-medium"
                        >
                          Department
                        </Label>
                        <Controller
                          name="department_id"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger id="department_id">
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                  {departments?.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id}>
                                      <div className="flex items-center gap-2">
                                        <Building2 className="w-3 h-3" />
                                        {dept.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground">
                                {departments?.length || 0} departments available
                              </p>
                            </>
                          )}
                        />
                      </div>
                      {selectedDepartment && (
                        <div className="space-y-2">
                          <Label
                            htmlFor="team_id"
                            className="text-sm font-medium"
                          >
                            Team
                          </Label>
                          <Controller
                            name="team_id"
                            control={control}
                            render={({ field }) => (
                              <>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger id="team_id">
                                    <SelectValue placeholder="Select team" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {teams?.map((team) => (
                                      <SelectItem key={team.id} value={team.id}>
                                        <div className="flex items-center gap-2">
                                          <UsersIcon className="w-3 h-3" />
                                          {team.name}{" "}
                                          <span className="text-xs text-muted-foreground">
                                            ({team.code})
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                  {teams?.length || 0} teams in selected
                                  department
                                </p>
                              </>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Summary */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>Professional Summary</span>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="profile_summary"
                        className="text-sm font-medium"
                      >
                        Profile Summary
                      </Label>
                      <Controller
                        name="profile_summary"
                        control={control}
                        render={({ field }) => (
                          <>
                            <textarea
                              {...field}
                              id="profile_summary"
                              className="flex min-h-25px w-full rounded-none border resize-none border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Brief professional summary highlighting key skills, experience, and achievements..."
                            />
                            <p className="text-xs text-muted-foreground">
                              {field.value?.length || 0}/500 characters
                            </p>
                          </>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <Card className="border-2 border-primary/20 bg-linear-to-r from-primary/5 to-transparent">
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      Ready to add employee?
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      All fields marked with * are required. Review the
                      information before submitting.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    asChild
                    className="flex-1 sm:flex-none"
                  >
                    <Link to="/employees">Cancel</Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !isBasicComplete ||
                      !isProfessionalComplete
                    }
                    className="min-w-40 flex-1 sm:flex-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding Employee...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Add Employee
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
