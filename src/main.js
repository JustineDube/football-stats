// main.js — home page entry.
// ---------------------------------------------------------------

import FootballData from "./modules/FootballData.mjs";
import Standings from "./modules/Standings.mjs";
import {
  loadHeaderFooter,
  setupScrollTop,
  escapeHTML,
  teamLogoUrl,
  attachImageFallbacks,
  formatMatchDate
} from "./modules/utils.mjs";
import {
  renderFavourites,
  renderSummaryBar,
  setupSearch,
  startLiveTicker
} from "./modules/features.mjs";

const LEAGUE_KEY = "fsd-league";

async function bootstrap() {
  await loadHeaderFooter();
  setupScrollTop();

  const api = new FootballData();
  setupSearch(api);

  // ----- league tabs -----
  const tabs = document.getElementById("league-tabs");
  const leagues = api.getLeagues();
  const stored = Number(localStorage.getItem(LEAGUE_KEY)) || leagues[0].id;

  tabs.innerHTML = leagues
    .map(
      (l) => `
      <button class="league-tab${l.id === stored ? " active" : ""}" data-id="${l.id}" type="button">
        ${escapeHTML(l.name)}
      </button>`
    )
    .join("");

  tabs.querySelectorAll(".league-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      localStorage.setItem(LEAGUE_KEY, id);
      tabs.querySelectorAll(".league-tab").forEach((b) =>
        b.classList.toggle("active", Number(b.dataset.id) === id)
      );
      loadLeague(api, id);
    });
  });

  // ----- favourites -----
  renderFavourites(document.getElementById("favourites-list"));

  // ----- refresh button -----
  document.getElementById("refresh-fixtures").addEventListener("click", () => {
    // Clear the per-endpoint cache and reload
    Object.keys(localStorage)
      .filter((k) => k.startsWith("fsd::"))
      .forEach((k) => localStorage.removeItem(k));
    const activeId =
      Number(document.querySelector(".league-tab.active")?.dataset.id) ||
      stored;
    loadLeague(api, activeId);
  });

  // ----- initial load -----
  loadLeague(api, stored);

  // optional live polling (silent unless games are live)
  startLiveTicker(api, null);

  // ----- latest news -----
  loadNews(api);
}

async function loadLeague(api, leagueId) {
  const leagues = api.getLeagues();
  const league = leagues.find((l) => l.id === leagueId) || leagues[0];

  const fixturesEl = document.getElementById("fixtures-list");
  const summaryEl = document.getElementById("summary-bar");

  fixturesEl.innerHTML = Array.from({ length: 4 })
    .map(() => `<div class="skeleton skeleton-card"></div>`)
    .join("");

  const fixtures = await api.getFixtures(leagueId);
  renderSummaryBar(summaryEl, fixtures, league.short);
  renderFixtures(fixturesEl, fixtures);

  // mini standings
  const standings = new Standings(api, "standings-mini", { compact: true });
  standings.render(leagueId);
}

function renderFixtures(mount, fixtures) {
  if (!fixtures.length) {
    mount.innerHTML = `<p class="empty-state">No fixtures today. Check back tomorrow.</p>`;
    return;
  }
  mount.innerHTML = fixtures
    .map((f) => {
      const isLive = f.status === "LIVE";
      const status = isLive
        ? `${f.minute || ""}'`
        : f.status === "FT"
        ? "Full time"
        : formatMatchDate(f.kickoff);
      const statusClass = isLive ? "live" : "";
      return `
      <a class="fixture-card" href="/match.html?id=${f.id}">
        <div class="fixture-team home">
          <img src="${teamLogoUrl(f.home.logoId || f.home.id)}" alt="" />
          <span class="team-name">${escapeHTML(f.home.name)}</span>
        </div>
        <div class="fixture-score">
          <div>${f.score.home} : ${f.score.away}</div>
          <div class="status ${statusClass}">${escapeHTML(status)}</div>
        </div>
        <div class="fixture-team away">
          <span class="team-name">${escapeHTML(f.away.name)}</span>
          <img src="${teamLogoUrl(f.away.logoId || f.away.id)}" alt="" />
        </div>
        <div class="fixture-meta">
          <span>${escapeHTML(f.venue || "")}</span>
          <span>${formatMatchDate(f.kickoff)}</span>
        </div>
      </a>`;
    })
    .join("");
  attachImageFallbacks(mount);
}

async function loadNews(api) {
  const mount = document.getElementById("news-grid");
  mount.innerHTML = Array.from({ length: 3 })
    .map(() => `<div class="skeleton skeleton-card" style="height:200px"></div>`)
    .join("");
  try {
    const news = await api.getNews();
    mount.innerHTML = news
      .slice(0, 6)
      .map(
        (n) => `
        <article class="news-card">
          <div class="news-img" style="background-image:url('${n.image}')"></div>
          <div class="news-body">
            <h3>${escapeHTML(n.title)}</h3>
            <div class="news-meta"><span>${escapeHTML(n.source)}</span><span>${escapeHTML(n.time)}</span></div>
          </div>
        </article>`
      )
      .join("");
  } catch (err) {
    mount.innerHTML = `<div class="error-box">News feed unavailable.</div>`;
  }
}

bootstrap();
