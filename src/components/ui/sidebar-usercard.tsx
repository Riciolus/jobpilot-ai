"use client";

import { ChevronUp, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { signOut } from "next-auth/react";

type SidebarUserCardProps = {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
};

const SidebarUserCard = ({ user }: SidebarUserCardProps) => {
  const handleLogout = async () => {
    await signOut({ redirectTo: "/" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="group flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-all duration-300 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-blue-600/10">
          <Avatar className="h-8 w-8 shadow-sm ring-1 shadow-blue-600/20 ring-blue-500/20">
            <AvatarImage
              src={user.avatarUrl ?? "/placeholder.svg?height=32&width=32"}
            />
            <AvatarFallback className="border border-blue-800/50 bg-gradient-to-br from-blue-900/80 to-blue-800/60 text-blue-300 backdrop-blur-sm">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-100">
              {user.name}
            </p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
          <ChevronUp className="h-4 w-4 text-slate-400 transition-transform group-hover:text-blue-400 group-data-[state=open]:rotate-180" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="start"
        className="w-[240px] border-slate-700/50 bg-slate-800/95 shadow-xl shadow-black/20 backdrop-blur-xl"
      >
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-slate-300 transition-colors hover:bg-red-950/50 hover:text-red-300 focus:bg-red-950/50 focus:text-red-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarUserCard;
