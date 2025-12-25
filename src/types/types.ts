import type { ReactNode } from "react";

export type NavigationSidebarProps = {
  children?: ReactNode;  // children can be React nodes, optional
};

export interface Company {
  id: string
  idd: string
  name: string
  type: "headquarters" | "branch" | "subsidiary" | "division"
  description: string
  city: string
  country: string
  status: "active" | "inactive"
  employees: number
}

export interface CompanyDetail {
  id: string;
  idd: string;
  name: string;
  type: "headquarters" | "branch" | "subsidiary" | "division";
  description: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  zone: string;
  status: "active" | "inactive";
  employees: number;
  phone: string;
  email: string;
  website: string;
  parentCompany?: string;
  childCompanies: string[];
}
