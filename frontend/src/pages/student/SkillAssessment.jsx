import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import { ClockCounterClockwise } from "@phosphor-icons/react";
import { getAssessmentQuestions, getStoredSkillProfileOrDemo } from "../../services/assessmentService";

const QUEUE_STORAGE_KEY = "dynamicTestQueue";

export default function SkillAssessment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState(undefined);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [error, setError] = useState("");
  // undefined = still checking, null = never completed, string = last completion date.
  // If the student already completed a skill assessment once, don't force
  // them through the whole picker again on every visit — show a summary with
  // an explicit "Retake" choice instead (Issue 6).
  const [previousCompletedAt, setPreviousCompletedAt] = useState(undefined);
  const [forceRetake, setForceRetake] = useState(false);

  useEffect(() => {
    // getAssessmentQuestions() only supplies the skill picker's sections/list
    // here — the objective test questions themselves come from Supabase
    // per-skill once a test starts (see DynamicSkillTestStart.jsx).
    getAssessmentQuestions().then(setQuestions);
    getStoredSkillProfileOrDemo().then((profile) => setPreviousCompletedAt(profile?.completedAt ?? null));
  }, []);

  useEffect(() => {
    if (searchParams.get("start") === "beginning") {
      setSelectedSkills([]);
    }
    if (searchParams.get("retake") === "true") setForceRetake(true);
  }, [searchParams]);

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
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Only "Technical Skills" have a question bank in Supabase's
  // assessment_questions table — the "Soft Skills" section (Communication,
  // Teamwork, etc.) has no objective test to send a selection into, so it's
  // excluded from this picker rather than dead-ending in a 404 dynamic test.
  const availableSections = questions
    .filter((question) => question.section === "Technical Skills")
    .reduce((sections, question) => {
      const section = sections.find((item) => item.section === question.section);
      if (section) section.questions.push(question);
      else sections.push({ section: question.section, questions: [question] });
      return sections;
    }, []);

  const toggleSkill = (skill) => {
    setSelectedSkills((currentSkills) =>
      currentSkills.includes(skill) ? currentSkills.filter((item) => item !== skill) : [...currentSkills, skill]
    );
  };

  // Runs every selected skill as one combined 20-question-per-skill test
  // (see DynamicTestRun.jsx) instead of the old in-page self-rating step —
  // sessionStorage is a durability fallback so a page refresh mid-run
  // doesn't lose the skill list; location.state is the primary channel.
  const beginSkillTests = () => {
    if (selectedSkills.length === 0) {
      setError("Please select at least one skill before continuing.");
      return;
    }
    sessionStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(selectedSkills));
    navigate("/skill-tests/dynamic/run", { state: { selectedSkills } });
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-2xl mx-auto bg-white border border-hairline rounded-xl p-6 md:p-10">
        <div className="mb-8">
          <h1 className="font-editorial text-2xl text-ink tracking-tight mb-2">Which skills do you know?</h1>
          <p className="text-muted">
            Select the technical skills you have started learning or using. You'll take a 20-question assessment for each one to verify
            your level.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {availableSections.map((section) => (
            <section key={section.section}>
              <h2 className="text-base font-medium text-ink mb-3">{section.section}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {section.questions.map((question) => {
                  const isSelected = selectedSkills.includes(question.skill);
                  return (
                    <label
                      key={question.skill}
                      className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                        isSelected ? "border-ink bg-bone" : "border-hairline hover:border-ink"
                      }`}
                    >
                      <input
                        className="w-4 h-4 text-ink border-hairline focus:ring-ink"
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSkill(question.skill)}
                      />
                      <span className="text-sm text-ink">{question.skill}</span>
                    </label>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {error && <p className="text-sm text-pastel-red-ink mt-6">{error}</p>}

        <div className="flex justify-end mt-8 pt-4 border-t border-hairline">
          <button
            type="button"
            onClick={beginSkillTests}
            className="px-4 py-2 bg-ink text-white rounded-md text-sm hover:bg-[#333333] active:scale-[0.98] transition-all"
          >
            Start Skill Tests
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
