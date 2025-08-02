"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Eye,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import {
  useDropzone,
  type DropzoneInputProps,
  type DropzoneRootProps,
} from "react-dropzone";

import * as mammoth from "mammoth";
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
} from "pdfjs-dist";
import type { TextContent } from "pdfjs-dist/types/src/display/api";
import { cn } from "@/lib/utils";

// Needed to avoid CORS issues
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export interface CVAnalysis {
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

function getGradient(score: number) {
  if (score < 40) {
    // Red to orange
    return "linear-gradient(to right, #ef4444, #f97316)";
  } else if (score < 70) {
    // Orange to yellow
    return "linear-gradient(to right, #f59e0b, #facc15)";
  } else {
    // Yellow to green
    return "linear-gradient(to right, #facc15, #22c55e)";
  }
}

export default function CVReviewPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    const storedAnalysis = localStorage.getItem("analysis-data");

    if (storedAnalysis) {
      setAnalysis(JSON.parse(storedAnalysis) as CVAnalysis);
      setShowAnalysis(true);
    }
  }, []);

  const parseDocxFile = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const { value: html } = await mammoth.extractRawText({ arrayBuffer });

    return html;
  };

  const parsePdfFile = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf: PDFDocumentProxy = await getDocument({ data: arrayBuffer })
      .promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content: TextContent = await page.getTextContent();

      const pageText = content.items
        .map((item) => {
          if ("str" in item) return item.str;
          return "";
        })
        .join(" ");

      text += pageText + "\n";
    }

    return text;
  };

  const parseCVFile = async (file: File) => {
    const mime = file.type;
    if (mime === "application/pdf") return await parsePdfFile(file);
    if (
      mime ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mime === "application/msword"
    ) {
      return await parseDocxFile(file);
    }
    throw new Error("Unsupported file type");
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    void (async () => {
      const file = acceptedFiles[0];
      if (file) {
        setUploadedFile(file);
        setShowAnalysis(false);
        setAnalysis(null);
      }
    })();
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  }: {
    getRootProps: () => DropzoneRootProps;
    getInputProps: () => DropzoneInputProps;
    isDragActive: boolean;
  } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
    },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);

    try {
      const text = await parseCVFile(uploadedFile);

      const res = await fetch("/api/resume-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userCV: text }),
      });

      const modelAnalysis = (await res.json()) as {
        status: boolean;
        data: CVAnalysis;
      };

      if (!modelAnalysis.status) {
        console.log("Error analysis CV");
      }

      setAnalysis(modelAnalysis.data);
      setIsAnalyzing(false);
      setShowAnalysis(true);

      localStorage.setItem("analysis-data", JSON.stringify(modelAnalysis.data));
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "good":
        return <CheckCircle className="h-4 w-4 text-blue-400" />;
      case "needs-improvement":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case "missing":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-400";
      case "good":
        return "text-blue-400";
      case "needs-improvement":
        return "text-yellow-400";
      case "missing":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

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
                  <FileText className="h-6 w-6 text-blue-400" />
                  <div>
                    <h1 className="text-base font-bold text-white">
                      CV Review
                    </h1>
                    <p className="text-sm text-slate-400">
                      Get AI-powered feedback on your resume
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto max-w-6xl">
              {!showAnalysis ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {/* Upload Section */}
                  <div className="space-y-4">
                    <Card className="gap-0 border-slate-800/50 bg-slate-900/50 shadow-xl shadow-black/10 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
                          <Upload className="h-5 w-5 text-blue-400" />
                          Upload Your CV
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 p-4">
                        {/* File Upload Area */}
                        <div
                          {...getRootProps()}
                          className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all duration-300 ${
                            isDragActive
                              ? "border-blue-500/50 bg-blue-950/20"
                              : "border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-800/30"
                          }`}
                        >
                          <input {...getInputProps()} />
                          <div className="space-y-3">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                              <Upload className="h-6 w-6 text-blue-400" />
                            </div>
                            <div>
                              <p className="mb-2 text-sm font-medium text-slate-200">
                                {isDragActive
                                  ? "Drop your CV here"
                                  : "Drag & drop your CV here"}
                              </p>
                              <p className="mb-3 text-sm text-slate-400">
                                or click to browse files
                              </p>
                              <div className="flex justify-center gap-2">
                                <Badge className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-300">
                                  PDF
                                </Badge>
                                <Badge className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-300">
                                  DOCX
                                </Badge>
                                <Badge className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-300">
                                  DOC
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Uploaded File Info */}
                        {uploadedFile && (
                          <div className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                            <FileText className="h-5 w-5 flex-shrink-0 text-blue-400" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-200">
                                {uploadedFile.name}
                              </p>
                              <p className="text-sm text-slate-400">
                                {(uploadedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setUploadedFile(null)}
                              className="text-slate-400 hover:bg-slate-800 hover:text-red-400"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        {/* Analyze Button */}
                        <Button
                          onClick={handleAnalyze}
                          disabled={!uploadedFile || isAnalyzing}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-sm text-white shadow-lg ring-1 shadow-blue-600/25 ring-blue-500/20 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
                        >
                          {isAnalyzing ? (
                            <>
                              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                              Analyzing CV...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Analyze CV
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Analysis Progress */}
                    {isAnalyzing && (
                      <Card className="border-slate-800/50 bg-slate-900/50 shadow-xl shadow-black/10 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Sparkles className="h-5 w-5 animate-pulse text-blue-400" />
                              <span className="text-sm font-medium text-slate-200">
                                Analyzing your CV...
                              </span>
                            </div>
                            <Progress value={66} className="h-2" />
                            <div className="space-y-2 text-sm text-slate-400">
                              <p>✓ Parsing document structure</p>
                              <p>✓ Analyzing content quality</p>
                              <p className="text-blue-400">
                                → Generating recommendations...
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className="space-y-4">
                    <Card className="gap-0 border-slate-800/50 bg-slate-900/50 p-0 py-3 shadow-xl shadow-black/10 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
                          <Target className="h-5 w-5 text-blue-400" />
                          What We Analyze
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 p-3">
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            {
                              icon: <Users className="h-4 w-4 text-blue-400" />,
                              title: "Content Quality",
                              description:
                                "Professional summary, work experience",
                            },
                            {
                              icon: (
                                <TrendingUp className="h-4 w-4 text-green-400" />
                              ),
                              title: "Skills Assessment",
                              description:
                                "Technical and soft skills relevance",
                            },
                            {
                              icon: <Eye className="h-4 w-4 text-purple-400" />,
                              title: "Format & Structure",
                              description: "Layout, readability",
                            },
                            {
                              icon: (
                                <Target className="h-4 w-4 text-yellow-400" />
                              ),
                              title: "ATS Compatibility",
                              description: "Keyword optimization",
                            },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex gap-3 rounded-lg bg-slate-800/30 p-3"
                            >
                              <div className="mt-0.5 flex-shrink-0">
                                {item.icon}
                              </div>
                              <div>
                                <h4 className="mb-1 text-sm font-medium text-slate-200">
                                  {item.title}
                                </h4>
                                <p className="text-sm text-slate-400">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="gap-0 border-slate-800/50 bg-slate-900/50 shadow-xl shadow-black/10 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
                          <Clock className="h-5 w-5 text-blue-400" />
                          Quick Tips
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3">
                        <div className="space-y-2 text-sm text-slate-400">
                          <p>• Keep your CV to 1-2 pages</p>
                          <p>• Use quantifiable achievements</p>
                          <p>• Tailor keywords to match job descriptions</p>
                          <p>• Use a clean, professional format</p>
                          <p>• Include relevant certifications</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                /* Analysis Results */
                <div className="space-y-4">
                  {/* Overall Score */}
                  <Card className="border-slate-800/50 bg-slate-900/50 shadow-xl shadow-black/10 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <h2 className="mb-2 text-lg font-bold text-white">
                            CV Analysis Complete
                          </h2>
                          <p className="text-sm text-slate-400">
                            Here&apos;s your detailed CV review and
                            recommendations
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="mb-1 text-2xl font-bold text-blue-400">
                            {analysis?.overallScore}/100
                          </div>
                          <p className="text-sm text-slate-400">
                            Overall Score
                          </p>
                        </div>
                      </div>
                      <Progress
                        value={analysis!.overallScore}
                        className={cn(
                          "h-2 w-full bg-neutral-900/80",
                          analysis!.overallScore < 40 &&
                            "[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-orange-400",
                          analysis!.overallScore >= 40 &&
                            analysis!.overallScore < 70 &&
                            "[&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-yellow-300",
                          analysis!.overallScore >= 70 &&
                            "[&>div]:bg-gradient-to-r [&>div]:from-yellow-300 [&>div]:to-green-400",
                        )}
                      />
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Section Analysis */}
                    <Card className="gap-0 border-slate-800/50 bg-slate-900/50 p-0 shadow-xl shadow-black/10 backdrop-blur-sm">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base font-semibold text-white">
                          Section Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 p-4">
                        {analysis?.sections.map((section, index) => (
                          <div
                            key={index}
                            className="rounded-lg bg-slate-800/30 p-2"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(section.status)}
                                <span className="text-sm font-medium text-slate-200">
                                  {section.name}
                                </span>
                              </div>
                              <span
                                className={`text-sm font-medium ${getStatusColor(section.status)}`}
                              >
                                {section.score}/100
                              </span>
                            </div>
                            <p className="text-sm text-slate-400">
                              {section.feedback}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Keywords */}
                    <Card className="gap-0 border-slate-800/50 bg-slate-900/50 p-0 shadow-xl shadow-black/10 backdrop-blur-sm">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base font-semibold text-white">
                          Keywords Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 p-4">
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-green-400">
                            Present Keywords
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {analysis?.keywords.present.map(
                              (keyword, index) => (
                                <Badge
                                  key={index}
                                  className="border-green-800/50 bg-green-900/40 text-sm text-green-300"
                                >
                                  {keyword}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-red-400">
                            Missing Keywords
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {analysis?.keywords.missing.map(
                              (keyword, index) => (
                                <Badge
                                  key={index}
                                  className="border-red-800/50 bg-red-900/40 text-sm text-red-300"
                                >
                                  {keyword}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Strengths */}
                    <Card className="gap-0 border-slate-800/50 bg-slate-900/50 p-0 shadow-xl shadow-black/10 backdrop-blur-sm">
                      <CardHeader className="p-4">
                        <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <ul className="space-y-1">
                          {analysis?.strengths.map((strength, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-slate-300"
                            >
                              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Improvements */}
                    <Card className="gap-0 border-slate-800/50 bg-slate-900/50 p-0 shadow-xl shadow-black/10 backdrop-blur-sm">
                      <CardHeader className="p-3">
                        <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
                          <TrendingUp className="h-4 w-4 text-yellow-400" />
                          Areas for Improvement
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <ul className="space-y-1">
                          {analysis?.improvements.map((improvement, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-slate-300"
                            >
                              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Suggestions */}
                  <Card className="gap-0 border-slate-800/50 bg-slate-900/50 p-0 shadow-xl shadow-black/10 backdrop-blur-sm">
                    <CardHeader className="p-4">
                      <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
                        <Sparkles className="h-4 w-4 text-blue-400" />
                        (🚧👷‍♂️🛠️ Soon) - AI Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {analysis?.suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="rounded-lg bg-slate-800/30 p-3"
                          >
                            <p className="text-sm text-slate-300">
                              {suggestion}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Button
                      onClick={() => setShowAnalysis(false)}
                      variant="outline"
                      className="border-slate-600/50 bg-slate-800/30 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-slate-200"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Analyze Another CV
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-sm text-white shadow-lg shadow-blue-600/25 hover:from-blue-700 hover:to-blue-800">
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}
