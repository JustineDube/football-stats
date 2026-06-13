// BettingPanel.mjs — odds and recent-form comparison panel.
// No real betting takes place; this is a stats visualisation.
// ---------------------------------------------------------------

import { escapeHTML, showError, showSkeleton } from "./utils.mjs";

export default class BettingPanel {
  constructor(api) {
    this.api = api;
  }

  async render(mountId, matchId, match) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    showSkeleton(mount, 2);

    try {
      const b = await this.api.getBetting(matchId);
      const best = Math.min(b.home, b.draw, b.away);

      mount.innerHTML = `
        <div class="bet-grid">
          <div class="bet-card${b.home === best ? " best" : ""}">
            <div class="label">${escapeHTML(match.home.name)} win</div>
            <div class="odds">${b.home.toFixed(2)}</div>
          </div>
          <div class="bet-card${b.draw === best ? " best" : ""}">
            <div class="label">Draw</div>
            <div class="odds">${b.draw.toFixed(2)}</div>
          </div>
          <div class="bet-card${b.away === best ? " best" : ""}">
            <div class="label">${escapeHTML(match.away.name)} win</div>
            <div class="odds">${b.away.toFixed(2)}</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
          <div>
            <h3 style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">${escapeHTML(match.home.name)} form</h3>
            <div class="form-strip">
              ${b.homeForm.map((r) => `<span class="form-pill ${r}">${r}</span>`).join("")}
            </div>
          </div>
          <div>
            <h3 style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">${escapeHTML(match.away.name)} form</h3>
            <div class="form-strip">
              ${b.awayForm.map((r) => `<span class="form-pill ${r}">${r}</span>`).join("")}
            </div>
          </div>
        </div>

        <p class="bet-disclaimer">Odds for analysis only. This dashboard does not facilitate gambling.</p>
      `;
    } catch (err) {
      showError(mount, err.message);
    }
  }
}
