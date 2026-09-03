export default function QuestionCard({ prompt, options, selectedValue, onSelect }) {
  return (
    <div>
      <p className="text-lg text-ink leading-relaxed mb-6">{prompt}</p>
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                isSelected ? "border-ink bg-bone" : "border-hairline hover:border-ink"
              }`}
            >
              <input
                className="w-4 h-4 text-ink border-hairline focus:ring-ink"
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
    </div>
  );
}
