import ConversationInbox from "../../components/messaging/ConversationInbox";
import { industryNavItems, industryFooterNavItems } from "../../config/industryNavConfig";

export default function IndustryMessages() {
  return (
    <ConversationInbox
      navItems={industryNavItems}
      footerNavItems={industryFooterNavItems}
      emptyStateLabel="No conversations yet. Use Contact on an applicant in your Applicant Pipeline to start one."
    />
  );
}
