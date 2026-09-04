import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Wrench } from "@phosphor-icons/react";

const ROLE_LABELS = {
  industry: "Industry",
  academician: "Academician",
  admin: "Institution",
};

export default function PortalPending() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const roleLabel = ROLE_LABELS[user?.role] || "your";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas text-charcoal px-4">
      <div className="max-w-md w-full text-center bg-white border border-hairline rounded-xl p-10">
        <Wrench size={32} className="text-ink mb-4 inline-block" />
        <h1 className="font-editorial text-2xl text-ink mb-3 tracking-tight">Your {roleLabel} portal is coming soon</h1>
        <p className="text-sm text-muted mb-8 leading-relaxed">
          We're still building the {roleLabel.toLowerCase()} experience for SkillBridge. You're signed in as{" "}
          <span className="text-charcoal">{user?.email}</span>, and we'll let you know as soon as your dashboard is ready.
        </p>
        <button
          onClick={handleLogout}
          className="w-full flex justify-center py-2.5 px-4 rounded-md text-sm text-white bg-ink hover:bg-[#333333] active:scale-[0.98] transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
