import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { getUserLinkedinProfile, createLinkedinProfile, updateLinkedinProfile } from "../db";

export const linkedinOptimizerRouter = router({
  analyze: protectedProcedure
    .input(
      z.object({
        headline: z.string().optional(),
        summary: z.string().optional(),
        experience: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Get or create LinkedIn profile
        let profile = await getUserLinkedinProfile(ctx.user.id);

        let profileId: number;
        if (!profile) {
          const result = await createLinkedinProfile({
            userId: ctx.user.id,
            headline: input.headline || undefined,
            summary: input.summary || undefined,
            experience: input.experience || undefined,
          });
          profileId = (result as any).insertId;
        } else {
          profileId = profile.id;
        }

        // Analyze with AI
        const { analysis, recommendations } = await analyzeLinkedinProfile(
          input.headline,
          input.summary,
          input.experience
        );

        // Update profile with analysis
        await updateLinkedinProfile(profileId, {
          headline: input.headline,
          summary: input.summary,
          experience: input.experience,
          analysis: JSON.stringify(analysis),
          recommendations: JSON.stringify(recommendations),
        });

        return {
          success: true,
          analysis,
          recommendations,
        };
      } catch (error) {
        console.error("LinkedIn analysis error:", error);
        throw new Error("Failed to analyze LinkedIn profile");
      }
    }),
});

async function analyzeLinkedinProfile(
  headline?: string,
  summary?: string,
  experience?: string
) {
  const profileContent = `
Headline: ${headline || "Not provided"}
Summary: ${summary || "Not provided"}
Experience: ${experience || "Not provided"}
`;

  const prompt = `You are a LinkedIn profile optimization expert. Analyze the following LinkedIn profile content and provide detailed recommendations for improvement.

${profileContent}

Provide:
1. Analysis of current profile strengths and weaknesses
2. Specific recommendations for the headline
3. Recommendations for the about/summary section
4. Recommendations for the experience section
5. Overall optimization score (0-100)
6. Top 3 priority improvements

Focus on making the profile more attractive to recruiters and improving discoverability.`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are a LinkedIn profile optimization expert. Provide actionable recommendations to help professionals improve their LinkedIn profiles and attract more opportunities.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "linkedin_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            overallScore: { type: "number" },
            strengths: {
              type: "array",
              items: { type: "string" },
            },
            weaknesses: {
              type: "array",
              items: { type: "string" },
            },
            headlineRecommendations: {
              type: "array",
              items: { type: "string" },
            },
            summaryRecommendations: {
              type: "array",
              items: { type: "string" },
            },
            experienceRecommendations: {
              type: "array",
              items: { type: "string" },
            },
            topPriorities: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: [
            "overallScore",
            "strengths",
            "weaknesses",
            "headlineRecommendations",
            "summaryRecommendations",
            "experienceRecommendations",
            "topPriorities",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  try {
    const content = response.choices[0]?.message.content;
    if (typeof content === "string") {
      const analysis = JSON.parse(content);
      return {
        analysis,
        recommendations: generateRecommendations(analysis),
      };
    }
    return {
      analysis: content,
      recommendations: generateRecommendations(content as any),
    };
  } catch (error) {
    console.error("Failed to parse LinkedIn analysis:", error);
    return {
      analysis: {},
      recommendations: [],
    };
  }
}

function generateRecommendations(analysis: any): string {
  const sections = [];

  if (analysis.topPriorities && analysis.topPriorities.length > 0) {
    sections.push("## Top Priorities\n");
    analysis.topPriorities.forEach((priority: string, i: number) => {
      sections.push(`${i + 1}. ${priority}`);
    });
  }

  if (
    analysis.headlineRecommendations &&
    analysis.headlineRecommendations.length > 0
  ) {
    sections.push("\n## Headline Recommendations\n");
    analysis.headlineRecommendations.forEach((rec: string) => {
      sections.push(`- ${rec}`);
    });
  }

  if (
    analysis.summaryRecommendations &&
    analysis.summaryRecommendations.length > 0
  ) {
    sections.push("\n## Summary Recommendations\n");
    analysis.summaryRecommendations.forEach((rec: string) => {
      sections.push(`- ${rec}`);
    });
  }

  if (
    analysis.experienceRecommendations &&
    analysis.experienceRecommendations.length > 0
  ) {
    sections.push("\n## Experience Recommendations\n");
    analysis.experienceRecommendations.forEach((rec: string) => {
      sections.push(`- ${rec}`);
    });
  }

  return sections.join("\n");
}
