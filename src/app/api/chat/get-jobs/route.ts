import type { Message } from "@/app/(auth-check)/(with-sidebar)/chat/page";
import { scrapeGlints } from "@/lib/puppeteer";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { messages } from "@/server/db/schema";
import { type NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

type ResponseFormat = { response: boolean };

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!, // store securely in .env
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const conversationId = req.nextUrl.searchParams.get("convId");
    const userMessage = req.nextUrl.searchParams.get("userMsg");

    if (!userMessage || !conversationId) {
      throw new Error("Missing params");
    }

    let modelCheckerRes;

    const prompt = `
Is the following message a request to search for job listings?

Respond ONLY with one of the following, as plain JSON:
{ "response": true }
or
{ "response": false }

Do NOT add quotes, explanations, markdown, or extra text.

Message: "${userMessage}"
`;

    try {
      const output = (await replicate.run(
        "ibm-granite/granite-3.3-8b-instruct",
        {
          input: { prompt },
        },
      )) as string[];

      // Step 1: Join and trim the output
      const combined = output.join("").trim();

      // Step 2: Parse safely
      const parsed = JSON.parse(combined) as ResponseFormat;
      modelCheckerRes = parsed.response;
    } catch (error) {
      console.error("Replicate error:", error);
      return NextResponse.json(
        { error: "Failed to generate" },
        { status: 500 },
      );
    }

    if (!modelCheckerRes) {
      return NextResponse.json(
        {
          status: false,
          message: "Granite determined this is not a job search request.",
        },
        { status: 400 },
      );
    }

    const query = await db.query.userProfiles.findFirst({
      where: (userProfile, { eq }) => eq(userProfile.userId, session.user.id),
      columns: {
        skills: true,
        desiredIndustry: true,
      },
    });

    const skillsArray: string[] = query?.skills
      ? (JSON.parse(query.skills) as string[])
      : [];
    const desiredIndustry: string = query?.desiredIndustry ?? "";

    const queryString = [...skillsArray, desiredIndustry].join(" ");

    const jobs = await scrapeGlints(queryString);

    const messagePayload: Message[] = [
      {
        id: crypto.randomUUID(),
        content: userMessage,
        role: "user",
        type: "text",
        conversationId,
      },
      {
        id: crypto.randomUUID(),
        content: `😍 This job might be up your alley—especially with your passion for ${desiredIndustry}!`,
        role: "assistant",
        type: "job-card",
        conversationId,
        metadata: { jobs },
      },
    ];

    await db.insert(messages).values(messagePayload);

    return NextResponse.json({
      status: true,
      data: messagePayload[1],
    });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: error ?? "something went wrong" },
      { status: 400 },
    );
  }
}

// buat diriku besok: KAYAKNYA BISA RETURN LANGSUNG MESSAGE OBJECT GTU JADINYA BISA DI STORE LGSNG DI DB SEBELUM SAMPE CLIENT

export async function POST() {
  const jobs = await scrapeGlints("developer");

  return NextResponse.json(jobs);
}
