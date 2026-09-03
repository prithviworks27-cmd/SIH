import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import SkillTestCard from "../../components/common/SkillTestCard";
import { getSkillTests } from "../../services/skillTestService";

export default function SkillTests() {
  const navigate = useNavigate();
  const [tests, setTests] = useState(undefined);

  useEffect(() => {
    getSkillTests().then(setTests);
  }, []);

  return (
    <DashboardLayout>
      <header className="mb-8 border-b border-hairline pb-6">
        <h1 className="font-editorial text-3xl text-ink tracking-tight mb-1">My Assessments</h1>
        <p className="text-muted">Pass a skill test to verify it on your profile — employers see Assessment Verified skills as trusted.</p>
      </header>

      {!tests && <LoadingState label="Loading assessments…" />}

      {tests && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test) => (
            <SkillTestCard
              key={test.id}
              title={test.title}
              category={test.category}
              questionCount={test.questionCount}
              durationMinutes={test.durationMinutes}
              lastResult={test.lastResult}
              onStart={() => navigate(`/skill-tests/${test.id}`)}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
