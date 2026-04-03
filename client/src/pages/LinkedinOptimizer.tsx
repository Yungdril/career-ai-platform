import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Linkedin, Loader2, Copy, Check } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function LinkedinOptimizer() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [experience, setExperience] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // TODO: Implement LinkedIn profile query

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleAnalyze = async () => {
    if (!headline.trim() && !summary.trim() && !experience.trim()) return;

    setAnalyzing(true);
    try {
      // TODO: Implement LinkedIn profile analysis with AI
      console.log("Analyzing LinkedIn profile");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            LinkedIn Profile Optimizer
          </h1>
          <p className="text-lg text-muted-foreground">
            Get AI-powered recommendations to optimize your LinkedIn profile
          </p>
        </div>

        {/* Input Section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Your LinkedIn Profile</CardTitle>
            <CardDescription>
              Paste your current LinkedIn content to get optimization suggestions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Headline
                </label>
                <input
                  type="text"
                  placeholder="Your current LinkedIn headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  About/Summary
                </label>
                <Textarea
                  placeholder="Your current LinkedIn about section"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="min-h-24 bg-background border-border/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Experience
                </label>
                <Textarea
                  placeholder="Your current work experience or key achievements"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="min-h-24 bg-background border-border/50"
                />
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={
                analyzing ||
                (!headline.trim() && !summary.trim() && !experience.trim())
              }
              className="w-full gap-2"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Linkedin className="w-4 h-4" />
                  Get Recommendations
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Recommendations Section */}
        {/* TODO: Display optimization recommendations and analysis */}
      </div>
    </DashboardLayout>
  );
}
