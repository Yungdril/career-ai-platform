import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { FileText, Briefcase, Linkedin, ArrowRight, CheckCircle2, Sparkles, Zap, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useRef } from "react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (isAuthenticated && user && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate("/dashboard");
    }
  }, [isAuthenticated, user]);

  if (isAuthenticated && user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
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
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Sign In
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Career Development</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Land Your Dream Job with <span className="text-primary">AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
              Hirix combines intelligent resume analysis, interview preparation, and LinkedIn optimization to help you stand out to employers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a href={getLoginUrl()}>
              <Button size="lg" className="gap-2 w-full sm:w-auto bg-primary hover:bg-primary/90 text-lg h-12 px-8">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-12 px-8">
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid sm:grid-cols-3 gap-6 pt-12 border-t border-border">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <p className="text-sm text-muted-foreground">Job seekers helped</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">95%</div>
              <p className="text-sm text-muted-foreground">Success rate</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <p className="text-sm text-muted-foreground">AI support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Powerful AI Tools for Career Success</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need to land your dream job</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Resume Analyzer */}
            <Card className="border border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Resume Analyzer</CardTitle>
                <CardDescription>Get AI-powered feedback on your resume</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    ATS compatibility scoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Improvement suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    AI-rewritten resume
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Interview Prep */}
            <Card className="border border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Interview Preparation</CardTitle>
                <CardDescription>Practice with AI-generated questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Role-specific questions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    AI feedback on answers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Progress tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* LinkedIn Optimizer */}
            <Card className="border border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Linkedin className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>LinkedIn Optimizer</CardTitle>
                <CardDescription>Optimize your LinkedIn profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Headline optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Summary improvements
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Experience section tips
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Hirix Section */}
      <section className="container py-20 md:py-32 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Why Choose Hirix?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Lightning Fast</h3>
                  <p className="text-muted-foreground">Get instant AI feedback powered by cutting-edge technology</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Privacy First</h3>
                  <p className="text-muted-foreground">Your data is secure and never shared with third parties</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">AI-Powered</h3>
                  <p className="text-muted-foreground">Powered by advanced AI models for accurate analysis</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Proven Results</h3>
                  <p className="text-muted-foreground">Join thousands of job seekers who landed their dream jobs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-primary/5 rounded-2xl p-12 border border-primary/10">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Ready to Land Your Dream Job?</h2>
          <p className="text-xl text-muted-foreground">Start using Hirix today and get instant AI feedback on your career materials</p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-lg h-12 px-8">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 py-12">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">&copy; 2026 Hirix. All rights reserved.</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
