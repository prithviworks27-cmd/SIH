import SkillTrustBadge from "./SkillTrustBadge";

// Not yet started/Beginner/Intermediate/Advanced/Expert — the same score bands used across
// the assessment flow (skillTestService.js's levelForScore) and the gap
// report, kept in one place here since "My Skills" is the canonical place
// a skill's level is shown to the student.
function levelForScore(score) {
  if (score >= 90) return "Expert";
  if (score >= 70) return "Advanced";
  if (score >= 40) return "Intermediate";
  if (score > 0) return "Beginner";
  return "Not yet started";
}

export default function SkillCard({ name, category, currentScore, trustLevel }) {
  const level = levelForScore(currentScore);
  const isVerified = trustLevel && trustLevel !== "Self-Declared";

  return (
    <div className="bg-white border border-hairline rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-medium text-ink">{name}</h3>
          <p className="text-xs text-muted">{category}</p>
        </div>
        {isVerified ? (
          <SkillTrustBadge trustLevel={trustLevel} />
        ) : (
          <span className="text-xs px-2 py-0.5 rounded-full uppercase tracking-wide bg-bone text-muted whitespace-nowrap">
            —
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-charcoal">{level}</span>
        <span className="text-muted">{currentScore}%</span>
      </div>

      <div className="h-1.5 w-full bg-bone rounded-full overflow-hidden">
        <div className="h-full bg-ink transition-all duration-300" style={{ width: `${currentScore}%` }} />
      </div>
    </div>
  );
}
