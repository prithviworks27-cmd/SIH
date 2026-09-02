import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import { getLearningPaths, completeNextModule } from "../../services/learningPathsService";
import { CheckCircle, Circle, GraduationCap } from "@phosphor-icons/react";

export default function RecommendedLearningPaths() {
  const [paths, setPaths] = useState(undefined);
  const [updatingSkill, setUpdatingSkill] = useState(null);

  useEffect(() => {
    getLearningPaths().then(setPaths);
  }, []);

  const handleCompleteModule = async (skillName) => {
    setUpdatingSkill(skillName);
    try {
      await completeNextModule(skillName);
      const refreshed = await getLearningPaths();
      setPaths(refreshed);
    } finally {
      setUpdatingSkill(null);
    }
  };

  return (
    <DashboardLayout>
      <header className="mb-10">
        <h2 className="font-editorial text-3xl text-ink tracking-tight mb-2">Recommended Learning Paths</h2>
        <p className="text-muted max-w-2xl leading-relaxed">
          Curated module sequences generated from your skill gap report — complete them to close the gap and improve your match scores.
        </p>
      </header>

      {paths === undefined && <LoadingState label="Loading learning paths…" />}

      {paths && paths.length === 0 && (
        <EmptyState
          icon={GraduationCap}
          title="No learning paths yet"
          description="Take the skill assessment to get personalized learning paths based on your gaps."
        />
      )}

      {paths && paths.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {paths.map((path) => {
            const isComplete = path.completed >= path.modules.length;
            return (
              <article key={path.skillName} className="bg-white border border-hairline rounded-xl flex flex-col h-full">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-ink">{path.title}</h3>
                    <span className="bg-bone px-2.5 py-1 rounded-full text-xs uppercase tracking-wide text-charcoal whitespace-nowrap">
                      {path.duration}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-muted mb-1">
                      <span>Progress</span>
                      <span>{path.progressPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-bone rounded-full overflow-hidden">
                      <div className="h-full bg-ink rounded-full" style={{ width: `${path.progressPercent}%` }} />
                    </div>
                  </div>
                  <h4 className="text-xs uppercase tracking-wide text-muted mb-2">Modules</h4>
                  <ul className="flex flex-col gap-2 mb-6 border-t border-hairline pt-3">
                    {path.modules.map((module, i) => {
                      const done = i < path.completed;
                      return (
                        <li key={module} className="flex items-start gap-2">
                          {done ? (
                            <CheckCircle size={16} className="text-pastel-green-ink mt-0.5" weight="fill" />
                          ) : (
                            <Circle size={16} className="text-muted mt-0.5" />
                          )}
                          <span className={`text-sm ${done ? "text-muted line-through" : "text-charcoal"}`}>{module}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="p-6 border-t border-hairline mt-auto">
                  <button
                    onClick={() => handleCompleteModule(path.skillName)}
                    disabled={isComplete || updatingSkill === path.skillName}
                    className="block text-center w-full bg-ink text-white rounded-md text-sm py-2.5 hover:bg-[#333333] active:scale-[0.98] transition-all disabled:opacity-60"
                  >
                    {isComplete ? "Path Complete ✓" : updatingSkill === path.skillName ? "Updating…" : "Complete Next Module"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
