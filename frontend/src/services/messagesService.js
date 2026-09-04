import { resolveMock } from "./mockClient";
import { messagesAPI } from "./api";

// Real student<->industry 1:1 conversations, entirely server-side (see
// backend/src/controllers/messagesController.js) — no seeded fake contacts,
// no localStorage fallback for the conversation list itself (unlike other
// services, a stale local cache of someone else's real messages isn't a
// safe thing to fall back to offline). Used by both the student MessagesInbox
// and the industry-side Messages page — the shape returned (id, name,
// subtitle, unread, messages[]) is participant-agnostic, so the same
// component renders it either way.
export async function getConversations() {
  const { conversations } = await messagesAPI.getConversations();
  return resolveMock(conversations);
}

// Opens (or returns the existing) conversation with the other participant —
// used by the industry Contact button so it creates a REAL thread instead of
// a fake 2-second label flip. Returns the conversation id.
export async function startConversation({ studentId, industryId, opportunityId }) {
  const { conversationId } = await messagesAPI.startConversation(studentId, industryId, opportunityId);
  return resolveMock(conversationId, { delay: 150 });
}

// Sends into an existing conversation (conversationId) or creates one on
// the fly (studentId + industryId) if this is the first message.
export async function sendMessage({ conversationId, studentId, industryId, opportunityId, text }) {
  const result = await messagesAPI.sendMessage({ conversationId, studentId, industryId, opportunityId, text });
  return resolveMock(result, { delay: 200 });
}

export async function markConversationRead(conversationId) {
  await messagesAPI.markConversationRead(conversationId);
  return resolveMock({ conversationId, unread: false }, { delay: 0 });
}
