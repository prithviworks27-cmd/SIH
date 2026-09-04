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
    const resolved = profile ?? DEFAULT_COMPANY_PROFILE;
    persistLocally(resolved);
    return resolveMock(resolved);
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

export async function saveCompanyProfile(fields) {
  const current = loadStoredLocally() ?? DEFAULT_COMPANY_PROFILE;
  const next = { ...current, ...fields };
  persistLocally(next);

  try {
    await industryAPI.saveCompanyProfile(next);
  } catch (err) {
    console.warn("Could not sync company profile to backend, kept in local cache only:", err.message);
  }

  return resolveMock(next, { delay: 500 });
}
