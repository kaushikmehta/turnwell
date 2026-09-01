/*
 * Thin client for the persistence API. Each call takes Clerk's `getToken`
 * (from useAuth()) and attaches the session token as a Bearer header so the
 * serverless routes can verify the user. Same-origin by default; override with
 * VITE_API_BASE_URL only if the API is hosted separately.
 */
const BASE = import.meta.env.VITE_API_BASE_URL || "";

async function authHeaders(getToken) {
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Returns raw DB rows: { id, ownerUserId, patientId, domain, performedAt, payload, createdAt }.
// Pass a patientName to scope the results to one patient (Akki vs "Test patient");
// omit it to get every session in the shared workspace.
export async function fetchSessions(getToken, patientName) {
  const qs = patientName ? `?patient=${encodeURIComponent(patientName)}` : "";
  const res = await fetch(`${BASE}/api/sessions${qs}`, { headers: await authHeaders(getToken) });
  if (!res.ok) throw new Error(`GET /api/sessions failed (${res.status})`);
  const data = await res.json();
  return data.sessions;
}

// record: the full finished session object (its `.at` becomes performedAt).
export async function saveSession(getToken, domain, record, patientName = "Akki") {
  const res = await fetch(`${BASE}/api/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders(getToken)) },
    body: JSON.stringify({
      domain,
      performedAt: record.at ? new Date(record.at).toISOString() : new Date().toISOString(),
      payload: record,
      patientName,
    }),
  });
  if (!res.ok) throw new Error(`POST /api/sessions failed (${res.status})`);
  const data = await res.json();
  return data.session;
}

// Delete one session by id (owner-scoped server-side).
export async function deleteSession(getToken, id) {
  const res = await fetch(`${BASE}/api/sessions/${id}`, {
    method: "DELETE",
    headers: await authHeaders(getToken),
  });
  if (!res.ok) throw new Error(`DELETE /api/sessions/${id} failed (${res.status})`);
  return true;
}
