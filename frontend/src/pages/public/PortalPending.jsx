import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ROLE_LABELS = {
  industry: "Industry",
  academician: "Academician",
  admin: "Institution",
};

export default function PortalPending() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const roleLabel = ROLE_LABELS[user?.role] || "your";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest text-on-surface px-md">
      <div className="max-w-md w-full text-center bg-surface-container-lowest border border-outline-variant rounded-lg p-xl">
        <span className="material-symbols-outlined text-primary-container text-4xl mb-md inline-block">construction</span>
        <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">
          Your {roleLabel} portal is coming soon
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
          We're still building the {roleLabel.toLowerCase()} experience for AcademiaLink. You're signed in as{" "}
          <span className="font-medium text-on-surface">{user?.email}</span>, and we'll let you know as soon as your
          dashboard is ready.
        </p>
        <button
          onClick={handleLogout}
          className="w-full flex justify-center py-sm px-md rounded-DEFAULT font-label-md text-label-md text-white bg-primary-container hover:bg-primary transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
