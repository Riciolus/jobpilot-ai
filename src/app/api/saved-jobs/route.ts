import type { SavedJob } from "@/app/(auth-check)/(with-sidebar)/saved-jobs/page";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { savedJobs } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const jobs = await db
      .select()
      .from(savedJobs)
      .where(eq(savedJobs.userId, session?.user.id));

    return NextResponse.json({ status: true, jobs });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: "Internal Server Error",
        error,
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    console.log({ session });

    const body = (await req.json()) as SavedJob;

    const { title, company, location, salary, tags, link, savedAt } = body;

    if (!title || !company || !location || !salary || !tags || !link) {
      return NextResponse.json(
        { status: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    await db.insert(savedJobs).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      title,
      company,
      location,
      salary,
      tags, // convert to string if using SQLite
      link,
      savedAt: savedAt ? new Date(savedAt) : new Date(),
    });

    return NextResponse.json({ status: true, message: "Job saved" });
  } catch (error) {
    console.error("[POST /saved-jobs] Error:", error);
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { status: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = (await req.json()) as { id: string };
  const jobId = body.id;

  if (!jobId) {
    return new Response("Missing job ID", { status: 400 });
  }

  const deletedJob = await db
    .delete(savedJobs)
    .where(and(eq(savedJobs.id, jobId), eq(savedJobs.userId, session.user.id)))
    .returning();

  if (deletedJob.length === 0) {
    return NextResponse.json(
      { status: false, message: "Job not found or not authorized" },
      { status: 404 },
    );
  }

  return NextResponse.json({ status: true, message: "job removed" });
}
