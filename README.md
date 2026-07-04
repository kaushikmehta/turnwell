# Turnwell

A calm, facilitator-led speech practice app. One prompt at a time, a gentle ladder
of hints, and an end-of-session progress report you send to the therapist over
WhatsApp. Everything runs in the browser — **nothing is stored anywhere**.

---

## Run it on your computer first (optional)

You need **Node.js 20 or newer** (https://nodejs.org).

```bash
npm install     # once
npm run dev      # starts a local server, prints a http://localhost link
```

Open the link. Edit `src/App.jsx` and it reloads live.

---

## Put it online (GitHub Pages) — open it on your phone

1. **Create a new repository on GitHub named `turnwell`** (public is fine).
2. **Push these files to it** (the whole folder, including the `.github` folder):
   ```bash
   git init
   git add .
   git commit -m "Turnwell"
   git branch -M main
   git remote add origin https://github.com/<your-username>/turnwell.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: “GitHub Actions.”**
4. Wait ~1 minute. The included workflow builds and publishes automatically on
   every push to `main`. Your site will be live at:
   ```
   https://<your-username>.github.io/turnwell/
   ```
   Open that on your phone and add it to your home screen if you like.

That's it — no database, no server, no config.

---

## ⚠️ One thing to change if you rename the repo

GitHub Pages serves project sites from a sub-path, so the build has to know it.
This is set in **`vite.config.js`**:

```js
base: "/turnwell/",
```

If your repo is **not** called `turnwell`, change this to `/<your-repo-name>/`
(keep the slashes). Get this wrong and the page loads blank with the styles and
script failing to load — it's the single most common Pages mistake.

---

## Swapping the picture-deck images

The three decks (cars, sport, film) ship with **labeled placeholder images** — grey
cards that say "Red race car", "Footballer at goal", etc. They load reliably so the
app works out of the box, and each one tells you exactly what picture belongs there.

To use real pictures, open **`src/App.jsx`**, find `seedDecks()`, and replace each
card's `image_url`:

```js
{ theme: "cars", image_url: ph("BC7A45", "Red+race+car"), fill_blank: "...", model_example: "..." },
//                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  replace this
{ theme: "cars", image_url: "https://.../a-real-race-car.jpg", fill_blank: "...", ... },
```

Two ways to get a URL:
- **Paste a link** to a license-free image (Pixabay, Pexels, Unsplash). Simplest, but
  the picture breaks if that host ever moves it.
- **Safer:** download the images, drop them in a `public/images/` folder, and reference
  them as `"/images/cars-01.jpg"`. Then they're yours and can't vanish.

Check each source's licence — most Pixabay/Unsplash images are free, but a few ask for
attribution. Commit and push, and the site rebuilds with your images automatically.

---

## Good to know

- **On a phone**, the “Open WhatsApp to send” button opens the WhatsApp app with
  the report pre-filled — review it, tap send. On a computer it opens WhatsApp
  Web/desktop instead. Test on the actual device the facilitator will use.
- **Keep notes short-ish.** The report rides inside the WhatsApp link, and very
  long text can get truncated. The important numbers are placed first so they
  always survive.
- **Nothing persists.** Sessions and any edits you make in the Library reset when
  the page reloads — that's the intended design. The record lives in the
  therapist's WhatsApp thread. If you ever want an on-device history back, that's
  a small localStorage addition.
- The app fetches its two fonts from Google Fonts at runtime, so the first load
  needs a connection.

---

## What's inside

```
index.html                     page shell
src/main.jsx                   mounts the app
src/App.jsx                    the whole app (all screens + logic)
src/index.css                  minimal reset
vite.config.js                 build config (the base path lives here)
.github/workflows/deploy.yml   auto-build + publish to Pages
```
