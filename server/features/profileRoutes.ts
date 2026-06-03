import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { users, subscriptions } from "../../drizzle/schema";

export const profileRouter = router({
  /**
   * Complete user profile with job role, experience level, and industry
   */
  completeProfile: protectedProcedure
    .input(
      z.object({
        targetJobRole: z.string().min(2, "Job role is required"),
        experienceLevel: z.enum(["entry", "mid", "senior", "lead"]),
        industry: z.string().min(2, "Industry is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db
          .update(users)
          .set({
            targetJobRole: input.targetJobRole,
            experienceLevel: input.experienceLevel,
            industry: input.industry,
            profileCompleted: true,
          })
          .where(eq(users.id, ctx.user.id));

        return {
          success: true,
          message: "Profile completed successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Profile update failed",
        });
      }
    }),

  /**
   * Get user profile
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const profile = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (profile.length === 0) {
        throw new Error("Profile not found");
      }

      return {
        id: profile[0].id,
        name: profile[0].name,
        email: profile[0].email,
        targetJobRole: profile[0].targetJobRole,
        experienceLevel: profile[0].experienceLevel,
        industry: profile[0].industry,
        profileCompleted: profile[0].profileCompleted,
        emailVerified: profile[0].emailVerified,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to fetch profile",
      });
    }
  }),

  /**
   * Get user subscription status
   */
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get or create subscription
      let sub = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, ctx.user.id))
        .limit(1);

      if (sub.length === 0) {
        // Create default free subscription
        await db.insert(subscriptions).values({
          userId: ctx.user.id,
          tier: "free",
          status: "active",
        });

        sub = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, ctx.user.id))
          .limit(1);
      }

      return {
        tier: sub[0].tier,
        status: sub[0].status,
        stripeCustomerId: sub[0].stripeCustomerId,
        currentPeriodStart: sub[0].currentPeriodStart,
        currentPeriodEnd: sub[0].currentPeriodEnd,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to fetch subscription",
      });
    }
  }),

  /**
   * Check if user has access to a feature based on tier
   */
  hasFeatureAccess: protectedProcedure
    .input(z.object({ feature: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const sub = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, ctx.user.id))
          .limit(1);

        const tier = sub.length > 0 ? sub[0].tier : "free";

        // Define feature access by tier
        const featureAccess: Record<string, string[]> = {
          free: ["resume-analyzer", "interview-prep", "linkedin-optimizer"],
          pro: ["resume-analyzer", "interview-prep", "linkedin-optimizer", "export-pdf", "history"],
          premium: [
            "resume-analyzer",
            "interview-prep",
            "linkedin-optimizer",
            "export-pdf",
            "history",
            "advanced-analytics",
            "priority-support",
          ],
        };

        const allowed = featureAccess[tier] || [];
        return {
          hasAccess: allowed.includes(input.feature),
          tier,
          allowedFeatures: allowed,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Access check failed",
        });
      }
    }),
});
