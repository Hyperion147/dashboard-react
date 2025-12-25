
import { useMutation } from '@tanstack/react-query';
import { dummyEmployee, dummyUser } from "@/data/dummy";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  type: "admin" | "hr";
}

export interface Employee {
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

export interface AuthResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
    employee: Employee;
  };
}

export const loginAdmin = async (_credentials: LoginCredentials): Promise<AuthResponse> => {
    // Return dummy success
    return {
        success: true,
        code: 200,
        message: "Success",
        data: {
            access_token: "dummy-token",
            refresh_token: "dummy-refresh",
            user: dummyUser as User,
            employee: dummyEmployee as unknown as Employee
        }
    };
};

export const logoutAdmin = async (): Promise<void> => {
  return;
};

export const refreshToken = async (_refreshToken: string): Promise<AuthResponse> => {
  return {
      success: true,
      code: 200,
      message: "Success",
      data: {
          access_token: "dummy-token-refreshed",
          refresh_token: "dummy-refresh-new",
          user: dummyUser as User,
          employee: dummyEmployee as unknown as Employee
      }
  };
};

// React Query hooks
export const useLoginAdmin = () => {
  const mutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      // Store tokens and data in localStorage
      const { access_token, refresh_token, user, employee } = data.data;
      
      localStorage.setItem('adminToken', access_token);
      localStorage.setItem('adminRefreshToken', refresh_token);
      localStorage.setItem('adminData', JSON.stringify(user));
      localStorage.setItem('adminEmployee', JSON.stringify(employee));
      localStorage.setItem('adminCompanyId', employee.company_id);
    },
    onError: (error: any) => {
      console.error('Admin login failed:', error);
    },
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.message || (mutation.error as any)?.response?.data?.message || null,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
};
