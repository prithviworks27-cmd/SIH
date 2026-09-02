import { resolveMock } from "./mockClient";
import { conversations as seedConversations } from "./mockData/conversations";

const STORAGE_KEY = "conversations";

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persist(conversations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // best-effort — sent messages just won't survive a reload if storage is unavailable
  }
}

export async function getConversations() {
  return resolveMock(loadStored() ?? seedConversations);
}

export async function sendMessage(conversationId, text) {
  const current = loadStored() ?? seedConversations;
  const next = current.map((c) =>
    c.id === conversationId
      ? {
          ...c,
          unread: false,
          messages: [...c.messages, { id: `local-${Date.now()}`, from: "me", text, time: "Just now" }],
        }
      : c
  );
  persist(next);
  return resolveMock(next.find((c) => c.id === conversationId), { delay: 300 });
}

export async function markConversationRead(conversationId) {
  const current = loadStored() ?? seedConversations;
  const next = current.map((c) => (c.id === conversationId ? { ...c, unread: false } : c));
  persist(next);
  return resolveMock(next, { delay: 0 });
}
