import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import SkillTrustBadge from "../../components/common/SkillTrustBadge";
import SkillEvidencePanel from "../../components/common/SkillEvidencePanel";
import { useAuth } from "../../hooks/useAuth";
import { getSkillProfile } from "../../services/skillsService";
import { getPortfolio } from "../../services/portfolioService";
import { ShareNetwork, X } from "@phosphor-icons/react";

export default function DigitalPortfolio() {
  const { user } = useAuth();
  const [skillProfile, setSkillProfile] = useState(undefined);
  const [portfolio, setPortfolio] = useState(undefined);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    getSkillProfile().then(setSkillProfile);
    getPortfolio().then(setPortfolio);
  }, []);

  if (!skillProfile || !portfolio) {
    return (
      <DashboardLayout>
        <LoadingState fullScreen={false} label="Loading portfolio…" />
      </DashboardLayout>
    );
  }

  const displayedSkills = skillProfile.strongSkills.length > 0 ? skillProfile.strongSkills : skillProfile.profile.slice(0, 6);
  const shareUrl = `https://academialink.edu/passport/${(user?.email || "student").split("@")[0]}`;

  return (
    <DashboardLayout>
      {/*Top Bar / Actions*/}
      <div className="flex justify-between items-center mb-6">
        <div />
        <div className="flex gap-3">
          <Link to="/portfolio/edit" className="border border-hairline text-charcoal px-4 py-2 rounded-md text-sm hover:bg-bone transition-colors">
            Edit Portfolio
          </Link>
          <button
            onClick={() => setShareModalOpen(true)}
            className="bg-ink text-white px-4 py-2 rounded-md text-sm hover:bg-[#333333] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <ShareNetwork size={16} />
            Share Portfolio
          </button>
        </div>
      </div>

      {/*Profile Header*/}
      <section className="bg-white border border-hairline rounded-xl p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <img className="w-28 h-28 rounded-full object-cover border border-hairline" alt={user?.name || "Student"} src={portfolio.avatarUrl} />
          <div>
            <h2 className="font-editorial text-3xl text-ink tracking-tight mb-1">{user?.name || "Student"}</h2>
            <p className="text-muted mb-2">
              {portfolio.headline} · {portfolio.institution}
            </p>
            <p className="text-charcoal max-w-2xl leading-relaxed">{portfolio.bio}</p>
          </div>
        </div>
      </section>

      {/*Bento Grid Layout for Sections*/}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/*Left Column: Skills & Certifications*/}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/*Verified Skills*/}
          <section className="bg-white border border-hairline rounded-xl p-6">
            <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Skills &amp; Trust Levels</h3>
            <div className="flex flex-col gap-3">
              {displayedSkills.map((skill, i) => (
                <button
                  key={skill.name}
                  onClick={() => setSelectedSkill(skill)}
                  className={`flex justify-between items-center py-2 text-left hover:opacity-70 transition-opacity ${
                    i < displayedSkills.length - 1 ? "border-b border-hairline" : ""
                  }`}
                >
                  <span className="text-sm font-medium text-charcoal">{skill.name}</span>
                  <SkillTrustBadge trustLevel={skill.trustLevel} />
                </button>
              ))}
            </div>
          </section>
          {/*Certifications*/}
          <section className="bg-white border border-hairline rounded-xl p-6">
            <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Certifications</h3>
            <ul className="flex flex-col gap-4">
              {portfolio.certifications.length === 0 && <p className="text-sm text-muted">No certifications added yet.</p>}
              {portfolio.certifications.map((cert) => (
                <li key={cert.id} className="border-b border-hairline pb-4 last:border-b-0 last:pb-0">
                  <p className="text-sm text-ink">{cert.title}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {cert.issuer} • {new Date(cert.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
        {/*Right Column: Projects, Internships, Achievements*/}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/*Projects*/}
          <section>
            <h3 className="text-base font-medium text-ink mb-4">Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.projects.map((project) => (
                <div key={project.id} className="bg-white border border-hairline rounded-xl p-5 hover:shadow-lift transition-shadow">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h4 className="text-sm font-medium text-ink">{project.title}</h4>
                    <SkillTrustBadge trustLevel={project.trustLevel} />
                  </div>
                  <p className="text-sm text-muted mb-3 leading-relaxed">{project.description}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {project.skills.map((skill) => (
                      <span key={skill} className="bg-bone text-charcoal px-2 py-0.5 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/*Internships & Achievements Grid*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/*Internships*/}
            <section className="bg-white border border-hairline rounded-xl p-6">
              <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Internships</h3>
              <ul className="flex flex-col gap-4">
                {portfolio.internships.length === 0 && <p className="text-sm text-muted">No internships added yet.</p>}
                {portfolio.internships.map((item) => (
                  <li key={item.id} className="border-b border-hairline pb-4 last:border-b-0 last:pb-0">
                    <p className="text-sm text-ink">{item.role}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {item.company} • {item.period}
                    </p>
                    {item.note && <p className="text-xs text-charcoal mt-1.5">{item.note}</p>}
                  </li>
                ))}
              </ul>
            </section>
            {/*Achievements*/}
            <section className="bg-white border border-hairline rounded-xl p-6">
              <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Achievements</h3>
              <ul className="flex flex-col gap-3 list-disc list-inside text-sm text-charcoal">
                {portfolio.achievements.length === 0 && <p className="text-sm text-muted list-none">No achievements added yet.</p>}
                {portfolio.achievements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>

      {selectedSkill && <SkillEvidencePanel skill={selectedSkill} portfolio={portfolio} onClose={() => setSelectedSkill(null)} />}

      {/*Share Modal*/}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-[#1A1A1A]/20 z-50 flex items-center justify-center p-4" onClick={() => setShareModalOpen(false)}>
          <div className="bg-white border border-hairline rounded-xl p-8 max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShareModalOpen(false)} className="absolute top-4 right-4 text-muted hover:text-ink">
              <X size={18} />
            </button>
            <h3 className="text-lg font-medium text-ink mb-4 text-center">Share Skill Passport</h3>
            <div className="flex gap-2">
              <input
                className="flex-grow border border-hairline bg-white rounded-md px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-ink"
                readOnly
                type="text"
                value={shareUrl}
                onFocus={(e) => e.target.select()}
              />
              <button
                onClick={() => navigator.clipboard?.writeText(shareUrl)}
                className="border border-hairline text-charcoal px-4 py-2 rounded-md text-sm hover:bg-bone transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
