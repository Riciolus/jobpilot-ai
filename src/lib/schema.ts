import z from "zod";

export const userProfileSchema = z.object({
  fullName: z.string().min(1, "Fullname is required"),
  age: z.string().regex(/^\d+$/, "Age must be a number"),
  educationLevel: z.enum(["High School", "D3", "S1", "S2", ""]),
  major: z.string().min(1, "Major is required"),
  location: z.string().min(1, "Location is required"),

  currentStatus: z.enum([
    "Student",
    "Fresh Graduate",
    "Working",
    "Career Switcher",
  ]),
  pastJobs: z.string().optional(), // or .min(1) if you want to require it
  skills: z.array(z.string()).min(1, "At least one skill is required"),

  desiredIndustry: z.string().min(1, "Desired industry is required"),
  targetRole: z.string().min(1, "Target role is required"),
  growthAreas: z.array(z.string()), // or use .min(1) to enforce

  userId: z.string().min(1, "User ID is required"),
});

export type UserProfileForm = z.infer<typeof userProfileSchema>;
