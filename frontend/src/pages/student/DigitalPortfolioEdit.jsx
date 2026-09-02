import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import { FloppyDisk } from "@phosphor-icons/react";
import { useAuth } from "../../hooks/useAuth";
import { getPortfolio, savePortfolioBasics } from "../../services/portfolioService";

const inputClass =
  "w-full border border-hairline rounded-md px-3 py-2.5 bg-white focus:border-ink focus:ring-0 text-sm outline-none transition-colors";

export default function DigitalPortfolioEdit() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(undefined);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getPortfolio().then((p) =>
      setForm({
        headline: p.headline,
        institution: p.institution,
        expectedGraduation: p.expectedGraduation,
        bio: p.bio,
      })
    );
  }, []);

  if (!form) {
    return (
      <DashboardLayout>
        <LoadingState fullScreen={false} label="Loading portfolio…" />
      </DashboardLayout>
    );
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePortfolioBasics(form);
      setSaved(true);
      navigate("/portfolio");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      {/*Page Header*/}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="font-editorial text-3xl text-ink tracking-tight">Edit Portfolio</h2>
          <p className="text-muted mt-2">Manage your academic and professional profile visible to industry partners.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate("/portfolio")}
            className="flex-1 md:flex-none py-2 px-6 border border-hairline rounded-md text-charcoal text-sm hover:bg-bone transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 md:flex-none py-2 px-6 rounded-md bg-ink text-white text-sm hover:bg-[#333333] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <FloppyDisk size={16} />
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
      {/*Basic Info Form*/}
      <section className="bg-white border border-hairline rounded-xl p-8">
        <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Full Name</label>
            <input className={`${inputClass} bg-bone`} type="text" value={user?.name || ""} disabled title="Update your name in Settings" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Headline / Major</label>
            <input className={inputClass} type="text" value={form.headline} onChange={handleChange("headline")} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Institution</label>
            <input className={inputClass} type="text" value={form.institution} onChange={handleChange("institution")} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Expected Graduation</label>
            <input className={inputClass} type="month" value={form.expectedGraduation} onChange={handleChange("expectedGraduation")} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Bio / Summary</label>
            <textarea className={`${inputClass} min-h-[100px] resize-y`} value={form.bio} onChange={handleChange("bio")} />
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
