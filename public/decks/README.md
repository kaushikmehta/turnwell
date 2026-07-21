# Picture deck images

Drop real photos in here and the app will pick them up automatically — no code
changes needed. Each card falls back to a plain theme label if its file is
missing, so it's safe to fill these in gradually.

**Naming**: one file per card, numbered to match the card's position in
`seedDecks()` (`src/seed.js`), saved as `.jpg` — e.g. `decks/cars/1.jpg`.
A card with no matching file just shows its theme label instead of a photo,
so it's safe to fill these in gradually.

| Folder | Card | Subject |
|---|---|---|
| `cars/`  | 1 | Red race car |
| `cars/`  | 2 | Classic vintage car |
| `cars/`  | 3 | Man refuelling car |
| `cars/`  | 4 | Cars in a traffic jam |
| `cars/`  | 5 | Mechanic under the bonnet |
| `sport/` | 1 | Footballer at goal |
| `sport/` | 2 | Tennis player serving |
| `sport/` | 3 | Fans celebrating |
| `sport/` | 4 | Runner at finish line |
| `sport/` | 5 | Basketball player shooting |
| `film/`  | 1 | Cinema and popcorn |
| `film/`  | 2 | Actor on red carpet |
| `film/`  | 3 | Director behind camera |
| `film/`  | 4 | Bright cinema screen |
| `film/`  | 5 | Clapperboard on set |

**Sizing**: roughly 4:3 landscape (the card frame is a 10:7 box) — anything
close works fine since it's displayed with `object-fit: cover`.

**This repo deploys to a public GitHub Pages site.** These images are meant to
be generic stock-style photos (cars, sport, film), not personal photos — keep
anything private out of this folder.
