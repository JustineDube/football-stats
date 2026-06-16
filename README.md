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
- **API 1 — Free API Live Football Data** on RapidAPI (live scores, fixtures, standings, players, teams)
- **API 2 — NewsAPI.org** (live football headlines with links)
- **FotMob image CDN** for team and player imagery
- **localStorage** for caching, favourites and selected league

---

## APIs Used

### API 1 · Free API Live Football Data (RapidAPI)
- **Base URL**: `https://free-api-live-football-data.p.rapidapi.com`
- **Auth**: `X-RapidAPI-Key` header
- **Env var**: `VITE_FOOTBALL_API_KEY`
- **Module**: `src/modules/FootballData.mjs`
- **Provides**: fixtures, live scores, standings, match detail, player search, team rosters, trending news

### API 2 · NewsAPI.org
- **Base URL**: `https://newsapi.org/v2/everything`
- **Auth**: `apiKey` query parameter
- **Env var**: `VITE_NEWS_API_KEY`
- **Module**: `src/modules/NewsAPI.mjs`
- **Provides**: latest football & soccer headlines with images, sources and article links
- **Free tier**: 100 req/day · developer plan (localhost + preview only)
- **CORS note**: NewsAPI free keys are blocked by CORS on deployed origins. The app falls back to mock news gracefully. For production, proxy via a Netlify/Vercel serverless function.

---

## Quick start

### 1. Prerequisites

- **Node.js 18+** (Node 20 LTS recommended)
- A free **RapidAPI** account for football data *(optional — mock data ships with the app)*
- A free **NewsAPI.org** account for headlines *(optional — mock news ships with the app)*

### 2. Install dependencies

```bash
npm install
```

### 3. Add your API keys

```bash
cp .env.example .env
```

Open `.env` and fill in both keys:

```env
VITE_FOOTBALL_API_KEY=your_rapidapi_key_here
VITE_NEWS_API_KEY=your_newsapi_key_here
```

- **Football key**: sign up at [rapidapi.com](https://rapidapi.com), subscribe to *Free API Live Football Data*, copy the `X-RapidAPI-Key` value.
- **News key**: sign up at [newsapi.org](https://newsapi.org/register), copy the API key from your account dashboard.

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
    ├── main.js          # entry — home page (uses both APIs)
    ├── match.js         # entry — match page
    ├── player.js        # entry — player page
    ├── team.js          # entry — team page
    ├── styles/
    │   └── main.css
    └── modules/
        ├── FootballData.mjs   # API 1 — RapidAPI football data
        ├── NewsAPI.mjs        # API 2 — NewsAPI.org headlines
        ├── Standings.mjs      # league table renderer
        ├── MatchStats.mjs     # events, stat bars, lineups
        ├── HeadToHead.mjs     # h2h comparison
        ├── PlayerStats.mjs    # player profile
        ├── TeamStats.mjs      # team overview
        ├── BettingPanel.mjs   # odds + form
        ├── features.mjs       # favourites, summary bar, search, live ticker
        ├── utils.mjs          # shared helpers
        └── mockData.mjs       # fallback dataset for both APIs
```

---

## Feature map

| Feature | Where |
| --- | --- |
| Live fixtures & scores | `main.js` + `FootballData.mjs` (API 1) |
| League standings (full + mini) | `Standings.mjs` |
| Match detail (events, stats, lineups) | `MatchStats.mjs` |
| Head-to-head record | `HeadToHead.mjs` |
| Player profile & form chart | `PlayerStats.mjs` |
| Team statistics & top scorers | `TeamStats.mjs` |
| Betting panel (odds + form) | `BettingPanel.mjs` |
| News feed (live headlines) | `main.js` + `NewsAPI.mjs` (API 2) |
| League selector & filtering | `main.js` |
| Favourites & persistent state | `features.mjs` (localStorage) |
| Search players | `features.mjs` (setupSearch) |
| Skeleton loaders | `utils.mjs` (showSkeleton) |
| Live ticker | `features.mjs` (startLiveTicker) |
| Scroll-to-top | `utils.mjs` (setupScrollTop) |

---

## Caching strategy

The app uses aggressive localStorage caching with per-endpoint TTLs to stay within free-tier quotas:

| Endpoint bucket | TTL |
| --- | --- |
| Live (API 1) | 1 min |
| Fixtures (API 1) | 5 min |
| Match detail (API 1) | 5 min |
| News (API 2) | 30 min |
| Standings (API 1) | 6 hr |
| Team (API 1) | 12 hr |
| Player / search (API 1) | 24 hr |

Pressing **Refresh** on the fixtures section clears the football cache and re-fetches. The news cache uses a separate key (`fsd::newsapi`) and refreshes independently.

---

## Deployment

### Netlify

```bash
npm run build
# drag the dist/ folder onto netlify.com/drop
```

Add both env vars under Site settings → Environment variables:
- `VITE_FOOTBALL_API_KEY`
- `VITE_NEWS_API_KEY`

> **Note**: NewsAPI.org free keys block deployed origins via CORS. The app falls back to mock news gracefully. For live headlines on a deployed site, add a Netlify Function proxy.

### Vercel

```bash
npm install -g vercel
vercel --prod
```

Add both env vars in the Vercel dashboard under Settings → Environment Variables.

### Render

New Static Site → connect repo → build command `npm run build` → publish directory `dist`. Add both env vars the same way.

---

## Troubleshooting

**The app loads with no real football data.**
No football API key is configured. Add `VITE_FOOTBALL_API_KEY` to `.env` and restart `npm run dev`.

**News section shows mock headlines.**
Either the NewsAPI key isn't configured, you're on a deployed URL (free tier CORS block), or the daily quota (100 req/day) is used up. The UI falls back automatically — this is by design.

**Images don't load.**
The FotMob CDN occasionally rate-limits unknown referrers. Images fall back to a placeholder automatically.

**Quota exceeded errors.**
Both APIs reset daily. The cache keeps the app usable until then.

---

## Credits

- Football data: [Free API Live Football Data](https://rapidapi.com/Creativesdev/api/free-api-live-football-data) via RapidAPI
- Football news: [NewsAPI.org](https://newsapi.org)
- Imagery: FotMob image CDN
- Fonts: Inter & Roboto Mono via Google Fonts

Built by Lebohang Sebata · WDD 330 · BYU-Idaho · 2026
