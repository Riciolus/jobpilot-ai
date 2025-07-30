import type { Message } from "@/app/(auth-check)/(with-sidebar)/chat/page";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { messages, userProfiles } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

const toArray = (input?: string | null): string[] =>
  input
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? [];

function generateSystemPrompt(data: {
  name: string;
  age: number;
  degree: string;
  skills: string[];
  experience: string[];
  interests: string[];
  userMessage: string;
}) {
  return `
You are an AI Career Assistant. Your role is to support users in their professional journey — offering helpful insights, guidance, and suggestions based on their profile and current career goals.

User Profile:
- Name: ${data.name}
- Age: ${data.age}  
- Degree: ${data.degree}
- Skills: ${data.skills.join(", ") || "Not specified"}
- Experience: ${data.experience.join(", ") || "Not specified"}
- Interests: ${data.interests.join(", ") || "Not specified"}

Instructions:
- Respond naturally to the user’s message — answer their question, suggest next steps, or offer encouragement.
- Keep the conversation *career-focused*: skills, jobs, learning, personal branding, portfolios, or work experience.
- Avoid repeating general advice unless the user asks.
- Be friendly, concise, and supportive — adapt to the tone of the conversation.

If the user asks something off-topic:
> “I'm here to support your career growth. Would you like help with job ideas, skills, or your portfolio?”

Your response should:
1. Acknowledge what the user said or asked
2. Provide a useful, relevant, career-related response
3. Optionally suggest a follow-up question or idea to keep the conversation moving

User says:
"${data.userMessage}"
`.trim();
}

export async function GET(req: NextRequest) {
  try {
    const conversationId = req.nextUrl.searchParams.get("conversationId");

    if (!conversationId) {
      return new Response("Missing conversationId", { status: 400 });
    }

    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);

    return NextResponse.json(msgs);
  } catch (error) {
    ErrorHandler(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Message;
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const { content, conversationId, role, type } = body;

    if (!type || !role || !content || !conversationId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const userProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session?.user.id))
      .then((rows) => rows[0]);

    if (!userProfile) throw new Error("No user profile found");

    const systemPrompt = generateSystemPrompt({
      name: userProfile.fullName ?? "Unknown",
      age: userProfile.age ?? 0,
      degree: `${userProfile.educationLevel ?? "Unknown"} in ${userProfile.major ?? "Unknown"}`,
      skills: toArray(userProfile.skills),
      experience: toArray(userProfile.pastJobs),
      interests: toArray(
        `${userProfile.desiredIndustry}, ${userProfile.targetRole}`,
      ),
      userMessage: content,
    });

    let modelResponseBuffer = "";
    const userMessage = { content, conversationId, role, type };

    const stream = replicate.stream("ibm-granite/granite-3.3-8b-instruct", {
      input: {
        prompt: systemPrompt,
      },
    });

    const encoder = new TextEncoder();
    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const event of stream) {
              if (event.event === "done") {
                controller.close();
                await db.insert(messages).values([
                  userMessage,
                  {
                    content: modelResponseBuffer,
                    conversationId,
                    role: "assistant",
                    type: "text",
                  },
                ]);

                controller.close();
                break;
              }

              if (event.event === "output" && event.data) {
                controller.enqueue(encoder.encode(event.data));
                modelResponseBuffer = modelResponseBuffer + event.data;
              }
            }
          } catch {
            controller.enqueue(encoder.encode("[Error streaming response]"));
            controller.close();
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      },
    );
  } catch (error) {
    return ErrorHandler(error, "Server error");
  }
}

function ErrorHandler(error: unknown, message = "Something went wrong") {
  console.error(message, error);
  return NextResponse.json(
    {
      status: false,
      error: message,
      detail: (error as Error)?.message ?? "Unknown error",
    },
    { status: 500 },
  );
}
