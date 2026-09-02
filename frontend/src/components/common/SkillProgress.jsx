const PALETTE = [
  { fill: "bg-pastel-red", text: "text-pastel-red-ink" },
  { fill: "bg-pastel-blue", text: "text-pastel-blue-ink" },
  { fill: "bg-pastel-green", text: "text-pastel-green-ink" },
  { fill: "bg-pastel-yellow", text: "text-pastel-yellow-ink" },
];

export default function SkillProgress({ label, percent, index = 0 }) {
  const { fill, text } = PALETTE[index % PALETTE.length];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-full h-40 bg-bone rounded-xl overflow-hidden flex items-end">
        <div
          className={`w-full ${fill} rounded-xl flex items-start justify-center pt-2 transition-[height] duration-500`}
          style={{ height: `${percent}%` }}
        >
          <span className={`text-xs font-medium ${text}`}>{percent}%</span>
        </div>
      </div>
      <span className="text-sm text-charcoal text-center">{label}</span>
    </div>
  );
}
