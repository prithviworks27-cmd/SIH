import { Link } from "react-router-dom";
import { UserCircle, EnvelopeSimple, Bell } from "@phosphor-icons/react";
import Sidebar from "./Sidebar";
import MessagesBar from "../common/MessagesBar";
import { studentNavItems, studentFooterNavItems } from "../../config/studentNavConfig";

// Portfolio/Messages/Notifications moved out of the student sidebar and up
// here as a small top-right icon row instead — this only renders when
// navItems is the (default) student set, so Industry/Faculty/Admin pages
// (which always pass their own navItems) never see it.
function TopRightLinks() {
  return (
    <div className="flex justify-end items-center gap-1 mb-6">
      <Link to="/portfolio" className="icon-btn p-2" aria-label="Portfolio" title="Portfolio">
        <UserCircle size={20} />
      </Link>
      <Link to="/messages" className="icon-btn p-2" aria-label="Messages" title="Messages">
        <EnvelopeSimple size={20} />
      </Link>
      <Link to="/notifications" className="icon-btn p-2" aria-label="Notifications" title="Notifications">
        <Bell size={20} />
      </Link>
    </div>
  );
}

export default function DashboardLayout({
  children,
  navItems = studentNavItems,
  footerNavItems = studentFooterNavItems,
  title,
  subtitle,
  contentClassName = "",
}) {
  const isStudentPortal = navItems === studentNavItems;

  return (
    <div className="bg-canvas text-charcoal min-h-screen">
      <Sidebar navItems={navItems} footerNavItems={footerNavItems} title={title} subtitle={subtitle} />
      <main className="md:ml-64 px-4 md:px-10 py-10">
        <div className={`max-w-5xl mx-auto ${contentClassName}`}>
          {isStudentPortal && <TopRightLinks />}
          {children}
        </div>
      </main>
      <MessagesBar />
    </div>
  );
}
