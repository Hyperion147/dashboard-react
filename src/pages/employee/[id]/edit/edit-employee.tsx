import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useForm, Controller } from "react-hook-form"
import { ArrowLeft, User, Building2, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePicker } from "@/components/ui/DatePicker"
import { DatePickerWithYearMonth } from "@/components/ui/DatePickerWithYearMonth"
import { useEmployeeDetail, useUpdateEmployee } from "@/queries/employee/employee"
import { useCompanyDepartments } from "@/queries/departments/departmentQueries"
import { useDepartmentTeams } from "@/queries/teams/teamQueries"
import toast from "react-hot-toast"

interface EmployeeFormData {
  first_name: string
  last_name: string
  email: string
  status: "active" | "inactive"
  doj: Date | string | undefined
  doe?: Date | string | undefined
  department_id?: string
  team_id?: string
  job_title?: string
  designation?: string
  level?: string
  dob?: Date | string | undefined
  gender?: string
  blood_group?: string
  marital_status?: string
  profile_summary?: string
}

interface EditEmployeePageProps {
  employeeId?: string
}

export default function EditEmployeePage({ employeeId: propEmployeeId }: EditEmployeePageProps) {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const employeeId = params.id || propEmployeeId || "";
  
  const [currentTab, setCurrentTab] = useState("basic")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")

  // Fetch employee data
  const { data: employee, isLoading: employeeLoading, error: employeeError } = useEmployeeDetail(employeeId);
  
  // Fetch departments and teams
  const { companyId: authCompanyId } = useAuth();
  const companyId = employee?.company_id || authCompanyId;
  const { data: departments } = useCompanyDepartments(companyId || "");
  const { data: teams } = useDepartmentTeams(selectedDepartment);
  
  // Update mutation
  const updateEmployeeMutation = useUpdateEmployee(employeeId);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<EmployeeFormData>()

  // Watch department changes
  const watchDepartment = watch("department_id");
  
  useEffect(() => {
    if (watchDepartment) {
      setSelectedDepartment(watchDepartment);
    }
  }, [watchDepartment]);

  // Load employee data into form
  useEffect(() => {
    if (employee) {
      reset({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        status: employee.status,
        doj: employee.doj ? new Date(employee.doj) : undefined,
        doe: employee.doe ? new Date(employee.doe) : undefined,
        department_id: employee.details?.department_id,
        team_id: employee.details?.team_id,
        job_title: employee.details?.job_title,
        designation: employee.details?.designation,
        level: employee.details?.level,
        dob: employee.details?.dob ? new Date(employee.details.dob) : undefined,
        gender: employee.details?.gender,
        blood_group: employee.details?.blood_group,
        marital_status: employee.details?.marital_status,
        profile_summary: employee.details?.profile_summary,
      });
      
      if (employee.details?.department_id) {
        setSelectedDepartment(employee.details.department_id);
      }
    }
  }, [employee, reset]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      // Convert Date objects to ISO strings for API
      const formattedData = {
        ...data,
        doj: data.doj instanceof Date ? data.doj.toISOString().split('T')[0] : data.doj,
        doe: data.doe instanceof Date ? data.doe.toISOString().split('T')[0] : data.doe,
        dob: data.dob instanceof Date ? data.dob.toISOString().split('T')[0] : data.dob,
      };

      await updateEmployeeMutation.mutateAsync({
        id: employeeId,
        ...formattedData,
      });
      
      toast.success("Employee updated successfully!");
      navigate(`/employees/${employeeId}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update employee");
    }
  }

  // Loading state
  if (employeeLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading employee data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (employeeError || !employee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Employee</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {employeeError instanceof Error ? employeeError.message : "Failed to load employee data"}
            </p>
            <Link to="/employees">
              <Button>Back to Employees</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="m-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to={`/employees/${employeeId}`}>
            <Button variant="ghost" size="icon" className="border">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Edit Employee</h1>
            <p className="text-muted-foreground">
              Update information for {employee.first_name} {employee.last_name}
            </p>
          </div>
          <Badge variant={employee.status === "active" ? "default" : "secondary"}>
            {employee.status}
          </Badge>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>Update employee's basic details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">
                        First Name <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name="first_name"
                        control={control}
                        rules={{ required: "First name is required" }}
                        render={({ field }) => (
                          <>
                            <Input {...field} id="first_name" placeholder="John" />
                            {errors.first_name && (
                              <p className="text-sm text-destructive">{errors.first_name.message}</p>
                            )}
                          </>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">
                        Last Name <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name="last_name"
                        control={control}
                        rules={{ required: "Last name is required" }}
                        render={({ field }) => (
                          <>
                            <Input {...field} id="last_name" placeholder="Doe" />
                            {errors.last_name && (
                              <p className="text-sm text-destructive">{errors.last_name.message}</p>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-destructive">*</span>
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
                          <Input {...field} id="email" type="email" placeholder="john.doe@company.com" />
                          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                        </>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Controller
                        name="dob"
                        control={control}
                        render={({ field }) => (
                          <DatePickerWithYearMonth
                            date={field.value instanceof Date ? field.value : field.value ? new Date(field.value) : undefined}
                            onDateChange={field.onChange}
                            placeholder="Select date of birth"
                            fromYear={1950}
                            toYear={new Date().getFullYear() - 18}
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="blood_group">Blood Group</Label>
                      <Controller
                        name="blood_group"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
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
                          <Select value={field.value} onValueChange={field.onChange}>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doj">
                        Date of Joining <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name="doj"
                        control={control}
                        rules={{ required: "Date of joining is required" }}
                        render={({ field }) => (
                          <>
                            <DatePicker
                              date={field.value instanceof Date ? field.value : field.value ? new Date(field.value) : undefined}
                              onDateChange={field.onChange}
                              placeholder="Select joining date"
                            />
                            {errors.doj && <p className="text-sm text-destructive">{errors.doj.message}</p>}
                          </>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">
                        Status <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name="status"
                        control={control}
                        rules={{ required: "Status is required" }}
                        render={({ field }) => (
                          <>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
                          </>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Professional Tab */}
            <TabsContent value="professional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Professional Details
                  </CardTitle>
                  <CardDescription>Update employee's work-related information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="job_title">Job Title</Label>
                      <Controller
                        name="job_title"
                        control={control}
                        render={({ field }) => (
                          <Input {...field} id="job_title" placeholder="Senior Frontend Developer" />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Controller
                        name="designation"
                        control={control}
                        render={({ field }) => (
                          <Input {...field} id="designation" placeholder="Tech Lead" />
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Controller
                        name="level"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id="level">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Junior">Junior</SelectItem>
                              <SelectItem value="Mid">Mid</SelectItem>
                              <SelectItem value="Senior">Senior</SelectItem>
                              <SelectItem value="Lead">Lead</SelectItem>
                              <SelectItem value="Principal">Principal</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department_id">Department</Label>
                      <Controller
                        name="department_id"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id="department_id">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments?.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  {selectedDepartment && (
                    <div className="space-y-2">
                      <Label htmlFor="team_id">Team</Label>
                      <Controller
                        name="team_id"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id="team_id">
                              <SelectValue placeholder="Select team" />
                            </SelectTrigger>
                            <SelectContent>
                              {teams?.map((team) => (
                                <SelectItem key={team.id} value={team.id}>
                                  {team.name} ({team.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="profile_summary">Profile Summary</Label>
                    <Controller
                      name="profile_summary"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          id="profile_summary"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Brief professional summary..."
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {isDirty && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="w-4 h-4" />
                      <span>You have unsaved changes</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={updateEmployeeMutation.isPending}
                    asChild
                  >
                    <Link to={`/employees/${employeeId}`}>Cancel</Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateEmployeeMutation.isPending || !isDirty}
                    className="min-w-[120px]"
                  >
                    {updateEmployeeMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Save Changes
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
  )
}
