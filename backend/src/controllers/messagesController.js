import { supabase } from "../config/supabase.js";
import { resolveUserId } from "../utils/resolveUserId.js";

// Seed conversations/contacts stay in frontend mock data (mockData/conversations.js)
// — no real second-party accounts exist for them. This only returns the two
// pieces of per-user mutable state layered on top: sent messages and unread
// overrides, keyed by the seed conversation IDs. The frontend merges these
// into the seed conversation objects the same way it merged localStorage before.
export const getConversationState = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const [sent, readState] = await Promise.all([
      supabase.from("sent_messages").select("*").eq("user_id", userId).order("sent_at", { ascending: true }),
      supabase.from("conversation_read_state").select("conversation_id, unread").eq("user_id", userId),
    ]);

    if (sent.error) {
      console.error("Fetch sent messages error:", sent.error);
      return res.status(500).json({ error: "Failed to load messages" });
    }
    if (readState.error) {
      console.error("Fetch conversation read-state error:", readState.error);
      return res.status(500).json({ error: "Failed to load messages" });
    }

    const messagesByConversation = {};
    for (const m of sent.data) {
      (messagesByConversation[m.conversation_id] ??= []).push({ id: m.id, from: "me", text: m.text, sentAt: m.sent_at });
    }

    const unreadOverrides = Object.fromEntries(readState.data.map((r) => [r.conversation_id, r.unread]));

    res.status(200).json({ messagesByConversation, unreadOverrides });
  } catch (error) {
    console.error("Get conversation state error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { conversationId, text } = req.body;
    if (!conversationId || !text?.trim()) {
      return res.status(400).json({ error: "conversationId and text are required" });
    }

    const { data: message, error: insertError } = await supabase
      .from("sent_messages")
      .insert({ user_id: userId, conversation_id: conversationId, text: text.trim() })
      .select()
      .single();

    if (insertError) {
      console.error("Send message error:", insertError);
      return res.status(500).json({ error: "Failed to send message" });
    }

    const { error: readStateError } = await supabase
      .from("conversation_read_state")
      .upsert(
        { user_id: userId, conversation_id: conversationId, unread: false, updated_at: new Date().toISOString() },
        { onConflict: "user_id,conversation_id" }
      );

    if (readStateError) {
      console.error("Update conversation read-state error:", readStateError);
      // message was already saved — don't fail the whole request over the read-state side effect
    }

    res.status(201).json({ message: { id: message.id, from: "me", text: message.text, sentAt: message.sent_at } });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markConversationRead = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { conversationId } = req.body;
    if (!conversationId) return res.status(400).json({ error: "conversationId is required" });

    const { error } = await supabase
      .from("conversation_read_state")
      .upsert(
        { user_id: userId, conversation_id: conversationId, unread: false, updated_at: new Date().toISOString() },
        { onConflict: "user_id,conversation_id" }
      );

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
