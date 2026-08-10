/*
 * /api/sessions/:id
 *   DELETE -> remove one session, scoped to the authenticated owner.
 */
import { and, eq } from "drizzle-orm";
import { db } from "../_db.js";
import { sessions } from "../../db/schema.js";
import { requireUser } from "../_auth.js";

export default async function handler(req, res) {
  const auth = await requireUser(req);
  if (!auth) return res.status(401).json({ error: "unauthorized" });

  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    return res.status(405).json({ error: "method not allowed" });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "id required" });

  const deleted = await db
    .delete(sessions)
    .where(and(eq(sessions.id, id), eq(sessions.ownerUserId, auth.userId)))
    .returning({ id: sessions.id });

  if (!deleted.length) return res.status(404).json({ error: "not found" });
  return res.status(200).json({ deleted: deleted[0].id });
}
