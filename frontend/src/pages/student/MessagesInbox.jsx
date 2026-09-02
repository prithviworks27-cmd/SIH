import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import LoadingState from "../../components/common/LoadingState";
import { studentNavItems, studentFooterNavItems } from "../../config/studentNavConfig";
import { getConversations, sendMessage, markConversationRead } from "../../services/messagesService";
import { MagnifyingGlass, Buildings, UsersThree, Paperclip, PaperPlaneTilt, DotsThreeVertical, Check, Checks } from "@phosphor-icons/react";

const ICONS = { Buildings, UsersThree };

function ConversationAvatar({ conversation }) {
  if (conversation.avatarUrl) {
    return <img className="w-11 h-11 rounded-lg object-cover" alt={conversation.name} src={conversation.avatarUrl} />;
  }
  const Icon = ICONS[conversation.icon] || Buildings;
  return (
    <div className="w-11 h-11 rounded-lg bg-bone flex items-center justify-center text-muted">
      <Icon size={20} />
    </div>
  );
}

export default function MessagesInbox() {
  const [conversations, setConversations] = useState(undefined);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getConversations().then((list) => {
      setConversations(list);
      setActiveId(list[0]?.id ?? null);
    });
  }, []);

  const active = conversations?.find((c) => c.id === activeId);

  const handleSelectConversation = async (id) => {
    setActiveId(id);
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

  return (
    <div className="bg-canvas text-charcoal flex min-h-screen">
      <Sidebar navItems={studentNavItems} footerNavItems={studentFooterNavItems} />
      <main className="md:ml-64 flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 flex w-full bg-white h-full border-t md:border-t-0 border-hairline">
          {/*Left Column: Conversation List*/}
          <div className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 border-r border-hairline flex flex-col bg-white">
            <div className="p-6 border-b border-hairline">
              <h2 className="font-editorial text-2xl text-ink mb-4">Messages</h2>
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
              {filteredConversations?.map((conv) => {
                const lastMessage = conv.messages[conv.messages.length - 1];
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full text-left p-4 border-b border-hairline cursor-pointer flex gap-3 items-center transition-colors ${
                      conv.id === activeId ? "bg-bone" : "hover:bg-bone"
                    }`}
                  >
                    <ConversationAvatar conversation={conv} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className="text-sm font-medium text-ink truncate">{conv.name}</h3>
                        <span className="text-xs text-muted whitespace-nowrap">{lastMessage?.time}</span>
                      </div>
                      <p className={`text-sm truncate ${conv.unread ? "text-ink font-medium" : "text-muted"}`}>{lastMessage?.text}</p>
                    </div>
                    {conv.unread && <div className="w-2 h-2 rounded-full bg-ink flex-shrink-0"></div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/*Right Column: Open Thread*/}
          <div className="flex-1 flex flex-col bg-white hidden md:flex">
            {!active && (
              <div className="flex-1 flex items-center justify-center text-muted text-sm">Select a conversation to view messages.</div>
            )}
            {active && (
              <>
                <div className="px-8 py-4 border-b border-hairline flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <ConversationAvatar conversation={active} />
                    <div>
                      <h2 className="text-base font-medium text-ink">{active.name}</h2>
                      <p className="text-xs text-muted">{active.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-muted hover:text-ink transition-colors">
                      <MagnifyingGlass size={18} />
                    </button>
                    <button className="p-2 text-muted hover:text-ink transition-colors">
                      <DotsThreeVertical size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-4 bg-canvas">
                  {active.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col gap-1 max-w-[80%] lg:max-w-[60%] ${msg.from === "me" ? "self-end items-end" : "self-start"}`}
                    >
                      <div
                        className={`p-4 rounded-xl text-sm text-charcoal ${
                          msg.from === "me" ? "bg-bone rounded-tr-sm" : "bg-white border border-hairline rounded-tl-sm"
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                      <div className="flex items-center gap-1 mx-2">
                        <span className="text-xs text-muted">{msg.time}</span>
                        {msg.from === "me" && <Checks size={14} className="text-ink" />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-hairline">
                  <div className="flex items-end gap-3">
                    <button className="p-2 text-muted hover:text-ink transition-colors flex-shrink-0 mb-0.5">
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
                      className="bg-ink text-white px-5 py-2.5 rounded-md text-sm flex items-center gap-1.5 hover:bg-[#333333] active:scale-[0.98] transition-all mb-0.5 disabled:opacity-50"
                    >
                      <span>{sending ? "Sending…" : "Send"}</span>
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
