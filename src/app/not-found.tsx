"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Construction, Search, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-purple-500/8 blur-3xl delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl"></div>

      {/* Back to Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-slate-400 transition-colors hover:text-blue-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <Card className="border-slate-800/50 bg-slate-900/50 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <CardContent className="p-3">
            {/* 404 Icon with Animation */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg shadow-black/20">
                  <Construction className="h-10 w-10 text-blue-400" />
                </div>
                {/* Floating particles around the icon */}
                <div className="absolute -top-2 -right-2 h-3 w-3 animate-bounce rounded-full bg-blue-400 opacity-60"></div>
                <div
                  className="absolute -bottom-2 -left-2 h-2 w-2 animate-bounce rounded-full bg-purple-400 opacity-60"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute top-1/2 -left-4 h-2 w-2 animate-bounce rounded-full bg-blue-300 opacity-60"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="mb-3 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-xl font-bold text-white md:text-3xl">
              Page Not Found
            </h1>

            {/* Subheading */}
            <h2 className="mb-4 text-lg font-semibold text-slate-300 md:text-xl">
              We&apos;re Still Working on This
            </h2>

            {/* Description */}
            <p className="mx-auto mb-6 max-w-lg text-sm leading-relaxed text-slate-400">
              The page you&apos;re looking for doesn&apos;t exist yet <br /> or
              is currently under construction.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm text-white shadow-lg ring-1 shadow-blue-600/25 ring-blue-500/20 transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:ring-blue-400/30"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Go Home
                </Button>
              </Link>

              <Link href="/chat">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600/50 bg-slate-800/30 px-6 py-3 text-sm text-slate-300 shadow-lg shadow-black/20 backdrop-blur-sm hover:bg-slate-800/50 hover:text-slate-200"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Start Chat
                </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-8 border-t border-slate-700/50 pt-6">
              <p className="text-sm text-slate-500">
                Need help? Contact our support team or check back later for
                updates.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Floating Elements */}
        <div className="absolute -top-8 -left-8 h-4 w-4 animate-pulse rounded-full bg-blue-400/30"></div>
        <div className="absolute -right-8 -bottom-8 h-6 w-6 animate-pulse rounded-full bg-purple-400/20 delay-700"></div>
        <div className="absolute top-1/2 -right-12 h-3 w-3 animate-pulse rounded-full bg-blue-300/40 delay-1000"></div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
    </div>
  );
}
