import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { FileText, Briefcase, Linkedin, ArrowRight, CheckCircle2, Sparkles, Zap, Shield } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (isAuthenticated && user) {
    navigate("/dashboard");
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
      <section className="container py-20 md:py-32 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful AI tools designed to give you a competitive edge in your job search
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Resume Analyzer Card */}
            <Card className="border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Resume Analyzer</CardTitle>
                <CardDescription>
                  Get AI-powered feedback on your resume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">ATS compatibility scoring</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Keyword optimization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">AI-rewritten resume</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">PDF export ready</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Interview Prep Card - Featured */}
            <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/2 hover:shadow-lg transition-all duration-300 group md:scale-105 md:z-10">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl">Interview Prep</CardTitle>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary">Popular</span>
                </div>
                <CardDescription>
                  Practice with AI-generated interview questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Role-specific questions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Real-time AI feedback</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Performance tracking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Unlimited practice</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* LinkedIn Optimizer Card */}
            <Card className="border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Linkedin className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">LinkedIn Optimizer</CardTitle>
                <CardDescription>
                  Optimize your professional profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Headline suggestions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Summary improvements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Experience optimization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Recruiter visibility boost</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container py-20 md:py-32 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Why Choose Hirix?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">100% Private & Secure</h3>
                  <p className="text-muted-foreground">Your data is encrypted and never shared with third parties</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Instant Results</h3>
                  <p className="text-muted-foreground">Get AI feedback on your resume in seconds</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Proven Results</h3>
                  <p className="text-muted-foreground">95% of users report improved interview performance</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Always Improving</h3>
                  <p className="text-muted-foreground">AI-powered features that get smarter over time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 md:py-32 border-t border-border">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ready to advance your career?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of professionals using Hirix to land their dream jobs.
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-lg h-12 px-8">
              Start Your Free Account <ArrowRight className="w-5 h-5" />
            </Button>
          </a>
          <p className="text-sm text-muted-foreground">No credit card required. Free forever.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Hirix. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </footer>
    </div>
  );
}
