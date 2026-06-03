import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { eq, desc } from "drizzle-orm";
import { getDb } from "../db";
import { resumes, interviews, linkedinProfiles } from "../../drizzle/schema";

export const historyRouter = router({
  /**
   * Get resume analysis history
   */
  getResumeHistory: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const history = await db
        .select()
        .from(resumes)
        .where(eq(resumes.userId, ctx.user.id))
        .orderBy(desc(resumes.createdAt))
        .limit(50);

      return history.map((r) => ({
        id: r.id,
        fileName: r.fileName,
        atsScore: r.atsScore,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }));
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to fetch resume history",
      });
    }
  }),

  /**
   * Get resume analysis details
   */
  getResumeDetails: protectedProcedure
    .input(z.object({ resumeId: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const resume = await db
          .select()
          .from(resumes)
          .where(eq(resumes.id, input.resumeId))
          .limit(1);

        if (resume.length === 0 || resume[0].userId !== ctx.user.id) {
          throw new Error("Resume not found");
        }

        return {
          id: resume[0].id,
          fileName: resume[0].fileName,
          atsScore: resume[0].atsScore,
          analysis: resume[0].analysis ? JSON.parse(resume[0].analysis) : null,
          createdAt: resume[0].createdAt,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch resume details",
        });
      }
    }),

  /**
   * Get interview practice history
   */
  getInterviewHistory: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const history = await db
        .select()
        .from(interviews)
        .where(eq(interviews.userId, ctx.user.id))
        .orderBy(desc(interviews.createdAt))
        .limit(50);

      return history.map((i) => ({
        id: i.id,
        jobRole: i.jobRole,
        industry: i.industry,
        status: i.status,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      }));
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to fetch interview history",
      });
    }
  }),

  /**
   * Get interview details
   */
  getInterviewDetails: protectedProcedure
    .input(z.object({ interviewId: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const interview = await db
          .select()
          .from(interviews)
          .where(eq(interviews.id, input.interviewId))
          .limit(1);

        if (interview.length === 0 || interview[0].userId !== ctx.user.id) {
          throw new Error("Interview not found");
        }

        return {
          id: interview[0].id,
          jobRole: interview[0].jobRole,
          industry: interview[0].industry,
          status: interview[0].status,
          questions: interview[0].questions ? JSON.parse(interview[0].questions) : [],
          responses: interview[0].responses ? JSON.parse(interview[0].responses) : [],
          feedback: interview[0].feedback ? JSON.parse(interview[0].feedback) : null,
          createdAt: interview[0].createdAt,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch interview details",
        });
      }
    }),

  /**
   * Get LinkedIn profile optimization history
   */
  getLinkedInHistory: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const history = await db
        .select()
        .from(linkedinProfiles)
        .where(eq(linkedinProfiles.userId, ctx.user.id))
        .orderBy(desc(linkedinProfiles.createdAt))
        .limit(50);

      return history.map((lp) => ({
        id: lp.id,
        headline: lp.headline?.substring(0, 50),
        createdAt: lp.createdAt,
        updatedAt: lp.updatedAt,
      }));
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to fetch LinkedIn history",
      });
    }
  }),

  /**
   * Get progress metrics and stats
   */
  getProgressMetrics: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get resume stats
      const resumeCount = await db
        .select()
        .from(resumes)
        .where(eq(resumes.userId, ctx.user.id));

      const avgAtsScore =
        resumeCount.length > 0
          ? Math.round(
              resumeCount.reduce((sum, r) => sum + (r.atsScore || 0), 0) / resumeCount.length
            )
          : 0;

      // Get interview stats
      const interviewCount = await db
        .select()
        .from(interviews)
        .where(eq(interviews.userId, ctx.user.id));

      const completedInterviews = interviewCount.filter((i) => i.status === "completed").length;

      // Get LinkedIn stats
      const linkedinCount = await db
        .select()
        .from(linkedinProfiles)
        .where(eq(linkedinProfiles.userId, ctx.user.id));

      return {
        resumeAnalyses: resumeCount.length,
        averageAtsScore: avgAtsScore,
        interviewPractices: interviewCount.length,
        completedInterviews,
        linkedinOptimizations: linkedinCount.length,
        totalFeatureUsage: resumeCount.length + interviewCount.length + linkedinCount.length,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to fetch metrics",
      });
    }
  }),
});
