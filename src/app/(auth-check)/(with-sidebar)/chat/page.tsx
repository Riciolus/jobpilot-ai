"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import {
  Send,
  Mic,
  Upload,
  User,
  Briefcase,
  MapPin,
  DollarSign,
  Brain,
  Search,
  TrendingUp,
  BarChart3,
  HelpCircle,
  CalendarSearch,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { cn, fetchOrCreateConversation } from "@/lib/utils";
import ReactMarkdown, { type Components } from "react-markdown";
import Link from "next/link";

export interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  link: string;
}

export interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  type: "text" | "career-suggestion" | "job-card";
  conversationId: string;
  metadata?: { jobs: Job[] };
}

type ReactMarkdownProps = ComponentProps<typeof ReactMarkdown> & {
  className?: string;
};

const suggestions = [
  {
    text: "Give me jobs recommendation",
    icon: Search,
  },
  {
    text: "What skills should I learn next?",
    icon: TrendingUp,
  },
  {
    text: "How do I network effectively?",
    icon: BarChart3,
  },
  {
    text: "Any tips for interviews?",
    icon: CalendarSearch,
  },
];

function isJobSearchIntent(message: string): boolean {
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

const Markdown = ({ className, ...props }: ReactMarkdownProps) => (
  <div className={className}>
    <ReactMarkdown {...props} />
  </div>
);

const MarkdownComponents: Components = {
  p: ({ children }) => <p className="mb-4">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),

  // Style headers
  h1: ({ children }) => <h1 className="mb-2 text-2xl font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-2 text-xl font-bold">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 text-sm font-bold">{children}</h3>,

  // Style lists
  ul: ({ children }) => <ul className="mb-2 ml-4 list-disc">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal">{children}</ol>,

  // Style code blocks
  code: ({ children }) => (
    <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">
      {children}
    </code>
  ),

  // Style blockquotes
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic dark:border-gray-600">
      {children}
    </blockquote>
  ),
};

const MessageContent = ({ content }: { content: string }) => (
  <Markdown
    className="prose dark:prose-invert prose-sm max-w-none text-sm md:text-[15.5px]"
    components={MarkdownComponents}
  >
    {content}
  </Markdown>
);

export default function ChatInterface() {
  const [conversationId, setConversationId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void (async () => {
      try {
        setIsTyping(true);
        const id = await fetchOrCreateConversation(setMessages);
        setConversationId(id);
      } catch (err) {
        console.error("Failed to get conversation:", err);
      } finally {
        setIsTyping(() => false);
      }
    })();
  }, []);

  useEffect(() => {
    void (async () => {
      if (!conversationId) return;

      try {
        const res = await fetch(
          `/api/messages?conversationId=${conversationId}`,
        );
        const data = (await res.json()) as Message[];
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [conversationId]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = async (messageInput?: string) => {
    const currentInput = messageInput ?? input;

    if (!currentInput.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: currentInput,
      type: "text",
      conversationId,
    };

    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // 👇 Insert this block before sending to /api/messages
    if (isJobSearchIntent(currentInput)) {
      const res = await fetch(
        `/api/chat/get-jobs?convId=${conversationId}&userMsg=${currentInput}`,
        {
          method: "GET",
        },
      );

      const messagePayload = (await res.json()) as { data: Message };

      setMessages((prev) => [...prev, messagePayload.data]);
      setIsTyping(false);
      return;
    }

    const empytAssistantMessage: Message = {
      role: "assistant",
      content: "",
      type: "text",
      conversationId,
    };

    setMessages((prev) => [...prev, empytAssistantMessage]);

    try {
      const res = await fetch(`/api/messages`, {
        method: "POST",
        body: JSON.stringify(userMessage),
      });

      if (!res.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
        throw new Error("Denied");
      }

      setIsTyping(() => false);

      const reader = res?.body?.getReader();
      if (!reader) throw new Error("Response body is null");

      const decoder = new TextDecoder("utf-8");
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullText += chunk;

        // Step 2: Update assistant message content as it streams in
        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;

          updated[lastIndex] = {
            ...updated[lastIndex]!,
            content: fullText,
          };

          return updated;
        });
      }
    } catch (err) {
      console.log("Failed to create messages:", err);
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === "user";

    if (message.content.trim() === "") {
      return null;
    }

    return (
      <div
        className={cn(
          "mb-6 flex gap-3",
          isUser
            ? "justify-end"
            : "flex-col items-center justify-center md:flex-row md:justify-start",
        )}
      >
        {!isUser && (
          <div className="self-start">
            <Avatar className="mt-1 h-8 w-8 shadow-lg shadow-blue-600/20 ring-blue-500/20">
              <AvatarFallback className="border border-blue-800/50 bg-gradient-to-br from-blue-900/80 to-blue-800/60 text-blue-300 backdrop-blur-sm">
                <Brain className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        <div
          className={cn("max-w-full md:max-w-[80%]", isUser && "order-first")}
        >
          <div
            className={cn(
              "rounded-2xl backdrop-blur-sm",
              isUser
                ? "bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white shadow-xl ring-1 shadow-blue-600/30 ring-blue-500/30"
                : [
                    "text-slate-100 shadow-lg shadow-black/20",
                    message.type !== "job-card"
                      ? "border border-slate-700/50 bg-slate-800/80 px-4 py-3"
                      : "p-0",
                  ],
            )}
          >
            {message.type === "job-card" ? (
              <div>
                <div className="mb-5 space-y-3">
                  <p className="my-3 text-[15px]">{message.content}</p>
                </div>
                <div className="grid grid-cols-1 gap-3 px-3 md:grid-cols-2 md:px-0">
                  {message.metadata?.jobs?.map((job: Job, index: number) => (
                    <Card
                      key={index}
                      className="group h-full cursor-pointer border border-slate-700/50 bg-slate-900/60 p-0 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-600/20"
                    >
                      <CardContent className="relative flex h-full flex-col p-3">
                        {/* Subtle glow effect on hover */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                        <div className="relative z-10 mb-2 flex flex-1 items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <Link href={job.link} target="_blank">
                                <h4 className="flex items-center gap-2 font-semibold text-slate-100">
                                  <Briefcase className="h-4 w-4 flex-shrink-0 text-blue-400 drop-shadow-sm" />
                                  <span className="truncate text-sm hover:text-amber-100 hover:underline hover:underline-offset-4">
                                    {job.title}
                                  </span>
                                </h4>
                              </Link>

                              <Bookmark className="h-4 w-4 text-slate-300" />
                            </div>
                            <p className="truncate text-sm text-slate-400">
                              {job.company}
                            </p>
                          </div>
                        </div>

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

                        <div className="relative z-10 flex flex-wrap gap-1">
                          {job.tags
                            .slice(0, 3)
                            .map((tag: string, tagIndex: number) => (
                              <Badge
                                key={tagIndex}
                                className="border-blue-800/50 bg-blue-900/40 text-xs text-blue-300 shadow-sm backdrop-blur-sm hover:bg-blue-800/50"
                              >
                                {tag}
                              </Badge>
                            ))}
                          {job.tags.length > 3 && (
                            <Badge className="border-slate-600/50 bg-slate-800/40 text-xs text-slate-400">
                              +{job.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-1 text-left">
                  <span className="text-xs font-medium text-blue-300">
                    Jobs from{" "}
                    <Link className="hover:underline" href="https://glints.com">
                      Glints
                    </Link>
                  </span>
                </div>
              </div>
            ) : message.role === "assistant" ? (
              <MessageContent content={message.content} />
            ) : (
              <div className="text-sm whitespace-pre-wrap">
                {message.content}
              </div>
            )}
          </div>
        </div>
        {isUser && (
          <Avatar className="mt-1 h-8 w-8 shadow-lg ring-1 shadow-blue-600/20 ring-blue-500/30">
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-purple-500/8 blur-3xl delay-1000"></div>

      <SidebarInset className="relative z-10 w-full flex-1">
        <div className="flex h-full w-full flex-col bg-slate-950">
          <BetaBanner />

          {/* Chat Messages */}
          {!loading ? (
            <div
              ref={containerRef}
              className="-bottom-36 flex flex-1 justify-center overflow-y-auto px-3 py-6 md:p-6"
            >
              <div className="w-full max-w-5xl">
                {messages.map((message) => renderMessage(message))}

                {isTyping && (
                  <div className="mb-6 flex gap-3 pb-6">
                    <Avatar className="mt-1 h-8 w-8 shadow-lg ring-1 shadow-blue-600/20 ring-blue-500/20">
                      <AvatarFallback className="border border-blue-800/50 bg-gradient-to-br from-blue-900/80 to-blue-800/60 text-blue-300 backdrop-blur-sm">
                        <Brain className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/80 px-4 py-3 shadow-lg shadow-black/20 backdrop-blur-sm">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400 shadow-sm shadow-blue-400/50"></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-blue-400 shadow-sm shadow-blue-400/50"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-blue-400 shadow-sm shadow-blue-400/50"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-12 mb-6 flex justify-end gap-3 pb-6">
                  {suggestion && (
                    <div className="order-first max-w-[80%] opacity-80 hover:opacity-100">
                      <Card className="group rounded-2xl border border-slate-700/50 bg-slate-900/60 p-0 text-white shadow-sm ring-1 shadow-blue-600/30 ring-blue-900/10 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-600/20">
                        <div className="space-y-3">
                          <CardContent className="relative p-3">
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                            <div className="relative z-10 mb-3 flex items-center justify-start gap-2 text-sm">
                              <HelpCircle className="h-4 w-4 text-slate-200" />
                              <h4 className="flex items-center gap-2 font-semibold text-slate-100">
                                Try asking :
                              </h4>
                            </div>

                            <div className="relative z-10 flex flex-col flex-wrap gap-2">
                              {suggestions.map((suggestion, index) => (
                                <Badge
                                  key={index}
                                  onClick={() => handleSend(suggestion.text)}
                                  className={cn(
                                    "flex cursor-pointer gap-3 border-blue-800/40 bg-blue-900/30 px-2 py-1 text-sm font-normal text-blue-300 shadow-sm backdrop-blur-sm hover:bg-blue-800/50",
                                    suggestion.text ===
                                      "Give me jobs recommendation" &&
                                      "border-yellow-600/40 bg-amber-300/30 text-amber-400 hover:bg-yellow-400/50",
                                  )}
                                >
                                  <suggestion.icon
                                    className={cn(
                                      "h-4 w-4 text-blue-400 drop-shadow-sm",
                                      suggestion.text ===
                                        "Give me jobs recommendation" &&
                                        "text-yellow-500",
                                    )}
                                  />

                                  {suggestion.text}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-950"></div>
          )}
          {/* Input Area */}
          <div className="relative">
            <div className="animate-pin absolute -bottom-36 left-1/4 h-56 w-96 animate-pulse rounded-full bg-fuchsia-400/30 blur-3xl"></div>
            <div className="animate-pin absolute right-1/4 -bottom-36 h-56 w-72 animate-pulse rounded-full bg-yellow-400/30 blur-3xl"></div>
            <div className="mx-auto mb-0 h-fit max-w-5xl md:mb-3">
              <div className="rounded-t-2xl border border-slate-700/50 bg-slate-900/80 shadow-2xl ring-1 shadow-black/20 ring-slate-800/50 backdrop-blur-xl md:rounded-2xl">
                <div className="p-4">
                  <div className="flex items-end gap-3">
                    <div className="relative flex-1">
                      <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about your career..."
                        className="max-h-32 min-h-[48px] w-full resize-none overflow-y-auto bg-transparent py-3 pr-20 pl-4 text-sm text-slate-100 outline-none placeholder:text-slate-400 focus:ring-0"
                        disabled={isTyping}
                        rows={1}
                      />
                      <div className="absolute top-3 right-2 flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 backdrop-blur-sm hover:bg-slate-700/50 hover:text-blue-400"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 backdrop-blur-sm hover:bg-slate-700/50 hover:text-blue-400"
                        >
                          <Mic className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => setSuggestion((prev) => !prev)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 backdrop-blur-sm hover:bg-slate-700/50 hover:text-blue-400"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isTyping}
                      className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white shadow-lg ring-1 shadow-blue-600/30 ring-blue-500/20 transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:ring-blue-400/30"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Model Info */}
                <div className="border-t border-slate-700/50 px-4 py-2">
                  <div className="w-fit cursor-pointer rounded-md border border-slate-600/30 bg-blue-500/10 px-3 py-1 backdrop-blur-sm">
                    <Link
                      href="https://www.ibm.com/granite"
                      className="text-xs text-slate-400"
                    >
                      ibm-granite/granite-3.3-8b-instruct
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}

const BetaBanner = () => {
  return (
    <div className="from-5%% border-b border-slate-800/50 bg-gradient-to-r from-blue-400/40 via-purple-900/40 to-blue-900/60 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <SidebarTrigger className="rounded-lg border border-slate-600/30 bg-slate-800/50 p-2 text-slate-300 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-950/50 hover:text-blue-300 md:hidden" />
        <p className="flex-1 text-center text-sm text-slate-300">
          <span className="font-medium text-blue-400 drop-shadow-sm">
            Beta:
          </span>{" "}
          Powered by
          <span className="ml-1 font-medium text-purple-400">Granite AI</span>
        </p>
        <div className="w-10 md:hidden"></div> {/* Spacer for centering */}
      </div>
    </div>
  );
};
