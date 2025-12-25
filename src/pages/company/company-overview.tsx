import type { UseFormReturn } from "react-hook-form";
import type { CompanyFormData } from "@/types/company/main-types";
import { Phone, Mail, Globe } from "lucide-react";
import { TabsContent } from "@repo/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Textarea } from "@repo/ui/textarea";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

interface CompanyOverviewProps {
  editMode: boolean;
  form: UseFormReturn<CompanyFormData>;
  companyData: CompanyFormData;
}

export default function CompanyOverview({
  editMode,
  form,
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
            {editMode ? (
              <Textarea
                id="description"
                className="mt-1 w-full resize-none"
                {...form.register("description")}
              />
            ) : (
              <p className="mt-1">{companyData.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {editMode ? (
                  <Input id="phone" {...form.register("phone")} />
                ) : (
                  <span>{companyData.phone || "-"}</span>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-muted-foreground" />
                {editMode ? (
                  <Input id="email" type="email" {...form.register("email")} />
                ) : (
                  <span>{companyData.email || "-"}</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <div className="flex items-center gap-2 mt-1">
              <Globe className="w-4 h-4 text-muted-foreground" />
              {editMode ? (
                <Input id="website" {...form.register("website")} />
              ) : (
                <span>{companyData.website || "-"}</span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="zone">Zone</Label>
            {editMode ? (
              <Input id="zone" {...form.register("zone")} />
            ) : (
              <p className="mt-1">{companyData.zone || "-"}</p>
            )}
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
              {editMode ? (
                <Input id="address_1" {...form.register("address_1")} />
              ) : (
                <p className="mt-1">{companyData.address_1 || "-"}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address_2">Address Line 2</Label>
              {editMode ? (
                <Input id="address_2" {...form.register("address_2")} />
              ) : (
                <p className="mt-1">{companyData.address_2 || "-"}</p>
              )}
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              {editMode ? (
                <Input id="city" {...form.register("city")} />
              ) : (
                <p className="mt-1">{companyData.city || "-"}</p>
              )}
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              {editMode ? (
                <Input id="state" {...form.register("state")} />
              ) : (
                <p className="mt-1">{companyData.state || "-"}</p>
              )}
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              {editMode ? (
                <Input id="country" {...form.register("country")} />
              ) : (
                <p className="mt-1">{companyData.country || "-"}</p>
              )}
            </div>

            <div>
              <Label htmlFor="pincode">Pincode</Label>
              {editMode ? (
                <Input id="pincode" {...form.register("pincode")} />
              ) : (
                <p className="mt-1">{companyData.pincode || "-"}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
