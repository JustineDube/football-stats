// player.js — player page entry.
// ---------------------------------------------------------------

import FootballData from "./modules/FootballData.mjs";
import PlayerStats from "./modules/PlayerStats.mjs";
import { loadHeaderFooter, setupScrollTop, getParam } from "./modules/utils.mjs";
import { setupSearch } from "./modules/features.mjs";

async function bootstrap() {
  await loadHeaderFooter();
  setupScrollTop();

  const api = new FootballData();
  setupSearch(api);

  const playerId = getParam("id", "p1");
  const player = new PlayerStats(api);
  player.render(playerId);
}

bootstrap();
