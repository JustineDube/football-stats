// PlayerStats.mjs — player profile page (hero, stats cards, form chart, news).
// ---------------------------------------------------------------

import {
  escapeHTML,
  showError,
  showSkeleton,
  playerPhotoUrl,
  attachImageFallbacks
} from "./utils.mjs";

import { addFavBtn } from "./features.mjs";

export default class PlayerStats {
  constructor(api) {
    this.api = api;
  }

  async render(playerId) {
    const hero = document.getElementById("player-hero");
    const cards = document.getElementById("player-stats-cards");
    const chart = document.getElementById("player-form-chart");
    const news = document.getElementById("player-news");

    showSkeleton(cards, 4);

    try {
      const p = await this.api.getPlayer(playerId);
      if (!p) {
        showError(hero, "Player not found.");
        return;
      }
      this._drawHero(hero, p);
      this._drawStats(cards, p);
      this._drawForm(chart, p);
      this._drawNews(news, p);
      attachImageFallbacks(hero);
    } catch (err) {
      showError(hero, err.message);
    }
  }

  _drawHero(mount, p) {
    if (!mount) return;
    mount.innerHTML = `
      <img src="${playerPhotoUrl(p.photoId)}" alt="${escapeHTML(p.name)}" />
      <div class="ph-meta">
        <h1>${escapeHTML(p.name)}</h1>
        <div class="sub">${escapeHTML(p.position)} · ${escapeHTML(p.nationality)} · Age ${p.age}</div>
        <div class="sub" style="margin-top:6px">
          <a href="/team.html?id=${p.club.id}">${escapeHTML(p.club.name)}</a>
        </div>
        <div style="margin-top:14px" id="player-fav-slot"></div>
      </div>
    `;
    addFavBtn(document.getElementById("player-fav-slot"), {
      id: p.id,
      type: "player",
      name: p.name,
      photoId: p.photoId
    });
  }

  _drawStats(mount, p) {
    if (!mount) return;
    const items = [
      ["Goals", p.stats.goals],
      ["Assists", p.stats.assists],
      ["Appearances", p.stats.appearances],
      ["Yellows", p.stats.yellow]
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

  _drawForm(mount, p) {
    if (!mount) return;
    const max = Math.max(...p.form, 10);
    mount.innerHTML = p.form
      .map(
        (v) =>
          `<div class="bar" style="height:${(v / max) * 100}%" data-val="${v.toFixed(1)}"></div>`
      )
      .join("");
  }

  _drawNews(mount, p) {
    if (!mount) return;
    if (!p.news || p.news.length === 0) {
      mount.innerHTML = `<p class="muted">No news available.</p>`;
      return;
    }
    mount.innerHTML = p.news
      .map(
        (n) => `
        <div style="padding:10px 0;border-bottom:1px solid var(--line)">
          <div style="font-weight:600;font-size:14px">${escapeHTML(n.title)}</div>
          <div class="news-meta">${escapeHTML(n.source)} · ${escapeHTML(n.time)}</div>
        </div>`
      )
      .join("");
  }
}
