import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load .env.local for local `npm run db:*` commands. On CI/Vercel the same
// vars come from the environment, so a missing file is fine.
config({ path: ".env.local" });

// Migrations use the DIRECT (unpooled) connection — drizzle-kit needs a single
// non-pooled session. The app runtime uses the pooled DATABASE_URL instead.
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

export default defineConfig({
  schema: "./db/schema.js",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
});
