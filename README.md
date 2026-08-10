# Turnwell

A calm, facilitator-led practice app for a person recovering after a brain injury.
Three kinds of session, each run one step at a time with a gentle ladder of hints:

- **Speech** — sentences, scenes, and picture decks, scored on how much support each
  response needed.
- **Physio / OT** — a facilitator-run motor session: priming, involvement scoring,
  standing dose, and metacognition (difficulty prediction).
- **Reading** — passages with comprehension questions on the same support ladder.

At the end of a session you send a plain-text progress report to the therapist over
WhatsApp. Sessions are now **saved** (see *Data & accounts* below), and a
**Dashboard** turns them into trends over time.

---

## Architecture at a glance

```
Browser (React SPA)  ──►  /api serverless functions  ──►  Neon (Postgres)
      │                          ▲
      └── Clerk session token ───┘   (functions verify the token, scope by user)
```

- **Hosting:** Vercel (static SPA + `/api` serverless functions).
- **Auth:** Clerk. **Database:** Neon Postgres via Drizzle ORM.
- The database is never touched from the browser — only from the authenticated
  `/api` routes.

Full account/environment setup lives in **[`docs/persistence-setup.md`](docs/persistence-setup.md)**.

---

## Run it locally

You need **Node.js 20+** and the four environment variables in `.env.local`
(copy `.env.example` and fill in Clerk + Neon values — see the setup doc).

```bash
npm install            # once
npm run dev            # ⚠️ frontend ONLY — /api routes won't exist (saves/loads 404)
```

Because the app now has a serverless backend, day-to-day local development uses
the Vercel CLI, which serves the SPA **and** the `/api` functions together the way
production does:

```bash
npm i -g vercel        # once
vercel link            # once, links this folder to the Vercel project
vercel dev             # serves app + /api at http://localhost:3000
```

Database migrations (Drizzle):

```bash
npm run db:push        # apply schema to the branch in .env.local (your dev branch)
npm run db:studio      # browse the data
```

---

## Deploy

Deploys are automatic on **Vercel**: push to `main` (or merge a PR) and Vercel builds
and publishes. It needs the same four env vars set in the Vercel dashboard
(**Production** scope), pointing at the Neon **production** branch, and the schema
pushed to that branch once. Details and the exact click-path are in
[`docs/persistence-setup.md`](docs/persistence-setup.md).

> Turnwell used to deploy as a static site to GitHub Pages. That's gone — there's no
> `base` sub-path and no Pages workflow anymore; Vercel serves from the domain root.

### Two environments

| | Local (`vercel dev`) | Vercel deploy |
|---|---|---|
| **Clerk** | Development instance | same Development instance* |
| **Neon** | `dev` branch | `production` branch |
| **Config** | `.env.local` | Vercel env vars (Production scope) |

*A Clerk **production** instance requires a custom domain (it can't run on
`*.vercel.app`), so the dev instance is used for both until a domain is added — then
it's a config-only swap.

---

## Data & accounts

- **Sign in** is required (Clerk). Sign out via the avatar, top-right on any screen.
- **Completed sessions are saved** to Neon automatically, scoped to your account.
- **Resume:** an in-progress session autosaves to this device (localStorage). Reload
  and Home offers **Continue / Discard**. (Single device — a draft doesn't follow you
  to another browser.)
- **Delete:** remove individual saved sessions (or all) from the Speech history screen.
- **Dashboard:** trends and per-session detail across all three domains
  (`#dashboard` opens it directly once signed in).

---

## Swapping the picture-deck images

The three decks (cars, sport, film) ship with **labeled placeholder images** — grey
cards that say "Red race car", etc. They load reliably so the app works out of the
box, and each tells you exactly what picture belongs there.

To use real pictures, open **`src/seed.js`**, find `seedDecks()`, and replace each
card's `image_url`:

```js
{ theme: "cars", image_url: ph("BC7A45", "Red+race+car"), fill_blank: "...", model_example: "..." },
//                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  replace this
{ theme: "cars", image_url: "https://.../a-real-race-car.jpg", fill_blank: "...", ... },
```

Two ways to get a URL:
- **Paste a link** to a license-free image (Pixabay, Pexels, Unsplash). Simplest, but
  the picture breaks if that host ever moves it.
- **Safer:** download the images into `public/images/` and reference them as
  `"/images/cars-01.jpg"`. Then they're yours and can't vanish.

Check each source's licence. Commit and push, and the deploy rebuilds with your images.

---

## Good to know

- **On a phone**, the "Open WhatsApp to send" button opens WhatsApp with the report
  pre-filled — review it, tap send. On a computer it opens WhatsApp Web/desktop. Test
  on the actual device the facilitator will use.
- **Keep notes short-ish.** The report rides inside the WhatsApp link, and very long
  text can get truncated. The key numbers are placed first so they always survive.
- The app fetches its two fonts from Google Fonts at runtime, so first load needs a
  connection.

---

## What's inside

```
index.html                     page shell
vite.config.js                 build config
.env.example                   env template (copy to .env.local)
drizzle.config.js              Drizzle / migrations config
docs/persistence-setup.md      account + environment setup checklist

api/                           serverless functions (Vercel)
  _env.js                        loads .env.local for `vercel dev`
  _db.js                         Neon + Drizzle client
  _auth.js                       Clerk token verification
  sessions/index.js              GET (list) + POST (save)
  sessions/[id].js               DELETE (one, owner-scoped)

db/
  schema.js                      tables: users, patients, sessions
  migrations/                    generated SQL

src/
  main.jsx                       mounts the app, Clerk sign-in gate
  App.jsx                        top-level state + view routing
  api.js                         fetch client for /api
  draft.js                       in-progress session autosave (localStorage)
  seed.js                        seed content (speech / physio / reading banks)
  constants.js  utils.js  report.js
  components/                    screens + shared UI
  components/dashboard/          multi-domain dashboard (trends + detail)
```
