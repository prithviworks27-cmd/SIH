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

function navLinkClass({ isActive }, mobileOpen, delayMs) {
  return `group flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer ${
    isActive ? "text-ink font-medium bg-bone" : "text-muted hover:bg-bone hover:text-ink"
  } transition-[color,background-color,opacity,transform] duration-300 ease-out md:!opacity-100 md:!translate-x-0 ${
    mobileOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
  }`;
}

export default function Sidebar({ navItems, footerNavItems, title = "Student Portal", subtitle = "Academic Collaboration" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden flex items-center gap-2 p-4 border-b border-hairline bg-white/70 backdrop-blur-md sticky top-0 z-20">
        <button onClick={() => setMobileOpen(true)} className="icon-btn p-2" aria-label="Open menu" title="Open menu">
          <List size={20} />
        </button>
        <h1 className="font-sans font-bold text-xl text-ink tracking-tight">{title}</h1>
      </header>

      {/* Backdrop — fades in behind the drawer on mobile, click to close */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`md:hidden fixed inset-0 bg-ink/30 z-20 transition-opacity duration-300 ease-out ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`flex flex-col bg-white md:bg-transparent border-r border-hairline fixed left-0 top-0 h-screen w-56 py-8 px-4 z-30 overflow-y-auto transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between gap-2 mb-8 px-2">
          <div>
            <h2 className="font-sans font-bold text-xl text-ink leading-tight tracking-tight">{title}</h2>
            <p className="text-sm font-medium text-muted mt-0.5">{subtitle}</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="icon-btn md:hidden p-1.5" aria-label="Close menu" title="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5">
          {navItems.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={(state) => navLinkClass(state, mobileOpen, i)}
              style={{ transitionDelay: mobileOpen ? `${i * 40}ms` : "0ms" }}
              onClick={() => setMobileOpen(false)}
            >
              <NavIcon name={item.icon} size={18} weight="regular" className="transition-transform duration-150 group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-hairline pt-4 space-y-0.5">
          {footerNavItems.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={(state) => navLinkClass(state, mobileOpen, navItems.length + i)}
              style={{ transitionDelay: mobileOpen ? `${(navItems.length + i) * 40}ms` : "0ms" }}
              onClick={() => setMobileOpen(false)}
            >
              <NavIcon name={item.icon} size={18} weight="regular" className="transition-transform duration-150 group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            style={{ transitionDelay: mobileOpen ? `${(navItems.length + footerNavItems.length) * 40}ms` : "0ms" }}
            className={`group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted hover:bg-bone hover:text-ink cursor-pointer transition-[color,background-color,opacity,transform] duration-300 ease-out md:!opacity-100 md:!translate-x-0 ${
              mobileOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
            }`}
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
