import { supabase } from "../config/supabase.js";
import { resolveUserId } from "../utils/resolveUserId.js";

// Real student<->industry 1:1 messaging. A conversation exists between one
// student and one recruiter (student_id, industry_id — UNIQUE together), so
// there's exactly one thread per pair regardless of how many opportunities/
// applications connect them. Legacy free-text-id conversations
// (sent_messages/conversation_read_state, the old seeded-contact system)
// are untouched by this controller — they're dead now that
// mockData/conversations.js is gone, but the tables aren't dropped.

function otherParticipant(conversation, userId) {
  return conversation.student_id === userId ? conversation.industry_id : conversation.student_id;
}

// Looked up once per list/detail call — small (≤ a few hundred rows for any
// real user), so no pagination yet.
async function getUserDisplay(userIds) {
  if (userIds.length === 0) return new Map();
  const { data, error } = await supabase.from("users").select("id, name, email").in("id", userIds);
  if (error) throw error;
  return new Map(data.map((u) => [u.id, u]));
}

// GET /api/messages — every conversation the current user (student OR
// industry) is a participant in, with the last message and this user's
// unread flag, newest activity first.
export const getConversations = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { data: conversations, error } = await supabase
      .from("conversations")
      .select("*")
      .or(`student_id.eq.${userId},industry_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch conversations error:", error);
      return res.status(500).json({ error: "Failed to load conversations" });
    }

    if (conversations.length === 0) return res.status(200).json({ conversations: [] });

    const conversationIds = conversations.map((c) => c.id);
    const otherIds = conversations.map((c) => otherParticipant(c, userId));

    const [messagesResult, unreadResult, usersMap] = await Promise.all([
      supabase.from("conversation_messages").select("*").in("conversation_id", conversationIds).order("sent_at", { ascending: true }),
      supabase.from("conversation_unread").select("*").eq("user_id", userId).in("conversation_id", conversationIds),
      getUserDisplay(otherIds),
    ]);

    if (messagesResult.error) {
      console.error("Fetch conversation messages error:", messagesResult.error);
      return res.status(500).json({ error: "Failed to load conversations" });
    }
    if (unreadResult.error) {
      console.error("Fetch conversation unread state error:", unreadResult.error);
      return res.status(500).json({ error: "Failed to load conversations" });
    }

    const messagesByConversation = new Map();
    for (const m of messagesResult.data) {
      const list = messagesByConversation.get(m.conversation_id) ?? [];
      list.push({ id: m.id, from: m.sender_id === userId ? "me" : "them", text: m.text, sentAt: m.sent_at });
      messagesByConversation.set(m.conversation_id, list);
    }
    const unreadByConversation = new Map(unreadResult.data.map((r) => [r.conversation_id, r.unread]));

    const shaped = conversations
      .map((c) => {
        const other = usersMap.get(otherParticipant(c, userId));
        return {
          id: c.id,
          name: other?.name ?? "Unknown User",
          subtitle: other?.email ?? null,
          opportunityId: c.opportunity_id,
          unread: unreadByConversation.get(c.id) ?? false,
          messages: messagesByConversation.get(c.id) ?? [],
          lastActivityAt: messagesByConversation.get(c.id)?.at(-1)?.sentAt ?? c.created_at,
        };
      })
      .sort((a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt));

    res.status(200).json({ conversations: shaped });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Shared by sendMessage and getOrCreateConversation — finds the existing
// student<->industry pair or creates it. opportunityId is stored only on
// first creation (informational: "this thread started because of that
// posting"); it's never required or re-checked on subsequent messages so a
// conversation keeps working even if the opportunity is later closed.
async function findOrCreateConversation({ studentId, industryId, opportunityId }) {
  const { data: existing, error: findError } = await supabase
    .from("conversations")
    .select("*")
    .eq("student_id", studentId)
    .eq("industry_id", industryId)
    .maybeSingle();
  if (findError) throw findError;
  if (existing) return existing;

  const { data: created, error: createError } = await supabase
    .from("conversations")
    .insert({ student_id: studentId, industry_id: industryId, opportunity_id: opportunityId ?? null })
    .select()
    .single();
  if (createError) throw createError;
  return created;
}

// POST /api/messages/start — explicitly creates (or returns the existing)
// conversation without sending a message yet. Used by:
//   - the student side, automatically once they apply to an opportunity
//     (see applicationsController.applyToOpportunity)
//   - the industry side's Applicant Pipeline "Contact" button, so clicking
//     it opens a real thread instead of a fake 2-second label flip
// Body: { studentId, industryId, opportunityId? } — at least one of
// studentId/industryId must be the caller's own id (enforced below) so a
// user can't wire up conversations between two other people.
export const startConversation = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { studentId, industryId, opportunityId } = req.body;
    if (!studentId || !industryId) {
      return res.status(400).json({ error: "studentId and industryId are required" });
    }
    if (userId !== studentId && userId !== industryId) {
      return res.status(403).json({ error: "You can only start a conversation you're part of" });
    }

    const conversation = await findOrCreateConversation({ studentId, industryId, opportunityId });
    res.status(200).json({ conversationId: conversation.id });
  } catch (error) {
    console.error("Start conversation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/messages/send — sends into an existing conversation by id
// (conversationId) OR creates one on the fly (studentId + industryId, same
// as startConversation) if none exists yet — covers "first message IS the
// conversation-starter" per the task's "on first message, whichever comes
// first" requirement.
export const sendMessage = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { conversationId, studentId, industryId, opportunityId, text } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: "text is required" });

    let conversation;
    if (conversationId) {
      const { data, error } = await supabase.from("conversations").select("*").eq("id", conversationId).maybeSingle();
      if (error) throw error;
      if (!data) return res.status(404).json({ error: "Conversation not found" });
      if (data.student_id !== userId && data.industry_id !== userId) {
        return res.status(403).json({ error: "You are not a participant in this conversation" });
      }
      conversation = data;
    } else {
      if (!studentId || !industryId) {
        return res.status(400).json({ error: "conversationId, or studentId + industryId, is required" });
      }
      if (userId !== studentId && userId !== industryId) {
        return res.status(403).json({ error: "You can only message on your own behalf" });
      }
      conversation = await findOrCreateConversation({ studentId, industryId, opportunityId });
    }

    const { data: message, error: insertError } = await supabase
      .from("conversation_messages")
      .insert({ conversation_id: conversation.id, sender_id: userId, text: text.trim() })
      .select()
      .single();
    if (insertError) throw insertError;

    const recipientId = otherParticipant(conversation, userId);

    // Sender's own thread is implicitly read (they just wrote in it);
    // recipient gets flagged unread. Both are upserts on the composite key.
    const { error: unreadError } = await supabase.from("conversation_unread").upsert(
      [
        { conversation_id: conversation.id, user_id: userId, unread: false },
        { conversation_id: conversation.id, user_id: recipientId, unread: true },
      ],
      { onConflict: "conversation_id,user_id" }
    );
    if (unreadError) console.error("Update conversation unread state error:", unreadError); // message already saved — non-fatal

    res.status(201).json({
      conversationId: conversation.id,
      message: { id: message.id, from: "me", text: message.text, sentAt: message.sent_at },
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/messages/read — marks one conversation read for the caller.
export const markConversationRead = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { conversationId } = req.body;
    if (!conversationId) return res.status(400).json({ error: "conversationId is required" });

    const { data: conversation, error: fetchError } = await supabase
      .from("conversations")
      .select("student_id, industry_id")
      .eq("id", conversationId)
      .maybeSingle();
    if (fetchError) throw fetchError;
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });
    if (conversation.student_id !== userId && conversation.industry_id !== userId) {
      return res.status(403).json({ error: "You are not a participant in this conversation" });
    }

    const { error } = await supabase
      .from("conversation_unread")
      .upsert({ conversation_id: conversationId, user_id: userId, unread: false }, { onConflict: "conversation_id,user_id" });

    if (error) {
      console.error("Mark conversation read error:", error);
      return res.status(500).json({ error: "Failed to update conversation" });
    }

    res.status(200).json({ conversationId, unread: false });
  } catch (error) {
    console.error("Mark conversation read error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
