import "@/styles/globals.css";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth(); // or getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <>
      <SessionProvider>
        <SidebarProvider>
          <AppSidebar user={session.user} />
          {children}
        </SidebarProvider>
      </SessionProvider>
    </>
  );
}
