import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import WhyThisMatch from "../../components/common/WhyThisMatch";
import SkillTrustBadge from "../../components/common/SkillTrustBadge";
import { industryNavItems, industryFooterNavItems } from "../../config/industryNavConfig";
import { getCandidateById } from "../../services/candidatesService";
import { getMyOpportunities } from "../../services/opportunitiesService";
import { calculateMatch, DEFAULT_WEIGHTS } from "../../services/matchingEngine";
import { ArrowLeft, MagnifyingGlass } from "@phosphor-icons/react";

const WEIGHT_LABELS = {
  skillMatch: "Skill Match",
  eligibility: "Eligibility",
  projects: "Projects",
  certifications: "Certifications",
  experience: "Experience",
};

export default function CandidateDetail() {
  const { candidateId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(undefined); // undefined = loading, null = not found
  const [opportunities, setOpportunities] = useState([]);
  const [opportunityId, setOpportunityId] = useState(searchParams.get("opportunityId") || "");
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);

  useEffect(() => {
    let active = true;
    Promise.all([getCandidateById(candidateId), getMyOpportunities()]).then(([cand, opps]) => {
      if (!active) return;
      setCandidate(cand);
      const activeOpps = opps.filter((o) => (o.status ?? "Active") === "Active");
      setOpportunities(activeOpps);
      if (!opportunityId && activeOpps[0]) setOpportunityId(activeOpps[0].id);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateId]);

  const selectedOpportunity = opportunities.find((o) => o.id === opportunityId);

  const match = useMemo(() => {
    if (!candidate || !selectedOpportunity) return null;
    return calculateMatch(candidate, selectedOpportunity, weights);
  }, [candidate, selectedOpportunity, weights]);

  const handleWeightChange = (key, value) => {
    setWeights((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <DashboardLayout navItems={industryNavItems} footerNavItems={industryFooterNavItems} title="Industry Portal" subtitle="Talent & Recruitment">
      {candidate === undefined && <LoadingState label="Loading candidate…" />}

      {candidate === null && (
        <EmptyState
          icon={MagnifyingGlass}
          title="Candidate not found"
          actionLabel="Back to Candidates"
          onAction={() => navigate("/industry/candidates")}
        />
      )}

      {candidate && (
        <div className="max-w-4xl mx-auto w-full">
          <button
            className="inline-flex items-center gap-2 text-muted hover:text-ink transition-colors text-sm mb-6"
            onClick={() => navigate("/industry/candidates")}
          >
            <ArrowLeft size={16} />
            Back to Candidates
          </button>

          <header className="bg-white border border-hairline rounded-xl p-8 mb-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-bone flex items-center justify-center text-ink font-medium text-xl shrink-0">
              {candidate.avatarInitial}
            </div>
            <div>
              <h1 className="font-editorial text-2xl text-ink tracking-tight mb-1">{candidate.name}</h1>
              <p className="text-muted">
                {candidate.institution} · {candidate.year}
              </p>
            </div>
          </header>

          {/* Verified skill profile — what an employer sees behind the match score,
              not just a bare percentage. */}
          <section className="bg-white border border-hairline rounded-xl p-6 mb-6">
            <h2 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Verified Skill Profile</h2>
            <ul className="flex flex-col gap-1">
              {candidate.skills.map((skill) => (
                <li key={skill.name} className="flex items-center justify-between gap-3 py-2.5 border-b border-hairline last:border-b-0">
                  <span className="text-sm text-charcoal">{skill.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted w-10 text-right">{skill.currentScore}%</span>
                    <SkillTrustBadge trustLevel={skill.trustLevel ?? "Self-Declared"} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white border border-hairline rounded-xl p-6 mb-6">
            <label className="block text-xs uppercase tracking-wide text-muted mb-2" htmlFor="opp-select">
              Matching against
            </label>
            <select
              id="opp-select"
              className="w-full md:w-96 border border-hairline bg-white text-charcoal rounded-md py-2 px-3 focus:border-ink focus:ring-0 text-sm h-10"
              value={opportunityId}
              onChange={(e) => setOpportunityId(e.target.value)}
            >
              {opportunities.length === 0 && <option value="">No active opportunities</option>}
              {opportunities.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>
              ))}
            </select>
          </section>

          {/* Adjustable matching weights */}
          <section className="bg-white border border-hairline rounded-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-ink">Matching Weights</h2>
              <span className={`text-xs ${totalWeight === 100 ? "text-muted" : "text-pastel-red-ink"}`}>Total: {totalWeight}%</span>
            </div>
            <div className="flex flex-col gap-5">
              {Object.entries(weights).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm text-charcoal" htmlFor={`weight-${key}`}>
                      {WEIGHT_LABELS[key]}
                    </label>
                    <span className="text-sm text-muted">{value}%</span>
                  </div>
                  <input
                    id={`weight-${key}`}
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={value}
                    onChange={(e) => handleWeightChange(key, e.target.value)}
                    className="w-full accent-ink"
                  />
                </div>
              ))}
            </div>
            {totalWeight !== 100 && (
              <p className="text-xs text-muted mt-4">Weights don't need to sum to exactly 100 — the score is normalized automatically.</p>
            )}
          </section>

          {match && selectedOpportunity ? (
            <div className="bg-white border border-hairline rounded-xl p-8">
              <WhyThisMatch match={match} compact action={{ to: "/industry/applications", label: "View in Pipeline" }} />
            </div>
          ) : (
            <EmptyState title="No opportunity selected" description="Choose an opportunity above to see a match breakdown." />
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
