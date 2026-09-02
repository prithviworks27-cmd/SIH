import Sidebar from "./Sidebar";
import { studentNavItems, studentFooterNavItems } from "../../config/studentNavConfig";

export default function DashboardLayout({
  children,
  navItems = studentNavItems,
  footerNavItems = studentFooterNavItems,
  title,
  subtitle,
  contentClassName = "",
}) {
  return (
    <div className="bg-canvas text-charcoal min-h-screen">
      <Sidebar navItems={navItems} footerNavItems={footerNavItems} title={title} subtitle={subtitle} />
      <main className={`md:ml-64 px-4 md:px-10 py-10 max-w-5xl mx-auto w-full ${contentClassName}`}>{children}</main>
    </div>
  );
}
