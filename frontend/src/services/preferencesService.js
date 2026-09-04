import { resolveMock } from "./mockClient";
import { studentStateAPI } from "./api";

const STORAGE_KEY = "notificationPreferences";

const DEFAULTS = {
  emailNotifications: true,
  smsAlerts: false,
  applicationUpdates: true,
  phone: "",
  course: "",
  profileVisibility: "Institution Only",
  portfolioVisibility: "Public",
  opportunityVisibility: "Visible to Recruiters",
  dataSharingConsent: true,
  // Real student data the matching engine's education/location dimensions
  // compare against (see matchingEngine.js) — no longer fake constants.
  degree: "",
  branch: "",
  graduationYear: null,
  preferredLocation: "",
};

function loadStoredLocally() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function persistLocally(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // best-effort — preference changes just won't survive a reload if storage is unavailable
  }
}

export async function getPreferences() {
  try {
    const { preferences } = await studentStateAPI.getNotificationPreferences();
    persistLocally(preferences);
    return resolveMock(preferences);
  } catch (err) {
    console.warn("Could not load preferences from backend, using local cache only:", err.message);
    return resolveMock(loadStoredLocally());
  }
}

export async function savePreferences(prefs) {
  const next = { ...loadStoredLocally(), ...prefs };
  persistLocally(next);

  try {
    await studentStateAPI.saveNotificationPreferences(next);
  } catch (err) {
    console.warn("Could not sync preferences to backend, kept in local cache only:", err.message);
  }

  return resolveMock(next, { delay: 300 });
}
