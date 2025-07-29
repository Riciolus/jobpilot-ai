import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }

  return <SessionProvider>{children}</SessionProvider>;
}
