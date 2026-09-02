import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import ApplicationStatus from "../../components/common/ApplicationStatus";
import { useAuth } from "../../hooks/useAuth";
import { industryNavItems, industryFooterNavItems } from "../../config/industryNavConfig";
import { getMyOpportunities } from "../../services/opportunitiesService";
import { getPipeline, PIPELINE_STAGES } from "../../services/pipelineService";
import { Briefcase, Users, Target, CheckCircle } from "@phosphor-icons/react";

export default function IndustryDashboard() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState(undefined);
  const [pipeline, setPipeline] = useState(undefined);

  useEffect(() => {
    getMyOpportunities().then(setOpportunities);
    getPipeline().then(setPipeline);
  }, []);

  const activeOpportunities = opportunities?.filter((o) => (o.status ?? "Active") === "Active").length ?? "—";
  const totalApplications = pipeline?.length ?? "—";
  const shortlisted = pipeline?.filter((p) => PIPELINE_STAGES.indexOf(p.stage) >= PIPELINE_STAGES.indexOf("Shortlisted")).length ?? "—";
  const selected = pipeline?.filter((p) => p.stage === "Selected").length ?? "—";

  const recentApplications = pipeline?.slice(0, 5) ?? [];
  const topCandidates = pipeline
    ?.filter((p) => p.stage === "Interview" || p.stage === "Shortlisted")
    .slice(0, 3);

  return (
    <DashboardLayout
      navItems={industryNavItems}
      footerNavItems={industryFooterNavItems}
      title="Industry Portal"
      subtitle="Talent & Recruitment"
    >
      <header className="mb-10">
        <h1 className="font-editorial text-4xl text-ink tracking-tight mb-2">Welcome back, {user?.name || "Partner"}</h1>
        <p className="text-muted leading-relaxed">Here's an overview of your recruitment pipeline.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Active Opportunities" value={activeOpportunities} icon={Briefcase} />
        <StatCard label="Total Applications" value={totalApplications} icon={Users} />
        <StatCard label="Shortlisted" value={shortlisted} icon={Target} valueColorClass="text-pastel-blue-ink" />
        <StatCard label="Selected" value={selected} icon={CheckCircle} valueColorClass="text-pastel-green-ink" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <section className="bg-white border border-hairline rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-ink">Recent Applications</h3>
              <Link to="/industry/applications" className="text-xs uppercase tracking-wide text-ink hover:text-muted transition-colors">
                View all
              </Link>
            </div>
            {!pipeline && <p className="text-sm text-muted">Loading…</p>}
            {pipeline && recentApplications.length === 0 && <p className="text-sm text-muted">No applications yet.</p>}
            <div className="flex flex-col divide-y divide-hairline">
              {recentApplications.map((entry) => (
                <div key={entry.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-ink">{entry.candidate?.name}</p>
                    <p className="text-xs text-muted">{entry.opportunity?.title}</p>
                  </div>
                  <ApplicationStatus status={entry.stage} />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-hairline rounded-xl p-8">
            <h3 className="text-lg font-medium text-ink mb-6">Active Opportunities</h3>
            {!opportunities && <p className="text-sm text-muted">Loading…</p>}
            <div className="flex flex-col divide-y divide-hairline">
              {opportunities
                ?.filter((o) => (o.status ?? "Active") === "Active")
                .slice(0, 5)
                .map((o) => (
                  <div key={o.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-ink">{o.title}</p>
                      <p className="text-xs text-muted">{o.type} · {o.location}</p>
                    </div>
                    <Link to="/industry/opportunities" className="text-xs text-ink hover:underline whitespace-nowrap">
                      Manage
                    </Link>
                  </div>
                ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <section className="bg-white border border-hairline rounded-xl p-6">
            <h3 className="text-lg font-medium text-ink mb-4">Top Candidates</h3>
            {!topCandidates && <p className="text-sm text-muted">Loading…</p>}
            {topCandidates && topCandidates.length === 0 && <p className="text-sm text-muted">No candidates in review yet.</p>}
            <div className="flex flex-col gap-3">
              {topCandidates?.map((entry) => (
                <Link
                  key={entry.id}
                  to={`/industry/candidates/${entry.candidateId}`}
                  className="block border border-hairline rounded-xl p-4 hover:shadow-lift transition-shadow"
                >
                  <p className="text-sm font-medium text-ink">{entry.candidate?.name}</p>
                  <p className="text-xs text-muted mt-0.5">{entry.opportunity?.title}</p>
                </Link>
              ))}
            </div>
            <Link
              to="/industry/opportunities/create"
              className="mt-6 w-full block text-center bg-ink text-white text-sm px-4 py-2.5 rounded-md hover:bg-[#333333] active:scale-[0.98] transition-all"
            >
              Post New Opportunity
            </Link>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
