import { resolveMock } from "./mockClient";
import { notifications as seedNotifications } from "./mockData/notifications";
import { studentStateAPI } from "./api";

const STORAGE_KEY = "notificationReadState";

function loadReadOverridesLocally() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistReadOverridesLocally(overrides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // best-effort — read state just won't survive a reload if storage is unavailable
  }
}

// Seed notifications stay in frontend mock data (see mockData/notifications.js);
// only which ones a user has read is real per-user state, now in Supabase's
// notification_read_state table with localStorage as a same-tab cache/offline
// fallback.
export async function getNotifications() {
  let overrides = loadReadOverridesLocally();
  try {
    const { readIds } = await studentStateAPI.getReadNotificationIds();
    overrides = { ...overrides, ...Object.fromEntries(readIds.map((id) => [id, false])) };
    persistReadOverridesLocally(overrides);
  } catch (err) {
    console.warn("Could not load notification read-state from backend, using local cache only:", err.message);
  }

  const withReadState = seedNotifications.map((n) => ({
    ...n,
    unread: overrides[n.id] !== undefined ? overrides[n.id] : n.unread,
  }));
  return resolveMock(withReadState);
}

export async function markNotificationRead(id) {
  const overrides = loadReadOverridesLocally();
  overrides[id] = false;
  persistReadOverridesLocally(overrides);

  try {
    await studentStateAPI.markNotificationsRead([id]);
  } catch (err) {
    console.warn(`Could not sync read-state for ${id} to backend:`, err.message);
  }

  return resolveMock({ id }, { delay: 0 });
}

export async function markAllNotificationsRead() {
  const overrides = loadReadOverridesLocally();
  for (const n of seedNotifications) overrides[n.id] = false;
  persistReadOverridesLocally(overrides);

  try {
    await studentStateAPI.markNotificationsRead(seedNotifications.map((n) => n.id));
  } catch (err) {
    console.warn("Could not sync read-all-notifications to backend:", err.message);
  }

  return resolveMock(true, { delay: 300 });
}
