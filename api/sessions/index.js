/*
 * /api/sessions
 *   GET  -> list ALL sessions in the shared workspace, newest first
 *   POST -> persist a completed session { domain, performedAt, payload, patientName }
 *
 * Shared-workspace model: this is a private tool for one closed care team all
 * working on a single person, so every signed-in member sees the whole pool.
 * Auth is still required (you must be a signed-in member), but reads are NOT
 * scoped to the caller. `ownerUserId` stays on each row purely as an authorship
 * stamp (who logged it), not as an access boundary. Membership is guarded by
 * closing Clerk sign-ups / an allowlist once the team is onboarded.
 */
import { desc, eq } from "drizzle-orm";
import { db } from "../_db.js";
import { users, patients, sessions } from "../../db/schema.js";
import { requireUser } from "../_auth.js";

const DOMAINS = new Set(["speech", "physio", "reading"]);

// Insert the user row on first write (no-op if it already exists).
async function ensureUser(userId, email) {
  await db.insert(users).values({ clerkUserId: userId, email }).onConflictDoNothing();
}

// Find-or-create the shared patient by name. The workspace has one patient
// shared across the whole team, so we match on name alone (not owner) and reuse
// the oldest matching row — that keeps every teammate's sessions attached to the
// same patient instead of spawning a per-account duplicate. Only the very first
// write for a never-seen name creates a row (owned by whoever wrote it first).
async function resolvePatientId(userId, name) {
  const existing = await db
    .select({ id: patients.id })
    .from(patients)
    .where(eq(patients.name, name))
    .orderBy(patients.createdAt)
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
    // Shared workspace: return every member's sessions, not just the caller's.
    const rows = await db
      .select()
      .from(sessions)
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
