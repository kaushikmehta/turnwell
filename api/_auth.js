/*
 * Clerk auth guard for serverless routes.
 *
 * The browser attaches a short-lived Clerk session token as a Bearer header
 * (see src/api.js). We verify it against Clerk's JWKS using the secret key and
 * return the authenticated user id. Never trust a client-supplied user id —
 * `sub` from the verified token is the only identity the API uses.
 */
import "./_env.js";
import { verifyToken } from "@clerk/backend";

export async function requireUser(req) {
  const header = req.headers.authorization || req.headers.Authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;

  try {
    const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    if (!payload?.sub) return null;
    // `email` is only present if added as a custom session-token claim; may be null.
    return { userId: payload.sub, email: payload.email ?? null, payload };
  } catch {
    return null;
  }
}
