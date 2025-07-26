import { Home, Compass, Map, Bookmark, Settings, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
  },
  {
    title: "Explore Careers",
    url: "#",
    icon: Compass,
  },
  {
    title: "My Plan",
    url: "#",
    icon: Map,
  },
  {
    title: "Saved Jobs",
    url: "#",
    icon: Bookmark,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar
      className="border-r border-slate-800 bg-slate-900"
      collapsible="offcanvas"
    >
      <SidebarHeader className="border-b border-slate-800 bg-slate-900 px-0 py-0">
        <SidebarLogo />
      </SidebarHeader>

      <SidebarContent className="bg-slate-900">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarNavigationItems />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-800 bg-slate-900 p-4">
        <SidebarUserCard
          user={{
            name: "tes-dev",
            email: "test-dev@gmail.com",
            avatarUrl: "/placeholder.svg?height=32&width=32",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

const SidebarLogo = () => {
  return (
    <div className="group relative flex items-center gap-3 overflow-hidden px-6 py-4">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 border-y border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div
          className="absolute top-2 left-8 h-1 w-1 animate-bounce rounded-full bg-blue-400"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-6 right-12 h-1 w-1 animate-bounce rounded-full bg-purple-400"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-3 left-16 h-1 w-1 animate-bounce rounded-full bg-pink-400"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Glowing orb behind rocket */}
      <div className="absolute top-1/2 -left-2 h-16 w-16 -translate-y-1/2 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-xl"></div>

      {/* Rocket image with subtle movement */}
      <div className="z-10">
        <Image
          src="/images/Rocket.png"
          alt="rocket"
          width={93}
          height={93}
          priority
          className="group-hover:-trans absolute -top-4 -left-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] filter transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]"
        />
      </div>

      {/* Modern typography */}
      <div className="relative z-10 ml-12">
        <h1 className="font-playfair text-xl font-bold tracking-wide text-white/90 transition-all duration-300 group-hover:text-white">
          Job Pilot
        </h1>
      </div>

      {/* Ambient light effect */}
      <div className="bg-gradient-radial absolute -inset-4 from-blue-500/10 via-transparent to-transparent opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />
    </div>
  );
};

export default SidebarLogo;

const SidebarNavigationItems = () => {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            className="text-slate-300 hover:bg-blue-950/50 hover:text-blue-300 active:bg-blue-950 active:text-blue-300 data-[active=true]:border-r-2 data-[active=true]:border-blue-500 data-[active=true]:bg-blue-900/30 data-[active=true]:text-blue-300"
          >
            <a href={item.url} className="flex items-center gap-3 px-3 py-2">
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

type SidebarUserCardProps = {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
};

const SidebarUserCard = ({ user }: SidebarUserCardProps) => {
  return (
    <div className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-900">
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={user.avatarUrl ?? "/placeholder.svg?height=32&width=32"}
        />
        <AvatarFallback className="border border-blue-800 bg-blue-900/50 text-blue-300">
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-100">
          {user.name}
        </p>
        <p className="truncate text-xs text-slate-400">{user.email}</p>
      </div>
    </div>
  );
};
