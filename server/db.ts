import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, resumes, InsertResume, interviews, InsertInterview, linkedinProfiles, InsertLinkedinProfile } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserResumes(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(resumes).where(eq(resumes.userId, userId));
  return result;
}

export async function createResume(data: InsertResume) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(resumes).values(data);
  return result;
}

export async function getResumeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(resumes).where(eq(resumes.id, id)).limit(1);
  return result[0];
}

export async function updateResume(id: number, data: Partial<InsertResume>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(resumes).set(data).where(eq(resumes.id, id));
}

export async function deleteResume(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(resumes).where(eq(resumes.id, id));
}

export async function getUserInterviews(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(interviews).where(eq(interviews.userId, userId));
  return result;
}

export async function createInterview(data: InsertInterview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(interviews).values(data);
  return result;
}

export async function getInterviewById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(interviews).where(eq(interviews.id, id)).limit(1);
  return result[0];
}

export async function updateInterview(id: number, data: Partial<InsertInterview>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(interviews).set(data).where(eq(interviews.id, id));
}

export async function getUserLinkedinProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(linkedinProfiles).where(eq(linkedinProfiles.userId, userId)).limit(1);
  return result[0];
}

export async function createLinkedinProfile(data: InsertLinkedinProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(linkedinProfiles).values(data);
  return result;
}

export async function updateLinkedinProfile(id: number, data: Partial<InsertLinkedinProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(linkedinProfiles).set(data).where(eq(linkedinProfiles.id, id));
}

export async function deleteLinkedinProfile(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(linkedinProfiles).where(eq(linkedinProfiles.id, id));
}
