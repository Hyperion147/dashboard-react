import { createContext, useContext, useState, type ReactNode } from "react";
import { dummyUser, dummyEmployee } from "@/data/dummy";

// Keeping the interface compatible with existing usage
interface User {
  id: string;
  email: string;
  type: "admin" | "hr";
}

interface Employee {
  id: string;
  idd: string;
  user_id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  doj: string;
  doe: string | null;
  status: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  company: {
    id: string;
    idd: string;
    name: string;
    type: string;
    description: string;
    city: string;
    state: string;
    country: string;
    status: string;
  };
  details: {
    id: string;
    employee_id: string;
    job_title: string;
    designation: string;
    department_id: string;
    team_id: string;
    department: {
      id: string;
      name: string;
      code: string;
    };
    team: {
      id: string;
      name: string;
      code: string;
    };
  };
}

interface AuthContextType {
  user: User | null;
  employee: Employee | null;
  companyId: string | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (authResponse: any) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
  validateToken: () => Promise<boolean>;
  validateTokenOnVisit: () => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Always use dummy data
  const [user] = useState<User | null>(dummyUser as User);
  // Casting dummyEmployee to the local Employee interface which is slighty different but compatible enough for the UI
  const [employee] = useState<Employee | null>(
    dummyEmployee as unknown as Employee
  );
  const [companyId] = useState<string | null>(dummyEmployee.company_id);
  const [token] = useState<string | null>("dummy-token");
  const [isLoading] = useState(false);

  const login = () => {
    console.log("Dummy login called");
  };

  const logout = () => {
    console.log("Dummy logout called (no-op)");
  };

  const refreshAccessToken = async () => {
    return "dummy-token";
  };

  const validateToken = async () => {
    return true;
  };

  const validateTokenOnVisit = async () => {
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        employee,
        companyId,
        token,
        isAuthenticated: true, // Always authenticated
        login,
        logout,
        refreshAccessToken,
        validateToken,
        validateTokenOnVisit,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
