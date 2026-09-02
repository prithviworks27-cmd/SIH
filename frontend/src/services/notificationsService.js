import { resolveMock } from "./mockClient";
import { notifications as seedNotifications } from "./mockData/notifications";

const STORAGE_KEY = "notificationReadState";

function loadReadOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistReadOverrides(overrides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // best-effort — read state just won't survive a reload if storage is unavailable
  }
}

export async function getNotifications() {
  const overrides = loadReadOverrides();
  const withReadState = seedNotifications.map((n) => ({
    ...n,
    unread: overrides[n.id] !== undefined ? overrides[n.id] : n.unread,
  }));
  return resolveMock(withReadState);
}

export async function markNotificationRead(id) {
  const overrides = loadReadOverrides();
  overrides[id] = false;
  persistReadOverrides(overrides);
  return resolveMock({ id }, { delay: 0 });
}

export async function markAllNotificationsRead() {
  const overrides = loadReadOverrides();
  for (const n of seedNotifications) overrides[n.id] = false;
  persistReadOverrides(overrides);
  return resolveMock(true, { delay: 300 });
}
