import type { UseFormReturn } from "react-hook-form";
import type { CompanyFormData } from "@/types/company/main-types";
import { Phone, Mail, Globe } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface CompanyOverviewProps {
    form: UseFormReturn<CompanyFormData>;
    companyData: CompanyFormData;
}

export default function CompanyOverview({
    companyData,
}: CompanyOverviewProps) {
    return (
        <TabsContent value="overview" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <p className="mt-1">{companyData.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{companyData.phone || "-"}</span>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span>{companyData.email || "-"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="website">Website</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <Globe className="w-4 h-4 text-muted-foreground" />
                                <span>{companyData.website || "-"}</span>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="zone">Zone</Label>
                            <p className="mt-1">{companyData.zone || "-"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Address Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="address_1">Address Line 1</Label>
                            <p className="mt-1">
                                {companyData.address_1 || "-"}
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="address_2">Address Line 2</Label>
                            <p className="mt-1">
                                {companyData.address_2 || "-"}
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="city">City</Label>
                            <p className="mt-1">{companyData.city || "-"}</p>
                        </div>

                        <div>
                            <Label htmlFor="state">State</Label>
                            <p className="mt-1">{companyData.state || "-"}</p>
                        </div>

                        <div>
                            <Label htmlFor="country">Country</Label>
                            <p className="mt-1">{companyData.country || "-"}</p>
                        </div>

                        <div>
                            <Label htmlFor="pincode">Pincode</Label>
                            <p className="mt-1">{companyData.pincode || "-"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
