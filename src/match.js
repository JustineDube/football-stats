// match.js — match detail page entry.
// ---------------------------------------------------------------

import FootballData from "./modules/FootballData.mjs";
import MatchStats from "./modules/MatchStats.mjs";
import HeadToHead from "./modules/HeadToHead.mjs";
import BettingPanel from "./modules/BettingPanel.mjs";
import { loadHeaderFooter, setupScrollTop, getParam } from "./modules/utils.mjs";
import { setupSearch } from "./modules/features.mjs";

async function bootstrap() {
  await loadHeaderFooter();
  setupScrollTop();

  const api = new FootballData();
  setupSearch(api);

  const matchId = getParam("id", "m1");

  const stats = new MatchStats(api);
  const match = await stats.render(matchId);

  // tabs
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      document.querySelectorAll(".tab").forEach((t) =>
        t.classList.toggle("active", t === tab)
      );
      document.querySelectorAll(".tab-panel").forEach((p) => {
        p.classList.toggle("hidden", p.id !== `tab-${target}`);
      });
    });
  });

  // wire H2H and Betting once match is loaded
  if (match) {
    const h2h = new HeadToHead(api);
    h2h.render("tab-h2h", match.home.id, match.away.id, match.home.name, match.away.name);

    const betting = new BettingPanel(api);
    betting.render("tab-betting", matchId, match);
  }
}

bootstrap();
