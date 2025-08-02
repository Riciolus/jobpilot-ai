import type { UserProfileForm } from "@/app/(auth-check)/onboarding/page";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { userProfiles } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

function parseTextArray(input?: string | null): string[] {
  if (!input) return [];

  try {
    const parsed = JSON.parse(input) as [];
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim());
    }
  } catch {
    // fallback for old comma-separated string
    return input.split(",").map((s) => s.trim());
  }

  return [];
}

// GET: Fetch user profile
export async function GET() {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawProfile = await db.query.userProfiles.findFirst({
    where: (u, { eq }) => eq(u.userId, session.user.id),
  });

  if (!rawProfile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const profile = {
    ...rawProfile,
    skills: parseTextArray(rawProfile.skills),
    pastJobs: parseTextArray(rawProfile.pastJobs),
    growthAreas: parseTextArray(rawProfile.growthAreas),
  };

  return NextResponse.json(profile);
}

// POST: Create or update user profile
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as UserProfileForm;
  const {
    fullName,
    age,
    educationLevel,
    major,
    location,
    currentStatus,
    pastJobs,
    skills,
    desiredIndustry,
    targetRole,
    growthAreas,
  } = body;

  // Simple manual validation (expand as needed)
  if (!educationLevel || !currentStatus) {
    return NextResponse.json(
      { error: "Missing required fields: educationLevel, currentStatus" },
      { status: 400 },
    );
  }

  // Upsert logic
  const existing = await db.query.userProfiles.findFirst({
    where: (u, { eq }) => eq(u.userId, session.user.id),
  });

  if (existing) {
    // Update
    await db
      .update(userProfiles)
      .set({
        fullName,
        age: parseInt(age, 10),
        educationLevel,
        major,
        location,
        currentStatus,
        pastJobs,
        skills: JSON.stringify(skills),
        desiredIndustry,
        targetRole,
        growthAreas: JSON.stringify(growthAreas),
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, session.user.id));
  } else {
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true });
}
