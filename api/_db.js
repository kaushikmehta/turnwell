/*
 * Neon + Drizzle client for the serverless API.
 *
 * Uses the HTTP driver (neon-http): each query is a stateless HTTPS request,
 * which suits serverless functions (no connection pool to manage per invocation).
 * Reads the POOLED connection string. Migrations use the direct one instead —
 * see drizzle.config.js.
 */
import "./_env.js";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../db/schema.js";

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });
export { schema };
