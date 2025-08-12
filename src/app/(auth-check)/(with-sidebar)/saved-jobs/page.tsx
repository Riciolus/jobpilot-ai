"use client";

import { useEffect, useState } from "react";
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
  Briefcase,
  MapPin,
  DollarSign,
  Bookmark,
  BookmarkX,
  Search,
  Filter,
  Calendar,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import type { Job } from "../chat/page";
import { getSavedJobs, removeSavedJobs } from "@/lib/api";

export interface SavedJob extends Job {
  id: string;
  savedAt: string; // or Date if you're using actual Date objects
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    void (async () => {
      try {
        const data = await getSavedJobs();
        setSavedJobs(data.jobs);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const removeJob = async (jobId: string) => {
    try {
      await removeSavedJobs(jobId);
      setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAndSortedJobs = savedJobs
    .filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      if (filterBy === "all") return matchesSearch;
      if (filterBy === "remote")
        return matchesSearch && job.location.toLowerCase().includes("remote");
      if (filterBy === "onsite")
        return matchesSearch && !job.location.toLowerCase().includes("remote");

      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      if (sortBy === "oldest")
        return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "company") return a.company.localeCompare(b.company);
      return 0;
    });

  return (
    <div className="relative flex h-screen w-full overflow-hidden text-sm">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-purple-500/8 blur-3xl delay-1000"></div>

      <SidebarInset className="relative z-10 w-full flex-1">
        <div className="flex h-full w-full flex-col bg-slate-950">
          {/* Header */}
          <div className="to border-b border-slate-800/50 bg-slate-800/10 bg-gradient-to-b from-fuchsia-900/10 backdrop-blur-xl">
            <div className="flex items-center justify-between px-6 py-2">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="rounded-lg border border-slate-600/30 bg-slate-800/50 p-2 text-slate-300 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-950/50 hover:text-blue-300 md:hidden" />
                <div className="flex items-center gap-3">
                  <Bookmark className="h-6 w-6 text-blue-400" />
                  <div>
                    <h1 className="text-base font-bold text-white">
                      Saved Jobs
                    </h1>
                    <p className="text-sm text-slate-400">
                      {savedJobs.length} jobs saved
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="border-b border-slate-800/50 backdrop-blur-sm">
            <div className="px-6 py-2">
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                  <Input
                    placeholder="Search jobs, companies, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-slate-700/50 bg-slate-800/50 pl-10 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                {/* Filter */}
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="border-slate-700/50 bg-slate-800/50 text-slate-100 sm:w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-slate-700 bg-slate-800 text-slate-100">
                    <SelectItem value="all">All Jobs</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full border-slate-700/50 bg-slate-800/50 text-slate-100 sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-slate-700 bg-slate-800 text-slate-100">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="title">By Title</SelectItem>
                    <SelectItem value="company">By Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {filteredAndSortedJobs.length === 0 ? (
              <EmptyState hasJobs={savedJobs.length > 0} />
            ) : (
              <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {filteredAndSortedJobs.map((job) => (
                    <SavedJobCard key={job.id} job={job} onRemove={removeJob} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}

function SavedJobCard({
  job,
  onRemove,
}: {
  job: SavedJob;
  onRemove: (id: string) => void;
}) {
  return (
    <Card className="group cursor-pointer border border-slate-700/50 bg-slate-900/60 p-0 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-600/20">
      <CardContent className="relative p-4">
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

        {/* Header with actions */}
        <div className="relative z-10 mb-3 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <Link href={job.link}>
              <h4 className="mb-1 flex items-center gap-2 font-semibold text-slate-100">
                <Briefcase className="h-4 w-4 flex-shrink-0 text-blue-400 drop-shadow-sm" />
                <span className="truncate hover:text-amber-100 hover:underline hover:underline-offset-4">
                  {job.title}
                </span>
              </h4>
            </Link>
            <p className="truncate text-sm text-slate-400">{job.company}</p>
          </div>

          {/* Action buttons */}
          <div className="ml-3 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onRemove(job.id);
              }}
              className="h-8 w-8 p-0 text-slate-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-950/30 hover:text-red-400"
            >
              <BookmarkX className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Job details */}
        <div className="relative z-10 mb-3 flex items-center gap-4 text-sm text-slate-400">
          <span className="flex min-w-0 flex-1 items-center gap-1">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </span>
          <span className="flex flex-shrink-0 items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span className="text-xs">{job.salary}</span>
          </span>
        </div>

        {/* Tags */}
        <div className="relative z-10 mb-3 flex flex-wrap gap-1">
          {job.tags.slice(0, 4).map((tag, index) => (
            <Badge
              key={index}
              className="border-blue-800/50 bg-blue-900/40 text-xs text-blue-300 shadow-sm backdrop-blur-sm hover:bg-blue-800/50"
            >
              {tag}
            </Badge>
          ))}
          {job.tags.length > 4 && (
            <Badge className="border-slate-600/50 bg-slate-800/40 text-xs text-slate-400">
              +{job.tags.length - 4}
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Saved {new Date(job.savedAt).toLocaleDateString()}
          </span>
          <Link
            href={job.link}
            target="_blank"
            className="flex items-center gap-1 transition-colors hover:text-blue-400"
          >
            <ExternalLink className="h-3 w-3" />
            View Job
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ hasJobs }: { hasJobs: boolean }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg shadow-black/20">
        {hasJobs ? (
          <Search className="h-8 w-8 text-slate-400" />
        ) : (
          <Bookmark className="h-8 w-8 text-slate-400" />
        )}
      </div>

      <h3 className="mb-1.5 text-base font-semibold text-slate-300">
        {hasJobs ? "No jobs match your search" : "No saved jobs yet"}
      </h3>

      <p className="mb-4 text-sm text-slate-400">
        {hasJobs
          ? "Try adjusting your search terms or filters to find what you're looking for."
          : "Start chatting with our AI to discover job opportunities and save the ones you like."}
      </p>

      <Link href="/chat">
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg ring-1 shadow-blue-600/25 ring-blue-500/20 hover:from-blue-700 hover:to-blue-800">
          <Search className="mr-2 h-4 w-4" />
          Find Jobs
        </Button>
      </Link>
    </div>
  );
}
