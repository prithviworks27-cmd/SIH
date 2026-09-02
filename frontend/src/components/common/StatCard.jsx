export default function StatCard({ label, value, icon, iconColorClass = "text-primary-container", valueColorClass = "text-on-surface" }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-DEFAULT flex flex-col justify-between h-32">
      <div className="flex items-center justify-between">
        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{label}</span>
        <span className={`material-symbols-outlined ${iconColorClass}`}>{icon}</span>
      </div>
      <div>
        <div className={`font-display-lg text-display-lg ${valueColorClass}`}>{value}</div>
      </div>
    </div>
  );
}
