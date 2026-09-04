import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  SquaresFour,
  ClipboardText,
  GraduationCap,
  Briefcase,
  FileText,
  UserCircle,
  EnvelopeSimple,
  Gear,
  SignOut,
  X,
  List,
  Bell,
  Buildings,
  PlusCircle,
  Users,
  UsersThree,
  ChartBar,
  Sparkle,
  BookOpen,
  Target,
  GitBranch,
  Trophy,
  Robot,
  ShieldCheck,
} from "@phosphor-icons/react";

const ICONS = {
  dashboard: SquaresFour,
  quiz: ClipboardText,
  school: GraduationCap,
  work: Briefcase,
  description: FileText,
  account_circle: UserCircle,
  mail: EnvelopeSimple,
  settings: Gear,
  notifications: Bell,
  company_profile: Buildings,
  post_opportunity: PlusCircle,
  candidates: Users,
  applications: UsersThree,
  analytics: ChartBar,
  sparkle: Sparkle,
  courses: BookOpen,
  gap_report: Target,
  skill_graph: GitBranch,
  trophy: Trophy,
  career_twin: Robot,
  trust: ShieldCheck,
};

function NavIcon({ name, ...props }) {
  const Icon = ICONS[name] || SquaresFour;
  return <Icon {...props} />;
}

function navLinkClass({ isActive }) {
  return `group flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer transition-colors duration-150 ${
    isActive ? "text-ink font-medium bg-bone" : "text-muted hover:bg-bone hover:text-ink"
  }`;
}

export default function Sidebar({ navItems, footerNavItems, title = "Student Portal", subtitle = "Academic Collaboration" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-hairline bg-canvas sticky top-0 z-20">
        <h1 className="font-editorial italic text-lg text-ink">{title}</h1>
        <button onClick={() => setMobileOpen(true)} className="icon-btn p-2" aria-label="Open menu" title="Open menu">
          <List size={20} />
        </button>
      </header>

      <aside
        className={`${
          mobileOpen ? "flex" : "hidden"
        } md:flex flex-col bg-canvas border-r border-hairline fixed left-0 top-0 h-screen w-64 py-8 px-4 z-30 overflow-y-auto`}
      >
        <div className="flex items-center justify-between gap-2 mb-8 px-2">
          <div>
            <h2 className="font-editorial italic text-lg text-ink leading-tight">{title}</h2>
            <p className="text-xs text-muted mt-0.5">{subtitle}</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="icon-btn md:hidden p-1.5" aria-label="Close menu" title="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={() => setMobileOpen(false)}>
              <NavIcon name={item.icon} size={18} weight="regular" className="transition-transform duration-150 group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-hairline pt-4 space-y-0.5">
          {footerNavItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={() => setMobileOpen(false)}>
              <NavIcon name={item.icon} size={18} weight="regular" className="transition-transform duration-150 group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted hover:bg-bone hover:text-ink cursor-pointer transition-colors duration-150"
            title="Log out"
          >
            <SignOut size={18} className="transition-transform duration-150 group-hover:scale-110" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
