import type { Message } from "@/app/(auth-check)/(with-sidebar)/chat/page";
import { db } from "@/server/db";
import { messages } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

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

    const { content, conversationId, role, type } = body;

    if (!type || !role || !content || !conversationId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    let modelResponseBuffer = "";

    const userMessage = { content, conversationId, role, type };

    const stream = replicate.stream("ibm-granite/granite-3.3-8b-instruct", {
      input: {
        prompt: content,
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
