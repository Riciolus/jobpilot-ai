"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export interface UserProfileForm {
  fullName: string;
  age: string;
  educationLevel: "High School" | "D3" | "S1" | "S2" | "";
  major: string;
  location: string;

  currentStatus: "Student" | "Fresh Graduate" | "Working" | "Career Switcher";
  pastJobs: string;
  skills: string[];

  desiredIndustry: string;
  targetRole: string;
  growthAreas: string[];

  userId: string;
}

// Define the possible form field types
type FormValue = string | string[];

type SubmitProfileResponse = {
  status: boolean;
  message?: string;
};

const initialFormData: UserProfileForm = {
  userId: "",
  fullName: "",
  age: "",
  educationLevel: "",
  major: "",
  location: "",
  currentStatus: "Student",
  pastJobs: "",
  skills: [],
  desiredIndustry: "",
  targetRole: "",
  growthAreas: [],
};

const skillSuggestions = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "TypeScript",
  "SQL",
  "Git",
  "Project Management",
  "Data Analysis",
  "UI/UX Design",
  "Marketing",
  "Communication",
  "Leadership",
  "Problem Solving",
];

const industryOptions = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Design",
  "Consulting",
  "E-commerce",
  "Media",
  "Non-profit",
];

const growthAreaOptions = [
  "Soft Skills",
  "Hard Skills",
  "Communication",
  "Technical Skills",
  "Leadership",
  "Project Management",
  "Data Analysis",
  "Creative Skills",
];

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UserProfileForm>(initialFormData);
  const [skillInput, setSkillInput] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const updateFormData = (field: keyof UserProfileForm, value: FormValue) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      updateFormData("skills", [...formData.skills, skill]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateFormData(
      "skills",
      formData.skills.filter((skill) => skill !== skillToRemove),
    );
  };

  const toggleGrowthArea = (area: string) => {
    const currentAreas = formData.growthAreas;
    if (currentAreas.includes(area)) {
      updateFormData(
        "growthAreas",
        currentAreas.filter((a) => a !== area),
      );
    } else {
      updateFormData("growthAreas", [...currentAreas, area]);
    }
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      const dbPayload = {
        ...formData,
        userId: session?.user?.id,
        age: parseInt(formData.age, 10),
        skills: formData.skills,
        growthAreas: formData.growthAreas,
      };

      const res = await fetch("/api/submit-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dbPayload),
      });

      const result = (await res.json()) as SubmitProfileResponse;

      if (result.status === true) {
        router.replace("/loading");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalBackgroundStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <CareerSnapshotStep
            formData={formData}
            updateFormData={updateFormData}
            skillInput={skillInput}
            setSkillInput={setSkillInput}
            addSkill={addSkill}
            removeSkill={removeSkill}
          />
        );
      case 3:
        return (
          <CareerGoalsStep
            formData={formData}
            updateFormData={updateFormData}
            toggleGrowthArea={toggleGrowthArea}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl"></div>
      <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-1000"></div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        {/* <div className="border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
          <div className="mx-auto max-w-2xl px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-600/20">
                  <span className="text-sm font-bold text-white">P</span>
                </div>
                <h1 className="text-xl font-bold text-white">PathCoPilot</h1>
              </div>
              <div className="text-sm font-medium text-slate-400">
                Step {currentStep} of 3
              </div>
            </div>
          </div>
        </div> */}

        {/* Progress Bar */}
        <div
          className={cn(
            "border-b border-slate-800/30 bg-gradient-to-b to-slate-950/80",
            currentStep === 1 && "from-red-300/10",
            currentStep === 2 && "from-yellow-300/10",
            currentStep === 3 && "from-green-300/10",
          )}
        >
          <Link
            href="/"
            className="absolute top-6 left-6 z-10 flex items-center gap-2 text-slate-400 transition-colors hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="mx-auto flex max-w-2xl flex-col gap-3 px-6 py-4">
            <div className="h-2 w-full rounded-full bg-slate-800/50">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-600 shadow-sm shadow-blue-500/50 transition-all duration-500"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>

            <div className="text-center text-sm font-medium text-slate-400">
              Step {currentStep} of 3
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 py-12">
          <div className="mx-auto max-w-2xl px-6">{renderStep()}</div>
        </div>

        {/* Navigation */}
        <div className="border-t border-slate-800/50 bg-gradient-to-t from-fuchsia-950/10 to-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto max-w-2xl px-6 py-6">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="border-slate-700/50 bg-slate-800/30 text-slate-300 backdrop-blur-sm hover:bg-slate-800/50 hover:text-slate-200 disabled:opacity-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg ring-1 shadow-blue-600/25 ring-blue-500/20 hover:from-blue-700 hover:to-blue-800"
              >
                {currentStep === 3 ? "Complete Setup" : "Next"}
                {currentStep !== 3 && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 1: Personal Background
function PersonalBackgroundStep({
  formData,
  updateFormData,
}: {
  formData: UserProfileForm;
  updateFormData: (field: keyof UserProfileForm, value: FormValue) => void;
}) {
  return (
    <Card className="border-slate-800/30 bg-slate-950/10 shadow-xl shadow-black/10 backdrop-blur-sm">
      <CardContent>
        <div className="space-y-8">
          <div>
            <h2 className="mb-3 text-3xl font-bold text-white">
              Personal Background
            </h2>
            <div className="flex items-center gap-3">
              <Image
                src="/images/people.png"
                alt="people"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="text-lg font-medium">
                <p className="text-slate-400">
                  Let&apos;s start with some basic information about you.
                </p>
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <Label
                htmlFor="fullName"
                className="text-lg font-medium text-slate-200"
              >
                Full Name
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => updateFormData("fullName", e.target.value)}
                placeholder="Enter your full name"
                className="h-12 border-slate-700/50 bg-slate-800/50 text-base text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="age"
                className="text-lg font-medium text-slate-200"
              >
                Age
              </Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => updateFormData("age", e.target.value)}
                placeholder="Enter your age"
                className="h-12 border-slate-700/50 bg-slate-800/50 text-base text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-lg font-medium text-slate-200">
                Education Level
              </Label>
              <Select
                value={formData.educationLevel}
                onValueChange={(value) => {
                  updateFormData("educationLevel", value);
                }}
              >
                <SelectTrigger className="h-12 border-slate-700/50 bg-slate-800/50 text-base text-slate-100 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-800 text-slate-100">
                  <SelectItem value="High School">High School</SelectItem>
                  <SelectItem value="D3">D3 (Diploma)</SelectItem>
                  <SelectItem value="S1">S1 (Bachelor&apos;s)</SelectItem>
                  <SelectItem value="S2">S2 (Master&apos;s)</SelectItem>
                  asd
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="major"
                className="text-lg font-medium text-slate-200"
              >
                Major / Field of Study
              </Label>
              <Input
                id="major"
                value={formData.major}
                onChange={(e) => updateFormData("major", e.target.value)}
                placeholder="e.g., Computer Science, Business, Design"
                className="h-12 border-slate-700/50 bg-slate-800/50 text-base text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="location"
                className="text-lg font-medium text-slate-200"
              >
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-slate-400" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateFormData("location", e.target.value)}
                  placeholder="City, Country"
                  className="h-12 border-slate-700/50 bg-slate-800/50 pl-11 text-base text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <p className="text-sm text-slate-500">
                We&apos;ll use this to show relevant job opportunities in your
                area.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Step 2: Career Snapshot
function CareerSnapshotStep({
  formData,
  updateFormData,
  skillInput,
  setSkillInput,
  addSkill,
  removeSkill,
}: {
  formData: UserProfileForm;
  updateFormData: (field: keyof UserProfileForm, value: FormValue) => void;
  skillInput: string;
  setSkillInput: (value: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
}) {
  return (
    <Card className="border-slate-800/30 bg-slate-950/10 shadow-xl shadow-black/10 backdrop-blur-sm">
      <CardContent>
        <div className="space-y-8">
          <div>
            <h2 className="mb-3 text-3xl font-bold text-white">
              Career Snapshot
            </h2>

            <div className="flex items-center gap-3">
              <Image
                src="/images/saluting.png"
                alt="people"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="text-lg font-medium">
                <p className="text-slate-400">
                  Tell us about your current situation and experience.
                </p>
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-lg font-medium text-slate-200">
                Current Status
              </Label>
              <RadioGroup
                value={formData.currentStatus}
                onValueChange={(value) =>
                  updateFormData("currentStatus", value)
                }
                className="grid grid-cols-2 gap-4"
              >
                {[
                  "Fresh Graduate",
                  "Student",
                  "Working",
                  "Career Switcher",
                ].map((status) => (
                  <div
                    key={status}
                    className="flex items-center space-x-3 rounded-lg border border-slate-700/50 bg-slate-800/30 p-4 transition-colors hover:bg-slate-800/50"
                  >
                    <RadioGroupItem
                      value={status}
                      id={status}
                      className="border-slate-600 text-blue-500"
                    />
                    <Label
                      htmlFor={status}
                      className="flex-1 cursor-pointer text-slate-200"
                    >
                      {status}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="pastJobs"
                className="text-lg font-medium text-slate-200"
              >
                Past Jobs / Internships
                <span className="ml-2 text-sm font-normal text-slate-500">
                  (Optional)
                </span>
              </Label>
              <Textarea
                id="pastJobs"
                value={formData.pastJobs}
                onChange={(e) => updateFormData("pastJobs", e.target.value)}
                placeholder="Briefly describe your work experience, internships, or relevant projects..."
                className="min-h-[120px] resize-none border-slate-700/50 bg-slate-800/50 text-base text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium text-slate-200">
                Skills
              </Label>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill(skillInput);
                      }
                    }}
                    placeholder="Type a skill and press Enter"
                    className="h-12 border-slate-700/50 bg-slate-800/50 text-base text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                {/* Skill Suggestions */}
                <div className="flex flex-wrap gap-2">
                  {skillSuggestions
                    .filter(
                      (skill) =>
                        !formData.skills.includes(skill) &&
                        skill.toLowerCase().includes(skillInput.toLowerCase()),
                    )
                    .slice(0, 6)
                    .map((skill) => (
                      <Button
                        key={skill}
                        variant="outline"
                        size="sm"
                        onClick={() => addSkill(skill)}
                        className="border-slate-600/50 bg-slate-800/30 text-slate-300 hover:bg-blue-950/50 hover:text-blue-300"
                      >
                        + {skill}
                      </Button>
                    ))}
                </div>

                {/* Selected Skills */}
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <Badge
                        key={skill}
                        className="border-blue-800/50 bg-blue-900/50 px-3 py-1 text-sm text-blue-300 hover:bg-blue-800/50"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 hover:text-blue-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Step 3: Career Goals
function CareerGoalsStep({
  formData,
  updateFormData,
  toggleGrowthArea,
}: {
  formData: UserProfileForm;
  updateFormData: (field: keyof UserProfileForm, value: FormValue) => void;
  toggleGrowthArea: (area: string) => void;
}) {
  return (
    <Card className="border-slate-800/30 bg-slate-950/10 shadow-xl shadow-black/10 backdrop-blur-sm">
      <CardContent>
        <div className="space-y-8">
          <div>
            <h2 className="mb-3 text-3xl font-bold text-white">Career Goals</h2>
            <div className="flex items-center gap-3">
              <Image
                src="/images/smile.png"
                alt="people"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="text-lg font-medium">
                <p className="text-slate-400">
                  Help us understand where you want to go in your career.
                </p>
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-lg font-medium text-slate-200">
                Desired Industry
              </Label>
              <Select
                value={formData.desiredIndustry}
                onValueChange={(value) =>
                  updateFormData("desiredIndustry", value)
                }
              >
                <SelectTrigger className="h-12 border-slate-700/50 bg-slate-800/50 text-base text-slate-100 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue placeholder="Select your target industry" />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-800 text-slate-100">
                  {industryOptions.map((industry) => (
                    <SelectItem key={industry} value={industry.toLowerCase()}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="targetRole"
                className="text-lg font-medium text-slate-200"
              >
                Target Role
              </Label>
              <Input
                id="targetRole"
                value={formData.targetRole}
                onChange={(e) => updateFormData("targetRole", e.target.value)}
                placeholder="e.g., Software Engineer, Product Manager, UX Designer"
                className="h-12 border-slate-700/50 bg-slate-800/50 text-base text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium text-slate-200">
                Areas to Grow In
              </Label>
              <p className="text-sm text-slate-500">
                Select all areas where you&apos;d like to improve (you can
                select multiple).
              </p>
              <div className="grid grid-cols-2 gap-3">
                {growthAreaOptions.map((area) => (
                  <div
                    key={area}
                    className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-all ${
                      formData.growthAreas.includes(area)
                        ? "border-blue-500/50 bg-blue-950/30 shadow-sm shadow-blue-600/20"
                        : "border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50"
                    }`}
                    onClick={() => toggleGrowthArea(area)}
                  >
                    <Checkbox
                      checked={formData.growthAreas.includes(area)}
                      onChange={() => toggleGrowthArea(area)}
                      className="border-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label className="flex-1 cursor-pointer text-slate-200">
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
