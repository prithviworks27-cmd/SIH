import { resolveMock } from "./mockClient";
import { DEFAULT_PORTFOLIO } from "./mockData/portfolio";

const STORAGE_KEY = "studentPortfolio";

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persist(portfolio) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
  } catch {
    // best-effort — edits just won't survive a reload if storage is unavailable
  }
}

export async function getPortfolio() {
  const stored = loadStored();
  return resolveMock(stored ?? DEFAULT_PORTFOLIO);
}

// Only the editable fields (see DigitalPortfolioEdit) — projects/certifications/
// internships/achievements aren't editable yet, so they're preserved from
// whatever's already stored.
export async function savePortfolioBasics(basics) {
  const current = loadStored() ?? DEFAULT_PORTFOLIO;
  const next = { ...current, ...basics };
  persist(next);
  return resolveMock(next, { delay: 500 });
}
