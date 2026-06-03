import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../_core/trpc";
import {
  registerUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  authenticateUser,
} from "./auth";
import { upsertUser } from "../db";

export const authRouter = router({
  /**
   * Register a new user with email and password
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        name: z.string().min(2, "Name must be at least 2 characters"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await registerUser(input.email, input.password, input.name);
        return {
          success: true,
          message: "Registration successful. Please check your email to verify.",
          email: input.email,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Registration failed",
        });
      }
    }),

  /**
   * Verify email with token
   */
  verifyEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await verifyEmail(input.email, input.token);
        return {
          success: true,
          message: "Email verified successfully. You can now log in.",
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Verification failed",
        });
      }
    }),

  /**
   * Request password reset
   */
  requestPasswordReset: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      try {
        const result = await requestPasswordReset(input.email);
        return {
          success: true,
          message: "If email exists, password reset link has been sent.",
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Request failed",
        });
      }
    }),

  /**
   * Reset password with token
   */
  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        token: z.string(),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await resetPassword(input.email, input.token, input.newPassword);
        return {
          success: true,
          message: "Password reset successfully. You can now log in.",
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Reset failed",
        });
      }
    }),

  /**
   * Login with email and password
   */
  loginWithEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await authenticateUser(input.email, input.password);

        // Create session/cookie (same as OAuth flow)
        await upsertUser({
          openId: result.user.openId!,
          email: result.user.email,
          name: result.user.name,
          loginMethod: "email",
          lastSignedIn: new Date(),
        });

        return {
          success: true,
          message: "Login successful",
          user: result.user,
        };
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: error instanceof Error ? error.message : "Login failed",
        });
      }
    }),
});
