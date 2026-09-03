import { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import LoadingState from "../../components/common/LoadingState";
import { studentNavItems, studentFooterNavItems } from "../../config/studentNavConfig";
import { getConversations, sendMessage, markConversationRead } from "../../services/messagesService";
import {
  MagnifyingGlass,
  Buildings,
  UsersThree,
  Paperclip,
  PaperPlaneTilt,
  DotsThreeVertical,
  Checks,
  ArrowLeft,
  ChatCircleDots,
} from "@phosphor-icons/react";

const ICONS = { Buildings, UsersThree };

function ConversationAvatar({ conversation, size = 44 }) {
  const dimension = `${size / 4}rem`;
  if (conversation.avatarUrl) {
    return (
      <img
        className="rounded-lg object-cover flex-shrink-0"
        style={{ width: dimension, height: dimension }}
        alt={conversation.name}
        src={conversation.avatarUrl}
      />
    );
  }
  const Icon = ICONS[conversation.icon] || Buildings;
  return (
    <div
      className="rounded-lg bg-bone flex items-center justify-center text-muted flex-shrink-0"
      style={{ width: dimension, height: dimension }}
    >
      <Icon size={size * 0.45} />
    </div>
  );
}

export default function MessagesInbox() {
  const [conversations, setConversations] = useState(undefined);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    getConversations().then((list) => {
      setConversations(list);
      setActiveId(list[0]?.id ?? null);
    });
  }, []);

  const active = conversations?.find((c) => c.id === activeId);

  // Auto-scroll to the newest message whenever the open thread changes.
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [active?.messages?.length, activeId]);

  const handleSelectConversation = async (id) => {
    setActiveId(id);
    setMobileShowThread(true);
    await markConversationRead(id);
    const refreshed = await getConversations();
    setConversations(refreshed);
  };

  const handleSend = async () => {
    if (!draft.trim() || !activeId) return;
    setSending(true);
    try {
      await sendMessage(activeId, draft.trim());
      setDraft("");
      const refreshed = await getConversations();
      setConversations(refreshed);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations?.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const unreadCount = conversations?.filter((c) => c.unread).length ?? 0;

  return (
    <div className="bg-canvas text-charcoal flex min-h-screen">
      <Sidebar navItems={studentNavItems} footerNavItems={studentFooterNavItems} />
      <main className="md:ml-64 flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 flex w-full bg-white h-full border-t md:border-t-0 border-hairline">
          {/*Left Column: Conversation List*/}
          <div
            className={`w-full md:w-[350px] lg:w-[400px] flex-shrink-0 md:border-r border-hairline flex-col bg-white ${
              mobileShowThread ? "hidden md:flex" : "flex"
            }`}
          >
            <div className="p-6 border-b border-hairline">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-editorial text-2xl text-ink">Messages</h2>
                {unreadCount > 0 && (
                  <span className="bg-ink text-white text-xs font-medium px-2 py-0.5 rounded-full">{unreadCount} new</span>
                )}
              </div>
              <div className="relative">
                <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  className="w-full pl-9 pr-4 py-2 border border-hairline bg-white rounded-md text-sm focus:border-ink focus:outline-none focus:ring-0 placeholder:text-muted"
                  placeholder="Search conversations..."
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations === undefined && <LoadingState label="Loading conversations…" />}
              {filteredConversations?.length === 0 && (
                <p className="text-sm text-muted text-center py-10 px-6">No conversations match "{search}".</p>
              )}
              {filteredConversations?.map((conv) => {
                const lastMessage = conv.messages[conv.messages.length - 1];
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full text-left px-5 py-4 border-b border-hairline cursor-pointer flex gap-3 items-center transition-colors duration-150 ${
                      conv.id === activeId ? "bg-bone" : "hover:bg-bone"
                    }`}
                  >
                    <ConversationAvatar conversation={conv} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-2 mb-0.5">
                        <h3 className={`text-sm truncate ${conv.unread ? "text-ink font-semibold" : "text-ink font-medium"}`}>
                          {conv.name}
                        </h3>
                        <span className="text-xs text-muted whitespace-nowrap">{lastMessage?.time}</span>
                      </div>
                      {conv.subtitle && <p className="text-xs text-muted truncate mb-0.5">{conv.subtitle}</p>}
                      <p className={`text-sm truncate ${conv.unread ? "text-charcoal font-medium" : "text-muted"}`}>
                        {lastMessage?.from === "me" && <span className="text-muted">You: </span>}
                        {lastMessage?.text}
                      </p>
                    </div>
                    {conv.unread && <div className="w-2.5 h-2.5 rounded-full bg-pastel-blue-ink flex-shrink-0" aria-label="Unread" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/*Right Column: Open Thread*/}
          <div className={`flex-1 flex-col bg-white ${mobileShowThread ? "flex" : "hidden md:flex"}`}>
            {!active && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 px-6">
                <div className="w-16 h-16 rounded-full bg-bone flex items-center justify-center text-muted">
                  <ChatCircleDots size={28} />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">Select a conversation</p>
                  <p className="text-sm text-muted mt-0.5">Choose someone from the list to view your message history.</p>
                </div>
              </div>
            )}
            {active && (
              <>
                <div className="px-4 md:px-8 py-4 border-b border-hairline flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      className="icon-btn p-2 -ml-2 md:hidden flex-shrink-0"
                      onClick={() => setMobileShowThread(false)}
                      aria-label="Back to conversations"
                      title="Back to conversations"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <ConversationAvatar conversation={active} />
                    <div className="min-w-0">
                      <h2 className="text-base font-medium text-ink truncate">{active.name}</h2>
                      {active.subtitle && <p className="text-xs text-muted truncate">{active.subtitle}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button className="icon-btn p-2" aria-label="Search in conversation" title="Search in conversation">
                      <MagnifyingGlass size={18} />
                    </button>
                    <button className="icon-btn p-2" aria-label="More options" title="More options">
                      <DotsThreeVertical size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-4 bg-canvas">
                  {active.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col gap-1 max-w-[85%] md:max-w-[70%] lg:max-w-[60%] ${
                        msg.from === "me" ? "self-end items-end" : "self-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-3 rounded-xl text-sm leading-relaxed text-charcoal ${
                          msg.from === "me" ? "bg-bone rounded-tr-sm" : "bg-white border border-hairline rounded-tl-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      </div>
                      <div className="flex items-center gap-1 mx-2">
                        <span className="text-xs text-muted">{msg.time}</span>
                        {msg.from === "me" && <Checks size={14} className="text-ink" />}
                      </div>
                    </div>
                  ))}
                  <div ref={scrollRef} />
                </div>

                <div className="p-4 md:p-6 border-t border-hairline">
                  <div className="flex items-end gap-2 md:gap-3">
                    <button className="icon-btn p-2 flex-shrink-0 mb-0.5" aria-label="Attach a file" title="Attach a file">
                      <Paperclip size={18} />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        className="w-full resize-none border border-hairline bg-white rounded-md p-3 text-sm focus:border-ink focus:ring-0 focus:outline-none min-h-[44px] max-h-[120px]"
                        placeholder="Type a message..."
                        rows="1"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                      />
                    </div>
                    <button
                      onClick={handleSend}
                      disabled={sending || !draft.trim()}
                      className="bg-ink text-white px-4 md:px-5 py-2.5 rounded-md text-sm flex items-center gap-1.5 hover:bg-[#333333] active:scale-[0.98] transition-all mb-0.5 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
                      aria-label="Send message"
                    >
                      <span className="hidden sm:inline">{sending ? "Sending…" : "Send"}</span>
                      <PaperPlaneTilt size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
