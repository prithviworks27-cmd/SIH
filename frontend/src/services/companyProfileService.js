import { resolveMock } from "./mockClient";
import { DEFAULT_COMPANY_PROFILE } from "./mockData/companyProfile";
import { industryAPI } from "./api";

const STORAGE_KEY = "companyProfile";

function loadStoredLocally() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistLocally(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // best-effort — edits just won't survive a reload if storage is unavailable
  }
}

export async function getCompanyProfile() {
  try {
    const { profile } = await industryAPI.getCompanyProfile();
    if (profile) persistLocally(profile);
    return resolveMock(profile);
  } catch (err) {
    console.warn("Could not load company profile from backend, using local cache only:", err.message);
    return resolveMock(loadStoredLocally() ?? DEFAULT_COMPANY_PROFILE);
  }
}

// Used to decide whether an industry user still needs the post-signup
// onboarding step — true once they've saved at least a company name.
export function isCompanyProfileComplete(profile) {
  return Boolean(profile?.name?.trim());
}

export async function saveCompanyProfile(fields, { requireBackend = false } = {}) {
  const current = loadStoredLocally() ?? DEFAULT_COMPANY_PROFILE;
  const next = { ...current, ...fields };

  try {
    const { profile } = await industryAPI.saveCompanyProfile(next);
    const saved = profile ?? next;
    persistLocally(saved);
    return resolveMock(saved, { delay: 500 });
  } catch (err) {
    if (requireBackend) throw err;
    console.warn("Could not sync company profile to backend:", err.message);
    persistLocally(next);
    return resolveMock(next, { delay: 500 });
  }

}

export async function uploadCompanyLogo(file) {
  const { logoUrl } = await industryAPI.uploadCompanyLogo(file);
  return logoUrl;
}
