import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { conversations, messages, userProfiles } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

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

  const userFullname = await db.query.userProfiles.findFirst({
    columns: {
      fullName: true,
    },
    where: eq(userProfiles.userId, session.user.id),
  });

  if (!userFullname) {
    return NextResponse.json(
      {
        status: false,
        message: "User Profile not found",
      },
      { status: 404 },
    );
  }

  const userFirstName = userFullname.fullName?.split(" ")[0];

  const conversationId = crypto.randomUUID();

  await db.insert(conversations).values({
    id: conversationId,
    userId: session.user.id,
    title: "Welcome",
  });

  await db.insert(messages).values({
    id: crypto.randomUUID(),
    conversationId,
    role: "assistant", // from senderEnum
    content: `👋 Hi ${userFirstName}! Let's get started with your career goals.`,
    type: "text",
  });

  return NextResponse.json({ status: "initialized", conversationId });
}
