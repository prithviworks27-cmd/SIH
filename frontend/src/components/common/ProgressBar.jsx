export default function ProgressBar({ percent, className = "" }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={`h-1.5 w-full bg-bone rounded-full overflow-hidden ${className}`}>
      <div className="h-full bg-ink transition-all duration-300" style={{ width: `${clamped}%` }} />
    </div>
  );
}
