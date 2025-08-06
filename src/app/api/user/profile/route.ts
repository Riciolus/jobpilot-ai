import { userProfileSchema, type UserProfileForm } from "@/lib/schema";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { userProfiles, users } from "@/server/db/schema";
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
    growthAreas: parseTextArray(rawProfile.growthAreas),
  };

  return NextResponse.json(profile);
}

// POST: Create user profile
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as UserProfileForm;

    const result = userProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { status: false, errors: result.error.format() },
        { status: 400 },
      );
    }

    const payload = {
      ...body,
      userId: session.user.id,
      age: parseInt(body.age, 10),
      skills: JSON.stringify(body.skills),
      growthAreas: JSON.stringify(body.growthAreas),
    };

    await db.insert(userProfiles).values(payload);
    await db
      .update(users)
      .set({ isOnboardingComplete: true })
      .where(eq(users.id, body.userId));

    return NextResponse.json({ status: true });
  } catch (error) {
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
}

// PATCH: Update user profile
export async function PATCH(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as UserProfileForm;

  const result = userProfileSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { status: false, errors: result.error.format() },
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
        ...body,
        skills: JSON.stringify(body.skills),
        age: parseInt(body.age, 10),
        growthAreas: JSON.stringify(body.growthAreas),
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, session.user.id));
  } else {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
