import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getUserResumes,
  createResume,
  getResumeById,
  updateResume,
  deleteResume,
  getUserInterviews,
  createInterview,
  getInterviewById,
  updateInterview,
  getUserLinkedinProfile,
  createLinkedinProfile,
  updateLinkedinProfile,
} from "./db";
import { resumeAnalyzerRouter } from "./features/resumeAnalyzer";
import { interviewPrepRouter } from "./features/interviewPrep";
import { linkedinOptimizerRouter } from "./features/linkedinOptimizer";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),



  linkedinOptimizer: linkedinOptimizerRouter,
  resumeAnalyzer: resumeAnalyzerRouter,
  interviewPrep: interviewPrepRouter,
});

export type AppRouter = typeof appRouter;
