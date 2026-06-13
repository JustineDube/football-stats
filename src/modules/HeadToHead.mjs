// HeadToHead.mjs — recent and historical record between two clubs.
// ---------------------------------------------------------------

import { escapeHTML, showSkeleton, showError } from "./utils.mjs";

export default class HeadToHead {
  constructor(api) {
    this.api = api;
  }

  async render(mountId, homeId, awayId, homeName, awayName) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    showSkeleton(mount, 3);

    try {
      const h2h = await this.api.getH2H(homeId, awayId);
      const total = h2h.homeWins + h2h.draws + h2h.awayWins;

      mount.innerHTML = `
        <div class="h2h-summary">
          <div class="h2h-stat win">
            <div class="num">${h2h.homeWins}</div>
            <div class="lbl">${escapeHTML(homeName || "Home")} wins</div>
          </div>
          <div class="h2h-stat draw">
            <div class="num">${h2h.draws}</div>
            <div class="lbl">Draws</div>
          </div>
          <div class="h2h-stat loss">
            <div class="num">${h2h.awayWins}</div>
            <div class="lbl">${escapeHTML(awayName || "Away")} wins</div>
          </div>
        </div>
        <p class="muted">Over ${total} historical meetings · goals ${h2h.homeGoals}-${h2h.awayGoals}</p>
        <h3 style="margin-top:18px;font-size:14px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em">Last 5 meetings</h3>
        <ul style="margin-top:10px">
          ${h2h.matches
            .map(
              (m) => `
            <li style="display:grid;grid-template-columns:80px 1fr auto;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);font-size:14px">
              <span class="muted">${escapeHTML(m.date)}</span>
              <span>${escapeHTML(m.home)} v ${escapeHTML(m.away)}</span>
              <span style="font-family:var(--font-mono);font-weight:600">${escapeHTML(m.score)}</span>
            </li>`
            )
            .join("")}
        </ul>
      `;
    } catch (err) {
      showError(mount, err.message);
    }
  }
}
