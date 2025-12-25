import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Loader2, CalendarIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
// import { useCreateTask } from "@/queries/tasks/taskQueries";
// import { useProjectTeams } from "@/queries/projects/projectQueries";
import { useTeamMembers } from "@/queries/teams/teamQueries";
import toast from "react-hot-toast";

type TaskFormData = {
  team_id: string;
  assigned_to_employee_id: string;
  title: string;
  description: string;
  status:
    | "todo"
    | "in_progress"
    | "developed"
    | "code_review"
    | "deployment"
    | "qa"
    | "done";
  priority: "low" | "medium" | "high" | "urgent";
  due_date: Date | undefined;
};

interface CreateTaskDialogProps {
  projectId: string;
}

interface TeamMember {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  job_title?: string;
  designation?: string;
  level?: string;
  status: string;
}

// Mock hooks
const useCreateTask = () => ({
  mutateAsync: async (_data: any) => {
    await new Promise((r) => setTimeout(r, 1000));
  },
  isPending: false,
});

export function CreateTaskDialog({ projectId }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);

  const createTaskMutation = useCreateTask();
  // Mock useProjectTeams
  const { data: projectTeams, isLoading: isTeamsLoading } = {
    data: [] as any[],
    isLoading: false,
  };

  const form = useForm<TaskFormData>({
    defaultValues: {
      team_id: "",
      assigned_to_employee_id: "",
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      due_date: undefined,
    },
    mode: "onChange",
  });

  // Watch selected team to fetch its members
  const selectedTeamId = form.watch("team_id");

  // Fetch team members when a team is selected
  const { data: teamMembers, isLoading: isTeamMembersLoading } =
    useTeamMembers(selectedTeamId);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  // Reset assigned employee when team changes
  useEffect(() => {
    if (selectedTeamId) {
      form.setValue("assigned_to_employee_id", "");
    }
  }, [selectedTeamId, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    if (!data.due_date) {
      toast.error("Please select a due date");
      return;
    }

    const formattedData = {
      project_id: projectId,
      team_id: data.team_id,
      assigned_to_employee_id: data.assigned_to_employee_id,
      title: data.title.trim(),
      description: data.description.trim(),
      status: data.status,
      priority: data.priority,
      due_date: format(data.due_date, "yyyy-MM-dd"),
    };

    try {
      await createTaskMutation.mutateAsync(formattedData);
      toast.success("Task created successfully!");
      setOpen(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to create task";
      toast.error(errorMessage);
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-500";
      case "qa":
        return "bg-blue-500";
      case "deployment":
        return "bg-purple-500";
      case "code_review":
        return "bg-indigo-500";
      case "developed":
        return "bg-cyan-500";
      case "in_progress":
        return "bg-yellow-500";
      case "todo":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to this project and assign it to a team member
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Task Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Implement User Authentication"
              {...form.register("title", {
                required: "Task title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
                maxLength: {
                  value: 200,
                  message: "Title must not exceed 200 characters",
                },
              })}
              className={form.formState.errors.title ? "border-red-500" : ""}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about the task, requirements, and expected outcomes..."
              {...form.register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
                maxLength: {
                  value: 1000,
                  message: "Description must not exceed 1000 characters",
                },
              })}
              rows={4}
              className={`resize-none ${
                form.formState.errors.description ? "border-red-500" : ""
              }`}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {form.formState.errors.description.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {form.watch("description")?.length || 0}/1000 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="team" className="text-sm font-medium">
                Assign to Team <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.watch("team_id")}
                onValueChange={(value) =>
                  form.setValue("team_id", value, { shouldValidate: true })
                }
                disabled={isTeamsLoading}
              >
                <SelectTrigger
                  className={`w-full ${
                    form.formState.errors.team_id ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue
                    placeholder={
                      isTeamsLoading ? "Loading teams..." : "Select team"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {projectTeams?.map((pt) => (
                    <SelectItem key={pt.id} value={pt.team_id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{pt.team?.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({pt.team?.code})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                  {(!projectTeams || projectTeams.length === 0) &&
                    !isTeamsLoading && (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No teams assigned to this project
                      </div>
                    )}
                </SelectContent>
              </Select>
              {form.formState.errors.team_id && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {form.formState.errors.team_id.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="employee" className="text-sm font-medium">
                Assign to Employee <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.watch("assigned_to_employee_id")}
                onValueChange={(value) =>
                  form.setValue("assigned_to_employee_id", value, {
                    shouldValidate: true,
                  })
                }
                disabled={isTeamMembersLoading || !selectedTeamId}
              >
                <SelectTrigger
                  className={`w-full ${
                    form.formState.errors.assigned_to_employee_id
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  <SelectValue
                    placeholder={
                      !selectedTeamId
                        ? "Select a team first"
                        : isTeamMembersLoading
                        ? "Loading team members..."
                        : "Select employee"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers && teamMembers.length > 0 ? (
                    teamMembers.map((member: TeamMember) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {member.first_name} {member.last_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {member.email}
                          </span>
                          {member.job_title && (
                            <span className="text-xs text-muted-foreground">
                              {member.job_title} • {member.level}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      {selectedTeamId && !isTeamMembersLoading
                        ? "No members in this team"
                        : "Select a team first"}
                    </div>
                  )}
                </SelectContent>
              </Select>
              {form.formState.errors.assigned_to_employee_id && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {form.formState.errors.assigned_to_employee_id.message}
                </p>
              )}
              {selectedTeamId && teamMembers && teamMembers.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {teamMembers.length} member
                  {teamMembers.length !== 1 ? "s" : ""} in this team
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status" className="text-sm font-medium">
                Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) =>
                  form.setValue("status", value as TaskFormData["status"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          "todo"
                        )}`}
                      />
                      To Do
                    </div>
                  </SelectItem>
                  <SelectItem value="in_progress">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          "in_progress"
                        )}`}
                      />
                      In Progress
                    </div>
                  </SelectItem>
                  <SelectItem value="developed">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          "developed"
                        )}`}
                      />
                      Developed
                    </div>
                  </SelectItem>
                  <SelectItem value="code_review">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          "code_review"
                        )}`}
                      />
                      Code Review
                    </div>
                  </SelectItem>
                  <SelectItem value="deployment">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          "deployment"
                        )}`}
                      />
                      Deployment
                    </div>
                  </SelectItem>
                  <SelectItem value="qa">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          "qa"
                        )}`}
                      />
                      QA
                    </div>
                  </SelectItem>
                  <SelectItem value="done">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          "done"
                        )}`}
                      />
                      Done
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.watch("priority")}
                onValueChange={(value) =>
                  form.setValue("priority", value as TaskFormData["priority"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${getPriorityColor("low")}`}
                      >
                        ●
                      </span>
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${getPriorityColor("medium")}`}
                      >
                        ●
                      </span>
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${getPriorityColor("high")}`}
                      >
                        ●
                      </span>
                      High
                    </div>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${getPriorityColor("urgent")}`}
                      >
                        ●
                      </span>
                      Urgent
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="due_date" className="text-sm font-medium">
                Due Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch("due_date") && "text-muted-foreground",
                      form.formState.errors.due_date && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("due_date") ? (
                      format(form.watch("due_date")!, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch("due_date")}
                    onSelect={(date) =>
                      form.setValue("due_date", date, { shouldValidate: true })
                    }
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.due_date && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {form.formState.errors.due_date.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Select the deadline for this task
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="submit"
              disabled={createTaskMutation.isPending || !form.formState.isValid}
              className="flex-1"
            >
              {createTaskMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Task...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createTaskMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
