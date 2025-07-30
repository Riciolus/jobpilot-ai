import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { conversations, messages, userProfiles } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

const toArray = (input?: string | null): string[] =>
  input
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? [];

function generateOpeningSystemPrompt(data: {
  name: string;
  age: number;
  degree: string;
  skills: string[];
  experience: string[];
  interests: string[];
}) {
  return `
You are an AI Career Assistant. Your job is to help users explore job opportunities and grow professionally based on their background and goals.

Use the user's profile below to provide helpful, friendly, and actionable career advice.

User Profile:
- Name: ${data.name}
- Age: ${data.age} 
- Degree: ${data.degree}
- Skills: ${data.skills.join(", ") || "Not specified"}
- Experience: ${data.experience.join(", ") || "Not specified"}
- Interests: ${data.interests.join(", ") || "Not specified"}

Start by helping the user with:
1. A quick overview of how their background fits into potential job roles
2. General suggestions to boost their career readiness in the short term
3. One personalized tip to improve their portfolio or personal brand

Now respond to the user’s message and guide them forward.
Be welcoming.
Keep some details general, saving specifics for follow-up questions.
Ask a follow-up to keep the conversation going.
`.trim();
}

export async function POST() {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  // ✅ Check if user already has a conversation
  const existing = await db.query.conversations.findFirst({
    where: (c, { eq }) => eq(c.userId, session.user.id),
  });

  if (existing) {
    return NextResponse.json({
      conversationId: existing.id,
      alreadyInitialized: true,
    });
  }

  const userProfile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, session.user.id),
  });

  if (!userProfile) throw new Error("No user profile found");

  const conversationId = crypto.randomUUID();
  await db.insert(conversations).values({
    id: conversationId,
    userId: session.user.id,
    title: "Welcome",
  });

  const systemPrompt = generateOpeningSystemPrompt({
    name: userProfile.fullName ?? "Unknown",
    age: userProfile.age ?? 0,
    degree: `${userProfile.educationLevel ?? "Unknown"} in ${userProfile.major ?? "Unknown"}`,
    skills: toArray(userProfile.skills),
    experience: toArray(userProfile.pastJobs),
    interests: toArray(
      `${userProfile.desiredIndustry}, ${userProfile.targetRole}`,
    ),
  });

  let modelResponseBuffer = "";

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
        "x-conversation-id": conversationId,
      },
    },
  );
}
