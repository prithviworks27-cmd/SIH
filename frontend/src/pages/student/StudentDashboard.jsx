import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import SkillProgress from "../../components/common/SkillProgress";
import { useAuth } from "../../hooks/useAuth";
import { getSkillProfile } from "../../services/skillsService";
import { getApplications } from "../../services/applicationsService";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [skillProfile, setSkillProfile] = useState(undefined);
  const [applications, setApplications] = useState(undefined);

  useEffect(() => {
    getSkillProfile().then(setSkillProfile);
    getApplications().then(setApplications);
  }, []);

  const activeApplications = applications?.filter((a) => a.status !== "Closed" && a.status !== "Rejected").length ?? "—";
  const upcomingInterviews = applications?.filter((a) => a.status === "Interview").length ?? "—";

  return (
    <DashboardLayout>
      {/*Welcome Header*/}
      <header className="mb-xl">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Welcome back, {user?.name || "Student"}</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Here is a summary of your academic progress and opportunities.
        </p>
      </header>

      {/*Stat Cards Grid*/}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl">
        <StatCard label="Skill Match" value={skillProfile ? `${skillProfile.overallMatchPercent}%` : "…"} icon="radar" valueColorClass="text-primary-container" />
        <StatCard label="Active Applications" value={activeApplications} icon="work_history" />
        <StatCard label="Upcoming Interviews" value={upcomingInterviews} icon="event" iconColorClass="text-error" />
      </section>

      {/*Main Content Bento Grid*/}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/*Left Column: Skills & Opportunities*/}
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          {/*Skill Gap Analysis*/}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-xl">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="font-headline-md text-headline-md text-on-surface">Skill Gap Analysis</h3>
              <Link to="/skill-profile/gap-report" className="font-label-md text-label-md text-primary-container hover:underline">
                View Details
              </Link>
            </div>
            <div className="space-y-md">
              {skillProfile
                ? skillProfile.skillGaps.map((s) => <SkillProgress key={s.skill} label={s.skill} percent={s.percent} />)
                : (
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Loading skill profile…</p>
                )}
            </div>
          </section>

          {/*Recommended Opportunities*/}
          <section>
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-md text-headline-md text-on-surface">Recommended Opportunities</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <article className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-md flex flex-col h-full">
                <div className="flex justify-between items-start mb-md">
                  <div className="bg-surface-variant p-sm rounded-DEFAULT">
                    <span className="material-symbols-outlined text-on-surface-variant">database</span>
                  </div>
                  <span className="bg-surface-variant text-on-surface-variant px-sm py-xs rounded-DEFAULT font-label-sm text-label-sm">85% Match</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Data Science Intern</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg">TechCorp Research Labs</p>
                <div className="mt-auto flex justify-end">
                  <Link
                    to="/internships"
                    className="bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md px-md py-sm rounded-DEFAULT hover:bg-surface-variant transition-colors"
                  >
                    View Opportunities
                  </Link>
                </div>
              </article>
              <article className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-md flex flex-col h-full">
                <div className="flex justify-between items-start mb-md">
                  <div className="bg-surface-variant p-sm rounded-DEFAULT">
                    <span className="material-symbols-outlined text-on-surface-variant">code</span>
                  </div>
                  <span className="bg-surface-variant text-on-surface-variant px-sm py-xs rounded-DEFAULT font-label-sm text-label-sm">78% Match</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Machine Learning Engineer</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg">Nexus Systems Institute</p>
                <div className="mt-auto flex justify-end">
                  <Link
                    to="/internships"
                    className="bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md px-md py-sm rounded-DEFAULT hover:bg-surface-variant transition-colors"
                  >
                    View Opportunities
                  </Link>
                </div>
              </article>
            </div>
          </section>
        </div>

        {/*Right Column: Recommended Courses*/}
        <div className="lg:col-span-4">
          <section className="bg-surface border border-outline-variant rounded-DEFAULT p-lg h-full flex flex-col">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-lg">Recommended Courses</h3>
            <div className="space-y-md flex-1">
              <Link
                to="/courses"
                className="block bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-md hover:border-primary-container transition-colors group"
              >
                <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary-container transition-colors mb-xs">
                  Foundations of Applied Machine Learning
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-sm">Zurich Institute of Technology</p>
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">schedule</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">6 Weeks</span>
                </div>
              </Link>
            </div>
            <Link
              to="/courses"
              className="mt-lg w-full text-center bg-primary-container text-on-primary font-label-md text-label-md px-md py-sm rounded-DEFAULT hover:bg-primary transition-colors"
            >
              Browse Full Catalog
            </Link>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
