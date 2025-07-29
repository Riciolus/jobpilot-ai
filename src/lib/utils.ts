import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type initResponse = {
  alreadyInitialized: boolean;
  conversationId: string;
};

export async function fetchOrCreateConversation(): Promise<string> {
  let convId = localStorage.getItem("conversationId");

  if (convId) return convId;

  const res = await fetch("/api/chat/init", {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to create conversation");
  }

  const data = (await res.json()) as initResponse;
  console.log(data);

  convId = data.conversationId;

  localStorage.setItem("conversationId", convId);
  return convId;
}
