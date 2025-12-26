import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import CompanyOverview from "../company-overview";
import CompanyDepartments from "../department";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { statusColors, typeColors } from "@/types/company/colors";
import {
    useCompanyDetail,
} from "@/queries/company/company-queries";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CompanyPageSkeleton } from "@/components/custom/skeletons/company-skeleton";
import NotFound from "@/components/custom/skeletons/NotFound";
import type { CompanyFormData } from "@/types/company/main-types";
import gsap from "gsap";

export default function CompanyPage() {
    const params = useParams<{ id: string }>();
    const { companyId: authCompanyId } = useAuth();
    const id = params.id || authCompanyId;
    const containerRef = useRef<HTMLDivElement>(null);

    const { data: company, isLoading, error } = useCompanyDetail(id || "");

    const form = useForm<CompanyFormData>({
        defaultValues: (company
            ? { ...company, type: company.type as "private" | "public" }
            : {
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
              }) as CompanyFormData,
    });

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".initial-animation",
                {
                    y: -20,
                    opacity: 0,
                    filter: "blur(20px)",
                },
                {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.8,
                    stagger: 0.05,
                    ease: "power3.out",
                    delay: 0.2,
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const watchedType = form.watch("type");
    const watchedStatus = form.watch("status");
    const [activeTab, setActiveTab] = useState<"overview" | "departments">(
        "overview"
    );

    if (isLoading) return <CompanyPageSkeleton />;
    if (error) return <NotFound />;
    if (!company) return <NotFound />;

    return (
        <div className="p-4" ref={containerRef}>
            <div
                className="initial-animation flex items-center justify-between px-2 mb-4"
            >
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">
                            {form.getValues("name")}
                        </h1>
                        <div className="flex gap-2 mt-2">
                            <p className="text-muted-foreground">
                                {form.getValues("idd")}
                            </p>
                            <div>
                                <Badge
                                    className={
                                        typeColors[watchedType || "private"]
                                    }
                                >
                                    {form.getValues("type")}
                                </Badge>
                                <Badge
                                    className={
                                        statusColors[watchedStatus || "active"]
                                    }
                                >
                                    {form.getValues("status")}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Tabs
                value={activeTab}
                onValueChange={(value) =>
                    setActiveTab(value as typeof activeTab)
                }
            >
                <TabsList className="initial-animation">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="departments">Departments</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="initial-animation">
                    <CompanyOverview
                        companyData={company as unknown as CompanyFormData}
                        form={form}
                    />
                </TabsContent>

                <TabsContent value="departments" className="initial-animation">
                    <CompanyDepartments />
                </TabsContent>
            </Tabs>
        </div>
    );
}
