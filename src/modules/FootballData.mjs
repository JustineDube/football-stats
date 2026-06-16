// FootballData.mjs — single source of truth for all data fetching.
// Wraps the Free API Live Football Data on RapidAPI with aggressive
// localStorage caching and a graceful fall-back to mock data when no
// API key is configured.
// ---------------------------------------------------------------

import {
  LEAGUES,
  MOCK_FIXTURES,
  MOCK_STANDINGS,
  MOCK_MATCH_DETAIL,
  MOCK_PLAYERS,
  MOCK_TEAMS,
  MOCK_H2H,
  MOCK_NEWS,
  MOCK_BETTING
} from "./mockData.mjs";

const API_HOST = "free-api-live-football-data.p.rapidapi.com";
const API_BASE = `https://${API_HOST}`;
const CACHE_PREFIX = "fsd::";

// per-endpoint TTL in ms (longer for slow-changing data)
const TTL = {
  fixtures: 1000 * 60 * 5, //   5 min
  live: 1000 * 60, //   1 min
  standings: 1000 * 60 * 60 * 6, //   6 h
  match: 1000 * 60 * 5, //   5 min
  player: 1000 * 60 * 60 * 24, //   24 h
  team: 1000 * 60 * 60 * 12, //   12 h
  news: 1000 * 60 * 30, //   30 min
  search: 1000 * 60 * 60 * 24, //   24 h
  default: 1000 * 60 * 15 //   15 min
};

export default class FootballData {
  constructor() {
    this.apiKey = import.meta.env.VITE_FOOTBALL_API_KEY || "";
    this.useMock = !this.apiKey || this.apiKey === "your_rapidapi_key_here";
    this.leagues = LEAGUES;
  }

  // ----- internal helpers -----
  _cacheKey(endpoint, params = {}) {
    const qs = new URLSearchParams(params).toString();
    return `${CACHE_PREFIX}${endpoint}${qs ? "?" + qs : ""}`;
  }

  _readCache(key, ttl) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const { time, data } = JSON.parse(raw);
      if (Date.now() - time < ttl) return data;
      return null;
    } catch {
      return null;
    }
  }

  _writeCache(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify({ time: Date.now(), data }));
    } catch {
      // localStorage might be full; ignore
    }
  }

  async _fetch(endpoint, params = {}, ttlBucket = "default") {
    const key = this._cacheKey(endpoint, params);
    const cached = this._readCache(key, TTL[ttlBucket] || TTL.default);
    if (cached) return cached;

    if (this.useMock) {
      // mocks are resolved by the caller, not here
      throw new Error("MOCK_MODE");
    }

    const url = new URL(`${API_BASE}${endpoint}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const res = await fetch(url.toString(), {
      headers: {
        "X-RapidAPI-Key": this.apiKey,
        "X-RapidAPI-Host": API_HOST
      }
    });

    if (!res.ok) {
      throw new Error(`API ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    this._writeCache(key, data);
    return data;
  }

  // ----- public surface -----

  getLeagues() {
    return this.leagues;
  }

  /** Today's fixtures for a league. */
  async getFixtures(leagueId) {
    try {
      const data = await this._fetch(
        "/football-get-matches-by-date-and-league",
        { date: this._today(), leagueid: leagueId },
        "fixtures"
      );
      return this._normaliseFixtures(data, leagueId);
    } catch {
      return MOCK_FIXTURES[leagueId] || [];
    }
  }

  /** Currently live matches across all leagues. */
  async getLive() {
    try {
      const data = await this._fetch("/football-current-live", {}, "live");
      return this._normaliseFixtures(data);
    } catch {
      return Object.values(MOCK_FIXTURES)
        .flat()
        .filter((m) => m.status === "LIVE");
    }
  }

  async getStandings(leagueId) {
    try {
      const data = await this._fetch(
        "/football-get-standing-all",
        { leagueid: leagueId },
        "standings"
      );
      const standings = this._normaliseStandings(data);
      if (!standings.length) throw new Error("empty"); // fall to mock
      return standings;
    } catch {
      return MOCK_STANDINGS[leagueId] || [];
    }
  }

  async getMatchDetail(matchId) {
    try {
      const data = await this._fetch(
        "/football-get-match-detail",
        { matchid: matchId },
        "match"
      );
      const match = this._normaliseMatch(data, matchId);
      if (!match) throw new Error("empty"); // triggers mock fallback
      return match;
    } catch {
      return MOCK_MATCH_DETAIL[matchId] || MOCK_MATCH_DETAIL.m1;
    }
  }

  async searchPlayers(q) {
    if (!q || q.length < 2) return [];
    try {
      const data = await this._fetch(
        "/football-players-search",
        { search: q },
        "search"
      );
      const results = this._normaliseSearch(data);
      if (results.length) return results;
      throw new Error("empty"); // fall through to mock
    } catch {
      const needle = q.toLowerCase();
      return Object.values(MOCK_PLAYERS)
        .filter((p) => {
          const name = p.name.toLowerCase();
          const club = (p.club?.name || "").toLowerCase();
          // match on any word in the name or club
          return (
            name.includes(needle) ||
            club.includes(needle) ||
            name.split(" ").some((w) => w.startsWith(needle))
          );
        })
        .map((p) => ({
          id: p.id,
          name: p.name,
          club: p.club.name,
          photoId: p.photoId
        }));
    }
  }

  async getPlayer(playerId) {
    try {
      const data = await this._fetch(
        "/football-get-player-news",
        { playerid: playerId },
        "player"
      );
      return this._normalisePlayer(data, playerId);
    } catch {
      return MOCK_PLAYERS[playerId] || MOCK_PLAYERS.p1;
    }
  }

  async getTeam(teamId) {
    try {
      const data = await this._fetch(
        "/football-get-list-player",
        { teamid: teamId },
        "team"
      );
      return this._normaliseTeam(data, teamId);
    } catch {
      return MOCK_TEAMS[teamId] || MOCK_TEAMS[8650];
    }
  }

  async getH2H(homeId, awayId) {
    const key = `${homeId}-${awayId}`;
    return MOCK_H2H[key] || MOCK_H2H["8650-9825"];
  }

  async getNews() {
    try {
      const data = await this._fetch(
        "/football-get-trendingnews",
        {},
        "news"
      );
      return this._normaliseNews(data);
    } catch {
      return MOCK_NEWS;
    }
  }

  async getBetting(matchId) {
    return MOCK_BETTING[matchId] || {
      home: 2.2,
      draw: 3.3,
      away: 3.2,
      homeForm: ["W", "D", "W", "L", "W"],
      awayForm: ["W", "L", "D", "W", "W"]
    };
  }

  // ----- date helper -----
  _today() {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  }

  // ----- normalisers -----
  // These shape the wildly varying API responses into the consistent
  // structures used by the UI modules. When the API returns no payload
  // we fall through to the corresponding MOCK_* dataset above.

  _normaliseFixtures(data, leagueId) {
    if (!data?.response?.matches) return MOCK_FIXTURES[leagueId] || [];
    return data.response.matches.map((m) => ({
      id: String(m.id),
      home: {
        id: m.home?.id,
        name: m.home?.name,
        logoId: m.home?.id
      },
      away: {
        id: m.away?.id,
        name: m.away?.name,
        logoId: m.away?.id
      },
      score: {
        home: m.home?.score ?? 0,
        away: m.away?.score ?? 0
      },
      status: m.status?.started ? (m.status.finished ? "FT" : "LIVE") : "UPCOMING",
      minute: m.status?.liveTime?.short || null,
      kickoff: m.status?.utcTime || new Date().toISOString(),
      venue: m.tournament?.name || ""
    }));
  }

  _normaliseStandings(data) {
    // Try multiple response shapes RapidAPI might return
    const table =
      data?.response?.standings?.[0]?.table ||
      data?.response?.table ||
      data?.standings?.[0]?.table ||
      data?.table ||
      null;

    if (!Array.isArray(table) || table.length === 0) return [];

    return table.map((r, i) => ({
      rank: r.idx ?? r.position ?? i + 1,
      teamId: r.teamId ?? r.id,
      teamName: r.name ?? r.teamName ?? "Unknown",
      played: r.played ?? r.mp ?? 0,
      won: r.wins ?? r.w ?? 0,
      drawn: r.draws ?? r.d ?? 0,
      lost: r.losses ?? r.l ?? 0,
      gf: r.scoresStr?.split("-")?.[0] ?? r.gf ?? 0,
      ga: r.scoresStr?.split("-")?.[1] ?? r.ga ?? 0,
      gd: r.goalConDiff ?? r.gd ?? 0,
      pts: r.pts ?? r.points ?? 0
    }));
  }

  _normaliseMatch(data, matchId) {
    // Try different response shapes the RapidAPI endpoint might return
    const r = data?.response?.match || data?.response || data?.match || null;
    if (!r) return null;

    // If the response already has the shape our UI expects, return it
    if (r.home && r.away && r.score) return r;

    // Try to build a match object from common API field names
    const homeId = r.homeTeam?.id || r.home?.id;
    const awayId = r.awayTeam?.id || r.away?.id;
    if (!homeId && !awayId) return null;

    return {
      id: matchId,
      home: {
        id: homeId,
        name: r.homeTeam?.name || r.home?.name || "Home",
        logoId: homeId
      },
      away: {
        id: awayId,
        name: r.awayTeam?.name || r.away?.name || "Away",
        logoId: awayId
      },
      score: {
        home: r.homeScore ?? r.score?.home ?? 0,
        away: r.awayScore ?? r.score?.away ?? 0
      },
      status: r.status?.finished ? "FT" : r.status?.started ? "LIVE" : "UPCOMING",
      minute: r.status?.liveTime?.short || null,
      kickoff: r.status?.utcTime || new Date().toISOString(),
      venue: r.venue?.name || r.venue || "",
      events: r.events || [],
      stats: r.stats || null,
      lineups: r.lineups || null
    };
  }

  _normaliseSearch(data) {
    const list = data?.response?.players || data?.response || [];
    if (!Array.isArray(list)) return [];
    return list.slice(0, 8).map((p) => ({
      id: String(p.id),
      name: p.name,
      club: p.teamName || "",
      photoId: p.id
    }));
  }

  _normalisePlayer(data, playerId) {
    return MOCK_PLAYERS[playerId] || MOCK_PLAYERS.p1;
  }

  _normaliseTeam(data, teamId) {
    return MOCK_TEAMS[teamId] || MOCK_TEAMS[8650];
  }

  _normaliseNews(data) {
    const items = data?.response?.news || data?.response || [];
    if (!Array.isArray(items) || items.length === 0) return MOCK_NEWS;
    return items.slice(0, 9).map((n, i) => ({
      title: n.title || n.headline || "Football news update",
      source: n.source?.name || n.source || "Football Data",
      time: n.timeAgo || "Recent",
      image: n.image || MOCK_NEWS[i % MOCK_NEWS.length].image
    }));
  }
}
