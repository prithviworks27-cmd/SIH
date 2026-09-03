import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import { ArrowLeft, ArrowRight, CheckCircle, ClockCounterClockwise } from "@phosphor-icons/react";
import { getAssessmentQuestions, submitAssessment, getStoredSkillProfileOrDemo } from "../../services/assessmentService";

const STORAGE_DRAFT_KEY = "skillAssessmentDraft";

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_DRAFT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDraft(answers) {
  try {
    localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(answers));
  } catch {
    // best-effort only — losing draft progress isn't fatal
  }
}

export default function SkillAssessment() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(undefined);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  // undefined = still checking, null = never completed, string = last completion date.
  // If the student already completed this self-rating once, don't force them
  // through the whole form again on every visit — show a summary with an
  // explicit "Retake" choice instead (Issue 6).
  const [previousCompletedAt, setPreviousCompletedAt] = useState(undefined);
  const [forceRetake, setForceRetake] = useState(false);

  useEffect(() => {
    getAssessmentQuestions().then(setQuestions);
    getStoredSkillProfileOrDemo().then((profile) => setPreviousCompletedAt(profile?.completedAt ?? null));
  }, []);

  useEffect(() => {
    if (forceRetake) setAnswers(loadDraft());
  }, [forceRetake]);

  if (!questions || previousCompletedAt === undefined) {
    return (
      <DashboardLayout>
        <LoadingState fullScreen={false} label="Loading assessment…" />
      </DashboardLayout>
    );
  }

  if (previousCompletedAt && !forceRetake) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg bg-white border border-hairline rounded-xl p-10 text-center">
            <ClockCounterClockwise size={32} className="text-ink mx-auto mb-4" />
            <h1 className="font-editorial text-2xl text-ink tracking-tight mb-2">You've already completed this assessment</h1>
            <p className="text-muted mb-8">
              Last completed on{" "}
              {new Date(previousCompletedAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}. Your skill
              profile is already up to date — no need to fill it in again.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/skill-profile/gap-report")}
                className="w-full bg-ink text-white text-sm px-4 py-2.5 rounded-md hover:bg-[#333333] active:scale-[0.98] transition-all cursor-pointer"
              >
                View My Skill Profile
              </button>
              <button
                onClick={() => setForceRetake(true)}
                className="w-full border border-hairline text-charcoal text-sm px-4 py-2.5 rounded-md hover:bg-bone transition-colors cursor-pointer"
              >
                Retake Self-Assessment
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const total = questions.length;
  const question = questions[current];
  const progressPercent = Math.round(((current + 1) / total) * 100);
  const selectedValue = answers[question.id];
  const isLastQuestion = current === total - 1;

  const handleSelect = (value) => {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    saveDraft(next);
    setError("");
  };

  const handleBack = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const handleNext = () => {
    if (!selectedValue) {
      setError("Please select an option before continuing.");
      return;
    }
    setCurrent((c) => c + 1);
  };

  const handleSaveExit = () => {
    saveDraft(answers);
    navigate("/dashboard");
  };

  const handleSubmit = async () => {
    if (!selectedValue) {
      setError("Please select an option before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      await submitAssessment(answers);
      localStorage.removeItem(STORAGE_DRAFT_KEY);
      navigate("/skill-profile/gap-report");
    } catch {
      setError("Something went wrong submitting your assessment. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Top Progress Bar */}
      <div className="w-full bg-white border border-hairline rounded-xl flex flex-col mb-10">
        <div className="h-1 w-full bg-bone rounded-t-xl overflow-hidden">
          <div className="h-1 bg-ink transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="px-6 py-4 flex justify-between items-center">
          <span className="text-sm text-muted">
            Question {current + 1} of {total} · {question.section}
          </span>
          <button type="button" onClick={handleSaveExit} className="text-sm text-ink hover:underline">
            Save &amp; Exit
          </button>
        </div>
      </div>

      {/* Assessment Form Container */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white border border-hairline rounded-xl p-10">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-ink mb-2">{question.skill}</h2>
            <p className="text-muted">{question.prompt}</p>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {question.options.map((option) => {
              const isSelected = selectedValue === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                    isSelected ? "border-ink bg-bone" : "border-hairline hover:border-ink"
                  }`}
                >
                  <input
                    className="w-4 h-4 text-ink border-hairline focus:ring-ink"
                    name={question.id}
                    type="radio"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => handleSelect(option.value)}
                  />
                  <div className="ml-4">
                    <span className="block text-sm font-medium text-ink">{option.label}</span>
                    <span className="block text-sm text-muted">{option.desc}</span>
                  </div>
                </label>
              );
            })}
          </div>

          {error && <p className="text-sm text-pastel-red-ink mb-4">{error}</p>}

          <div className="flex justify-between items-center pt-4 border-t border-hairline">
            <button
              className="px-4 py-2 border border-hairline rounded-md text-charcoal text-sm hover:bg-bone transition-colors flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
              type="button"
              onClick={handleBack}
              disabled={current === 0}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            {isLastQuestion ? (
              <button
                className="px-4 py-2 bg-ink text-white rounded-md text-sm hover:bg-[#333333] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-60"
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit Assessment"}
                <CheckCircle size={16} />
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-ink text-white rounded-md text-sm hover:bg-[#333333] active:scale-[0.98] transition-all flex items-center gap-2"
                type="button"
                onClick={handleNext}
              >
                Next
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
