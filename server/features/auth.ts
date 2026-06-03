import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";

/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a password with its hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a secure token for email verification or password reset
 */
export function generateToken(): string {
  return nanoid(32);
}

/**
 * Register a new user with email and password
 */
export async function registerUser(email: string, password: string, name: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if user already exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("Email already registered");
  }

  const passwordHash = await hashPassword(password);
  const emailVerificationToken = generateToken();

  const result = await db.insert(users).values({
    email,
    passwordHash,
    name,
    emailVerificationToken,
    loginMethod: "email",
    openId: `email_${nanoid(32)}`, // Generate a unique openId for email users
  });

  return {
    success: true,
    token: emailVerificationToken,
    message: "User registered. Please verify your email.",
  };
}

/**
 * Verify user email with token
 */
export async function verifyEmail(email: string, token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) {
    throw new Error("User not found");
  }

  if (user[0].emailVerificationToken !== token) {
    throw new Error("Invalid verification token");
  }

  // Mark email as verified
  await db
    .update(users)
    .set({
      emailVerified: new Date(),
      emailVerificationToken: null,
    })
    .where(eq(users.email, email));

  return { success: true, message: "Email verified successfully" };
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) {
    // Don't reveal if email exists
    return { success: true, message: "If email exists, reset link sent" };
  }

  const resetToken = generateToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await db
    .update(users)
    .set({
      passwordResetToken: resetToken,
      passwordResetExpiresAt: expiresAt,
    })
    .where(eq(users.email, email));

  return {
    success: true,
    token: resetToken,
    message: "Password reset link sent to email",
  };
}

/**
 * Reset password with token
 */
export async function resetPassword(email: string, token: string, newPassword: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) {
    throw new Error("User not found");
  }

  if (user[0].passwordResetToken !== token) {
    throw new Error("Invalid reset token");
  }

  if (!user[0].passwordResetExpiresAt || user[0].passwordResetExpiresAt < new Date()) {
    throw new Error("Reset token expired");
  }

  const passwordHash = await hashPassword(newPassword);

  await db
    .update(users)
    .set({
      passwordHash,
      passwordResetToken: null,
      passwordResetExpiresAt: null,
    })
    .where(eq(users.email, email));

  return { success: true, message: "Password reset successfully" };
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(email: string, password: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) {
    throw new Error("Invalid email or password");
  }

  if (!user[0].passwordHash) {
    throw new Error("This account uses OAuth login");
  }

  if (!user[0].emailVerified) {
    throw new Error("Please verify your email first");
  }

  const isValid = await comparePassword(password, user[0].passwordHash);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  return {
    success: true,
    user: user[0],
    message: "Authentication successful",
  };
}
