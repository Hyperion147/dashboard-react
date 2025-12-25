type ChildCompany = {
  name: string;
}

export type FormData = {
  idd: string
  name: string
  type: string
  description: string
  address_1: string
  address_2: string
  address_3: string
  landmark: string
  city: string
  area: string
  state: string
  country: string
  pincode: string
  zone: string
  status: string
  parentCompanyId: string
}

export type CompanyFormData = {
  idd: string;
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  zone?: string;
  type: "private" | "public";
  status: "active" | "inactive";
  code?: ""
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  employees?: number;
  parentCompany?: string;
  childCompanies?: ChildCompany[];
}

export type CompanyOverview = {
  id: string;
  idd: string;
  name: string;
  type: "headquarters" | "branch" | "subsidiary" | "division" | "private" | "public";
  status: "active" | "inactive";
  description?: string;
  city?: string;
  country?: string;
  employees?: number;
}

export interface CompanyDetail extends CompanyOverview {
  phone?: string;
  email?: string;
  website?: string;
  zone?: string;
  address_1?: string;
  address_2?: string;
  state?: string;
  pincode?: string;
  parentCompany?: string;
  childCompanies?: { name: string }[];
}

export type Department = {
  companyId: string;
  id: string,
  name: string;
  code: string;
  description: string;
  status: "active" | "inactive";
}

export interface Team {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  project: string;
  teamLead: string;
  memberCount: number;
  description: string;
  status: "active" | "inactive" | "archived";
  createdAt?: string;
  updatedAt?: string;
}


