"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Users,
  MapPin,
  Briefcase,
  Star,
  ArrowRight,
  BookOpen,
  Target,
  BarChart3,
} from "lucide-react";

interface Career {
  id: string;
  title: string;
  category: string;
  description: string;
  averageSalary: string;
  growthRate: string;
  demandLevel: "High" | "Medium" | "Low";
  requiredSkills: string[];
  education: string;
  workEnvironment: string;
  jobOutlook: string;
  relatedCareers: string[];
}

const mockCareers: Career[] = [
  {
    id: "1",
    title: "Software Engineer",
    category: "Technology",
    description:
      "Design, develop, and maintain software applications and systems.",
    averageSalary: "$95,000 - $150,000",
    growthRate: "+22%",
    demandLevel: "High",
    requiredSkills: ["JavaScript", "Python", "React", "Node.js", "SQL"],
    education: "Bachelor's in Computer Science",
    workEnvironment: "Office/Remote",
    jobOutlook: "Much faster than average",
    relatedCareers: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
    ],
  },
  {
    id: "2",
    title: "Data Scientist",
    category: "Technology",
    description:
      "Analyze complex data to help organizations make informed decisions.",
    averageSalary: "$100,000 - $160,000",
    growthRate: "+31%",
    demandLevel: "High",
    requiredSkills: ["Python", "R", "Machine Learning", "SQL", "Statistics"],
    education: "Master's in Data Science/Statistics",
    workEnvironment: "Office/Remote",
    jobOutlook: "Much faster than average",
    relatedCareers: [
      "Data Analyst",
      "Machine Learning Engineer",
      "Business Analyst",
    ],
  },
  {
    id: "3",
    title: "UX Designer",
    category: "Design",
    description:
      "Create intuitive and engaging user experiences for digital products.",
    averageSalary: "$75,000 - $120,000",
    growthRate: "+13%",
    demandLevel: "High",
    requiredSkills: [
      "Figma",
      "User Research",
      "Prototyping",
      "Design Systems",
      "HTML/CSS",
    ],
    education: "Bachelor's in Design/HCI",
    workEnvironment: "Office/Remote",
    jobOutlook: "Faster than average",
    relatedCareers: ["UI Designer", "Product Designer", "Interaction Designer"],
  },
  {
    id: "4",
    title: "Product Manager",
    category: "Business",
    description:
      "Guide product development from conception to launch and beyond.",
    averageSalary: "$110,000 - $180,000",
    growthRate: "+19%",
    demandLevel: "High",
    requiredSkills: [
      "Product Strategy",
      "Analytics",
      "Agile",
      "Leadership",
      "Market Research",
    ],
    education: "Bachelor's in Business/Engineering",
    workEnvironment: "Office/Hybrid",
    jobOutlook: "Faster than average",
    relatedCareers: [
      "Project Manager",
      "Business Analyst",
      "Strategy Consultant",
    ],
  },
  {
    id: "5",
    title: "Digital Marketing Manager",
    category: "Marketing",
    description:
      "Develop and execute digital marketing strategies across various channels.",
    averageSalary: "$65,000 - $110,000",
    growthRate: "+10%",
    demandLevel: "Medium",
    requiredSkills: [
      "SEO",
      "Google Analytics",
      "Social Media",
      "Content Marketing",
      "PPC",
    ],
    education: "Bachelor's in Marketing/Communications",
    workEnvironment: "Office/Remote",
    jobOutlook: "Average",
    relatedCareers: [
      "Content Manager",
      "SEO Specialist",
      "Social Media Manager",
    ],
  },
  {
    id: "6",
    title: "Cybersecurity Analyst",
    category: "Technology",
    description:
      "Protect organizations from cyber threats and security breaches.",
    averageSalary: "$85,000 - $130,000",
    growthRate: "+33%",
    demandLevel: "High",
    requiredSkills: [
      "Network Security",
      "Incident Response",
      "Risk Assessment",
      "CISSP",
      "Penetration Testing",
    ],
    education: "Bachelor's in Cybersecurity/IT",
    workEnvironment: "Office",
    jobOutlook: "Much faster than average",
    relatedCareers: [
      "Security Engineer",
      "Ethical Hacker",
      "Security Consultant",
    ],
  },
];

const categories = [
  "All",
  "Technology",
  "Design",
  "Business",
  "Marketing",
  "Healthcare",
  "Finance",
];
const sortOptions = [
  { value: "salary-high", label: "Salary (High to Low)" },
  { value: "salary-low", label: "Salary (Low to High)" },
  { value: "growth", label: "Growth Rate" },
  { value: "demand", label: "Demand Level" },
  { value: "title", label: "Title A-Z" },
];

export default function ExploreCareersPage() {
  const [careers] = useState<Career[]>(mockCareers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("demand");
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);

  const filteredCareers = careers
    .filter((career) => {
      const matchesSearch =
        career.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (career.requiredSkills ?? []).some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesCategory =
        selectedCategory === "All" || career.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const parseSalary = (salary: string | undefined, high: boolean) => {
        if (!salary) return 0;
        const parts = salary.split(" - ");
        const targetPart = high ? parts[1] : parts[0];
        return Number.parseInt(targetPart?.replace(/[^0-9]/g, "") ?? "0");
      };

      const parseGrowth = (growth: string | undefined) =>
        Number.parseInt(growth?.replace("%", "") ?? "0");

      switch (sortBy) {
        case "salary-high":
          return (
            parseSalary(b.averageSalary, true) -
            parseSalary(a.averageSalary, true)
          );
        case "salary-low":
          return (
            parseSalary(a.averageSalary, false) -
            parseSalary(b.averageSalary, false)
          );
        case "growth":
          return parseGrowth(b.growthRate) - parseGrowth(a.growthRate);
        case "demand":
          const demandOrder: Record<string, number> = {
            High: 3,
            Medium: 2,
            Low: 1,
          };
          return (
            (demandOrder[b.demandLevel ?? "Low"] ?? 1) -
            (demandOrder[a.demandLevel ?? "Low"] ?? 1)
          );
        case "title":
          return (a.title ?? "").localeCompare(b.title ?? "");
        default:
          return 0;
      }
    });

  const getDemandColor = (level: string) => {
    switch (level) {
      case "High":
        return "text-green-400 bg-green-900/40 border-green-800/50";
      case "Medium":
        return "text-yellow-400 bg-yellow-900/40 border-yellow-800/50";
      case "Low":
        return "text-red-400 bg-red-900/40 border-red-800/50";
      default:
        return "text-slate-400 bg-slate-800/40 border-slate-700/50";
    }
  };
  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-purple-500/8 blur-3xl delay-1000"></div>

      <SidebarInset className="relative z-10 w-full flex-1">
        <div className="flex h-full w-full flex-col bg-slate-950">
          {/* Header */}
          <div className="border-b border-slate-800/50 bg-slate-800/10 bg-gradient-to-b from-fuchsia-900/10 backdrop-blur-xl">
            <div className="flex items-center justify-between px-6 py-2">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="rounded-lg border border-slate-600/30 bg-slate-800/50 p-2 text-slate-300 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-950/50 hover:text-blue-300 md:hidden" />
                <div className="flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-blue-400" />
                  <div>
                    <h1 className="text-base font-bold text-white">
                      Explore Careers
                    </h1>
                    <p className="text-sm text-slate-400">
                      Discover career paths and opportunities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="border-b border-slate-800/50 backdrop-blur-sm">
            <div className="px-6 py-2">
              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                  <Input
                    placeholder="Search careers, skills, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-slate-700/50 bg-slate-800/50 pl-10 text-sm text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                {/* Category Filter */}
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full border-slate-700/50 bg-slate-800/50 text-sm text-slate-100 sm:w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-slate-700 bg-slate-800">
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="text-sm"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full border-slate-700/50 bg-slate-800/50 text-sm text-slate-100 sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-slate-700 bg-slate-800">
                    {sortOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-sm"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex h-full">
              {/* Career List */}
              <div className="flex-1 px-6 py-4">
                <div className="mx-auto max-w-4xl">
                  <div className="mb-4">
                    <p className="text-sm text-slate-400">
                      {filteredCareers.length} career
                      {filteredCareers.length !== 1 ? "s" : ""} found
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {filteredCareers.map((career) => (
                      <Card
                        key={career.id}
                        className={`group cursor-pointer gap-0 border p-0 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/20 ${
                          selectedCareer?.id === career.id
                            ? "border-blue-500/50 bg-blue-950/30 shadow-lg shadow-blue-600/20"
                            : "border-slate-700/50 bg-slate-900/60 hover:border-blue-500/50"
                        }`}
                        onClick={() => setSelectedCareer(career)}
                      >
                        <CardContent className="relative p-4">
                          {/* Subtle glow effect on hover */}
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                          <div className="relative z-10">
                            {/* Header */}
                            <div className="mb-3 flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <h3 className="mb-1 truncate text-base font-semibold text-slate-100">
                                  {career.title}
                                </h3>
                                <Badge className="border-slate-700/50 bg-slate-800/50 text-xs text-slate-300">
                                  {career.category}
                                </Badge>
                              </div>
                              <Badge
                                className={`text-xs ${getDemandColor(career.demandLevel)}`}
                              >
                                {career.demandLevel} Demand
                              </Badge>
                            </div>

                            {/* Description */}
                            <p className="mb-3 line-clamp-2 text-sm text-slate-400">
                              {career.description}
                            </p>

                            {/* Stats */}
                            <div className="mb-3 grid grid-cols-2 gap-3">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-400" />
                                <span className="text-xs text-slate-300">
                                  {career.averageSalary}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-blue-400" />
                                <span className="text-xs text-slate-300">
                                  {career.growthRate} growth
                                </span>
                              </div>
                            </div>

                            {/* Skills */}
                            <div className="mb-3 flex flex-wrap gap-1">
                              {career.requiredSkills
                                .slice(0, 3)
                                .map((skill, index) => (
                                  <Badge
                                    key={index}
                                    className="border-blue-800/50 bg-blue-900/40 text-xs text-blue-300"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              {career.requiredSkills.length > 3 && (
                                <Badge className="border-slate-700/50 bg-slate-800/40 text-xs text-slate-400">
                                  +{career.requiredSkills.length - 3}
                                </Badge>
                              )}
                            </div>

                            {/* View Details */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <BookOpen className="h-3 w-3" />
                                {career.education}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
                                View Details
                                <ArrowRight className="h-3 w-3" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Career Details Panel */}
              {selectedCareer && (
                <div className="w-80 border-l border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
                  <div className="h-full overflow-y-auto p-4">
                    <div className="space-y-4">
                      {/* Header */}
                      <div>
                        <h2 className="mb-2 text-lg font-bold text-white">
                          {selectedCareer.title}
                        </h2>
                        <div className="mb-3 flex items-center gap-2">
                          <Badge className="border-slate-700/50 bg-slate-800/50 text-xs text-slate-300">
                            {selectedCareer.category}
                          </Badge>
                          <Badge
                            className={`text-xs ${getDemandColor(selectedCareer.demandLevel)}`}
                          >
                            {selectedCareer.demandLevel} Demand
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400">
                          {selectedCareer.description}
                        </p>
                      </div>

                      {/* Key Stats */}
                      <Card className="border-slate-700/50 bg-slate-800/30">
                        <CardContent className="p-3">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-400" />
                              <div>
                                <p className="text-xs text-slate-400">
                                  Average Salary
                                </p>
                                <p className="text-sm font-medium text-slate-200">
                                  {selectedCareer.averageSalary}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-blue-400" />
                              <div>
                                <p className="text-xs text-slate-400">
                                  Growth Rate
                                </p>
                                <p className="text-sm font-medium text-slate-200">
                                  {selectedCareer.growthRate}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-purple-400" />
                              <div>
                                <p className="text-xs text-slate-400">
                                  Work Environment
                                </p>
                                <p className="text-sm font-medium text-slate-200">
                                  {selectedCareer.workEnvironment}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Required Skills */}
                      <div>
                        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                          <Target className="h-4 w-4 text-blue-400" />
                          Required Skills
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {selectedCareer.requiredSkills.map((skill, index) => (
                            <Badge
                              key={index}
                              className="border-blue-800/50 bg-blue-900/40 text-xs text-blue-300"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Education */}
                      <div>
                        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                          <BookOpen className="h-4 w-4 text-green-400" />
                          Education
                        </h3>
                        <p className="text-sm text-slate-300">
                          {selectedCareer.education}
                        </p>
                      </div>

                      {/* Job Outlook */}
                      <div>
                        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                          <BarChart3 className="h-4 w-4 text-yellow-400" />
                          Job Outlook
                        </h3>
                        <p className="text-sm text-slate-300">
                          {selectedCareer.jobOutlook}
                        </p>
                      </div>

                      {/* Related Careers */}
                      <div>
                        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                          <Users className="h-4 w-4 text-purple-400" />
                          Related Careers
                        </h3>
                        <div className="space-y-1">
                          {selectedCareer.relatedCareers.map(
                            (related, index) => (
                              <p
                                key={index}
                                className="cursor-pointer text-sm text-blue-400 hover:text-blue-300"
                              >
                                {related}
                              </p>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2 border-t border-slate-700/50 pt-4">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-sm text-white shadow-lg shadow-blue-600/25 hover:from-blue-700 hover:to-blue-800">
                          <Star className="mr-2 h-4 w-4" />
                          Save Career
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-slate-600/50 bg-slate-800/30 text-sm text-slate-300 hover:bg-slate-800/50"
                        >
                          <Search className="mr-2 h-4 w-4" />
                          Find Jobs
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}
