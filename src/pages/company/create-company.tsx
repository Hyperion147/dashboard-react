import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Controller, useForm } from "react-hook-form";
import type { FormData } from "@/types/company/main-types";
import { useCreateCompany } from "@/queries/company/company-queries";

export default function CreateCompanyPage() {
  const { register, handleSubmit, control } = useForm<FormData>();
  const { mutate } = useCreateCompany();

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        // success actions
      },
      onError: () => {
        // error handling
      },
    });
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/company">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Company</h1>
          <p className="text-muted-foreground mt-1">
            Add a new company to your organization
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details of the company
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Company Name *</label>
                <Input
                  {...register("name", { required: true })}
                  placeholder="e.g., TechCorp Headquarters"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Company Type *</label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="headquarters">
                            Headquarters
                          </SelectItem>
                          <SelectItem value="branch">Branch</SelectItem>
                          <SelectItem value="subsidiary">Subsidiary</SelectItem>
                          <SelectItem value="division">Division</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status *</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                {...register("description")}
                placeholder="Enter company description..."
                className="mt-1 resize-none"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
            <CardDescription>
              Enter the company's address details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Address Line 1 *</label>
              <Input
                {...register("address_1", { required: true })}
                placeholder="e.g., 123 Tech Street"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Address Line 2</label>
              <Input
                {...register("address_2")}
                placeholder="e.g., Suite 500"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Address Line 3</label>
              <Input
                {...register("address_3")}
                placeholder="e.g., Building A"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Landmark</label>
              <Input
                {...register("landmark")}
                placeholder="e.g., Near Central Park"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">City *</label>
                <Input
                  {...register("city", { required: true })}
                  placeholder="e.g., San Francisco"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Area</label>
                <Input
                  {...register("area")}
                  placeholder="e.g., Downtown"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">State *</label>
                <Input
                  {...register("state", { required: true })}
                  placeholder="e.g., California"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Country *</label>
                <Input
                  {...register("country", { required: true })}
                  placeholder="e.g., USA"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Pincode *</label>
                <Input
                  {...register("pincode", { required: true })}
                  placeholder="e.g., 94105"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Zone *</label>
                <Input
                  {...register("zone", { required: true })}
                  placeholder="e.g., North America"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hierarchy */}
        <Card>
          <CardHeader>
            <CardTitle>Company Hierarchy</CardTitle>
            <CardDescription>
              Link this company to a parent company (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              name="parentCompanyId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="0">None</SelectItem>
                      <SelectItem value="1">TechCorp Headquarters</SelectItem>
                      <SelectItem value="2">TechCorp Solutions</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-2">
          <Button type="submit" className="gap-2">
            <Save className="w-4 h-4" />
            Create Company
          </Button>
          <Link to="/company">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
