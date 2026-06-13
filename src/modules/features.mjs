// features.mjs — shared interactive features used across pages.
// ---------------------------------------------------------------

import {
  escapeHTML,
  debounce,
  teamLogoUrl,
  playerPhotoUrl,
  formatMatchDate
} from "./utils.mjs";

const FAV_KEY = "fsd-favourites";

// ---------- Favourites ----------
export function getFavourites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveFavourites(list) {
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
}

export function toggleFavourite(item) {
  const list = getFavourites();
  const idx = list.findIndex((f) => f.id === item.id && f.type === item.type);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(item);
  }
  saveFavourites(list);
  return idx < 0; // true if added
}

export function isFavourite(id, type) {
  return getFavourites().some((f) => f.id === id && f.type === type);
}

/** Render favourites into a container on the home page. */
export function renderFavourites(mount) {
  if (!mount) return;
  const favs = getFavourites();
  if (favs.length === 0) {
    mount.innerHTML = `<p class="muted" style="font-size:13px">Star a team or player to pin it here.</p>`;
    return;
  }
  mount.innerHTML = favs
    .map((f) => {
      const img =
        f.type === "team"
          ? teamLogoUrl(f.logoId || f.id)
          : playerPhotoUrl(f.photoId || f.id);
      const href =
        f.type === "team" ? `/team.html?id=${f.id}` : `/player.html?id=${f.id}`;
      return `
        <div class="fav-row">
          <img src="${img}" alt="" />
          <div>
            <a href="${href}" style="font-weight:600;font-size:14px">${escapeHTML(f.name)}</a>
            <div class="fav-meta">${f.type === "team" ? "Team" : "Player"}</div>
          </div>
          <button class="fav-remove" data-id="${f.id}" data-type="${f.type}" aria-label="Remove from favourites">×</button>
        </div>`;
    })
    .join("");

  mount.querySelectorAll(".fav-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const type = btn.dataset.type;
      toggleFavourite({ id, type });
      renderFavourites(mount);
    });
  });
}

/** Attach a "star" button to any container. */
export function addFavBtn(mount, item) {
  if (!mount) return;
  const active = isFavourite(item.id, item.type);
  mount.innerHTML = `
    <button class="fav-btn${active ? " active" : ""}" type="button">
      <span aria-hidden="true">${active ? "★" : "☆"}</span>
      <span>${active ? "Favourited" : "Add to favourites"}</span>
    </button>`;
  mount.querySelector("button").addEventListener("click", (e) => {
    const added = toggleFavourite(item);
    const btn = e.currentTarget;
    btn.classList.toggle("active", added);
    btn.innerHTML = `
      <span aria-hidden="true">${added ? "★" : "☆"}</span>
      <span>${added ? "Favourited" : "Add to favourites"}</span>`;
  });
}

// ---------- Summary bar ----------
export function renderSummaryBar(mount, fixtures, leagueName) {
  if (!mount) return;
  const live = fixtures.filter((f) => f.status === "LIVE").length;
  const finished = fixtures.filter((f) => f.status === "FT").length;
  const upcoming = fixtures.filter((f) => f.status === "UPCOMING").length;
  const goals = fixtures.reduce(
    (sum, f) => sum + (f.score?.home || 0) + (f.score?.away || 0),
    0
  );

  mount.innerHTML = `
    <div class="summary-card">
      <div class="summary-label">${escapeHTML(leagueName)}</div>
      <div class="summary-value">${fixtures.length}<span style="font-size:13px;color:var(--muted);margin-left:6px">games</span></div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Live now</div>
      <div class="summary-value accent">${live}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Finished</div>
      <div class="summary-value">${finished}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Goals today</div>
      <div class="summary-value">${goals}</div>
    </div>
  `;
}

// ---------- Search ----------
export function setupSearch(api) {
  const form = document.getElementById("header-search");
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  if (!form || !input || !results) return;

  const runSearch = debounce(async (q) => {
    if (!q || q.length < 2) {
      results.hidden = true;
      results.innerHTML = "";
      return;
    }
    const matches = await api.searchPlayers(q);
    if (!matches.length) {
      results.innerHTML = `<li class="row-meta" style="padding:14px">No matches.</li>`;
      results.hidden = false;
      return;
    }
    results.innerHTML = matches
      .map(
        (p) => `
        <li role="option" data-id="${p.id}" tabindex="0">
          <img src="${playerPhotoUrl(p.photoId)}" alt="" />
          <div>
            <div style="font-weight:600">${escapeHTML(p.name)}</div>
            <div class="row-meta">${escapeHTML(p.club || "")}</div>
          </div>
        </li>`
      )
      .join("");
    results.hidden = false;

    results.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => {
        window.location.href = `/player.html?id=${li.dataset.id}`;
      });
    });
  }, 250);

  input.addEventListener("input", (e) => runSearch(e.target.value.trim()));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const first = results.querySelector("li[data-id]");
    if (first) window.location.href = `/player.html?id=${first.dataset.id}`;
  });
  document.addEventListener("click", (e) => {
    if (!form.contains(e.target)) {
      results.hidden = true;
    }
  });
}

// ---------- Live ticker ----------
export function startLiveTicker(api, mount, intervalMs = 60000) {
  // Conservative: refresh every minute, only while tab is focused.
  if (!mount) return;
  let timer = null;
  const tick = async () => {
    try {
      const live = await api.getLive();
      if (!live.length) {
        mount.style.display = "none";
        return;
      }
      mount.style.display = "block";
      // Reserved hook; the live state is reflected inline in fixture cards.
    } catch {
      /* silent */
    }
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && timer) {
      clearInterval(timer);
      timer = null;
    } else if (!document.hidden && !timer) {
      tick();
      timer = setInterval(tick, intervalMs);
    }
  });
  tick();
  timer = setInterval(tick, intervalMs);
}

// re-export for legibility
export { formatMatchDate };
