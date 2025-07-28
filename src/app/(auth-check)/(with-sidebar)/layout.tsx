import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (session!.user.isOnboardingComplete === false) {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={session!.user} />
      {children}
    </SidebarProvider>
  );
}
