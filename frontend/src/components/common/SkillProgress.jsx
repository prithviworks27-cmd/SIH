export default function SkillProgress({ label, percent, colorClass = "bg-primary-container" }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-xs">
        <span className="font-body-md text-body-md text-on-surface">{label}</span>
        <span className="font-label-md text-label-md text-on-surface-variant">{percent}%</span>
      </div>
      <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
