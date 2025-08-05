"use client";

import { useEffect, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Settings,
  User,
  MapPin,
  Save,
  X,
  Upload,
  Camera,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { UserProfileForm } from "../../onboarding/page";
import { useSession } from "next-auth/react";

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
  "Machine Learning",
  "AWS",
  "Docker",
  "Figma",
  "Adobe Creative Suite",
  "Agile",
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
  "Technical Skills",
  "Soft Skills",
  "Leadership",
  "Communication",
  "Project Management",
  "Data Analysis",
  "Creative Skills",
  "Business Strategy",
  "Networking",
  "Public Speaking",
];

export default function SettingsPage() {
  const [formData, setFormData] = useState<UserProfileForm>(
    {} as UserProfileForm,
  );
  const [skillInput, setSkillInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/user/profile", { method: "GET" });
        const data = (await res.json()) as UserProfileForm;

        if (!res.ok) {
          throw new Error();
        }

        console.log(data);
        setFormData(data);
      } catch (err) {
        console.error("Failed to get conversation:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const updateFormData = (
    field: keyof UserProfileForm,
    value: UserProfileForm[typeof field],
  ) => {
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

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("success");

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error();
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaveStatus("idle");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveStatus("idle");
  };

  if (isLoading) {
    return <div className="h-screen w-screen bg-slate-950"></div>;
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-purple-500/8 blur-3xl delay-1000"></div>

      <SidebarInset className="relative z-10 w-full flex-1">
        <div className="flex h-full w-full flex-col bg-slate-950">
          {/* Header */}
          <div className="border-b border-slate-800/50 bg-slate-800/10 bg-gradient-to-b from-fuchsia-900/10 backdrop-blur-xl">
            <div className="flex items-center justify-between px-6 py-2">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="rounded-lg border border-slate-600/30 bg-slate-800/50 p-2 text-slate-300 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-950/50 hover:text-blue-300 md:hidden" />
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-blue-400" />
                  <div>
                    <h1 className="text-base font-bold text-white">
                      Personal Settings
                    </h1>
                    <p className="text-sm text-slate-400">
                      Manage your personal information and preferences
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {saveStatus === "success" && (
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    Saved successfully
                  </div>
                )}
                {saveStatus === "error" && (
                  <div className="flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    Save failed
                  </div>
                )}
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="border-slate-600/50 bg-slate-800/30 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
                    >
                      <X className="mr-1 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-sm text-white shadow-lg shadow-blue-600/25 hover:from-blue-700 hover:to-blue-800"
                    >
                      <Save className="mr-1 h-4 w-4" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-sm text-white shadow-lg shadow-blue-600/25 hover:from-blue-700 hover:to-blue-800"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="mx-auto max-w-4xl space-y-4">
              {/* Profile Picture Section */}
              <Card className="gap-0 border-slate-800/50 bg-slate-900/50 p-0 shadow-xl shadow-black/10 backdrop-blur-sm">
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-semibold text-white">
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16 shadow-lg ring-2 shadow-blue-600/20 ring-blue-500/20">
                        <AvatarImage src={session.data?.user.image ?? ""} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-lg text-white">
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full bg-blue-600 p-0 hover:bg-blue-700"
                        >
                          <Camera className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-200">
                        {formData.fullName}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {formData.targetRole}
                      </p>
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 border-slate-600/50 bg-slate-800/30 text-xs text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
                        >
                          <Upload className="mr-1 h-3 w-3" />
                          Change Photo
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card className="gap-0 border-slate-800/50 bg-slate-900/50 p-0 shadow-xl shadow-black/10 backdrop-blur-sm">
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-semibold text-white">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="text-sm font-medium text-slate-200"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          updateFormData("fullName", e.target.value)
                        }
                        disabled={!isEditing}
                        className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 disabled:opacity-60"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="age"
                        className="text-sm font-medium text-slate-200"
                      >
                        Age
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => updateFormData("age", e.target.value)}
                        disabled={!isEditing}
                        className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 disabled:opacity-60"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-200">
                        Education Level
                      </Label>
                      <Select
                        value={formData.educationLevel}
                        onValueChange={(value) =>
                          updateFormData("educationLevel", value)
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-100 focus:border-blue-500 focus:ring-blue-500/20 disabled:opacity-60">
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent className="border-slate-700 bg-slate-800 text-slate-100">
                          <SelectItem value="High School">
                            High School
                          </SelectItem>
                          <SelectItem value="D3">D3 (Diploma)</SelectItem>
                          <SelectItem value="S1">
                            S1 (Bachelor&apos;s)
                          </SelectItem>
                          <SelectItem value="S2">S2 (Master&apos;s)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="major"
                        className="text-sm font-medium text-slate-200"
                      >
                        Major / Field of Study
                      </Label>
                      <Input
                        id="major"
                        value={formData.major}
                        onChange={(e) =>
                          updateFormData("major", e.target.value)
                        }
                        disabled={!isEditing}
                        className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 disabled:opacity-60"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label
                        htmlFor="location"
                        className="text-sm font-medium text-slate-200"
                      >
                        Location
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) =>
                            updateFormData("location", e.target.value)
                          }
                          disabled={!isEditing}
                          className="border-slate-700/50 bg-slate-800/50 pl-10 text-sm text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 disabled:opacity-60"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Career Information */}
              <Card className="gap-0 border-slate-800/50 bg-slate-900/50 p-0 shadow-xl shadow-black/10 backdrop-blur-sm">
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-semibold text-white">
                    Career Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-200">
                      Current Status
                    </Label>
                    <RadioGroup
                      value={formData.currentStatus}
                      onValueChange={(value) =>
                        updateFormData("currentStatus", value)
                      }
                      disabled={!isEditing}
                      className="grid grid-cols-2 gap-3"
                    >
                      {[
                        "Fresh Graduate",
                        "Student",
                        "Working",
                        "Career Switcher",
                      ].map((status) => (
                        <div
                          key={status}
                          className={`flex items-center space-x-2 rounded-lg border p-3 transition-colors ${
                            isEditing
                              ? "border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50"
                              : "border-slate-700/30 bg-slate-800/20 opacity-60"
                          }`}
                        >
                          <RadioGroupItem
                            value={status}
                            id={status}
                            className="border-slate-600 text-blue-500"
                            disabled={!isEditing}
                          />
                          <Label
                            htmlFor={status}
                            className="flex-1 cursor-pointer text-sm text-slate-200"
                          >
                            {status}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="pastJobs"
                      className="text-sm font-medium text-slate-200"
                    >
                      Past Jobs / Experience
                    </Label>
                    <Textarea
                      id="pastJobs"
                      value={formData.pastJobs}
                      onChange={(e) =>
                        updateFormData("pastJobs", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Describe your work experience..."
                      className="min-h-[80px] resize-none border-slate-700/50 bg-slate-800/50 text-sm text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 disabled:opacity-60"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-200">
                        Desired Industry
                      </Label>
                      <Select
                        value={formData.desiredIndustry}
                        onValueChange={(value) =>
                          updateFormData("desiredIndustry", value)
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-100 focus:border-blue-500 focus:ring-blue-500/20 disabled:opacity-60">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="border-slate-700 bg-slate-800 text-slate-100">
                          {industryOptions.map((industry) => (
                            <SelectItem
                              key={industry}
                              value={industry.toLowerCase()}
                            >
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="targetRole"
                        className="text-sm font-medium text-slate-200"
                      >
                        Target Role
                      </Label>
                      <Input
                        id="targetRole"
                        value={formData.targetRole}
                        onChange={(e) =>
                          updateFormData("targetRole", e.target.value)
                        }
                        disabled={!isEditing}
                        className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 disabled:opacity-60"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="gap-0 border-slate-800/50 bg-slate-900/50 p-0 shadow-xl shadow-black/10 backdrop-blur-sm">
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-semibold text-white">
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  {isEditing && (
                    <div className="space-y-3">
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
                        className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                      />

                      {/* Skill Suggestions */}
                      <div className="flex flex-wrap gap-1">
                        {skillSuggestions
                          .filter(
                            (skill) =>
                              !formData.skills.includes(skill) &&
                              skill
                                .toLowerCase()
                                .includes(skillInput.toLowerCase()),
                          )
                          .slice(0, 6)
                          .map((skill) => (
                            <Button
                              key={skill}
                              variant="outline"
                              size="sm"
                              onClick={() => addSkill(skill)}
                              className="border-slate-600/50 bg-slate-800/30 text-xs text-slate-300 hover:bg-blue-950/50 hover:text-blue-300"
                            >
                              + {skill}
                            </Button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Selected Skills */}
                  <div className="flex flex-wrap gap-1">
                    {formData.skills.map((skill) => (
                      <Badge
                        key={skill}
                        className="border-blue-800/50 bg-blue-900/50 px-2 py-1 text-xs text-blue-300 hover:bg-blue-800/50"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-blue-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Growth Areas */}
              <Card className="gap-0 border-slate-800/50 bg-slate-900/50 p-0 shadow-xl shadow-black/10 backdrop-blur-sm">
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-semibold text-white">
                    Areas to Grow In
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {growthAreaOptions.map((area) => (
                      <div
                        key={area}
                        className={`flex cursor-pointer items-center space-x-2 rounded-lg border p-2 text-sm transition-all ${
                          formData.growthAreas.includes(area)
                            ? "border-blue-500/50 bg-blue-950/30 shadow-sm shadow-blue-600/20"
                            : isEditing
                              ? "border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50"
                              : "cursor-not-allowed border-slate-700/30 bg-slate-800/20 opacity-60"
                        }`}
                        onClick={() => isEditing && toggleGrowthArea(area)}
                      >
                        <Checkbox
                          checked={formData.growthAreas.includes(area)}
                          onChange={() => isEditing && toggleGrowthArea(area)}
                          disabled={!isEditing}
                          className="border-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                        />
                        <Label className="flex-1 cursor-pointer text-sm text-slate-200">
                          {area}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}
