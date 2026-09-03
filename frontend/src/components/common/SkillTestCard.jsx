import { ArrowRight, CheckCircle, XCircle } from "@phosphor-icons/react";

function ResultBadge({ lastResult }) {
  if (!lastResult) return null;
  const tone = lastResult.passed ? "bg-pastel-green text-pastel-green-ink" : "bg-pastel-red text-pastel-red-ink";
  const Icon = lastResult.passed ? CheckCircle : XCircle;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full uppercase tracking-wide ${tone}`}>
      <Icon size={12} weight="bold" />
      {lastResult.passed ? "Verified" : "Not Passed"} · {lastResult.scorePercent}%
    </span>
  );
}

export default function SkillTestCard({ title, category, questionCount, durationMinutes, lastResult, onStart }) {
  return (
    <div className="bg-white border border-hairline rounded-xl p-6 flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-base font-medium text-ink">{title}</h3>
          <ResultBadge lastResult={lastResult} />
        </div>
        <p className="text-sm text-muted">{category}</p>
      </div>
      <p className="text-sm text-muted">
        {questionCount} Questions • {durationMinutes} Minutes
      </p>
      <div className="mt-auto flex justify-end">
        <button
          type="button"
          onClick={onStart}
          className="flex items-center gap-2 text-sm text-ink hover:text-muted transition-colors"
        >
          {lastResult?.passed ? "Retake" : "Start"}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
