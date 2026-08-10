/*
 * Env bootstrap for local development.
 *
 * `vercel dev` does not reliably inject `.env.local` into Serverless Functions
 * (unlike Vite, which loads it for the browser bundle). So if the platform
 * hasn't already provided the vars, load them from `.env.local` ourselves.
 *
 * In the Vercel cloud the real env is always present, so this is a no-op there.
 * dotenv is a devDependency (pruned in production); the try/catch means a
 * genuinely-misconfigured cloud deploy still falls through to a clear error
 * from the code that actually needs the variable, rather than a module crash.
 */
if (!process.env.DATABASE_URL) {
  try {
    const { config } = await import("dotenv");
    config({ path: ".env.local" });
  } catch {
    /* dotenv unavailable (production) — env must come from the platform */
  }
}
