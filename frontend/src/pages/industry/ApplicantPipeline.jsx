import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import { industryNavItems, industryFooterNavItems } from "../../config/industryNavConfig";
import { getPipeline, moveStage, PIPELINE_STAGES } from "../../services/pipelineService";
import { UsersThree, ArrowRight } from "@phosphor-icons/react";

export default function ApplicantPipeline() {
  const [entries, setEntries] = useState(undefined);
  const [movingId, setMovingId] = useState(null);

  useEffect(() => {
    getPipeline().then(setEntries);
  }, []);

  const handleAdvance = async (entry) => {
    const currentIndex = PIPELINE_STAGES.indexOf(entry.stage);
    const nextStage = PIPELINE_STAGES[currentIndex + 1];
    if (!nextStage) return;

    setMovingId(entry.id);
    try {
      await moveStage(entry.id, nextStage);
      const refreshed = await getPipeline();
      setEntries(refreshed);
    } finally {
      setMovingId(null);
    }
  };

  return (
    <DashboardLayout navItems={industryNavItems} footerNavItems={industryFooterNavItems} title="Industry Portal" subtitle="Talent & Recruitment">
      <header className="mb-10 border-b border-hairline pb-6">
        <h2 className="font-editorial text-3xl text-ink tracking-tight">Applicant Pipeline</h2>
        <p className="text-muted mt-2">Move candidates through your recruitment stages.</p>
      </header>

      {entries === undefined && <LoadingState label="Loading pipeline…" />}

      {entries && entries.length === 0 && (
        <EmptyState icon={UsersThree} title="No applicants yet" description="Applications for your opportunities will show up here." />
      )}

      {entries && entries.length > 0 && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {PIPELINE_STAGES.map((stage) => {
              const stageEntries = entries.filter((e) => e.stage === stage);
              return (
                <div key={stage} className="w-72 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-sm font-medium text-ink">{stage}</h3>
                    <span className="text-xs text-muted">{stageEntries.length}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {stageEntries.map((entry) => {
                      const isLastStage = PIPELINE_STAGES.indexOf(entry.stage) === PIPELINE_STAGES.length - 1;
                      return (
                        <div key={entry.id} className="bg-white border border-hairline rounded-xl p-4">
                          <Link to={`/industry/candidates/${entry.candidateId}`} className="block mb-2">
                            <p className="text-sm font-medium text-ink hover:underline">{entry.candidate?.name}</p>
                            <p className="text-xs text-muted mt-0.5">{entry.opportunity?.title}</p>
                          </Link>
                          {!isLastStage && (
                            <button
                              onClick={() => handleAdvance(entry)}
                              disabled={movingId === entry.id}
                              className="mt-2 w-full flex items-center justify-center gap-1.5 border border-hairline text-charcoal text-xs px-3 py-1.5 rounded-md hover:bg-bone transition-colors disabled:opacity-50"
                            >
                              {movingId === entry.id ? "Moving…" : `Move to ${PIPELINE_STAGES[PIPELINE_STAGES.indexOf(entry.stage) + 1]}`}
                              {movingId !== entry.id && <ArrowRight size={12} />}
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {stageEntries.length === 0 && <div className="text-xs text-muted border border-dashed border-hairline rounded-xl p-4 text-center">Empty</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
