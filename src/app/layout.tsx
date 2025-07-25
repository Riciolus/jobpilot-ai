import "@/styles/globals.css";
import { type Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "JobPilot - 🚀",
  description:
    "Jobpilot is your AI-powered career navigator. Discover job paths, get tailored advice, and plan your future with smart, contextual guidance.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"], // Optional: choose weights
  variable: "--font-playfair", // CSS variable name
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${playfair.variable}`}>
      <body>
        <SidebarProvider>
          <AppSidebar />
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
