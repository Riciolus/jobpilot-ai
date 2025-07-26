"use client";

import type React from "react";

import { useRef, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "career-suggestion" | "job-card";
  metadata?: { jobs: Job[] };
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm your PathCoPilot AI assistant. I'm here to help you navigate your career journey. What would you like to explore today?",
    type: "text",
  },
  {
    id: "2",
    role: "user",
    content:
      "I'm interested in transitioning from marketing to data science. What skills should I focus on?",
    type: "text",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "Great choice! Data science is a growing field with excellent opportunities. Here are the key skills you should focus on for your transition:",
    type: "text",
  },
  {
    id: "4",
    role: "assistant",
    content:
      "• **Programming Languages**: Python and R are essential\n• **Statistics & Mathematics**: Linear algebra, probability, hypothesis testing\n• **Data Manipulation**: SQL, pandas, data cleaning techniques\n• **Machine Learning**: Supervised/unsupervised learning algorithms\n• **Data Visualization**: Tableau, matplotlib, seaborn\n• **Business Acumen**: Your marketing background is actually an advantage here!",
    type: "career-suggestion",
  },
  {
    id: "5",
    role: "assistant",
    content: "I found some relevant opportunities that might interest you:",
    type: "job-card",
    metadata: {
      jobs: [
        {
          title: "Junior Data Analyst",
          company: "TechCorp Inc.",
          location: "San Francisco, CA",
          salary: "$75,000 - $95,000",
          tags: ["Python", "SQL", "Marketing Analytics"],
        },
        {
          title: "Marketing Data Scientist",
          company: "Growth Labs",
          location: "Remote",
          salary: "$90,000 - $120,000",
          tags: ["Python", "A/B Testing", "Customer Analytics"],
        },
      ],
    },
  },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
          <Avatar className="mt-1 h-8 w-8">
            <AvatarFallback className="border border-blue-800 bg-blue-900/50 text-blue-300">
              <Brain className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}

        <div className={`max-w-[80%] ${isUser ? "order-first" : ""}`}>
          {/* {!isUser && (
            <div className="ml-2 flex flex-col items-start justify-center text-slate-700">
              <Brain className="h-4 w-4" />
              <div className="flex h-full min-h-3 w-4 min-w-4 items-start justify-center">
                <div className="h-full min-h-3 w-[1px] bg-slate-700"></div>
              </div>
            </div>
          )} */}
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "border border-slate-700 bg-slate-800 text-slate-100"
            }`}
          >
            {message.type === "career-suggestion" ? (
              <div className="space-y-2">
                {message.content.split("\n").map((line, index) => (
                  <div key={index} className="text-sm">
                    {line.startsWith("•") ? (
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-blue-400">•</span>
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
                    className="cursor-pointer border border-slate-700 bg-slate-900/50 py-0 transition-colors hover:border-blue-500"
                  >
                    <CardContent className="p-3">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h4 className="flex items-center gap-2 font-semibold text-slate-100">
                            <Briefcase className="h-4 w-4 text-blue-400" />
                            {job.title}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {job.company}
                          </p>
                        </div>
                      </div>
                      <div className="mb-3 flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {job.salary}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {job.tags.map((tag: string, tagIndex: number) => (
                          <Badge
                            key={tagIndex}
                            className="border-blue-800 bg-blue-900/50 text-xs text-blue-300 hover:bg-blue-800/50"
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
          <Avatar className="mt-1 h-8 w-8">
            <AvatarFallback className="bg-blue-600 text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full">
      <SidebarInset className="w-full flex-1">
        <div className="flex h-full w-full flex-col bg-indigo-950">
          <BettaBanner />

          {/* Chat Messages */}
          <div className="flex flex-1 justify-center overflow-y-auto px-6 py-6">
            <div className="w-full max-w-5xl">
              {messages.map(renderMessage)}

              {isTyping && (
                <div className="mb-6 flex gap-3">
                  <Avatar className="mt-1 h-8 w-8">
                    <AvatarFallback className="border border-blue-800 bg-blue-900/50 text-blue-300">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-blue-400"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-blue-400"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="px-6 pb-4">
            <div className="mx-auto h-fit max-w-5xl">
              <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3 shadow-2xl shadow-white/10">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about your career..."
                      className="max-h-32 min-h-[48px] w-full resize-none overflow-y-auto border-slate-700 pt-3 pr-20 pl-2 text-sm text-slate-100 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                      disabled={isTyping}
                      rows={1}
                    />
                    <div className="absolute top-3 right-2 flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-700 hover:text-blue-400"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-700 hover:text-blue-400"
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="rounded-xl bg-blue-600 px-4 py-3 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="w-fit rounded-md border border-y border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10">
                  <span className="text-xs text-neutral-50">
                    ibm-granite/granite-3.3-8b-instruct
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}

const BettaBanner = () => {
  return (
    <div className="border-b border-slate-800 bg-gradient-to-r from-blue-900/80 to-fuchsia-700 px-6 py-2">
      <div className="flex items-center justify-between">
        <SidebarTrigger className="border border-white/10 bg-white/5 p-1 text-slate-300 backdrop-blur-sm transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10 hover:bg-blue-950 hover:text-blue-300 md:hidden" />
        <p className="flex-1 text-center text-sm text-slate-300">
          <span className="font-medium text-blue-400">Beta:</span> Powered by
          Granite AI
        </p>
        <div className="w-6 md:hidden"></div> {/* Spacer for centering */}
      </div>
    </div>
  );
};
