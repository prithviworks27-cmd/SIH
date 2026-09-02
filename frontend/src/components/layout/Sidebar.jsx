import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function navLinkClass({ isActive }) {
  return `flex items-center gap-md px-md py-sm rounded-DEFAULT font-label-md text-label-md transition-all scale-95 active:scale-90 ${
    isActive
      ? "text-primary font-bold border-l-4 border-primary bg-surface-container-high"
      : "text-on-secondary-fixed-variant hover:bg-secondary-container"
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
      <header className="md:hidden flex items-center justify-between p-md border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-20">
        <h1 className="font-headline-sm text-headline-sm font-bold text-primary">{title}</h1>
        <button onClick={() => setMobileOpen(true)} className="text-on-surface-variant">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      <aside
        className={`${
          mobileOpen ? "flex" : "hidden"
        } md:flex flex-col bg-surface-container-low border-r border-outline-variant fixed left-0 top-0 h-screen w-64 py-xl px-md z-30 overflow-y-auto`}
      >
        <div className="flex items-center justify-between gap-sm mb-xl px-sm">
          <div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-primary">{title}</h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant">{subtitle}</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="md:hidden material-symbols-outlined text-on-surface-variant">
            close
          </button>
        </div>

        <nav className="flex-1 space-y-xs">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={() => setMobileOpen(false)}>
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-outline-variant pt-md space-y-xs">
          {footerNavItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={() => setMobileOpen(false)}>
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-md px-md py-sm rounded-DEFAULT text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
