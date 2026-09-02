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
    <div className="bg-surface-container-lowest text-on-surface min-h-screen">
      <Sidebar navItems={navItems} footerNavItems={footerNavItems} title={title} subtitle={subtitle} />
      <main className={`md:ml-64 p-margin md:px-margin px-md py-xl max-w-max-width mx-auto w-full ${contentClassName}`}>
        {children}
      </main>
    </div>
  );
}
