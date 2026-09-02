export default function StatCard({ label, value, icon: Icon, iconColorClass = "text-ink", valueColorClass = "text-ink" }) {
  return (
    <div className="bg-white border border-hairline p-5 rounded-xl flex flex-col justify-between h-32">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-muted">{label}</span>
        {Icon && <Icon size={18} className={iconColorClass} />}
      </div>
      <div className={`font-editorial text-3xl ${valueColorClass}`}>{value}</div>
    </div>
  );
}
