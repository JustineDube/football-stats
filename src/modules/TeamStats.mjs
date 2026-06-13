// TeamStats.mjs — team overview page.
// ---------------------------------------------------------------

import {
  escapeHTML,
  showError,
  showSkeleton,
  teamLogoUrl,
  attachImageFallbacks
} from "./utils.mjs";

import { addFavBtn } from "./features.mjs";

export default class TeamStats {
  constructor(api) {
    this.api = api;
  }

  async render(teamId) {
    const hero = document.getElementById("team-hero");
    const cards = document.getElementById("team-stats-cards");
    const recent = document.getElementById("team-recent");
    const scorers = document.getElementById("team-top-scorers");
    const form = document.getElementById("team-form");

    showSkeleton(cards, 4);

    try {
      const t = await this.api.getTeam(teamId);
      if (!t) {
        showError(hero, "Team not found.");
        return;
      }
      this._drawHero(hero, t);
      this._drawStats(cards, t);
      this._drawRecent(recent, t);
      this._drawScorers(scorers, t);
      this._drawForm(form, t);
      attachImageFallbacks(hero);
    } catch (err) {
      showError(hero, err.message);
    }
  }

  _drawHero(mount, t) {
    if (!mount) return;
    const winRate =
      t.stats.wins != null
        ? Math.round((t.stats.wins / 16) * 100)
        : null;

    mount.innerHTML = `
      <img src="${teamLogoUrl(t.logoId || t.id)}" alt="${escapeHTML(t.name)}" />
      <div class="th-meta">
        <h1>${escapeHTML(t.name)}</h1>
        <div class="sub">${escapeHTML(t.league)} · ${escapeHTML(t.formation)}</div>
        ${winRate != null ? `<div class="sub" style="margin-top:6px">Win rate: <strong>${winRate}%</strong></div>` : ""}
        <div style="margin-top:14px" id="team-fav-slot"></div>
      </div>
    `;
    addFavBtn(document.getElementById("team-fav-slot"), {
      id: t.id,
      type: "team",
      name: t.name,
      logoId: t.logoId
    });
  }

  _drawStats(mount, t) {
    if (!mount) return;
    const items = [
      ["Goals for", t.stats.goalsFor],
      ["Goals against", t.stats.goalsAgainst],
      ["Clean sheets", t.stats.cleanSheets],
      ["Wins", t.stats.wins]
    ];
    mount.innerHTML = items
      .map(
        ([lbl, val]) => `
        <div class="summary-card">
          <div class="summary-label">${lbl}</div>
          <div class="summary-value">${val}</div>
        </div>`
      )
      .join("");
  }

  _drawRecent(mount, t) {
    if (!mount) return;
    mount.innerHTML = t.recent
      .map(
        (r) => `
        <div style="display:grid;grid-template-columns:24px 1fr auto;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);align-items:center;font-size:14px">
          <span class="form-pill ${r.result}">${r.result}</span>
          <span>${r.home ? "vs" : "@"} ${escapeHTML(r.opp)}</span>
          <span style="font-family:var(--font-mono);font-weight:600">${escapeHTML(r.score)}</span>
        </div>`
      )
      .join("");
  }

  _drawScorers(mount, t) {
    if (!mount) return;
    mount.innerHTML = t.topScorers
      .map(
        (s, i) => `
        <div class="scorer-row">
          <span class="rank">${i + 1}</span>
          <span><a href="/player.html?id=${s.id}">${escapeHTML(s.name)}</a></span>
          <span class="goals">${s.goals}</span>
        </div>`
      )
      .join("");
  }

  _drawForm(mount, t) {
    if (!mount) return;
    mount.innerHTML = t.form
      .map((r) => `<span class="form-pill ${r}">${r}</span>`)
      .join("");
  }
}
