"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Target,
  Users,
  Zap,
  Star,
  CheckCircle,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const features = [
  {
    icon: <Bot className="h-8 w-8 text-blue-400" />,
    title: "AI Career Advisor",
    description:
      "Get personalized career advice powered by advanced AI that understands your goals and background.",
  },
  {
    icon: <Target className="h-8 w-8 text-purple-400" />,
    title: "Smart Job Matching",
    description:
      "Find opportunities that perfectly match your skills, experience, and career aspirations.",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-400" />,
    title: "Skill Gap Analysis",
    description:
      "Identify the skills you need to reach your career goals and get learning recommendations.",
  },
  {
    icon: <Briefcase className="h-8 w-8 text-purple-400" />,
    title: "Career Planning",
    description:
      "Create a personalized roadmap to achieve your career objectives with actionable steps.",
  },
  {
    icon: <Users className="h-8 w-8 text-blue-400" />,
    title: "Industry Insights",
    description:
      "Stay updated with the latest trends and opportunities in your field of interest.",
  },
  {
    icon: <Star className="h-8 w-8 text-purple-400" />,
    title: "Resume Optimization",
    description:
      "Get AI-powered suggestions to improve your resume and increase your chances of landing interviews.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen text-slate-100">
      <Navbar />

      {/* Hero Section with Spline Background and Glow Effects */}
      <section className="relative h-screen w-full overflow-hidden bg-slate-950">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/videos/landing-page-bg.webm" type="video/webm" />
        </video>
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-slate-950/80"></div>
        <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 h-80 w-80 animate-pulse rounded-full bg-purple-500/15 blur-3xl delay-1000"></div>
        {/* Hero Content Overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-20 items-center">
          <div className="flex h-full items-center justify-center px-6">
            <div className="pointer-events-auto relative mx-auto max-w-4xl text-center">
              <div className="absolute inset-0 h-36 w-96 animate-pulse rounded-full bg-red-500/40 blur-3xl"></div>
              <div className="absolute inset-x-32 h-36 w-96 animate-pulse rounded-full bg-green-500/30 blur-3xl"></div>
              <div className="absolute inset-x-64 h-36 w-96 animate-pulse rounded-full bg-pink-500/30 blur-3xl"></div>
              <Badge className="mb-6 border-blue-800/50 bg-blue-900/30 text-blue-300 shadow-lg shadow-blue-600/20 backdrop-blur-sm hover:bg-blue-800/30">
                <Bot className="mr-2 h-4 w-4" />
                Beta: Powered by Granite AI
              </Badge>

              <h1 className="mb-6 bg-gradient-to-b from-white via-blue-100 to-blue-300 bg-clip-text text-5xl font-bold text-white drop-shadow-2xl md:text-7xl">
                Your AI Career
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
                  Copilot
                </span>
              </h1>

              <p className="mx-auto mb-8 max-w-2xl text-xl text-slate-300 drop-shadow-lg md:text-2xl">
                Navigate your career journey with AI-powered guidance,
                personalized recommendations, and expert insights.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg text-white shadow-2xl ring-1 shadow-blue-600/40 ring-blue-500/30 transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-600/60 hover:ring-blue-400/50"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600/50 bg-slate-900/20 px-8 py-4 text-lg text-slate-300 shadow-lg shadow-black/20 backdrop-blur-sm hover:bg-slate-800/50"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Glow Cards */}
      <section
        id="features"
        className="relative overflow-hidden bg-slate-950 py-24"
      >
        {/* Background Glow Effects */}
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-4xl font-bold text-white md:text-5xl">
              Supercharge Your Career
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-400">
              Our AI-powered platform provides personalized career guidance, job
              matching, and skill development recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-slate-800/50 bg-slate-900/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-600/20"
              >
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <CardContent className="relative z-10 p-6">
                  <div className="mb-4 w-fit rounded-lg bg-slate-800/50 p-3 shadow-lg shadow-blue-600/10">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Enhanced Glow */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-purple-950 py-24">
        {/* Enhanced Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-blue-500/20 blur-3xl"></div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-4xl font-bold text-white md:text-5xl">
            Ready to Transform Your Career?
          </h2>
          <p className="mb-8 text-xl text-slate-300">
            Join thousands of professionals who are already using JobPilot to
            accelerate their career growth.
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg text-white shadow-2xl ring-1 shadow-blue-600/40 ring-blue-500/30 hover:from-blue-700 hover:to-purple-700 hover:ring-blue-400/50"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600/50 bg-slate-900/20 px-8 py-4 text-lg text-slate-300 shadow-lg shadow-black/20 backdrop-blur-sm hover:bg-slate-800/50 hover:text-slate-200"
            >
              Schedule Demo
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400 shadow-green-400/50 drop-shadow-lg" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400 shadow-green-400/50 drop-shadow-lg" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400 shadow-green-400/50 drop-shadow-lg" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="fixed top-5 z-50 mx-auto w-full rounded-xl">
      <div className="mx-auto max-w-4xl rounded-xl border-b border-slate-800/30 bg-transparent px-6 backdrop-blur-md lg:px-8">
        <div className="flex h-16 items-center justify-between rounded-xl">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div>
              <Image
                src={"/images/Rocket.png"}
                alt="rocket"
                width={30}
                height={30}
              />
            </div>
            <span className="text-xl font-bold text-slate-100">JobPilot</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 lg:flex">
            <div className="group relative">
              <button
                className="flex items-center gap-1 py-2 text-slate-300 transition-colors hover:text-blue-400"
                onMouseEnter={() => setActiveDropdown("features")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                Features
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "features" && (
                <div
                  className="absolute top-full left-0 mt-2 w-80 rounded-xl border border-slate-800/50 bg-slate-900/95 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"
                  onMouseEnter={() => setActiveDropdown("features")}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-semibold text-white">
                        AI Guidance
                      </h3>
                      <p className="text-sm text-slate-400">
                        Get personalized career advice powered by AI
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-white">
                        Job Matching
                      </h3>
                      <p className="text-sm text-slate-400">
                        Find opportunities that match your skills
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-white">
                        Skill Analysis
                      </h3>
                      <p className="text-sm text-slate-400">
                        Identify gaps and get learning recommendations
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a
              href="#pricing"
              className="text-slate-300 transition-colors hover:text-blue-400"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-slate-300 transition-colors hover:text-blue-400"
            >
              About
            </a>
            <a
              href="#blog"
              className="text-slate-300 transition-colors hover:text-blue-400"
            >
              Blog
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="hidden items-center space-x-4 lg:flex">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-slate-300 hover:bg-slate-800/50 hover:text-blue-400"
              >
                Login
              </Button>
            </Link>
            <Link href="https://github.com/Riciolus/jobpilot-ai">
              <Button
                variant="outline"
                className="border-slate-700 bg-transparent text-slate-300 hover:bg-blue-950/50 hover:text-blue-300"
              >
                Support
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg ring-1 shadow-blue-600/25 ring-blue-500/20 hover:from-blue-700 hover:to-blue-800">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="text-slate-300 hover:text-blue-400 lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="rounded-lg border-t border-slate-800/50 bg-slate-950/60 backdrop-blur-xl lg:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              <a
                href="#features"
                className="block px-3 py-2 text-slate-300 hover:text-blue-400"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 text-slate-300 hover:text-blue-400"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="block px-3 py-2 text-slate-300 hover:text-blue-400"
              >
                About
              </a>
              <div className="flex flex-col gap-2 px-3 pt-2">
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="w-full border-slate-700 bg-transparent text-slate-300 hover:bg-blue-950/50"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/50 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="to-fuchisa-700 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-800 shadow-lg ring-1 shadow-blue-600/30 ring-blue-500/20">
                <Image
                  src={"/images/Rocket.png"}
                  alt="rocket"
                  width={30}
                  height={30}
                />
              </div>
              <span className="text-xl font-bold text-slate-100">JobPilot</span>
            </div>
            <p className="mb-4 max-w-md text-slate-400">
              Your AI-powered career companion, helping professionals navigate
              their career journey with personalized guidance and insights.
            </p>
            <Badge className="border-blue-800/50 bg-blue-900/30 text-blue-300 shadow-lg shadow-blue-600/20 backdrop-blur-sm">
              Beta: Powered by Granite AI
            </Badge>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Product</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#" className="transition-colors hover:text-blue-400">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-blue-400">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-blue-400">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-blue-400">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Company</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#" className="transition-colors hover:text-blue-400">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-blue-400">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-blue-400">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-blue-400">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/50 pt-8 text-center text-slate-400">
          <p>&copy; 2025 JobPilot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
