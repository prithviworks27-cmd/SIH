// Right-hand rail shown while a test is in progress, styled as an exam
// "answer sheet" — a jump-to-any-question bubble grid, filled solid once
// answered so a glance shows exactly what's left, the way a real OMR sheet
// or exam-software navigator reads. Used by the dynamic (Supabase-backed)
// multi-skill run — questionIds/answeredIds span every selected skill's
// questions flattened into one sequence, not just one skill's 20, so
// `current`/onJumpTo index into that combined list.
//
// skillBoundaries (optional) labels where each skill's block of tiles starts
// in that combined list — [{ skillName, startIndex }], sorted by startIndex,
// rendered as numbered exam sections since a multi-skill run genuinely is
// one. Omit it (or pass a single-skill list) for a plain ungrouped grid.
export default function TestNavigatorSidebar({ questionCount, current, answeredIds, skippedIds = new Set(), questionIds, onJumpTo, skillBoundaries }) {
  // Precompute which index starts a new skill label, so the render loop
  // below can interleave labels with tiles in a single pass.
  const labelAtIndex = new Map((skillBoundaries || []).map((b) => [b.startIndex, b.skillName]));

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="bg-white border border-hairline rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-ink">Answer Sheet</h3>
          <span className="text-xs text-muted tabular-nums">
            {answeredIds.size} / {questionCount}
          </span>
        </div>
        <div className="flex flex-col gap-4">
          {questionIds.reduce((blocks, id, index) => {
            const label = labelAtIndex.get(index);
            if (label || blocks.length === 0) blocks.push({ label, sectionNumber: blocks.length + 1, tiles: [] });
            blocks[blocks.length - 1].tiles.push({ id, index });
            return blocks;
          }, []).map((block, blockIndex) => (
            <div key={block.label ?? `block-${blockIndex}`}>
              {block.label && (
                <div className="flex items-baseline gap-1.5 mb-2.5 pb-1.5 border-b border-hairline">
                  <span className="text-[10px] font-medium text-muted">{`S${block.sectionNumber}`}</span>
                  <p className="text-xs font-medium text-charcoal truncate">{block.label}</p>
                </div>
              )}
              <div className="grid grid-cols-5 gap-2">
                {block.tiles.map(({ id, index }) => {
                  const isAnswered = answeredIds.has(id);
                  const isSkipped = skippedIds.has(id) && !isAnswered;
                  const isCurrent = index === current;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onJumpTo(index)}
                      title={isAnswered ? "Answered" : isSkipped ? "Skipped" : "Not answered"}
                      className={`h-9 w-9 rounded-full text-xs font-medium transition-all flex items-center justify-center mx-auto ${
                        isCurrent
                          ? "bg-ink text-white"
                          : isAnswered
                          ? "bg-pastel-green-ink text-white hover:opacity-90"
                          : isSkipped
                          ? "bg-pastel-yellow-ink text-white hover:opacity-90"
                          : "border border-hairline text-muted hover:border-ink hover:text-ink"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-hairline text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pastel-green-ink" /> Answered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pastel-yellow-ink" /> Skipped
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-hairline" /> Unanswered
          </span>
        </div>
      </div>
    </aside>
  );
}
