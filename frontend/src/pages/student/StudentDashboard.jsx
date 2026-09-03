import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import SkillProgress from "../../components/common/SkillProgress";
import { useAuth } from "../../hooks/useAuth";
import { getSkillProfile } from "../../services/skillsService";
import { getApplications } from "../../services/applicationsService";
import { getInternshipsWithMatch } from "../../services/matchService";
import { getCourses } from "../../services/coursesService";
import { Target, Briefcase, CalendarBlank, Sparkle, Clock, Code, ShieldCheck, TrendUp, UserCircle } from "@phosphor-icons/react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [skillProfile, setSkillProfile] = useState(undefined);
  const [applications, setApplications] = useState(undefined);
  const [topMatches, setTopMatches] = useState(undefined);
  const [courses, setCourses] = useState(undefined);

  useEffect(() => {
    getSkillProfile().then(setSkillProfile);
    getApplications().then(setApplications);
    getInternshipsWithMatch().then((jobs) => setTopMatches(jobs.slice(0, 2)));
    getCourses().then((c) => setCourses(c.slice(0, 1)));
  }, []);

  const activeApplications = applications?.filter((a) => a.status !== "Closed" && a.status !== "Rejected").length ?? "—";
  const upcomingInterviews = applications?.filter((a) => a.status === "Interview").length ?? "—";

  return (
    <DashboardLayout>
      {/*Welcome Header*/}
      <header className="mb-10">
        <h1 className="font-editorial text-4xl text-ink tracking-tight mb-2">Welcome back, {user?.name || "Student"}</h1>
        <p className="text-muted leading-relaxed">Here is a summary of your academic progress and opportunities.</p>
      </header>

      {/*Stat Cards Grid*/}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <StatCard label="Skill Match" value={skillProfile ? `${skillProfile.overallMatchPercent}%` : "…"} icon={Target} valueColorClass="text-pastel-blue-ink" />
        <StatCard label="Active Applications" value={activeApplications} icon={Briefcase} />
        <StatCard label="Upcoming Interviews" value={upcomingInterviews} icon={CalendarBlank} iconColorClass="text-pastel-red-ink" />
      </section>

      {/*Main Content Bento Grid*/}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/*Left Column: Skills & Opportunities*/}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/*Skill Gap Analysis*/}
          <section className="bg-white border border-hairline rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-ink">Skill Gap Analysis</h3>
              <Link to="/skill-profile/gap-report" className="text-xs uppercase tracking-wide text-ink hover:text-muted transition-colors">
                View details
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {skillProfile ? (
                skillProfile.skillGaps
                  .slice(0, 3)
                  .map((s, i) => <SkillProgress key={s.name} label={s.name} percent={s.currentScore} index={i} />)
              ) : (
                <p className="text-sm text-muted col-span-3">Loading skill profile…</p>
              )}
            </div>
          </section>

          {/*Recommended Opportunities*/}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-ink">Recommended Opportunities</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!topMatches && <p className="text-sm text-muted">Loading opportunities…</p>}
              {topMatches?.map((job) => (
                <article key={job.id} className="bg-white border border-hairline rounded-xl p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="w-9 h-9 rounded-md flex items-center justify-center bg-pastel-blue text-pastel-blue-ink">
                      <Sparkle size={16} weight="bold" />
                    </span>
                    <span className="bg-bone text-muted px-2.5 py-1 rounded-full text-xs uppercase tracking-wide">
                      {job.match.overallScore}% Match
                    </span>
                  </div>
                  <h4 className="text-base font-medium text-ink mb-1">{job.title}</h4>
                  <p className="text-sm text-muted mb-6">{job.company}</p>
                  <div className="mt-auto flex justify-end">
                    <Link
                      to={`/internships/${job.id}`}
                      className="border border-hairline text-ink text-sm px-4 py-2 rounded-md hover:bg-bone transition-colors"
                    >
                      View Opportunity
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/*Right Column: Recommended Courses*/}
        <div className="lg:col-span-4">
          <section className="bg-white border border-hairline rounded-xl p-6 h-full flex flex-col">
            <h3 className="text-lg font-medium text-ink mb-6">Recommended Courses</h3>
            <div className="space-y-3 flex-1">
              {!courses && <p className="text-sm text-muted">Loading courses…</p>}
              {courses?.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="block border border-hairline rounded-xl p-4 hover:shadow-lift transition-shadow group"
                >
                  <h4 className="text-sm font-medium text-ink mb-1">{course.title}</h4>
                  <p className="text-xs text-muted mb-2">{course.provider}</p>
                  <div className="flex items-center gap-1.5 text-muted">
                    <Clock size={13} />
                    <span className="text-xs">{course.duration}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              to="/courses"
              className="mt-6 w-full text-center bg-ink text-white text-sm px-4 py-2.5 rounded-md hover:bg-[#333333] active:scale-[0.98] transition-all"
            >
              Browse Full Catalog
            </Link>
          </section>
        </div>
      </div>

      {/*Career Tools*/}
      <section className="mt-6">
        <h3 className="text-lg font-medium text-ink mb-4">Career Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/portfolio" className="bg-white border border-hairline rounded-xl p-5 hover:shadow-lift transition-shadow flex flex-col gap-2">
            <UserCircle size={20} className="text-ink" />
            <span className="text-sm font-medium text-ink">Preview Portfolio</span>
            <span className="text-xs text-muted">See your professional profile the way employers do.</span>
          </Link>
          <Link to="/proof-of-skill" className="bg-white border border-hairline rounded-xl p-5 hover:shadow-lift transition-shadow flex flex-col gap-2">
            <Code size={20} className="text-ink" />
            <span className="text-sm font-medium text-ink">Proof-of-Skill Challenge</span>
            <span className="text-xs text-muted">Verify a skill with a real coding challenge.</span>
          </Link>
          <Link to="/career-twin" className="bg-white border border-hairline rounded-xl p-5 hover:shadow-lift transition-shadow flex flex-col gap-2">
            <TrendUp size={20} className="text-ink" />
            <span className="text-sm font-medium text-ink">Career Digital Twin</span>
            <span className="text-xs text-muted">See your projected readiness after learning.</span>
          </Link>
          <Link to="/employer-trust" className="bg-white border border-hairline rounded-xl p-5 hover:shadow-lift transition-shadow flex flex-col gap-2">
            <ShieldCheck size={20} className="text-ink" />
            <span className="text-sm font-medium text-ink">Employer Trust Layer</span>
            <span className="text-xs text-muted">Preview what employers see when they verify you.</span>
          </Link>
        </div>
      </section>
    </DashboardLayout>
  );
}
