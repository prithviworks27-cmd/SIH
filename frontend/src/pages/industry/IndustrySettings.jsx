import { useAuth } from "../../hooks/useAuth";

export default function IndustrySettings() {
  const { user } = useAuth();

  return (
    <>
      <header className="mb-10">
        <h2 className="font-editorial text-3xl text-ink tracking-tight">Account Settings</h2>
        <p className="text-muted mt-2">Manage your recruiter account.</p>
      </header>

      <div className="bg-white border border-hairline rounded-xl p-8 max-w-xl">
        <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Account</h3>
        <div className="flex flex-col gap-1.5 mb-4">
          <span className="text-xs uppercase tracking-wide text-muted">Name</span>
          <span className="text-sm text-charcoal">{user?.name}</span>
        </div>
        <div className="flex flex-col gap-1.5 mb-4">
          <span className="text-xs uppercase tracking-wide text-muted">Email</span>
          <span className="text-sm text-charcoal">{user?.email}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wide text-muted">Role</span>
          <span className="text-sm text-charcoal capitalize">{user?.role}</span>
        </div>
      </div>
    </>
  );
}
