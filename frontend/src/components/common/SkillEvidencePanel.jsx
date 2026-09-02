import { X, CheckCircle } from "@phosphor-icons/react";
import SkillTrustBadge from "./SkillTrustBadge";

function formatDate(iso) {
  if (!iso) return "Not yet assessed";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// Slide-over-style panel showing what backs a skill's trust level: the
// assessment result plus any portfolio project/certification that lists it.
// skill: a SkillProfile entry (name, currentScore, trustLevel, lastUpdated).
// portfolio: the full portfolio object, used to look up related evidence.
export default function SkillEvidencePanel({ skill, portfolio, onClose }) {
  if (!skill) return null;

  const relatedProjects = portfolio?.projects?.filter((p) => p.skills?.includes(skill.name)) ?? [];
  const relatedCerts = portfolio?.certifications?.filter((c) => c.relatedSkill === skill.name) ?? [];

  const evidence = [
    skill.trustLevel !== "Self-Declared" && { label: "Skill Assessment", detail: `Scored ${skill.currentScore}% — ${formatDate(skill.lastUpdated)}` },
    ...relatedProjects.map((p) => ({ label: p.title, detail: "Project evidence" })),
    ...relatedCerts.map((c) => ({ label: c.title, detail: `${c.issuer} • ${formatDate(c.date)}` })),
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/20 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white border border-hairline rounded-xl p-8 max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-ink">
          <X size={18} />
        </button>
        <h3 className="text-lg font-medium text-ink mb-1">{skill.name}</h3>
        <div className="mb-4">
          <SkillTrustBadge trustLevel={skill.trustLevel} />
        </div>

        <h4 className="text-xs uppercase tracking-wide text-muted mb-2">Evidence</h4>
        {evidence.length === 0 ? (
          <p className="text-sm text-muted">No evidence yet — this skill is self-declared. Take the skill assessment to verify it.</p>
        ) : (
          <ul className="flex flex-col gap-2 mb-2">
            {evidence.map((item) => (
              <li key={item.label} className="flex items-start gap-2 py-2 border-b border-hairline last:border-b-0">
                <CheckCircle size={16} className="text-pastel-green-ink mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-charcoal">{item.label}</p>
                  <p className="text-xs text-muted">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs text-muted mt-4">Last verified: {formatDate(skill.lastUpdated)}</p>
      </div>
    </div>
  );
}
