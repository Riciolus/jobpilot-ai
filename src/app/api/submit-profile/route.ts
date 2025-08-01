import type { UserProfileForm } from "@/app/(auth-check)/onboarding/page";
import { db } from "@/server/db";
import { userProfiles, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as UserProfileForm;

    if (
      !body.userId ||
      !["High School", "D3", "S1", "S2"].includes(body.educationLevel) || // already good
      !["Student", "Fresh Graduate", "Working", "Career Switcher"].includes(
        body.currentStatus,
      )
    ) {
      return NextResponse.json(
        { status: false, error: "Missing or invalid fields" },
        { status: 400 },
      );
    }

    const payload = {
      ...body,
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
    return NextResponse.json({ status: false, error });
  }
}
