import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Play, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function InterviewPrep() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [jobRole, setJobRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [generating, setGenerating] = useState(false);

  // TODO: Implement interview list query

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleGenerateQuestions = async () => {
    if (!jobRole.trim()) return;

    setGenerating(true);
    try {
      // TODO: Implement question generation with AI
      console.log("Generating questions for:", jobRole, industry);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Interview Preparation
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate practice questions and get AI feedback on your answers
          </p>
        </div>

        {/* Generate Section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Generate Practice Questions</CardTitle>
            <CardDescription>
              Tell us about the role you're preparing for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Job Role *
                </label>
                <Input
                  placeholder="e.g., Senior Software Engineer, Product Manager"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="bg-background border-border/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Industry (Optional)
                </label>
                <Input
                  placeholder="e.g., Tech, Finance, Healthcare"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="bg-background border-border/50"
                />
              </div>
            </div>

            <Button
              onClick={handleGenerateQuestions}
              disabled={generating || !jobRole.trim()}
              className="w-full gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4" />
                  Generate Questions
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Previous Interviews */}
        {/* TODO: Display interview sessions */}
      </div>
    </DashboardLayout>
  );
}
