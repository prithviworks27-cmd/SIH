import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import { industryNavItems, industryFooterNavItems } from "../../config/industryNavConfig";
import { getCandidates } from "../../services/candidatesService";
import { getMyOpportunities } from "../../services/opportunitiesService";
import { calculateMatch } from "../../services/matchingEngine";
import { Users } from "@phosphor-icons/react";

export default function CandidatesList() {
  const [rows, setRows] = useState(undefined);
  const [opportunityId, setOpportunityId] = useState("");
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    Promise.all([getCandidates(), getMyOpportunities()]).then(([candidates, opps]) => {
      const activeOpps = opps.filter((o) => (o.status ?? "Active") === "Active");
      setOpportunities(activeOpps);
      const defaultOpp = activeOpps[0];
      setOpportunityId(defaultOpp?.id ?? "");
      setRows(defaultOpp ? candidates.map((c) => ({ candidate: c, match: calculateMatch(c, defaultOpp) })) : candidates.map((c) => ({ candidate: c, match: null })));
    });
  }, []);

  const handleOpportunityChange = async (id) => {
    setOpportunityId(id);
    const [candidates] = await Promise.all([getCandidates()]);
    const opp = opportunities.find((o) => o.id === id);
    setRows(opp ? candidates.map((c) => ({ candidate: c, match: calculateMatch(c, opp) })) : candidates.map((c) => ({ candidate: c, match: null })));
  };

  const sortedRows = rows ? [...rows].sort((a, b) => (b.match?.overallScore ?? 0) - (a.match?.overallScore ?? 0)) : rows;

  return (
    <DashboardLayout navItems={industryNavItems} footerNavItems={industryFooterNavItems} title="Industry Portal" subtitle="Talent & Recruitment">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <h2 className="font-editorial text-3xl text-ink tracking-tight">Candidates</h2>
          <p className="text-muted mt-2">Ranked by match against a selected opportunity.</p>
        </div>
        <div className="w-full md:w-72">
          <label className="sr-only" htmlFor="opp-selector">
            Match against opportunity
          </label>
          <select
            id="opp-selector"
            className="w-full border border-hairline bg-white text-charcoal rounded-md py-2 px-3 focus:border-ink focus:ring-0 text-sm h-10"
            value={opportunityId}
            onChange={(e) => handleOpportunityChange(e.target.value)}
          >
            {opportunities.length === 0 && <option value="">No active opportunities</option>}
            {opportunities.map((o) => (
              <option key={o.id} value={o.id}>
                {o.title}
              </option>
            ))}
          </select>
        </div>
      </header>

      {rows === undefined && <LoadingState label="Loading candidates…" />}

      {rows && rows.length === 0 && <EmptyState icon={Users} title="No candidates yet" description="Candidates will appear here as students apply." />}

      {sortedRows && sortedRows.length > 0 && (
        <div className="space-y-3">
          {sortedRows.map(({ candidate, match }) => (
            <Link
              key={candidate.id}
              to={`/industry/candidates/${candidate.id}${opportunityId ? `?opportunityId=${opportunityId}` : ""}`}
              className="bg-white border border-hairline rounded-xl p-5 flex items-center gap-4 hover:shadow-lift transition-shadow"
            >
              <div className="w-11 h-11 rounded-full bg-bone flex items-center justify-center text-ink font-medium shrink-0">
                {candidate.avatarInitial}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-ink">{candidate.name}</h3>
                <p className="text-sm text-muted">
                  {candidate.institution} · {candidate.year}
                </p>
              </div>
              {match && (
                <div className="text-right">
                  <span className="block font-editorial text-2xl text-ink">{match.overallScore}%</span>
                  <span className="text-xs text-muted">Match</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
