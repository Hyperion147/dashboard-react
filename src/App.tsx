import { Routes, Route, Navigate } from "react-router-dom";
import { NavigationSidebar } from "./components/NavigationSidebar";
import { AdminOverview } from "./pages/AdminOverview";
import { useState } from "react";
import { EmployeeManagement } from "./pages/employee/EmployeeManagement";
import { EmployeeDetail } from "./pages/employee/[id]/Employee";
import { PayrollManagement } from "./pages/PayrollManagement";
import { PayrollDetail } from "./pages/payroll/[id]/PayrollDetail";
import { PayslipManagement } from "./pages/payslip/PayslipManagement";
import { EmployeePayslips } from "./pages/payslip/[employeeId]/EmployeePayslips";
import ProjectsPage from "./pages/ProjectsPage";
import { ProjectManagement } from "./pages/projects/ProjectManagement";
import { ProjectDetail } from "./pages/projects/[id]/ProjectDetail";
import { CreateProject } from "./pages/projects/CreateProject";
import { TeamManagement } from "./pages/teams/TeamManagement";
import { CreateTeam } from "./pages/teams/CreateTeam";
import { TeamDetail } from "./pages/teams/TeamDetail";
import { AttendanceManagement } from "./pages/attendance/AttendanceManagement";
import { EmployeeAttendance } from "./pages/attendance/EmployeeAttendance";
import AdminSignin from "./pages/auth/AdminSignin";
import PasswordReset from "./pages/auth/PasswordReset";
import CompanyDetailPage from "./pages/company/[id]/Company";
import CreateCompanyPage from "./pages/company/create-company";
import AddEmployeePage from "./pages/employee/add-employee";
import EditEmployeePage from "./pages/employee/[id]/edit/edit-employee";
import { TaskAssginment } from "./pages/tasks/TaskAssignment";
import NotFound from "./components/custom/skeletons/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { useAuth } from "./contexts/AuthContext";
import { Toaster } from "@/utils/toast";
import Profile from "./components/custom/profile";

function App() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Auth routes without sidebar */}
        <Route
          path="/auth/signin"
          element={isAuthenticated ? <Navigate to="/" replace /> : <AdminSignin />}
        />
        <Route path="/auth/password-reset" element={<PasswordReset />} />

        {/* All other routes with sidebar */}
        <Route element={<NavigationSidebar open={open} setOpen={setOpen} />}>
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <EmployeeManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/add"
            element={
              <ProtectedRoute>
                <AddEmployeePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managetasks"
            element={
              <ProtectedRoute>
                <TaskAssginment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/:id"
            element={
              <ProtectedRoute>
                <EmployeeDetail employeeId="" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/:id/edit"
            element={
              <ProtectedRoute>
                <EditEmployeePage employeeId="" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managepayroll"
            element={
              <ProtectedRoute>
                <PayrollManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/:id"
            element={
              <ProtectedRoute>
                <PayrollDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payslips"
            element={
              <ProtectedRoute>
                <PayslipManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payslips/employee/:employeeId"
            element={
              <ProtectedRoute>
                <EmployeePayslips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/create"
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams"
            element={
              <ProtectedRoute>
                <TeamManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams/create"
            element={
              <ProtectedRoute>
                <CreateTeam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams/:id"
            element={
              <ProtectedRoute>
                <TeamDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <AttendanceManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/employee/:id"
            element={
              <ProtectedRoute>
                <EmployeeAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects-old"
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/create"
            element={
              <ProtectedRoute>
                <CreateCompanyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/:id/view"
            element={
              <ProtectedRoute>
                <CompanyDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
