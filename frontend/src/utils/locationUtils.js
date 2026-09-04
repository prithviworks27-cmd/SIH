// Shared location parsing for opportunities. Existing/legacy data stores
// location as a single free-text string that sometimes embeds the work mode,
// e.g. "Bangalore (Hybrid)", "Remote", "Zurich, Switzerland (Hybrid)". Rather
// than migrating every record, this derives a clean { city, mode } pair from
// that string so every card/detail/filter reads location the same way —
// including for opportunities posted going forward with an explicit mode.
export const WORK_MODES = ["Remote", "Hybrid", "On-site"];

const MODE_PATTERN = /\s*\((remote|hybrid|on-?site)\)\s*/i;

function normalizeMode(raw) {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower.includes("remote")) return "Remote";
  if (lower.includes("hybrid")) return "Hybrid";
  if (lower.includes("on-site") || lower.includes("onsite") || lower.includes("on site")) return "On-site";
  return null;
}

// Splits a raw location string into a display city and a work mode.
// "Bangalore (Hybrid)" -> { city: "Bangalore", mode: "Hybrid" }
// "Remote" -> { city: "Remote", mode: "Remote" }
// "Mumbai" -> { city: "Mumbai", mode: "On-site" } (no mode stated = assume on-site)
export function parseLocation(rawLocation) {
  const raw = (rawLocation || "").trim();
  if (!raw) return { city: "Not specified", mode: null, raw };

  const bracketMatch = raw.match(MODE_PATTERN);
  if (bracketMatch) {
    const mode = normalizeMode(bracketMatch[1]);
    const city = raw.replace(MODE_PATTERN, "").trim() || mode;
    return { city, mode, raw };
  }

  const modeFromWholeString = normalizeMode(raw);
  if (modeFromWholeString === "Remote" && raw.toLowerCase() === "remote") {
    return { city: "Remote", mode: "Remote", raw };
  }

  return { city: raw, mode: modeFromWholeString || "On-site", raw };
}

// Human-readable "City · Mode" label used consistently across cards and the
// detail page — falls back gracefully when only one half is known.
export function formatLocation(rawLocation) {
  const { city, mode } = parseLocation(rawLocation);
  if (city === "Remote") return "Remote";
  if (!mode) return city;
  return `${city} · ${mode}`;
}

