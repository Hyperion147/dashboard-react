import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Save, Edit, X, Plus, Trash2 } from "lucide-react";
import {
  useCompanyDepartments,
  useUpdateCompanyDepartment,
  useCreateDepartment,
  useDeleteDepartment,
} from "@/queries/company/department";
import type { Department } from "@/types/company/main-types";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function CompanyDepartments() {
  const params = useParams<{ id: string }>();
  const companyId = params.id!;
  const { data: departments, isLoading, error } = useCompanyDepartments(companyId);
  const [editModeId, setEditModeId] = useState<string | null>(null);
  const [departmentData, setDepartmentData] = useState<Department[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const createMutation = useCreateDepartment(companyId);
  const deleteMutation = useDeleteDepartment(companyId);

  useEffect(() => {
    if (departments && departments.length > 0) {
      setDepartmentData(departments);
    }
  }, [departments]);

  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return;
    
    deleteMutation.mutate(deleteConfirm.id, {
      onSuccess: () => {
        toast.success("Department deleted successfully!");
        setDeleteConfirm(null);
      },
      onError: () => {
        toast.error("Failed to delete department");
        setDeleteConfirm(null);
      },
    });
  };

  if (isLoading) return <div>Loading departments...</div>;
  if (error) return <div>Error loading departments</div>;

  // Add Department Form
  function AddDepartmentDialog() {
    const form = useForm<Omit<Department, 'id' | 'companyId'>>({
      defaultValues: {
        name: "",
        code: "",
        description: "",
        status: "active",
      },
    });

    const onSubmit = form.handleSubmit((data) => {
      // Trim whitespace from inputs
      const trimmedData = {
        name: data.name.trim(),
        code: data.code.trim().toUpperCase(),
        description: data.description?.trim() || "",
        status: data.status,
      };

      createMutation.mutate(trimmedData, {
        onSuccess: () => {
          toast.success("Department created successfully!");
          setIsAddDialogOpen(false);
          form.reset();
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || "Failed to create department";
          toast.error(errorMessage);
        },
      });
    });

    const handleCancel = () => {
      form.reset();
      setIsAddDialogOpen(false);
    };

    return (
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        if (!open) handleCancel();
        setIsAddDialogOpen(open);
      }}>
        <DialogTrigger asChild>
          <Button className="mb-6">
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Department Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...form.register("name", { 
                  required: "Department name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters"
                  },
                  maxLength: {
                    value: 100,
                    message: "Name must not exceed 100 characters"
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9\s&-]+$/,
                    message: "Name can only contain letters, numbers, spaces, & and -"
                  }
                })}
                placeholder="e.g., Human Resources"
                className={form.formState.errors.name ? "border-red-500" : ""}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Department Code <span className="text-red-500">*</span>
              </label>
              <Input
                {...form.register("code", { 
                  required: "Department code is required",
                  minLength: {
                    value: 2,
                    message: "Code must be at least 2 characters"
                  },
                  maxLength: {
                    value: 10,
                    message: "Code must not exceed 10 characters"
                  },
                  pattern: {
                    value: /^[A-Z0-9-]+$/,
                    message: "Code must be uppercase letters, numbers, or hyphens only"
                  }
                })}
                placeholder="e.g., HR or DEPT-001"
                className={form.formState.errors.code ? "border-red-500" : ""}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  form.setValue("code", e.target.value);
                }}
              />
              {form.formState.errors.code && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.code.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Use a unique code to identify this department
              </p>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Description</label>
              <Textarea
                {...form.register("description", {
                  maxLength: {
                    value: 500,
                    message: "Description must not exceed 500 characters"
                  }
                })}
                placeholder="Brief description of the department's role and responsibilities"
                rows={4}
                className={`resize-none ${form.formState.errors.description ? "border-red-500" : ""}`}
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

            <div>
              <label className="text-sm font-medium block mb-1.5">
                Status <span className="text-red-500">*</span>
              </label>
              <Select
                value={form.watch("status")}
                onValueChange={(val) => form.setValue("status", val as Department["status"])}
              >
                <SelectTrigger className="w-full">
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
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      Inactive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Only active departments will be available for assignment
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || !form.formState.isValid}
              >
                {createMutation.isPending ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Department
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // Individual department card with its own form and edit mode
  function DepartmentCard({ department }: { department: Department }) {
    const form = useForm<Department>({
      defaultValues: department,
    });

    const updateMutation = useUpdateCompanyDepartment(department.id, companyId);

    const onSubmit = form.handleSubmit((formData) => {
      updateMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Department updated successfully!");
          setEditModeId(null);
        },
        onError: () => {
          toast.error("Failed to update department");
        },
      });
    });

    const handleDeleteClick = () => {
      setDeleteConfirm({ id: department.id, name: department.name });
    };

    const isEditing = editModeId === department.id;

    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">
              {isEditing ? (
                <Input {...form.register("name")} className="text-lg font-semibold" />
              ) : (
                department.name || "-"
              )}
            </CardTitle>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onSubmit}
                    disabled={updateMutation.isPending}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditModeId(null);
                      form.reset(department);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditModeId(department.id);
                      form.reset(department);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDeleteClick}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">
              Department Code
            </label>
            {isEditing ? (
              <Input {...form.register("code")} />
            ) : (
              <p className="text-sm font-medium">{department.code || "-"}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-1">
              Description
            </label>
            {isEditing ? (
              <Textarea {...form.register("description")} rows={3} className="resize-none" />
            ) : (
              <p className="text-sm">{department.description || "-"}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-1">
              Status
            </label>
            {isEditing ? (
              <Select
                value={form.watch("status")}
                onValueChange={(val) =>
                  form.setValue("status", val as Department["status"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                department.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : department.status === 'inactive'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {department.status}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Departments</h2>
          <p className="text-muted-foreground">
            Manage company departments and their details
          </p>
        </div>
        <AddDepartmentDialog />
      </div>

      {departmentData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No departments found</p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Department
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentData.map((dept) => (
            <DepartmentCard key={dept.id} department={dept} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Department"
        description={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
