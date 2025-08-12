import type { Job, Message } from "@/app/(auth-check)/(with-sidebar)/chat/page";
import type { CVAnalysis } from "@/app/(auth-check)/(with-sidebar)/resume-review/page";
import type { SavedJob } from "@/app/(auth-check)/(with-sidebar)/saved-jobs/page";
import type { UserProfileForm } from "./schema";

export const createConversation = async () => {
  const res = await fetch("/api/chat/init", {
    method: "POST",
  });

  if (!res.ok || !res.body) {
    throw new Error("Failed to create conversation");
  }

  return res;
};

export const getConversation = async (conversationId: string) => {
  const res = await fetch(`/api/messages?conversationId=${conversationId}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch conversation: ${res.statusText}`);
  }

  return (await res.json()) as Message[];
};

export const getJobsRecommendation = async (
  conversationId: string,
  currentInput: string,
) => {
  const res = await fetch(
    `/api/chat/get-jobs?convId=${conversationId}&userMsg=${currentInput}`,
    {
      method: "GET",
    },
  );

  return (await res.json()) as { data: Message };
};

export const sendMessage = async (userMessage: Message) => {
  const res = await fetch(`/api/messages`, {
    method: "POST",
    body: JSON.stringify(userMessage),
  });

  if (!res.ok) {
    throw new Error("Denied");
  }

  return res;
};

export const getSavedJobs = async () => {
  const res = await fetch("/api/saved-jobs");

  if (!res.ok) {
    throw new Error("Failed to get saved jobs");
  }

  return (await res.json()) as { jobs: SavedJob[] };
};

export const removeSavedJobs = async (jobId: string) => {
  const res = await fetch("/api/saved-jobs", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: jobId }),
  });

  if (!res.ok) {
    throw new Error("Failed remove jobs from bookmark");
  }
};

export const saveJob = async (job: Job) => {
  const res = await fetch("/api/saved-jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });

  if (!res.ok) {
    throw new Error("Bookmark failed");
  }
};

export const submitResumeForReview = async (userCV: string) => {
  const res = await fetch("/api/resume-review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userCV }),
  });

  if (!res.ok) {
    throw new Error("Failed reviewing your resume");
  }

  return (await res.json()) as {
    data: CVAnalysis;
  };
};

export const createUserProfile = async (formData: UserProfileForm) => {
  const res = await fetch("/api/user/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  return (await res.json()) as {
    status: boolean;
    message?: string;
  };
};

export const getUserProfile = async () => {
  const res = await fetch("/api/user/profile", { method: "GET" });

  if (!res.ok) {
    throw new Error("Failed get user profile");
  }

  return (await res.json()) as UserProfileForm;
};

export const updateUserProfile = async (userProfileData: UserProfileForm) => {
  const res = await fetch("/api/user/profile", {
    method: "PATCH",
    body: JSON.stringify(userProfileData),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }
};
