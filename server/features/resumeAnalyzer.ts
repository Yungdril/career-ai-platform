import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { storagePut } from "../storage";
import { createResume } from "../db";
import * as pdfjsLib from "pdfjs-dist";

export const resumeAnalyzerRouter = router({
  uploadAndAnalyze: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileContent: z.instanceof(Uint8Array),
        fileType: z.enum(["pdf", "docx"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Extract text from PDF
        let extractedText = "";
        if (input.fileType === "pdf") {
          try {
            const pdf = await pdfjsLib.getDocument({ data: input.fileContent }).promise;
            const pages = [];
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const text = textContent.items.map((item: any) => item.str).join(" ");
              pages.push(text);
            }
            extractedText = pages.join("\n");
          } catch (e) {
            console.error("PDF parsing error:", e);
            extractedText = "";
          }
        } else {
          // For DOCX, we'll use a simple placeholder
          // In production, you'd use a library like mammoth
          const decoder = new TextDecoder();
          extractedText = decoder.decode(input.fileContent);
        }

        // Upload file to S3
        const fileKey = `resumes/${ctx.user.id}/${Date.now()}-${input.fileName}`;
        const { url: fileUrl } = await storagePut(
          fileKey,
          input.fileContent,
          input.fileType === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );

        // Analyze with AI first
        const analysis = await analyzeResumeWithAI(extractedText);

        // Create resume record with analysis
        await createResume({
          userId: ctx.user.id,
          fileName: input.fileName,
          fileKey,
          fileUrl,
          content: extractedText,
          analysis: JSON.stringify(analysis),
          atsScore: analysis.atsScore,
        });

        return {
          success: true,
          score: analysis.atsScore,
          atsScore: analysis.atsScore,
          strengths: analysis.strengths,
          improvements: analysis.improvements,
          analysis: `## Resume Analysis Report\n\n### ATS Score: ${analysis.atsScore}/100\n\n### Strengths\n${analysis.strengths.map((s: string) => `- ${s}`).join("\n")}\n\n### Missing Keywords\n${analysis.missingKeywords.map((k: string) => `- ${k}`).join("\n")}\n\n### Formatting Issues\n${analysis.formattingIssues.map((f: string) => `- ${f}`).join("\n")}\n\n### Improvements\n${analysis.improvements.map((i: string) => `- ${i}`).join("\n")}\n\n### Industry Recommendations\n${analysis.industryRecommendations.map((r: string) => `- ${r}`).join("\n")}`,
        };
      } catch (error) {
        console.error("Resume upload error:", error);
        throw new Error("Failed to upload and analyze resume");
      }
    }),

  rewriteResume: protectedProcedure
    .input(
      z.object({
        originalContent: z.string(),
        analysis: z.object({
          strengths: z.array(z.string()),
          improvements: z.array(z.string()),
          missingKeywords: z.array(z.string()),
          industryRecommendations: z.array(z.string()),
        }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const improvedResume = await rewriteResumeWithAI(
          input.originalContent,
          input.analysis
        );
        return {
          success: true,
          improvedResume,
        };
      } catch (error) {
        console.error("Resume rewriting error:", error);
        throw new Error("Failed to rewrite resume");
      }
    }),

  analyzeExisting: protectedProcedure
    .input(z.object({ resumeId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        // TODO: Implement re-analysis of existing resume
        return { success: true };
      } catch (error) {
        console.error("Resume analysis error:", error);
        throw new Error("Failed to analyze resume");
      }
    }),
});

async function rewriteResumeWithAI(
  originalContent: string,
  analysis: {
    strengths: string[];
    improvements: string[];
    missingKeywords: string[];
    industryRecommendations: string[];
  }
) {
  const prompt = `You are an expert resume writer and career coach. Your task is to rewrite the following resume to incorporate all the improvements and suggestions provided.

Original Resume:
${originalContent}

Analysis Feedback:

Strengths to Maintain:
${analysis.strengths.map((s) => `- ${s}`).join("\n")}

Improvements to Apply:
${analysis.improvements.map((i) => `- ${i}`).join("\n")}

Missing Keywords to Add:
${analysis.missingKeywords.map((k) => `- ${k}`).join("\n")}

Industry Recommendations:
${analysis.industryRecommendations.map((r) => `- ${r}`).join("\n")}

Please rewrite the resume incorporating all these improvements while maintaining the candidate's authentic voice and experience. The rewritten resume should:
1. Keep all the candidate's real experiences and achievements
2. Improve formatting and structure for ATS compatibility
3. Add the missing keywords naturally throughout
4. Apply all suggested improvements
5. Follow industry best practices
6. Be ready for immediate submission

Return ONLY the improved resume text, no explanations or markdown formatting.`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are an expert resume writer. Rewrite resumes to be more impactful, ATS-friendly, and professional while maintaining authenticity.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  try {
    const content = response.choices[0]?.message.content;
    if (typeof content === "string") {
      return content;
    }
    return "";
  } catch (error) {
    console.error("Failed to rewrite resume:", error);
    return originalContent;
  }
}

async function analyzeResumeWithAI(resumeContent: string) {
  const prompt = `You are an expert resume reviewer and ATS (Applicant Tracking System) specialist. Analyze the following resume and provide:

1. ATS Compatibility Score (0-100): How well will this resume pass through ATS systems?
2. Key Strengths: What are the strongest parts of this resume?
3. Missing Keywords: What important keywords or skills are missing?
4. Formatting Issues: Any formatting problems that could hurt ATS compatibility?
5. Improvement Suggestions: Top 5 actionable improvements
6. Industry-Specific Recommendations: Tailored advice for the candidate's industry

Resume Content:
${resumeContent}

Provide your analysis in a structured JSON format.`;

  // Set worker for PDF processing
  if (typeof pdfjsLib.GlobalWorkerOptions !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are an expert resume reviewer. Provide detailed, actionable feedback on resumes to help candidates improve their chances of getting hired.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "resume_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            atsScore: {
              type: "integer",
              description: "ATS compatibility score from 0-100",
            },
            strengths: {
              type: "array",
              items: { type: "string" },
              description: "Key strengths of the resume",
            },
            missingKeywords: {
              type: "array",
              items: { type: "string" },
              description: "Important missing keywords",
            },
            formattingIssues: {
              type: "array",
              items: { type: "string" },
              description: "Formatting problems identified",
            },
            improvements: {
              type: "array",
              items: { type: "string" },
              description: "Top 5 actionable improvements",
            },
            industryRecommendations: {
              type: "array",
              items: { type: "string" },
              description: "Industry-specific recommendations",
            },
          },
          required: [
            "atsScore",
            "strengths",
            "missingKeywords",
            "formattingIssues",
            "improvements",
            "industryRecommendations",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  try {
    const content = response.choices[0]?.message.content;
    if (typeof content === "string") {
      return JSON.parse(content);
    }
    return content;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return {
      atsScore: 0,
      strengths: [],
      missingKeywords: [],
      formattingIssues: [],
      improvements: [],
      industryRecommendations: [],
    };
  }
}
