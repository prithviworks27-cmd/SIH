export default function SkillProgress({ label, percent, colorClass = "bg-ink" }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-1.5">
        <span className="text-sm text-charcoal">{label}</span>
        <span className="text-xs text-muted">{percent}%</span>
      </div>
      <div className="h-1.5 w-full bg-bone rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
