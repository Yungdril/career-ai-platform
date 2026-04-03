import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function ResumeAnalyzer() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // TODO: Implement resume list query

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // TODO: Implement file upload to S3 and resume analysis
      console.log("Uploading file:", selectedFile.name);
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Resume Analyzer
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload your resume to get AI-powered analysis and improvement suggestions
          </p>
        </div>

        {/* Upload Section */}
        <Card className="border-2 border-dashed border-accent/30 hover:border-accent/50 transition-colors">
          <CardHeader>
            <CardTitle>Upload Your Resume</CardTitle>
            <CardDescription>
              Supported formats: PDF, DOCX (Max 5MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-accent" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-semibold text-foreground">
                  {selectedFile ? selectedFile.name : "Choose a file or drag and drop"}
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF or DOCX files up to 5MB
                </p>
              </div>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileSelect}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload">
                <Button asChild variant="outline">
                  <span>Select File</span>
                </Button>
              </label>
            </div>

            {selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Analyze Resume
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Previous Analyses */}
        {/* TODO: Display previous analyses */}
      </div>
    </DashboardLayout>
  );
}
