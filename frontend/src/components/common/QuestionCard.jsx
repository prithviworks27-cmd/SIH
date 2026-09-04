const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function QuestionCard({ prompt, options, selectedValue, onSelect }) {
  // Text/code questions (dynamic tests only) have no fixed options — render
  // a free-text answer box instead of the radio list. Static SKILL_TESTS
  // questions always have options, so that path is unaffected.
  const isFreeText = !options || options.length === 0;
  // A prompt containing a code block reads better in a monospace, dark
  // "paper" panel — same visual language as a real exam's code snippet —
  // rather than plain serif/sans body text. Heuristic: multi-line prompts
  // with brace/semicolon punctuation are code; short single-line prompts
  // (the vast majority of questions) are always plain prose.
  const looksLikeCode = prompt.includes("\n") && /[{};]/.test(prompt);

  return (
    <div>
      {looksLikeCode ? (
        <pre className="w-full overflow-x-auto bg-ink text-[#e8e8e8] rounded-xl p-5 mb-6 text-sm leading-relaxed font-mono whitespace-pre-wrap">
          {prompt}
        </pre>
      ) : (
        <p className="text-lg text-ink leading-relaxed mb-6 whitespace-pre-wrap">{prompt}</p>
      )}
      {isFreeText ? (
        <textarea
          className="w-full min-h-[140px] p-4 border border-hairline rounded-xl text-sm text-ink font-mono focus:border-ink focus:outline-none focus:ring-0 placeholder:text-muted placeholder:font-sans"
          placeholder="Type your answer…"
          value={selectedValue || ""}
          onChange={(e) => onSelect(e.target.value)}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {options.map((option, index) => {
            const isSelected = selectedValue === option.value;
            return (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                  isSelected ? "border-ink bg-bone" : "border-hairline hover:border-ink"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full border text-xs font-medium flex items-center justify-center ${
                    isSelected ? "border-ink bg-ink text-white" : "border-hairline text-muted"
                  }`}
                >
                  {OPTION_LETTERS[index] ?? index + 1}
                </span>
                <input
                  className="sr-only"
                  type="radio"
                  name="question-option"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => onSelect(option.value)}
                />
                <span className="text-sm text-ink">{option.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
