// NewsAPI.mjs — fetches football news from NewsAPI.org (API 2)
//
// Strategy:
//   - On localhost (dev): uses Vite's built-in proxy (/newsapi → newsapi.org)
//     which avoids CORS entirely — no browser restriction applies.
//   - On deployed / production: falls back to allorigins.win CORS proxy.
//   - If both fail or no key is set: returns MOCK_NEWS silently.
// ---------------------------------------------------------------

import { MOCK_NEWS } from "./mockData.mjs";

const CACHE_KEY = "fsd::newsapi";
const CACHE_TTL = 1000 * 60 * 30; // 30 min

export default class NewsAPI {
  constructor() {
    this.apiKey = import.meta.env.VITE_NEWS_API_KEY || "";
    this.useMock =
      !this.apiKey ||
      this.apiKey === "your_newsapi_key_here" ||
      this.apiKey.length < 20;
  }

  // ── cache helpers ──────────────────────────────────────────────
  _readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { time, data } = JSON.parse(raw);
      if (Date.now() - time < CACHE_TTL) return data;
      return null;
    } catch {
      return null;
    }
  }

  _writeCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data }));
    } catch { /* localStorage full */ }
  }

  // ── public API ─────────────────────────────────────────────────
  async getNews() {
    // 1. serve from cache if still fresh
    const cached = this._readCache();
    if (cached) return cached;

    // 2. no key — use mock data
    if (this.useMock) return MOCK_NEWS;

    // 3. Try the direct / dev-proxy path first (works on localhost via Vite proxy)
    const directArticles = await this._fetchDirect();
    if (directArticles) {
      this._writeCache(directArticles);
      return directArticles;
    }

    // 4. Fall back to allorigins CORS proxy (works on deployed static sites)
    const proxiedArticles = await this._fetchViaProxy();
    if (proxiedArticles) {
      this._writeCache(proxiedArticles);
      return proxiedArticles;
    }

    // 5. Both failed — show mock data silently
    return MOCK_NEWS;
  }

  // ── fetch strategies ──────────────────────────────────────────

  /** Direct call — works on localhost through the Vite /newsapi proxy. */
  async _fetchDirect() {
    try {
      const params = new URLSearchParams({
        q: "football OR soccer",
        language: "en",
        sortBy: "publishedAt",
        pageSize: "9",
        apiKey: this.apiKey,
      });
      const res = await fetch(`/newsapi/v2/everything?${params}`);
      if (!res.ok) return null;
      const json = await res.json();
      if (json.status !== "ok" || !Array.isArray(json.articles)) return null;
      const articles = this._normalise(json.articles);
      return articles.length ? articles : null;
    } catch {
      return null; // CORS on deployed — expected, fall through
    }
  }

  /** Via allorigins.win — avoids CORS on deployed static sites. */
  async _fetchViaProxy() {
    try {
      const newsUrl = new URL("https://newsapi.org/v2/everything");
      newsUrl.searchParams.set("q", "football OR soccer");
      newsUrl.searchParams.set("language", "en");
      newsUrl.searchParams.set("sortBy", "publishedAt");
      newsUrl.searchParams.set("pageSize", "9");
      newsUrl.searchParams.set("apiKey", this.apiKey);

      const proxyUrl =
        "https://api.allorigins.win/get?url=" +
        encodeURIComponent(newsUrl.toString());

      const res = await fetch(proxyUrl);
      if (!res.ok) return null;

      const outer = await res.json();
      const inner = JSON.parse(outer.contents);
      if (inner.status !== "ok" || !Array.isArray(inner.articles)) return null;

      const articles = this._normalise(inner.articles);
      return articles.length ? articles : null;
    } catch {
      return null;
    }
  }

  // ── normaliser ────────────────────────────────────────────────
  _normalise(articles) {
    return articles
      .filter((a) => a.title && a.title !== "[Removed]")
      .slice(0, 9)
      .map((a) => ({
        title: a.title,
        source: a.source?.name || "NewsAPI",
        time: this._timeAgo(a.publishedAt),
        image:
          a.urlToImage ||
          "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=70",
        url: a.url || null,
      }));
  }

  _timeAgo(iso) {
    if (!iso) return "Recently";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }
}
