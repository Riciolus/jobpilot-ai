import type { Message } from "@/app/(auth-check)/(with-sidebar)/chat/page";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchOrCreateConversation(
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
): Promise<string> {
  const convId = localStorage.getItem("conversationId");
  if (convId) return convId;

  const res = await fetch("/api/chat/init", {
    method: "POST",
  });

  if (!res.ok || !res.body) {
    throw new Error("Failed to create conversation");
  }

  const newConvId = res.headers.get("x-conversation-id");
  if (!newConvId) throw new Error("Missing conversation ID");

  localStorage.setItem("conversationId", newConvId);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let assistantContent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    assistantContent += chunk;

    setMessages((prev) => {
      const existingAssistant = prev.find(
        (msg) => msg.role === "assistant" && msg.id === "streaming",
      );
      if (existingAssistant) {
        return prev.map((msg) =>
          msg.id === "streaming" ? { ...msg, content: assistantContent } : msg,
        );
      } else {
        return [
          ...prev,
          {
            id: "streaming",
            role: "assistant",
            content: chunk,
            type: "text",
            conversationId: newConvId,
          },
        ];
      }
    });
  }

  return newConvId;
}
