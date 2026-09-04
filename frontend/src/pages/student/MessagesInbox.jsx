import ConversationInbox from "../../components/messaging/ConversationInbox";
import { studentNavItems, studentFooterNavItems } from "../../config/studentNavConfig";

export default function MessagesInbox() {
  return (
    <ConversationInbox
      navItems={studentNavItems}
      footerNavItems={studentFooterNavItems}
      emptyStateLabel="No conversations yet. Apply to an opportunity to start a conversation with the recruiter who posted it."
    />
  );
}
