import type { CVAnalysis } from "@/app/(auth-check)/(with-sidebar)/resume-review/page";
import { auth } from "@/server/auth";
import { NextResponse, type NextRequest } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!, // store securely in .env
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { userCV } = (await req.json()) as { userCV: string };

    if (!userCV) {
      return NextResponse.json(
        { status: false, message: "Missing params" },
        { status: 400 },
      );
    }

    const prompt = `
    You are an expert CV reviewer. Analyze the following resume and return feedback in this exact JSON format:

interface CVAnalysis {
  overallScore: number;
  sections: {
    name: string;
    score: number;
    status: "excellent" | "good" | "needs-improvement" | "missing";
    feedback: string;
  }[];
  strengths: string[];
  improvements: string[];
  keywords: {
    present: string[];
    missing: string[];
  };
  suggestions: string[];
}

### Instructions:
- Give a score (0-100) for each section: Contact Information, Professional Summary, Work Experience, Skills, Education, Certifications.
- Assign a 'status' based on score:
  - 90–100: "excellent"
  - 70–89: "good"
  - 40–69: "needs-improvement"
  - < 40: "missing"
- Write clear, concise feedback for each section.
- Identify strengths and improvements.
- Analyze relevant keywords: list 'present' and 'missing'.
- Provide 3–5 specific, actionable suggestions to improve the CV.
- Calculate an 'overallScore' as the average of all section scores (rounded).

### Resume:
${userCV}
`;

    let modelResponse;
    try {
      const output = (await replicate.run(
        "ibm-granite/granite-3.3-8b-instruct",
        {
          input: { prompt, max_tokens: 1024 },
        },
      )) as string[];

      const combined = output.join("").trim();

      const parsed = JSON.parse(combined) as CVAnalysis;

      modelResponse = parsed;
    } catch (error) {
      console.error("Replicate error:", error);
      return NextResponse.json(
        { error: "Failed to generate" },
        { status: 500 },
      );
    }

    return NextResponse.json({ status: true, data: modelResponse });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: error },
      { status: 500 },
    );
  }
}
