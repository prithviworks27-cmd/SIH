import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EmptyState from "../../components/common/EmptyState";
import { CheckCircle, XCircle, Trophy } from "@phosphor-icons/react";

// Shown once, after every skill queued from SkillAssessment's Step 1 picker
// has been submitted — a single combined summary instead of a result screen
// per skill (see DynamicSkillTestStart.jsx, which collects each result into
// location.state.results as the queue is worked through).
export default function DynamicTestSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results ?? [];

  if (results.length === 0) {
    return (
      <DashboardLayout>
        <EmptyState
          title="No results to show"
          description="Take a skill assessment to see your results here."
          actionLabel="Go to Assessments"
          onAction={() => navigate("/skill-tests")}
        />
      </DashboardLayout>
    );
  }

  const passedCount = results.filter((r) => r.passed).length;
  const averageScore = Math.round(results.reduce((sum, r) => sum + r.scorePercent, 0) / results.length);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white border border-hairline rounded-xl p-10">
          <div className="text-center mb-8">
            <span className="text-3xl mb-2 block">{passedCount === results.length ? "🎉" : "📋"}</span>
            <h1 className="font-editorial text-2xl text-ink tracking-tight mb-1">Assessments Completed</h1>
            <p className="text-muted">
              {results.length} skill{results.length > 1 ? "s" : ""} tested · {passedCount} verified · {averageScore}% average score
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {results.map((r) => (
              <div key={r.testId} className="p-4 border border-hairline rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{r.skillName}</p>
                    <p className="text-xs text-muted">
                      {r.correct} / {r.total} correct
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-medium text-ink">{r.scorePercent}%</span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full uppercase tracking-wide ${
                        r.passed ? "bg-pastel-green text-pastel-green-ink" : "bg-pastel-red text-pastel-red-ink"
                      }`}
                    >
                      {r.passed ? <CheckCircle size={12} weight="bold" /> : <XCircle size={12} weight="bold" />}
                      {r.passed ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                </div>

                {r.levelBreakdown?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-hairline">
                    {r.levelBreakdown.map((lb) => (
                      <span
                        key={lb.level}
                        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-bone text-charcoal capitalize"
                      >
                        {lb.level}: {lb.correct}/{lb.total} · {lb.scorePercent}%
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {passedCount > 0 && (
            <div className="flex items-center gap-2 mb-6 text-sm text-muted">
              <Trophy size={16} className="text-pastel-blue-ink" />
              Verified skills now show as "Assessment Verified" on your skill profile.
            </div>
          )}

          <button
            onClick={() => navigate("/skill-profile/gap-report")}
            className="w-full bg-ink text-white text-sm px-4 py-2.5 rounded-md hover:bg-[#333333] active:scale-[0.98] transition-all"
          >
            View My Skill Profile
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
