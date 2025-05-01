import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Lock, ChevronDown } from "lucide-react";

interface UserDropdownProps {
  email: string;
  onLogout: () => void;
  onChangePassword: () => void;
}

const UserDropdown = ({
  email,
  onLogout,
  onChangePassword,
}: UserDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <span className="max-w-[150px] truncate hidden sm:block">
            {email}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm font-medium text-gray-500 border-b mb-1 sm:hidden">
          {email}
        </div>
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2"
          onClick={onChangePassword}
        >
          <Lock className="h-4 w-4" />
          <span>Change Password</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2 text-red-500 focus:text-red-500"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
