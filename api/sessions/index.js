/*
 * /api/sessions
 *   GET  -> list the signed-in user's sessions, newest first
 *   POST -> persist a completed session { domain, performedAt, payload, patientName }
 *
 * Every query is scoped to the authenticated Clerk user id.
 */
import { and, desc, eq } from "drizzle-orm";
import { db } from "../_db.js";
import { users, patients, sessions } from "../../db/schema.js";
import { requireUser } from "../_auth.js";

const DOMAINS = new Set(["speech", "physio", "reading"]);

// Insert the user row on first write (no-op if it already exists).
async function ensureUser(userId, email) {
  await db.insert(users).values({ clerkUserId: userId, email }).onConflictDoNothing();
}

// Find-or-create the named patient for this owner; returns its id.
async function resolvePatientId(userId, name) {
  const existing = await db
    .select({ id: patients.id })
    .from(patients)
    .where(and(eq(patients.ownerUserId, userId), eq(patients.name, name)))
    .limit(1);
  if (existing.length) return existing[0].id;
  const inserted = await db
    .insert(patients)
    .values({ ownerUserId: userId, name })
    .returning({ id: patients.id });
  return inserted[0].id;
}

export default async function handler(req, res) {
  const auth = await requireUser(req);
  if (!auth) return res.status(401).json({ error: "unauthorized" });
  const { userId } = auth;

  if (req.method === "GET") {
    const rows = await db
      .select()
      .from(sessions)
      .where(eq(sessions.ownerUserId, userId))
      .orderBy(desc(sessions.performedAt));
    return res.status(200).json({ sessions: rows });
  }

  if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const { domain, performedAt, payload, patientName } = body;

    if (!DOMAINS.has(domain)) return res.status(400).json({ error: "invalid or missing domain" });
    if (!payload || typeof payload !== "object") return res.status(400).json({ error: "payload required" });

    await ensureUser(userId, auth.email);
    const patientId = await resolvePatientId(userId, (patientName || "Akki").trim() || "Akki");

    const performed = performedAt ? new Date(performedAt) : new Date();
    const inserted = await db
      .insert(sessions)
      .values({ ownerUserId: userId, patientId, domain, performedAt: performed, payload })
      .returning();

    return res.status(201).json({ session: inserted[0] });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "method not allowed" });
}
