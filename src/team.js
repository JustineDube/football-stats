// team.js — team page entry.
// ---------------------------------------------------------------

import FootballData from "./modules/FootballData.mjs";
import TeamStats from "./modules/TeamStats.mjs";
import { loadHeaderFooter, setupScrollTop, getParam } from "./modules/utils.mjs";
import { setupSearch } from "./modules/features.mjs";

async function bootstrap() {
  await loadHeaderFooter();
  setupScrollTop();

  const api = new FootballData();
  setupSearch(api);

  const teamId = Number(getParam("id", 8650));
  const team = new TeamStats(api);
  team.render(teamId);
}

bootstrap();
