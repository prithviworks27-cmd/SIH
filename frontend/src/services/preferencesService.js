import { resolveMock } from "./mockClient";

const STORAGE_KEY = "notificationPreferences";

const DEFAULTS = {
  emailNotifications: true,
  smsAlerts: false,
  applicationUpdates: true,
};

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function persist(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // best-effort — preference changes just won't survive a reload if storage is unavailable
  }
}

export async function getPreferences() {
  return resolveMock(loadStored());
}

export async function savePreferences(prefs) {
  const next = { ...loadStored(), ...prefs };
  persist(next);
  return resolveMock(next, { delay: 300 });
}
