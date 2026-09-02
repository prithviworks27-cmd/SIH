import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { industryNavItems, industryFooterNavItems } from "../../config/industryNavConfig";
import { createOpportunity } from "../../services/opportunitiesService";
import { getCompanyProfile } from "../../services/companyProfileService";
import { SKILL_CATALOG } from "../../services/mockData/skills";
import { PaperPlaneTilt } from "@phosphor-icons/react";

const inputClass =
  "w-full border border-hairline rounded-md px-3 py-2.5 bg-white focus:border-ink focus:ring-0 text-sm outline-none transition-colors";

const TYPES = ["Internship", "Full-time", "Part-time"];

const initialForm = {
  title: "",
  type: "Internship",
  location: "",
  duration: "",
  stipend: "",
  commitment: "",
  description: "",
  skills: [],
};

export default function PostOpportunity() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const toggleSkill = (skillName) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillName) ? prev.skills.filter((s) => s !== skillName) : [...prev.skills, skillName],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.location.trim()) return setError("Location is required.");
    if (form.skills.length === 0) return setError("Select at least one required skill.");

    setSubmitting(true);
    setError("");
    try {
      const company = await getCompanyProfile();
      await createOpportunity({
        title: form.title,
        company: company.name,
        type: form.type,
        location: form.location,
        duration: form.duration || undefined,
        stipend: form.stipend || undefined,
        commitment: form.commitment || undefined,
        overview: form.description ? [form.description] : undefined,
        skills: form.skills,
      });
      navigate("/industry/opportunities");
    } catch {
      setError("Something went wrong posting this opportunity. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout navItems={industryNavItems} footerNavItems={industryFooterNavItems} title="Industry Portal" subtitle="Talent & Recruitment">
      <header className="mb-10">
        <h2 className="font-editorial text-3xl text-ink tracking-tight">Post an Opportunity</h2>
        <p className="text-muted mt-2">Define the role and required skills — matched candidates appear the moment it's published.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white border border-hairline rounded-xl p-8 flex flex-col gap-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Title</label>
            <input className={inputClass} type="text" value={form.title} onChange={handleChange("title")} placeholder="e.g. Frontend Engineer Intern" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Opportunity Type</label>
            <select className={inputClass} value={form.type} onChange={handleChange("type")}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Location</label>
            <input className={inputClass} type="text" value={form.location} onChange={handleChange("location")} placeholder="e.g. Remote, Bangalore" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Duration</label>
            <input className={inputClass} type="text" value={form.duration} onChange={handleChange("duration")} placeholder="e.g. 3 Months" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Stipend / Salary</label>
            <input className={inputClass} type="text" value={form.stipend} onChange={handleChange("stipend")} placeholder="e.g. ₹20,000 / Month" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Commitment</label>
            <input className={inputClass} type="text" value={form.commitment} onChange={handleChange("commitment")} placeholder="e.g. Full-Time (40 hrs/week)" />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-muted mb-1.5">Description</label>
          <textarea className={`${inputClass} min-h-[100px] resize-y`} value={form.description} onChange={handleChange("description")} placeholder="What will this person work on?" />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-muted mb-2">Required Skills</label>
          <div className="flex flex-wrap gap-2">
            {SKILL_CATALOG.map((s) => {
              const selected = form.skills.includes(s.name);
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => toggleSkill(s.name)}
                  className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                    selected ? "bg-ink text-white border-ink" : "bg-white text-charcoal border-hairline hover:border-ink"
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>

        {error && <p className="text-sm text-pastel-red-ink">{error}</p>}

        <div className="flex justify-end gap-3 pt-4 border-t border-hairline">
          <button
            type="button"
            onClick={() => navigate("/industry/opportunities")}
            className="px-6 py-2.5 border border-hairline rounded-md text-charcoal text-sm hover:bg-bone transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-ink text-white rounded-md text-sm hover:bg-[#333333] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {submitting ? "Publishing…" : "Publish Opportunity"}
            <PaperPlaneTilt size={16} />
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
