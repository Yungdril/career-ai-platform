import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Play, Loader2, CheckCircle2, MessageSquare, Volume2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Question {
  question: string;
  difficulty: string;
  category: string;
}

interface InterviewSession {
  interviewId: number;
  questions: Question[];
  currentQuestionIndex: number;
  answers: string[];
  feedback: any;
}

export default function InterviewPrep() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [jobRole, setJobRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [generating, setGenerating] = useState(false);
  const [interviewSession, setInterviewSession] = useState<InterviewSession | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [submittingAnswers, setSubmittingAnswers] = useState(false);

  const generateQuestionsMutation = trpc.interviewPrep.generateQuestions.useMutation({
    onSuccess: (data) => {
      setInterviewSession({
        interviewId: data.interviewId,
        questions: data.questions,
        currentQuestionIndex: 0,
        answers: new Array(data.questions.length).fill(""),
        feedback: null,
      });
      setCurrentAnswer("");
      toast.success("Interview questions generated successfully!");
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to generate questions. Please try again.";
      toast.error(errorMessage);
    },
  });

  const submitAnswersMutation = trpc.interviewPrep.submitAnswers.useMutation({
    onSuccess: (data) => {
      if (interviewSession) {
        setInterviewSession({
          ...interviewSession,
          feedback: data.feedback,
        });
      }
      toast.success("Answers submitted! Check your feedback below.");
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to submit answers. Please try again.";
      toast.error(errorMessage);
    },
  });

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleGenerateQuestions = async () => {
    if (!jobRole.trim()) {
      toast.error("Please enter a job role");
      return;
    }

    setGenerating(true);
    try {
      await generateQuestionsMutation.mutateAsync({
        jobRole,
        industry: industry || undefined,
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleNextQuestion = () => {
    if (interviewSession && interviewSession.currentQuestionIndex < interviewSession.questions.length - 1) {
      // Save current answer
      const newAnswers = [...interviewSession.answers];
      newAnswers[interviewSession.currentQuestionIndex] = currentAnswer;

      setInterviewSession({
        ...interviewSession,
        answers: newAnswers,
        currentQuestionIndex: interviewSession.currentQuestionIndex + 1,
      });
      setCurrentAnswer(newAnswers[interviewSession.currentQuestionIndex + 1] || "");
    }
  };

  const handlePreviousQuestion = () => {
    if (interviewSession && interviewSession.currentQuestionIndex > 0) {
      // Save current answer
      const newAnswers = [...interviewSession.answers];
      newAnswers[interviewSession.currentQuestionIndex] = currentAnswer;

      setInterviewSession({
        ...interviewSession,
        answers: newAnswers,
        currentQuestionIndex: interviewSession.currentQuestionIndex - 1,
      });
      setCurrentAnswer(newAnswers[interviewSession.currentQuestionIndex - 1] || "");
    }
  };

  const handleSubmitAnswers = async () => {
    if (!interviewSession) return;

    // Save current answer
    const newAnswers = [...interviewSession.answers];
    newAnswers[interviewSession.currentQuestionIndex] = currentAnswer;

    // Check if all questions are answered
    if (newAnswers.some((answer) => !answer.trim())) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    setSubmittingAnswers(true);
    try {
      const responses = newAnswers.map((answer, index) => ({
        questionIndex: index,
        answer,
      }));

      await submitAnswersMutation.mutateAsync({
        interviewId: interviewSession.interviewId,
        responses,
      });
    } finally {
      setSubmittingAnswers(false);
    }
  };

  const handleStartOver = () => {
    setInterviewSession(null);
    setJobRole("");
    setIndustry("");
    setCurrentAnswer("");
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
        {!interviewSession && (
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
                disabled={generating || generateQuestionsMutation.isPending || !jobRole.trim()}
                className="w-full gap-2"
              >
                {generating || generateQuestionsMutation.isPending ? (
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
        )}

        {/* Interview Session */}
        {interviewSession && !interviewSession.feedback && (
          <div className="space-y-6">
            {/* Progress */}
            <Card className="border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-blue-50/20 dark:from-blue-950/20 dark:to-blue-950/10">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      Question {interviewSession.currentQuestionIndex + 1} of {interviewSession.questions.length}
                    </span>
                    <span className="text-muted-foreground">
                      {Math.round(
                        ((interviewSession.currentQuestionIndex + 1) / interviewSession.questions.length) * 100
                      )}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${((interviewSession.currentQuestionIndex + 1) / interviewSession.questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Question */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  Question
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-lg font-semibold text-foreground">
                      {interviewSession.questions[interviewSession.currentQuestionIndex]?.question}
                    </p>
                    <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                      <span>
                        Difficulty:{" "}
                        <span className="font-medium">
                          {interviewSession.questions[interviewSession.currentQuestionIndex]?.difficulty}
                        </span>
                      </span>
                      <span>
                        Category:{" "}
                        <span className="font-medium">
                          {interviewSession.questions[interviewSession.currentQuestionIndex]?.category}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Your Answer</label>
                    <Textarea
                      placeholder="Type your answer here... (Be thorough and clear)"
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      className="min-h-32 bg-background border-border/50"
                    />
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3 justify-between">
                  <Button
                    onClick={handlePreviousQuestion}
                    disabled={interviewSession.currentQuestionIndex === 0}
                    variant="outline"
                  >
                    Previous
                  </Button>

                  {interviewSession.currentQuestionIndex === interviewSession.questions.length - 1 ? (
                    <Button
                      onClick={handleSubmitAnswers}
                      disabled={submittingAnswers || submitAnswersMutation.isPending}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      {submittingAnswers || submitAnswersMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Submit Answers
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button onClick={handleNextQuestion} className="gap-2">
                      Next
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feedback Section */}
        {interviewSession && interviewSession.feedback && (
          <div className="space-y-6">
            <Card className="border-green-200/50 bg-gradient-to-br from-green-50/50 to-green-50/20 dark:from-green-950/20 dark:to-green-950/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Interview Complete!
                </CardTitle>
                <CardDescription>
                  Here's your AI feedback on your answers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-border/50">
                  <p className="text-foreground whitespace-pre-wrap">
                    {typeof interviewSession.feedback === "string"
                      ? interviewSession.feedback
                      : JSON.stringify(interviewSession.feedback, null, 2)}
                  </p>
                </div>

                <Button onClick={handleStartOver} className="w-full gap-2">
                  <Briefcase className="w-4 h-4" />
                  Start Another Interview
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
