import { useState } from "react";

// Reusable "show first N, then See more / See less" list for filter sidebars
// with long option lists (e.g. Skills, Location). Renders each option through
// `renderOption` so callers keep full control over the checkbox/label markup;
// this component only owns the expand/collapse state and slicing.
export default function ExpandableFilterList({ options, renderOption, visibleCount = 6 }) {
  const [expanded, setExpanded] = useState(false);

  const visibleOptions = expanded ? options : options.slice(0, visibleCount);
  const hasMore = options.length > visibleCount;

  return (
    <div className="space-y-2">
      {visibleOptions.map((option) => renderOption(option))}
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-xs text-ink font-medium hover:underline pt-1"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}
