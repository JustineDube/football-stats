// MatchStats.mjs — match detail: events, stat bars, lineups.
// ---------------------------------------------------------------

import {
  escapeHTML,
  showError,
  showSkeleton,
  teamLogoUrl,
  attachImageFallbacks,
  formatMatchDate
} from "./utils.mjs";

const ICONS = {
  goal: "⚽",
  yellow: "🟨",
  red: "🟥",
  sub: "🔁",
  pen: "🅿️"
};

export default class MatchStats {
  constructor(api) {
    this.api = api;
  }

  async render(matchId) {
    const hero = document.getElementById("match-hero");
    const eventsPanel = document.getElementById("tab-events");
    const statsPanel = document.getElementById("tab-stats");
    const lineupsPanel = document.getElementById("tab-lineups");

    showSkeleton(eventsPanel, 4);

    try {
      const match = await this.api.getMatchDetail(matchId);
      if (!match) {
        showError(eventsPanel, "Match not found.");
        return;
      }
      this._drawHero(hero, match);
      this._drawEvents(eventsPanel, match);
      this._drawStats(statsPanel, match);
      this._drawLineups(lineupsPanel, match);
      attachImageFallbacks(hero);
      return match;
    } catch (err) {
      showError(eventsPanel, err.message);
    }
  }

  _drawHero(mount, m) {
    if (!mount) return;
    const liveClass = m.status === "LIVE" ? " live" : "";
    const statusText =
      m.status === "LIVE"
        ? `${m.minute || ""}'`
        : m.status === "FT"
        ? "Full time"
        : formatMatchDate(m.kickoff);

    mount.innerHTML = `
      <div class="mh-team home">
        <img src="${teamLogoUrl(m.home.logoId || m.home.id)}" alt="${escapeHTML(m.home.name)}" />
        <div class="name">${escapeHTML(m.home.name)}</div>
      </div>
      <div class="mh-score">
        <div>${m.score?.home ?? "-"} : ${m.score?.away ?? "-"}</div>
        <div class="status${liveClass}">${escapeHTML(statusText)}</div>
        <div class="status">${escapeHTML(m.venue || "")}</div>
      </div>
      <div class="mh-team away">
        <img src="${teamLogoUrl(m.away.logoId || m.away.id)}" alt="${escapeHTML(m.away.name)}" />
        <div class="name">${escapeHTML(m.away.name)}</div>
      </div>
    `;
  }

  _drawEvents(mount, m) {
    if (!mount) return;
    if (!m.events || m.events.length === 0) {
      mount.innerHTML = `<p class="empty-state">No events yet — match hasn't kicked off.</p>`;
      return;
    }
    mount.innerHTML = m.events
      .map(
        (e) => `
        <div class="event-row ${e.team}">
          <div class="minute">${e.minute}'</div>
          <div class="icon" aria-hidden="true">${ICONS[e.type] || "•"}</div>
          <div class="desc">
            <span class="player">${escapeHTML(e.player)}</span>
            ${e.detail ? `<span class="muted"> — ${escapeHTML(e.detail)}</span>` : ""}
          </div>
        </div>`
      )
      .join("");
  }

  _drawStats(mount, m) {
    if (!mount) return;
    if (!m.stats) {
      mount.innerHTML = `<p class="empty-state">Stats appear once the match starts.</p>`;
      return;
    }
    const rows = [
      ["Possession %", m.stats.possession, true],
      ["Shots", m.stats.shots, false],
      ["Shots on target", m.stats.shotsOnTarget, false],
      ["Corners", m.stats.corners, false],
      ["Fouls", m.stats.fouls, false],
      ["Expected goals (xG)", m.stats.xG, true]
    ];

    mount.innerHTML = rows
      .map(([label, val, isPct]) => {
        const total = val.home + val.away || 1;
        const homePct = (val.home / total) * 100;
        const awayPct = (val.away / total) * 100;
        return `
        <div class="stat-row">
          <div class="stat-num home">${val.home}</div>
          <div class="stat-label">${label}</div>
          <div class="stat-num">${val.away}</div>
          <div class="stat-bar">
            <div class="home-fill" style="width:${homePct}%"></div>
            <div class="away-fill" style="width:${awayPct}%"></div>
          </div>
        </div>`;
      })
      .join("");
  }

  _drawLineups(mount, m) {
    if (!mount) return;
    if (!m.lineups) {
      mount.innerHTML = `<p class="empty-state">Lineups released closer to kick-off.</p>`;
      return;
    }
    const list = (side) =>
      side.starters
        .map(
          (p) =>
            `<li><span class="num">${p.num}</span><span>${escapeHTML(p.name)}</span></li>`
        )
        .join("");

    mount.innerHTML = `
      <div class="lineup">
        <div>
          <h3>${escapeHTML(m.home.name)} · ${m.lineups.home.formation}</h3>
          <ul>${list(m.lineups.home)}</ul>
        </div>
        <div>
          <h3>${escapeHTML(m.away.name)} · ${m.lineups.away.formation}</h3>
          <ul>${list(m.lineups.away)}</ul>
        </div>
      </div>
    `;
  }
}
