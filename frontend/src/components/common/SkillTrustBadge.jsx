// Small pill showing a skill's trust level. Colors escalate with trust —
// Self-Declared is muted/neutral, Assessed is blue, everything backed by
// real-world evidence (Project/Certified/Industry-Verified) is green.
const TONE_BY_LEVEL = {
  "Self-Declared": "bg-bone text-muted",
  Assessed: "bg-pastel-blue text-pastel-blue-ink",
  "Assessment Verified": "bg-pastel-green text-pastel-green-ink",
  "Project-Verified": "bg-pastel-green text-pastel-green-ink",
  Certified: "bg-pastel-green text-pastel-green-ink",
  "Institution-Verified": "bg-pastel-green text-pastel-green-ink",
  "Industry-Verified": "bg-pastel-green text-pastel-green-ink",
};

export default function SkillTrustBadge({ trustLevel, className = "" }) {
  const tone = TONE_BY_LEVEL[trustLevel] || "bg-bone text-muted";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap ${tone} ${className}`}>
      {trustLevel}
    </span>
  );
}
