import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Briefcase, Linkedin, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const tools = [
    {
      id: "resume",
      title: "Resume Analyzer",
      description: "Upload your resume and get AI-powered analysis with improvement suggestions",
      icon: FileText,
      href: "/resume-analyzer",
      color: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      id: "interview",
      title: "Interview Preparation",
      description: "Practice with AI-generated questions and get feedback on your answers",
      icon: Briefcase,
      href: "/interview-prep",
      color: "from-purple-500/20 to-purple-600/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    {
      id: "linkedin",
      title: "LinkedIn Optimizer",
      description: "Optimize your LinkedIn profile with AI-powered recommendations",
      icon: Linkedin,
      href: "/linkedin-optimizer",
      color: "from-cyan-500/20 to-cyan-600/20",
      borderColor: "border-cyan-200 dark:border-cyan-800",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Welcome back, {user?.name || "Career Seeker"}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose a tool below to start improving your career prospects
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.id}
                className={`border-2 ${tool.borderColor} hover:shadow-lg transition-all cursor-pointer group`}
                onClick={() => navigate(tool.href)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="group-hover:text-accent transition-colors">
                    {tool.title}
                  </CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    className="gap-2 text-accent hover:text-accent hover:bg-accent/10 w-full justify-start"
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 pt-8 border-t border-border/40">
          <Card className="bg-gradient-to-br from-accent/5 to-transparent border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Resumes Analyzed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">0</div>
              <p className="text-xs text-muted-foreground mt-2">
                Start by uploading your first resume
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/5 to-transparent border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Interviews Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">0</div>
              <p className="text-xs text-muted-foreground mt-2">
                Practice your interview skills
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/5 to-transparent border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                LinkedIn Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">—</div>
              <p className="text-xs text-muted-foreground mt-2">
                Optimize your profile
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
