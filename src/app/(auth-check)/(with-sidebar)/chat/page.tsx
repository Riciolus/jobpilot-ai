"use client";

import { useEffect, useRef, useState } from "react";
import {
  Send,
  Mic,
  Upload,
  User,
  Bot,
  Briefcase,
  MapPin,
  DollarSign,
  Brain,
  Search,
  TrendingUp,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { fetchOrCreateConversation } from "@/lib/utils";

interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "career-suggestion" | "job-card";
  metadata?: { jobs: Job[] };
}

const suggestions = [
  {
    text: "Search me a job that suits me",
    icon: Search,
  },
  {
    text: "What skills should I learn next?",
    icon: TrendingUp,
  },
  {
    text: "Show me my career growth",
    icon: BarChart3,
  },
  {
    text: "I want to switch industries",
    icon: RefreshCw,
  },
];

export default function ChatInterface() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    void (async () => {
      try {
        const id = await fetchOrCreateConversation();
        setConversationId(id);
      } catch (err) {
        console.error("Failed to get conversation:", err);
      }
    })(); // ← this is correct
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
        console.log("Messages fetched:", data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    })();
  }, [conversationId]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setIsTyping(true);
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "That's a great question! Let me help you with that. Based on your background and goals, I'd recommend focusing on building a strong foundation in data analysis first, then gradually moving into more advanced machine learning concepts.",
        type: "text",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
    return (
      <div
        key={message.id}
        className={`mb-6 flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
      >
        {!isUser && (
          <Avatar className="mt-1 h-8 w-8 shadow-lg ring-1 shadow-blue-600/20 ring-blue-500/20">
            <AvatarFallback className="border border-blue-800/50 bg-gradient-to-br from-blue-900/80 to-blue-800/60 text-blue-300 backdrop-blur-sm">
              <Brain className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
        <div className={`max-w-[80%] ${isUser ? "order-first" : ""}`}>
          <div
            className={`rounded-2xl px-4 py-3 backdrop-blur-sm ${
              isUser
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl ring-1 shadow-blue-600/30 ring-blue-500/30"
                : "border border-slate-700/50 bg-slate-800/80 text-slate-100 shadow-lg shadow-black/20"
            }`}
          >
            {message.type === "career-suggestion" ? (
              <div className="space-y-2">
                {message.content.split("\n").map((line, index) => (
                  <div key={index} className="text-sm">
                    {line.startsWith("•") ? (
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-blue-400 drop-shadow-sm">
                          •
                        </span>
                        <span>{line.substring(2)}</span>
                      </div>
                    ) : (
                      <div>{line}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : message.type === "job-card" ? (
              <div className="space-y-3">
                <p className="mb-3 text-sm">{message.content}</p>
                {message.metadata?.jobs?.map((job: Job, index: number) => (
                  <Card
                    key={index}
                    className="group cursor-pointer border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-600/20"
                  >
                    <CardContent className="relative p-3">
                      {/* Subtle glow effect on hover */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                      <div className="relative z-10 mb-2 flex items-start justify-between">
                        <div>
                          <h4 className="flex items-center gap-2 font-semibold text-slate-100">
                            <Briefcase className="h-4 w-4 text-blue-400 drop-shadow-sm" />
                            {job.title}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {job.company}
                          </p>
                        </div>
                      </div>
                      <div className="relative z-10 mb-3 flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {job.salary}
                        </span>
                      </div>
                      <div className="relative z-10 flex flex-wrap gap-1">
                        {job.tags.map((tag: string, tagIndex: number) => (
                          <Badge
                            key={tagIndex}
                            className="border-blue-800/50 bg-blue-900/40 text-xs text-blue-300 shadow-sm backdrop-blur-sm hover:bg-blue-800/50"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
          <div className="-bottom-36 flex flex-1 justify-center overflow-y-auto px-6 py-6">
            <div className="w-full max-w-5xl">
              {messages.map(renderMessage)}

              <div className="mb-6 flex justify-end gap-3">
                <div className="order-first max-w-[80%]">
                  <Card className="group rounded-2xl border border-slate-700/50 bg-slate-900/60 p-0 text-white shadow-sm ring-1 shadow-blue-600/30 ring-blue-900/10 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-600/20">
                    <div className="space-y-3">
                      <CardContent className="relative p-3">
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                        <div className="items-star relative z-10 mb-3 flex justify-between text-sm">
                          <h4 className="flex items-center gap-2 font-semibold text-slate-100">
                            Try asking :
                          </h4>
                        </div>

                        <div className="relative z-10 flex flex-col flex-wrap gap-2">
                          {suggestions.map((suggestion, index) => (
                            <Badge
                              key={index}
                              className="flex cursor-pointer gap-3 border-blue-800/40 bg-blue-900/30 px-2 py-1 text-sm font-normal text-blue-300 shadow-sm backdrop-blur-sm hover:bg-blue-800/50"
                            >
                              <suggestion.icon className="h-4 w-4 text-blue-400 drop-shadow-sm" />

                              {suggestion.text}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </div>

                <Avatar className="mt-1 h-8 w-8 shadow-lg ring-1 shadow-blue-600/20 ring-blue-500/30">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </div>

              {isTyping && (
                <div className="mb-6 flex gap-3">
                  <Avatar className="mt-1 h-8 w-8 shadow-lg ring-1 shadow-blue-600/20 ring-blue-500/20">
                    <AvatarFallback className="border border-blue-800/50 bg-gradient-to-br from-blue-900/80 to-blue-800/60 text-blue-300 backdrop-blur-sm">
                      <Bot className="h-4 w-4" />
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
            </div>
          </div>

          {/* Input Area */}
          <div className="relative">
            <div className="animate-pin absolute -bottom-36 left-1/4 h-56 w-96 animate-pulse rounded-full bg-fuchsia-400/30 blur-3xl"></div>
            <div className="animate-pin absolute right-1/4 -bottom-36 h-56 w-72 animate-pulse rounded-full bg-yellow-400/30 blur-3xl"></div>
            <div className="mx-auto mb-3 h-fit max-w-5xl">
              <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 shadow-2xl ring-1 shadow-black/20 ring-slate-800/50 backdrop-blur-xl">
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
                      </div>
                    </div>
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white shadow-lg ring-1 shadow-blue-600/30 ring-blue-500/20 transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:ring-blue-400/30"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Model Info */}
                <div className="border-t border-slate-700/50 px-4 py-2">
                  <div className="w-fit rounded-md border border-slate-600/30 bg-slate-800/50 px-3 py-1 backdrop-blur-sm">
                    <span className="text-xs text-slate-400">
                      ibm-granite/granite-3.3-8b-instruct
                    </span>
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
    <div className="border-b border-slate-800/50 bg-gradient-to-r from-blue-900/60 via-purple-900/40 to-blue-900/60 backdrop-blur-sm">
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
