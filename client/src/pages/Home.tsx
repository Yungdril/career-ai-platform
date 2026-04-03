import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { FileText, Briefcase, Linkedin, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (isAuthenticated && user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663509022194/fqTiwKMMFBcdmhrMEyWGCi/Untitleddesign_159d8bf6.png" 
              alt="Hirix" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-foreground">Hirix</span>
          </div>
          <a href={getLoginUrl()}>
            <Button size="sm" variant="default">
              Sign In
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Welcome to <span className="text-accent">Hirix</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Your AI-powered career companion. Get hired faster with intelligent resume analysis, interview preparation, and LinkedIn optimization—all in one platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a href={getLoginUrl()}>
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 text-sm text-muted-foreground border-t border-border/40">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Trusted by job seekers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>AI-powered insights</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>100% private & secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Three Powerful Tools
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to stand out to employers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Resume Analyzer Card */}
            <Card className="border-border/50 hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Resume Analyzer</CardTitle>
                <CardDescription>
                  Get instant AI feedback on your resume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">ATS compatibility score</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Missing keywords detection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Actionable improvements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Interview Prep Card */}
            <Card className="border-border/50 hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10 md:scale-105">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Interview Prep</CardTitle>
                <CardDescription>
                  Practice with AI-generated questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Role-specific questions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">AI-powered feedback</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Track your progress</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* LinkedIn Optimizer Card */}
            <Card className="border-border/50 hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Linkedin className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>LinkedIn Optimizer</CardTitle>
                <CardDescription>
                  Optimize your LinkedIn profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Headline suggestions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Summary improvements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Experience optimization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl border border-accent/20 p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ready to advance your career?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of job seekers using CareerAI to land their dream jobs.
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="gap-2">
              Start Your Free Account <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 CareerAI. Powered by advanced AI technology.</p>
        </div>
      </footer>
    </div>
  );
}
