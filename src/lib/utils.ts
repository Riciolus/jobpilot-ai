import type { Message } from "@/app/(auth-check)/(with-sidebar)/chat/page";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createConversation } from "./api";
import * as mammoth from "mammoth";
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
} from "pdfjs-dist";
import type { TextContent } from "pdfjs-dist/types/src/display/api";
// Needed to avoid CORS issues
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isJobSearchIntent(message: string): boolean {
  const lowered = message.toLowerCase();

  // More relaxed keyword check
  const jobKeywords = [
    "job",
    "jobs",
    "position",
    "vacancy",
    "hiring",
    "opening",
    "looking for",
  ];
  const likelyIntent = jobKeywords.some((kw) => lowered.includes(kw));

  // Less strict question detection: only block classic informational questions
  const likelyNotSearch =
    lowered.startsWith("how ") ||
    lowered.startsWith("why ") ||
    lowered.startsWith("can i ") ||
    lowered.endsWith("?");

  // Let ambiguous ones pass through to LLM layer
  return likelyIntent && !likelyNotSearch;
}

export async function fetchOrCreateConversation(
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
): Promise<string> {
  const convId = localStorage.getItem("conversationId");
  if (convId) return convId;

  const res = await createConversation();

  let newConvId: string;
  let alreadyInitialized = false;

  if (res.headers.get("content-type")?.includes("application/json")) {
    const data = (await res.json()) as {
      alreadyInitialized: boolean;
      conversationId: string;
    };
    newConvId = res.headers.get("x-conversation-id") ?? data.conversationId;
    alreadyInitialized = data.alreadyInitialized;
  } else {
    newConvId = res.headers.get("x-conversation-id") ?? "";
  }

  localStorage.setItem("conversationId", newConvId);

  // Only stream if not already initialized
  if (!alreadyInitialized) {
    const reader = res.body?.getReader();
    if (!reader) throw new Error("No readable stream found");

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
            msg.id === "streaming"
              ? { ...msg, content: assistantContent }
              : msg,
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
  }

  return newConvId;
}

const parseDocxFile = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const { value: html } = await mammoth.extractRawText({ arrayBuffer });

  return html;
};

const parsePdfFile = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf: PDFDocumentProxy = await getDocument({ data: arrayBuffer })
    .promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content: TextContent = await page.getTextContent();

    const pageText = content.items
      .map((item) => {
        if ("str" in item) return item.str;
        return "";
      })
      .join(" ");

    text += pageText + "\n";
  }

  return text;
};

export const parseCVFile = async (file: File) => {
  const mime = file.type;
  if (mime === "application/pdf") return await parsePdfFile(file);
  if (
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mime === "application/msword"
  ) {
    return await parseDocxFile(file);
  }
  throw new Error("Unsupported file type");
};
