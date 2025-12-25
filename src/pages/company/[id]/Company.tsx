import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CompanyOverview from "../company-overview";
import CompanyDepartments from "../department";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Adjust import path
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusColors, typeColors } from "@/types/company/colors";
import {
  useCompanyDetail,
  useUpdateCompanyDetail,
} from "@/queries/company/company-queries";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CompanyPageSkeleton } from "@/components/custom/skeletons/company-skeleton";
import NotFound from "@/components/custom/skeletons/NotFound";

export default function CompanyPage() {
  const params = useParams<{ id: string }>();
  const { companyId: authCompanyId } = useAuth();
  const id = params.id || authCompanyId;

  const { data: company, isLoading, error } = useCompanyDetail(id || "");
  const updateMutation = useUpdateCompanyDetail(id || "");
  const [editMode, setEditMode] = useState(false);

  const form = useForm({
    defaultValues: company ?? {
      idd: "",
      name: "",
      description: "",
      phone: "",
      email: "",
      website: "",
      zone: "",
      type: "private",
      status: "active",
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      employees: 0,
      parentCompany: "",
      childCompanies: [],
    },
  });

  // Reset form when company data changes
  useEffect(() => {
    if (company) form.reset(company);
  }, [company, form]);

  const onSubmit = form.handleSubmit((data) => {
    updateMutation.mutate(data, {
      onSuccess: () => setEditMode(false),
    });
  });

  const watchedType = form.watch("type") as keyof typeof typeColors;
  const watchedStatus = form.watch("status") as keyof typeof statusColors;
  const [activeTab, setActiveTab] = useState<
    "overview" | "departments"
  >("overview");

  if (isLoading) return <CompanyPageSkeleton />;
  if (error) return <NotFound />;
  if (!company) return <NotFound />;

  // Company Header component inside main file
  function CompanyHeader() {
    return (
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="flex items-center gap-4">
          <div>
            {editMode ? (
              <Input
                className="text-xl font-bold bg-background border-b"
                {...form.register("name")}
              />
            ) : (
              <h1 className="text-3xl font-bold">{form.getValues("name")}</h1>
            )}
            <div className="flex gap-2 mt-2">
              <p className="text-muted-foreground">{form.getValues("idd")}</p>
              {editMode ? (
                <Select
                  value={form.watch("type")}
                  onValueChange={(val) => form.setValue("type", val)}
                >
                  <SelectTrigger
                    className={
                      typeColors[form.watch("type") as keyof typeof typeColors]
                    }
                  >
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="headquarters">headquarters</SelectItem>
                    <SelectItem value="branch">branch</SelectItem>
                    <SelectItem value="subsidiary">subsidiary</SelectItem>
                    <SelectItem value="division">division</SelectItem>
                    <SelectItem value="private">private</SelectItem>
                    <SelectItem value="public">public</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <>
                  <Badge className={typeColors[watchedType]}>
                    {form.getValues("type")}
                  </Badge>
                  <Badge className={statusColors[watchedStatus]}>
                    {form.getValues("status")}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {editMode ? (
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
                  setEditMode(false);
                  form.reset();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setEditMode(true);
                form.reset();
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <CompanyHeader />

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <CompanyOverview
            companyData={company}
            editMode={editMode}
            form={form}
          />
        </TabsContent>

        <TabsContent value="departments">
          <CompanyDepartments />
        </TabsContent>
      </Tabs>
    </div>
  );
}
