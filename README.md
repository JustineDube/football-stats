# Football Stats Dashboard

A clean, fast single-page web application that brings live football scores, league standings, match details, player profiles, team statistics, head-to-head records, betting odds and news together in one dashboard.

Built as a final project for **WDD 330 — Web Frontend Development II** at BYU-Idaho.

---

## Live demo

After deployment, drop the URL here. The repo is configured to deploy out of the box to Netlify, Vercel or Render.

---

## Tech stack

- **Vite** multi-page bundler
- **Vanilla JavaScript** (ES modules, no framework)
- **Google Fonts** — Inter (UI), Roboto Mono (numerics)
- **Free API Live Football Data** on RapidAPI (live scores, fixtures, standings, players, news)
- **FotMob image CDN** for team and player imagery
- **localStorage** for caching, favourites and selected league

---

## Quick start

### 1. Prerequisites

- **Node.js 18+** (Node 20 LTS recommended)
- A free **RapidAPI** account *(optional — the app ships with mock data so it runs without one)*

### 2. Install dependencies

```bash
npm install
```

### 3. Add your API key (optional)

If you want live data, copy the example env file and paste in your RapidAPI key:

```bash
cp .env.example .env
```

Then open `.env` and replace `your_rapidapi_key_here` with your real key.

> Get a free key at <https://rapidapi.com>, subscribe to **Free API Live Football Data**, then copy the `X-RapidAPI-Key` value.

If you skip this step the app still works — it falls back to a built-in mock dataset that covers every feature.

### 4. Run the dev server

```bash
npm run dev
```

Open <http://localhost:5173>.

### 5. Build for production

```bash
npm run build
```

The static output lands in `dist/`. Preview it locally:

```bash
npm run preview
```

---

## Project structure

```
football-stats-dashboard/
├── index.html           # home page
├── match.html           # match detail page
├── player.html          # player profile page
├── team.html            # team overview page
├── vite.config.js
├── package.json
├── .env.example
├── partials/
│   ├── header.html
│   └── footer.html
├── public/
│   └── favicon.svg
└── src/
    ├── main.js          # entry — home page
    ├── match.js         # entry — match page
    ├── player.js        # entry — player page
    ├── team.js          # entry — team page
    ├── styles/
    │   └── main.css
    └── modules/
        ├── FootballData.mjs   # API + cache + mock fallback
        ├── Standings.mjs      # league table renderer
        ├── MatchStats.mjs     # events, stat bars, lineups
        ├── HeadToHead.mjs     # h2h comparison
        ├── PlayerStats.mjs    # player profile
        ├── TeamStats.mjs      # team overview
        ├── BettingPanel.mjs   # odds + form
        ├── features.mjs       # favourites, summary bar, search, live ticker
        ├── utils.mjs          # shared helpers
        └── mockData.mjs       # fallback dataset
```

---

## Feature map

| Feature | Where |
| --- | --- |
| Live fixtures & scores | `main.js` + `FootballData.mjs` |
| League standings (full + mini) | `Standings.mjs` |
| Match detail (events, stats, lineups) | `MatchStats.mjs` |
| Head-to-head record | `HeadToHead.mjs` |
| Player profile & form chart | `PlayerStats.mjs` |
| Team statistics & top scorers | `TeamStats.mjs` |
| Betting panel (odds + form) | `BettingPanel.mjs` |
| News feed | `main.js` (loadNews) |
| League selector & filtering | `main.js` (league tabs) |
| Favourites & persistent state | `features.mjs` (localStorage) |
| Search players | `features.mjs` (setupSearch) |
| Skeleton loaders | `utils.mjs` (showSkeleton) |
| Live ticker | `features.mjs` (startLiveTicker) |
| Scroll-to-top | `utils.mjs` (setupScrollTop) |

---

## Caching strategy

The app uses aggressive localStorage caching with per-endpoint TTLs to stay within the RapidAPI free-tier quota:

| Endpoint bucket | TTL |
| --- | --- |
| Live | 1 min |
| Fixtures | 5 min |
| Match detail | 5 min |
| News | 30 min |
| Standings | 6 hr |
| Team | 12 hr |
| Player / search | 24 hr |

Pressing **Refresh** on the fixtures section clears the cache and re-fetches.

---

## Deployment

### Netlify

```bash
npm run build
# drag the dist/ folder onto netlify.com/drop
```

Or connect the repo and Netlify will detect Vite automatically (`npm run build`, publish `dist`).

Add `VITE_FOOTBALL_API_KEY` under Site settings → Environment variables.

### Vercel

```bash
npm install -g vercel
vercel --prod
```

Add `VITE_FOOTBALL_API_KEY` in the Vercel dashboard under Settings → Environment Variables.

### Render

New Static Site → connect repo → build command `npm run build` → publish directory `dist`. Add the env var the same way.

---

## Troubleshooting

**The app loads with no real data.**
That means no API key is configured. The dashboard is using mock data — every feature still works, the numbers just aren't live. Add your key to `.env` and restart `npm run dev`.

**Images don't load.**
The FotMob CDN occasionally rate-limits unknown referrers. Images fall back to a placeholder automatically.

**Quota exceeded errors.**
The RapidAPI free tier resets daily. The cache will keep most of the app working until then. You can also bump TTLs in `FootballData.mjs`.

---

## Credits

- Football data: [Free API Live Football Data](https://rapidapi.com/Creativesdev/api/free-api-live-football-data) via RapidAPI
- Imagery: FotMob image CDN
- Fonts: Inter & Roboto Mono via Google Fonts

Built by Lebohang Sebata · WDD 330 · BYU-Idaho · 2026
