import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";
import { useState } from "react";
import toast from "react-hot-toast";
import { Avatar } from "../ui/avatar";
import { IconCode, IconLogout } from "@tabler/icons-react";
import { Button } from "../ui/button";

const Profile = () => {
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutDialog(true);
    };

    const handleLogoutConfirm = () => {
        setShowLogoutDialog(false);
        toast.success("Logged out");
    };

    const handleLogoutCancel = () => {
        setShowLogoutDialog(false);
    };

    return (
        <div>
            <LogoutConfirmDialog
                open={showLogoutDialog}
                onConfirm={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
            />
            <a
                href="https://github.com/Hyperion147/dashboard-react"
                className="flex items-center justify-start gap-2 group/sidebar py-2"
                target="_blank"
            >
                <IconCode className="h-5 w-5 shrink-0" />
                <span className="text-primary text-sm whitespace-pre inline-block m-0! border px-2 w-full rounded-sm tracking-wider">
                    Star on github
                </span>
            </a>
            <div className="h-px bg-gray-400 my-2" />
            <div className="flex gap-4 items-center">
                <Avatar className="h-6 w-6">
                    <img src="/profile.jpeg" alt="" />
                </Avatar>
                <div className="flex justify-between w-full items-center">
                    <div>
                        <h2 className="font-bold">Suryansu.pro</h2>
                        <p className="text-xs tracking-wider">Developer</p>
                    </div>
                    <Button
                        onClick={handleLogoutClick}
                        className="cursor-pointer"
                        variant="outline"
                    >
                        <IconLogout className="h-5 w-5 shrink-0" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
