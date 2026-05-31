import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { invokeGroqJSON } from "../_core/groq";
import { createInterview, updateInterview } from "../db";

export const interviewPrepRouter = router({
  generateQuestions: protectedProcedure
    .input(
      z.object({
        jobRole: z.string(),
        industry: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Create interview session
        const result = await createInterview({
          userId: ctx.user.id,
          jobRole: input.jobRole,
          industry: input.industry,
          status: "draft",
        });

        // Generate questions with AI (using Groq for speed)
        const questions = await generateInterviewQuestions(
          input.jobRole,
          input.industry
        );

        // Update interview with questions
        const interviewId = (result as any).insertId;
        if (interviewId) {
          await updateInterview(interviewId, {
            questions: JSON.stringify(questions),
            status: "in_progress",
          });
        }

        return {
          success: true,
          interviewId,
          questions,
        };
      } catch (error) {
        console.error("Interview generation error:", error);
        throw new Error("Failed to generate interview questions");
      }
    }),

  submitAnswers: protectedProcedure
    .input(
      z.object({
        interviewId: z.number(),
        responses: z.array(
          z.object({
            questionIndex: z.number(),
            answer: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Generate AI feedback on answers (using OpenAI for quality)
        const feedback = await generateInterviewFeedback(input.responses);

        // Update interview with responses and feedback
        await updateInterview(input.interviewId, {
          responses: JSON.stringify(input.responses),
          feedback: JSON.stringify(feedback),
          status: "completed",
        });

        return {
          success: true,
          feedback,
        };
      } catch (error) {
        console.error("Interview feedback error:", error);
        throw new Error("Failed to generate interview feedback");
      }
    }),
});

async function generateInterviewQuestions(
  jobRole: string,
  industry?: string
) {
  const prompt = `Generate 5 realistic and challenging interview questions for a ${jobRole} position${
    industry ? ` in the ${industry} industry` : ""
  }.

Return as JSON with this structure:
{
  "questions": [
    {
      "question": "...",
      "whatTheyAreLookingFor": "...",
      "tipsForAnswering": ["...", "..."]
    }
  ]
}

Focus on behavioral, technical (if applicable), and situational questions that are commonly asked for this role.`;

  try {
    // Use Groq for fast question generation
    const result = await invokeGroqJSON<{
      questions: Array<{
        question: string;
        whatTheyAreLookingFor: string;
        tipsForAnswering: string[];
      }>;
    }>({
      messages: [
        {
          role: "system",
          content:
            "You are an expert interview coach. Generate realistic and challenging interview questions that help candidates prepare effectively. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2048,
    });
    return result.questions;
  } catch (error) {
    console.error("Failed to generate questions with Groq:", error);
    // Fallback to OpenAI if Groq fails
    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "You are an expert interview coach. Generate realistic and challenging interview questions that help candidates prepare effectively.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });
      const content = response.choices[0]?.message.content;
      if (typeof content === "string") {
        const parsed = JSON.parse(content);
        return parsed.questions;
      }
      return (content as any).questions || [];
    } catch (fallbackError) {
      console.error("Failed to parse questions response:", fallbackError);
      return [];
    }
  }
}

async function generateInterviewFeedback(
  responses: Array<{ questionIndex: number; answer: string }>
) {
  const responsesText = responses
    .map(
      (r, i) =>
        `Question ${r.questionIndex + 1}: ${r.answer}`
    )
    .join("\n\n");

  const prompt = `You are an expert interview coach. Analyze the following interview answers and provide detailed feedback on each one.

${responsesText}

For each answer, provide:
1. Strengths: What was done well
2. Areas for Improvement: What could be better
3. Suggested Approach: A better way to answer this question
4. Overall Score: Rate the answer from 1-10

Also provide an overall interview performance summary.`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are an expert interview coach providing constructive feedback to help candidates improve their interview performance.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "interview_feedback",
        strict: true,
        schema: {
          type: "object",
          properties: {
            answerFeedback: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  questionIndex: { type: "number" },
                  strengths: {
                    type: "array",
                    items: { type: "string" },
                  },
                  areasForImprovement: {
                    type: "array",
                    items: { type: "string" },
                  },
                  suggestedApproach: { type: "string" },
                  score: { type: "number" },
                },
                required: [
                  "questionIndex",
                  "strengths",
                  "areasForImprovement",
                  "suggestedApproach",
                  "score",
                ],
                additionalProperties: false,
              },
            },
            overallSummary: { type: "string" },
            averageScore: { type: "number" },
          },
          required: ["answerFeedback", "overallSummary", "averageScore"],
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
    console.error("Failed to parse feedback response:", error);
    return {
      answerFeedback: [],
      overallSummary: "",
      averageScore: 0,
    };
  }
}
