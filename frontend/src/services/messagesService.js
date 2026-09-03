import { resolveMock } from "./mockClient";
import { conversations as seedConversations } from "./mockData/conversations";
import { messagesAPI } from "./api";

const STORAGE_KEY = "conversations";

function loadStoredLocally() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistLocally(conversations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // best-effort — sent messages just won't survive a reload if storage is unavailable
  }
}

// Seed conversations/contacts stay in frontend mock data (mockData/conversations.js)
// — there are no real second-party user accounts behind them. Messages the
// student actually sends and per-conversation unread state are the real
// per-user data, now in Supabase (sent_messages + conversation_read_state)
// with localStorage as a same-tab cache/offline fallback.
export async function getConversations() {
  try {
    const { messagesByConversation, unreadOverrides } = await messagesAPI.getConversationState();

    const merged = seedConversations.map((c) => ({
      ...c,
      unread: unreadOverrides[c.id] !== undefined ? unreadOverrides[c.id] : c.unread,
      messages: [...c.messages, ...(messagesByConversation[c.id] ?? []).map((m) => ({ id: m.id, from: m.from, text: m.text, time: "Just now" }))],
    }));

    persistLocally(merged);
    return resolveMock(merged);
  } catch (err) {
    console.warn("Could not load messages from backend, using local cache only:", err.message);
    return resolveMock(loadStoredLocally() ?? seedConversations);
  }
}

export async function sendMessage(conversationId, text) {
  const current = loadStoredLocally() ?? seedConversations;
  const localNext = current.map((c) =>
    c.id === conversationId
      ? {
          ...c,
          unread: false,
          messages: [...c.messages, { id: `local-${Date.now()}`, from: "me", text, time: "Just now" }],
        }
      : c
  );
  persistLocally(localNext);

  try {
    await messagesAPI.sendMessage(conversationId, text);
  } catch (err) {
    console.warn(`Could not sync message to backend, kept in local cache only:`, err.message);
  }

  return resolveMock(localNext.find((c) => c.id === conversationId), { delay: 300 });
}

export async function markConversationRead(conversationId) {
  const current = loadStoredLocally() ?? seedConversations;
  const next = current.map((c) => (c.id === conversationId ? { ...c, unread: false } : c));
  persistLocally(next);

  try {
    await messagesAPI.markConversationRead(conversationId);
  } catch (err) {
    console.warn(`Could not sync read-state for conversation ${conversationId} to backend:`, err.message);
  }

  return resolveMock(next, { delay: 0 });
}
