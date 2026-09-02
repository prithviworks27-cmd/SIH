import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import { useAuth } from "../../hooks/useAuth";
import { getPreferences, savePreferences } from "../../services/preferencesService";

const inputClass =
  "border border-hairline rounded-md px-3 py-2.5 text-sm focus:border-ink focus:ring-0 focus:outline-none bg-white text-charcoal transition-colors";

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input checked={checked} onChange={onChange} className="sr-only peer" type="checkbox" />
        <div className="w-11 h-6 bg-bone border border-hairline peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-hairline after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ink" />
      </label>
    </div>
  );
}

export default function ProfileSettings() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState(undefined);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getPreferences().then(setPrefs);
  }, []);

  const handleToggle = (key) => async (e) => {
    const next = { ...prefs, [key]: e.target.checked };
    setPrefs(next);
    setSaving(true);
    setSaved(false);
    try {
      await savePreferences(next);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const [firstName = "", lastName = ""] = (user?.name || "").split(/\s+/, 2);

  return (
    <DashboardLayout>
      <header className="mb-10">
        <h2 className="font-editorial text-3xl text-ink tracking-tight">Profile Settings</h2>
        <p className="text-muted mt-2">Manage your personal information and preferences.</p>
      </header>

      <div className="bg-white border border-hairline rounded-xl p-8 mb-6">
        <h3 className="text-base font-medium text-ink mb-6 border-b border-hairline pb-3">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-muted">First Name</label>
            <input className={`${inputClass} bg-bone`} type="text" value={firstName} disabled />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-muted">Last Name</label>
            <input className={`${inputClass} bg-bone`} type="text" value={lastName} disabled />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs uppercase tracking-wide text-muted">Email Address</label>
            <input className={`${inputClass} bg-bone`} type="email" value={user?.email || ""} disabled />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs uppercase tracking-wide text-muted">Role</label>
            <input className={`${inputClass} bg-bone capitalize`} type="text" value={user?.role || ""} disabled />
          </div>
        </div>
        <p className="text-xs text-muted mt-4">Account details are managed by your institution and can't be edited here yet.</p>
      </div>

      <div className="bg-white border border-hairline rounded-xl p-8 mb-6">
        <h3 className="text-base font-medium text-ink mb-6 border-b border-hairline pb-3">Notifications</h3>
        {prefs === undefined && <LoadingState fullScreen={false} label="Loading preferences…" />}
        {prefs && (
          <div className="flex flex-col divide-y divide-hairline">
            <ToggleRow
              title="Email Notifications"
              description="Receive updates about new opportunities."
              checked={prefs.emailNotifications}
              onChange={handleToggle("emailNotifications")}
            />
            <ToggleRow
              title="SMS Alerts"
              description="Get text messages for important account alerts."
              checked={prefs.smsAlerts}
              onChange={handleToggle("smsAlerts")}
            />
            <ToggleRow
              title="Application Updates"
              description="Notify me when my application status changes."
              checked={prefs.applicationUpdates}
              onChange={handleToggle("applicationUpdates")}
            />
          </div>
        )}
        {saving && <p className="text-xs text-muted mt-4">Saving…</p>}
        {saved && !saving && <p className="text-xs text-pastel-green-ink mt-4">Preferences saved.</p>}
      </div>
    </DashboardLayout>
  );
}
