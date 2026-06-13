// utils.mjs — shared helpers used across pages
// ---------------------------------------------------------------

/**
 * Load the header.html and footer.html partials into their containers
 * and wire up shared interactive bits (menu toggle, footer year, search).
 */
export async function loadHeaderFooter() {
  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");

  try {
    const [headerHTML, footerHTML] = await Promise.all([
      fetch("/partials/header.html").then((r) => r.text()),
      fetch("/partials/footer.html").then((r) => r.text())
    ]);
    if (headerEl) headerEl.innerHTML = headerHTML;
    if (footerEl) footerEl.innerHTML = footerHTML;
  } catch (err) {
    console.warn("Header/footer load failed", err);
  }

  // footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // mobile menu
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }
}

/** Show a skeleton loader inside a container. */
export function showSkeleton(container, count = 4) {
  if (!container) return;
  container.innerHTML = Array.from({ length: count })
    .map(() => `<div class="skeleton skeleton-card"></div>`)
    .join("");
}

/** Show an error message inside a container. */
export function showError(container, message) {
  if (!container) return;
  container.innerHTML = `
    <div class="error-box">
      <strong>Couldn't load that.</strong><br />
      <span>${escapeHTML(message || "Try refreshing in a moment.")}</span>
    </div>`;
}

/** Show an empty state. */
export function showEmpty(container, message) {
  if (!container) return;
  container.innerHTML = `<div class="empty-state">${escapeHTML(message)}</div>`;
}

/** Escape HTML to prevent injection from API responses. */
export function escapeHTML(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Format a date for fixture displays. */
export function formatMatchDate(date) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const today = new Date();
  const sameDay =
    d.toDateString() === today.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

/** Read a query-string parameter. */
export function getParam(key, fallback = null) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key) ?? fallback;
}

/** Set up the scroll-to-top button on any page that includes it. */
export function setupScrollTop() {
  const btn = document.getElementById("scroll-top");
  if (!btn) return;
  const onScroll = () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

/** Build a FotMob-style logo URL by team id. */
export function teamLogoUrl(teamId) {
  if (!teamId) return placeholderLogo();
  return `https://images.fotmob.com/image_resources/logo/teamlogo/${teamId}.png`;
}

/** Build a FotMob-style player photo URL by player id. */
export function playerPhotoUrl(playerId) {
  if (!playerId) return placeholderLogo();
  return `https://images.fotmob.com/image_resources/playerimages/${playerId}.png`;
}

/** Inline SVG placeholder used when an image fails to load. */
export function placeholderLogo() {
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='16' fill='%231a2e42'/><text x='50%' y='55%' text-anchor='middle' fill='%238a99aa' font-family='Inter' font-size='12' font-weight='700'>?</text></svg>`
    )
  );
}

/** Attach onerror fallback to all images inside a container. */
export function attachImageFallbacks(container) {
  if (!container) return;
  container.querySelectorAll("img").forEach((img) => {
    img.addEventListener(
      "error",
      () => {
        img.src = placeholderLogo();
      },
      { once: true }
    );
  });
}

/** Debounce helper for search input. */
export function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
