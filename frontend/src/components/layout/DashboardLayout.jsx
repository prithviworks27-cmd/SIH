import Sidebar from "./Sidebar";
import MessagesBar from "../common/MessagesBar";
import { studentNavItems, studentFooterNavItems } from "../../config/studentNavConfig";

export default function DashboardLayout({
  children,
  navItems = studentNavItems,
  footerNavItems = studentFooterNavItems,
  title,
  subtitle,
  contentClassName = "",
  hideSidebar = false,
}) {
  // hideSidebar drops the nav (and message bar) entirely rather than just
  // visually hiding it — used for focused, single-task screens like an
  // in-progress skill test where navigating away mid-attempt isn't wanted.
  return (
    <div className="bg-canvas text-charcoal min-h-screen">
      {!hideSidebar && <Sidebar navItems={navItems} footerNavItems={footerNavItems} title={title} subtitle={subtitle} />}
      <main className={hideSidebar ? "px-4 md:px-10 py-10" : "md:ml-64 px-4 md:px-10 py-10"}>
        <div className={`max-w-5xl mx-auto ${contentClassName}`}>{children}</div>
      </main>
      {!hideSidebar && <MessagesBar />}
    </div>
  );
}
