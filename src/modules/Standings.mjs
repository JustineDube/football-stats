// Standings.mjs — renders league standings with promotion / relegation zones.
// ---------------------------------------------------------------

import { escapeHTML, showSkeleton, showError } from "./utils.mjs";

const ZONE_RULES = {
  // top 4 = CL, 5 = EL, last 3 = relegation. Default for Big-5 leagues.
  default: (rank, total) => {
    if (rank <= 4) return "zone-cl";
    if (rank === 5) return "zone-el";
    if (rank > total - 3) return "zone-rel";
    return "";
  }
};

export default class Standings {
  constructor(api, mountId, options = {}) {
    this.api = api;
    this.mount = document.getElementById(mountId);
    this.compact = options.compact ?? false;
  }

  async render(leagueId) {
    if (!this.mount) return;
    showSkeleton(this.mount, this.compact ? 6 : 12);
    try {
      const rows = await this.api.getStandings(leagueId);
      if (!rows.length) {
        this.mount.innerHTML = `<p class="muted">Standings unavailable for this league.</p>`;
        return;
      }
      this._draw(rows);
    } catch (err) {
      showError(this.mount, err.message);
    }
  }

  _draw(rows) {
    const total = rows.length;
    const visible = this.compact ? rows.slice(0, 6) : rows;

    const header = this.compact
      ? `<tr><th>#</th><th>Team</th><th>P</th><th>GD</th><th>Pts</th></tr>`
      : `<tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr>`;

    const body = visible
      .map((r) => {
        const zone = ZONE_RULES.default(r.rank, total);
        const teamCell = `<a href="/team.html?id=${r.teamId}">${escapeHTML(
          r.teamName
        )}</a>`;
        const gd = r.gd > 0 ? `+${r.gd}` : r.gd;
        return this.compact
          ? `<tr class="${zone}">
              <td class="pos">${r.rank}</td>
              <td>${teamCell}</td>
              <td>${r.played}</td>
              <td>${gd}</td>
              <td class="pts">${r.pts}</td>
            </tr>`
          : `<tr class="${zone}">
              <td class="pos">${r.rank}</td>
              <td>${teamCell}</td>
              <td>${r.played}</td>
              <td>${r.won}</td>
              <td>${r.drawn}</td>
              <td>${r.lost}</td>
              <td>${r.gf}</td>
              <td>${r.ga}</td>
              <td>${gd}</td>
              <td class="pts">${r.pts}</td>
            </tr>`;
      })
      .join("");

    this.mount.innerHTML = `
      <table class="standings-table">
        <thead>${header}</thead>
        <tbody>${body}</tbody>
      </table>
    `;
  }
}
