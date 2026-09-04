import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import CertificationStatusBadge from "../../components/common/CertificationStatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { getSkillProfile } from "../../services/skillsService";
import { getPortfolio } from "../../services/portfolioService";
import { CheckCircle, WarningCircle, ShieldCheck } from "@phosphor-icons/react";

export default function EmployerTrustLayer() {
  const { user } = useAuth();
  const [skillData, setSkillData] = useState(undefined);
  const [portfolio, setPortfolio] = useState(undefined);

  useEffect(() => {
    getSkillProfile().then(setSkillData);
    getPortfolio().then(setPortfolio);
  }, []);

  if (!skillData || !portfolio) {
    return (
      <DashboardLayout>
        <LoadingState fullScreen={false} label="Loading verification status…" />
      </DashboardLayout>
    );
  }

  const verifiedSkillCount = skillData.strongSkills.filter((s) => s.trustLevel !== "Self-Declared").length;
  const projectVerifiedCount = skillData.strongSkills.filter((s) => s.trustLevel === "Project-Verified").length;
  const verifiedCertCount = portfolio.certifications.filter((c) => c.verificationStatus === "verified").length;
  const pendingCertCount = portfolio.certifications.filter((c) => c.verificationStatus === "pending").length;

  // Certification detail reflects the REAL per-certification review state
  // (portfolio_certifications.verification_status) instead of the old
  // blanket "Self-reported, uploaded to portfolio" — which was inaccurate
  // since nothing was ever actually uploaded before file upload existed.
  // "met" only counts an admin-approved certification as a real check —
  // an unreviewed self-report doesn't clear this bar.
  let certDetail = "No certifications added yet";
  if (portfolio.certifications.length > 0) {
    if (verifiedCertCount > 0) certDetail = `${verifiedCertCount} admin-verified via uploaded certificate file`;
    else if (pendingCertCount > 0) certDetail = `${pendingCertCount} awaiting admin review`;
    else certDetail = "Self-reported — no file uploaded for review yet";
  }

  const checks = [
    { label: "Identity Verified", met: !!user?.email, detail: user?.email },
    { label: `${verifiedSkillCount} Skill${verifiedSkillCount === 1 ? "" : "s"} Assessed`, met: verifiedSkillCount > 0, detail: "Via Skill Assessment" },
    {
      label: `${projectVerifiedCount} Skill${projectVerifiedCount === 1 ? "" : "s"} Project-Verified`,
      met: projectVerifiedCount > 0,
      detail: "Via Proof-of-Skill Challenge",
    },
    {
      label: `${verifiedCertCount} of ${portfolio.certifications.length} Certification${portfolio.certifications.length === 1 ? "" : "s"} Verified`,
      met: verifiedCertCount > 0,
      detail: certDetail,
    },
    { label: `${portfolio.projects.length} Verified Project${portfolio.projects.length === 1 ? "" : "s"}`, met: portfolio.projects.length > 0, detail: "Listed in Digital Portfolio" },
    { label: "Communication & Soft Skills", met: false, detail: "Self-reported — not independently verified" },
  ];

  const verifiedCount = checks.filter((c) => c.met).length;

  return (
    <DashboardLayout>
      <header className="mb-10 border-b border-hairline pb-6">
        <h1 className="font-editorial text-3xl text-ink tracking-tight mb-1">Employer Trust Layer</h1>
        <p className="text-muted">What an employer sees when they verify your profile.</p>
      </header>

      <section className="bg-white border border-hairline rounded-xl p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck size={28} className="text-pastel-green-ink" weight="fill" />
          <div>
            <h2 className="text-lg font-medium text-ink">Candidate Verification</h2>
            <p className="text-sm text-muted">
              {verifiedCount} of {checks.length} checks verified
            </p>
          </div>
        </div>
        <ul className="flex flex-col gap-1">
          {checks.map((check) => (
            <li key={check.label} className="flex items-center gap-3 py-3 border-b border-hairline last:border-b-0">
              {check.met ? (
                <CheckCircle size={20} className="text-pastel-green-ink shrink-0" weight="fill" />
              ) : (
                <WarningCircle size={20} className="text-pastel-yellow-ink shrink-0" weight="fill" />
              )}
              <div className="flex-1">
                <p className="text-sm text-charcoal">{check.label}</p>
                <p className="text-xs text-muted mt-0.5">{check.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-muted">
        This is a demo of what a partner employer sees on your Skill Passport when reviewing your application — it reflects real data from
        your assessment, portfolio, and challenge history.
      </p>
    </DashboardLayout>
  );
}
