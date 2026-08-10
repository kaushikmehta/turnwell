/*
 * Database schema (Drizzle ORM, Postgres/Neon).
 *
 * Design: a relational envelope + a JSONB payload. The three session kinds
 * (speech / physio / reading) share a common envelope — who ran it, when, which
 * patient, which domain — but each has a very different, evolving body. Rather
 * than normalise three shapes prematurely, the rich per-session structure is
 * stored verbatim in `payload` (jsonb), while the columns the dashboard filters
 * and sorts on live at the top level. Ownership is enforced by `ownerUserId`
 * (the Clerk user id) on every row.
 */
import { pgTable, uuid, text, timestamp, jsonb, pgEnum, index } from "drizzle-orm/pg-core";

export const domainEnum = pgEnum("domain", ["speech", "physio", "reading"]);

// Mirror of the Clerk user — populated on that user's first write.
export const users = pgTable("users", {
  clerkUserId: text("clerk_user_id").primaryKey(),
  email: text("email"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const patients = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerUserId: text("owner_user_id").notNull().references(() => users.clerkUserId, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerUserId: text("owner_user_id").notNull().references(() => users.clerkUserId, { onDelete: "cascade" }),
    patientId: uuid("patient_id").references(() => patients.id, { onDelete: "set null" }),
    domain: domainEnum("domain").notNull(),
    performedAt: timestamp("performed_at", { withTimezone: true }).notNull(),
    payload: jsonb("payload").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("sessions_owner_idx").on(t.ownerUserId),
    index("sessions_owner_performed_idx").on(t.ownerUserId, t.performedAt),
  ]
);
