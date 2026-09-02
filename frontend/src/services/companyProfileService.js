import { resolveMock } from "./mockClient";
import { DEFAULT_COMPANY_PROFILE } from "./mockData/companyProfile";

const STORAGE_KEY = "companyProfile";

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persist(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // best-effort — edits just won't survive a reload if storage is unavailable
  }
}

export async function getCompanyProfile() {
  return resolveMock(loadStored() ?? DEFAULT_COMPANY_PROFILE);
}

export async function saveCompanyProfile(fields) {
  const current = loadStored() ?? DEFAULT_COMPANY_PROFILE;
  const next = { ...current, ...fields };
  persist(next);
  return resolveMock(next, { delay: 500 });
}
