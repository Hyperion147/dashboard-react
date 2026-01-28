import { Outlet } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "./custom/sidebar";
import {
  IconLayoutDashboard,
  IconBuilding,
  IconUsersGroup,
  IconCalendarEvent,
  IconUsers,
  IconBriefcase,
  IconCheckbox,
  IconCash,
  IconReceipt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

import type { NavigationSidebarProps } from "@/types/types";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Profile from "@/components/custom/profile";

export function NavigationSidebar({
  open,
  setOpen,
}: NavigationSidebarProps & {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { isAuthenticated, companyId } = useAuth();

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: <IconLayoutDashboard className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Company",
      href: `/company/${companyId}/view`,
      icon: <IconBuilding className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Teams",
      href: "/teams",
      icon: <IconUsers className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Projects",
      href: "/projects",
      icon: <IconBriefcase className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Tasks",
      href: "/managetasks",
      icon: <IconCheckbox className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Employees",
      href: "/employees",
      icon: <IconUsersGroup className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Attendance",
      href: "/attendance",
      icon: <IconCalendarEvent className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Payroll",
      href: "/managepayroll",
      icon: <IconCash className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Payslips",
      href: "/payslips",
      icon: <IconReceipt className="h-5 w-5 shrink-0" />,
    },
  ];

  return (
    <>
      <div className="flex h-screen">
        <div
          className={cn(
            "flex flex-1 md:flex-row top-0 left-0 h-full w-60 text-primary",
          )}
        >
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10 rounded-md fixed z-9999">
              <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto justify-between">
                <div>
                  {open ? <Logo /> : <LogoIcon />}
                  <div className="h-px bg-gray-400 my-4" />
                  <div className="flex flex-col gap-2">
                    {links.map((link, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "transition-opacity duration-300",
                          !isAuthenticated && "opacity-40 pointer-events-none",
                        )}
                      >
                        <SidebarLink link={link} />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Profile />
                </div>
              </div>
            </SidebarBody>
          </Sidebar>
          <main className="flex-1 ml-18">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
export const Logo = () => {
  return (
    <p className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal">
      <Avatar className="h-6 w-6 border border-primary">
        <AvatarFallback>DE</AvatarFallback>
      </Avatar>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-serif font-bold whitespace-pre"
      >
        Dashboard React
      </motion.span>
    </p>
  );
};
export const LogoIcon = () => {
  return (
    <p className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal">
      <Avatar className="h-6 w-6 border border-primary">
        <AvatarFallback>DE</AvatarFallback>
      </Avatar>
    </p>
  );
};
