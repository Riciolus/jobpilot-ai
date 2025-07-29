import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

type ExtendedUser = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  isOnboardingComplete: boolean;
};

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  const user = session?.user as ExtendedUser;

  if (!user.isOnboardingComplete) {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      {children}
    </SidebarProvider>
  );
}
