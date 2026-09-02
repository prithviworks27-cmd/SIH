import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import { industryNavItems, industryFooterNavItems } from "../../config/industryNavConfig";
import { getCompanyProfile, saveCompanyProfile } from "../../services/companyProfileService";
import { FloppyDisk } from "@phosphor-icons/react";

const inputClass =
  "w-full border border-hairline rounded-md px-3 py-2.5 bg-white focus:border-ink focus:ring-0 text-sm outline-none transition-colors";

export default function CompanyProfile() {
  const [form, setForm] = useState(undefined);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getCompanyProfile().then(setForm);
  }, []);

  if (!form) {
    return (
      <DashboardLayout navItems={industryNavItems} footerNavItems={industryFooterNavItems} title="Industry Portal" subtitle="Talent & Recruitment">
        <LoadingState fullScreen={false} label="Loading company profile…" />
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
      await saveCompanyProfile(form);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout navItems={industryNavItems} footerNavItems={industryFooterNavItems} title="Industry Portal" subtitle="Talent & Recruitment">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="font-editorial text-3xl text-ink tracking-tight">Company Profile</h2>
          <p className="text-muted mt-2">This is what students and academicians see about your organization.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="py-2 px-6 rounded-md bg-ink text-white text-sm hover:bg-[#333333] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <FloppyDisk size={16} />
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>

      <section className="bg-white border border-hairline rounded-xl p-8">
        <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Organization Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Company Name</label>
            <input className={inputClass} type="text" value={form.name} onChange={handleChange("name")} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Industry</label>
            <input className={inputClass} type="text" value={form.industry} onChange={handleChange("industry")} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Website</label>
            <input className={inputClass} type="text" value={form.website} onChange={handleChange("website")} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Company Size</label>
            <input className={inputClass} type="text" value={form.size} onChange={handleChange("size")} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">About</label>
            <textarea className={`${inputClass} min-h-[100px] resize-y`} value={form.about} onChange={handleChange("about")} />
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
