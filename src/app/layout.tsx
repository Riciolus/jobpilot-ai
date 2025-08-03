import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Orbitron } from "next/font/google";

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

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${orbitron.variable}`}>
      <body>{children}</body>
    </html>
  );
}
