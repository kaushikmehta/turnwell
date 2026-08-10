# Turnwell persistence — account & environment setup checklist

This is the one-time setup for adding auth (Clerk) + database (Neon) + hosting
(Vercel) to Turnwell. Work top to bottom. By the end you'll have a filled-in
`.env.local` and three connected accounts. **This covers the parts only you can
do (dashboards, keys). The code scaffolding comes after.**

Legend: 🧑 = you do it in a browser · 💻 = a terminal command.

---

## 0. Prerequisites

- [ ] Node.js 20+ installed (`node -v`).
- [ ] 💻 Copy the env template:  `cp .env.example .env.local`
      You'll paste real values into `.env.local` as you go. It's git-ignored.

---

## 1. Clerk (authentication)

We use one Clerk **Development** instance for both local and the Vercel
deployment (a Clerk *production* instance needs a custom domain, which
`*.vercel.app` can't provide — we add that later).

- [ ] 🧑 Create an account at https://clerk.com and create a new application
      (name it "Turnwell"). Pick email + whichever sign-in methods you want.
- [ ] 🧑 In the app, go to **API keys**. You'll see keys for the *Development*
      instance. Copy:
  - **Publishable key** (`pk_test_…`) → paste into `.env.local` as
    `VITE_CLERK_PUBLISHABLE_KEY`.
  - **Secret key** (`sk_test_…`) → paste as `CLERK_SECRET_KEY`.
- [ ] 🧑 (Do this now for local; we'll add the Vercel URL in step 4 once it
      exists.) Under **Domains / Allowed origins**, confirm `http://localhost`
      is allowed for development.

> Later (custom domain): create a Clerk **Production** instance on your domain,
> then put its `pk_live…`/`sk_live…` into Vercel's Production env scope. No code
> change — same variable names, different values.

---

## 2. Neon (database)

Two branches keep dev data isolated from real clinical data.

- [ ] 🧑 Create an account at https://neon.tech and create a new project
      (name it "turnwell"). It comes with a default branch called
      **production** — that's your production branch.
- [ ] 🧑 Create a second branch named **dev** (Branches → New branch, branched
      from `production`), and set its auto-delete/expiration to **never** (it's
      a long-lived working branch, not an ephemeral preview). That's your local
      branch.
- [ ] 🧑 For the **dev** branch, open **Connection Details** and copy BOTH
      connection strings into `.env.local`:
  - the **Pooled** string (host contains `-pooler`) → `DATABASE_URL`
  - the **Direct/unpooled** string (host without `-pooler`) → `DATABASE_URL_UNPOOLED`

  > If the UI shows one string with a "Pooled connection" toggle, copy it once
  > with the toggle ON (→ `DATABASE_URL`) and once OFF (→ `DATABASE_URL_UNPOOLED`).
  > Keep `?sslmode=require` on both.

- [ ] Keep the **production** branch's two connection strings handy for step 4
      (they go into Vercel, not `.env.local`).

---

## 3. Verify local config before hosting

At this point `.env.local` should have all four values filled in. Once the code
scaffolding (Drizzle schema, `/api` routes) is in place, we'll verify with:

- [ ] 💻 `npm install` (installs the new deps we'll add).
- [ ] 💻 `npm run db:push` (drizzle-kit creates the tables on the Neon **dev**
      branch — `.env.local` points at dev). Success = tables visible in the
      Neon dashboard → Tables.
- [ ] 💻 `vercel dev` (serves the app + `/api` locally). Sign in, complete a
      session, reload → it should persist.

*(These commands don't exist yet — they arrive with the code. Listed here so
you know what "done" looks like.)*

---

## 4. Vercel (hosting)

- [ ] 🧑 Create an account at https://vercel.com and **Import** the `turnwell`
      Git repo. Vercel auto-detects Vite (build `npm run build`, output `dist`).
- [ ] 🧑 In **Project → Settings → Environment Variables**, add the same four
      variables, scoped to **Production** (and **Preview**):
  - `VITE_CLERK_PUBLISHABLE_KEY` = same `pk_test_…` as local
  - `CLERK_SECRET_KEY` = same `sk_test_…` as local
  - `DATABASE_URL` = the Neon **production** branch **pooled** string
  - `DATABASE_URL_UNPOOLED` = the Neon **production** branch **direct** string
- [ ] 🧑 Deploy. Note your `https://<project>.vercel.app` URL.
- [ ] 🧑 Back in **Clerk → Domains / Allowed origins**, add that
      `https://<project>.vercel.app` URL so auth works on the deployed site.
- [ ] 💻 Push the schema to the Neon **production** branch (one time), e.g.
      `DATABASE_URL_UNPOOLED="<production direct string>" npm run db:push`.

---

## 5. Retire GitHub Pages

- [ ] Remove `base: "/turnwell/"` from `vite.config.js` (Vercel serves at root).
- [ ] Delete/disable `.github/workflows/deploy.yml` (Vercel now deploys).
- [ ] Update `README.md` (no longer "nothing is stored anywhere").

*(Steps 5 items are code/repo edits — I'll do these during implementation.)*

---

## What you hand back to continue

Once steps 1–2 are done and `.env.local` has all four values filled, tell me
and I'll scaffold the Drizzle schema, the `/api` routes, and the Clerk +
resume-session wiring (steps 3–5).

## Environment cheat-sheet

| Variable | Local (`.env.local`) | Vercel (Prod scope) |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | dev `pk_test_…` | same dev `pk_test_…` |
| `CLERK_SECRET_KEY` | dev `sk_test_…` | same dev `sk_test_…` |
| `DATABASE_URL` | Neon **dev** pooled | Neon **production** pooled |
| `DATABASE_URL_UNPOOLED` | Neon **dev** direct | Neon **production** direct |
