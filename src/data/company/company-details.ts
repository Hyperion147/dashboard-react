import type { CompanyDetail } from "@/types/types";

export const mockCompanyDetail: CompanyDetail = {
  id: "1",
  idd: "HQ-001",
  name: "TechCorp Headquarters",
  type: "headquarters",
  description:
    "Main headquarters for TechCorp, serving as the central hub for all operations.",
  address_1: "123 Tech Street",
  address_2: "Suite 500",
  city: "San Francisco",
  state: "California",
  country: "USA",
  pincode: "94105",
  zone: "North America",
  status: "active",
  employees: 250,
  phone: "+1 (415) 555-0123",
  email: "hq@techcorp.com",
  website: "www.techcorp.com",
  childCompanies: ["TechCorp India Branch", "TechCorp Solutions"],
};