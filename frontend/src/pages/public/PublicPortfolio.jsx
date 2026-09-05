import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CertificationStatusBadge from "../../components/common/CertificationStatusBadge";
import { getPublicPortfolio } from "../../services/api";
import { WarningCircle } from "@phosphor-icons/react";
import logo from "../../assets/logo.png";

// The real public share page behind /passport/:userId — replaces the old
// fake https://skillbridge.edu/passport/{...} link that pointed nowhere.
// Unauthenticated by design: this is what an employer clicks from a resume
// or application without needing a SkillBridge account.
export default function PublicPortfolio() {
  const { userId } = useParams();
  const [data, setData] = useState(undefined); // undefined = loading, null = not found/private, error string = other failure
  const [error, setError] = useState("");

  useEffect(() => {
    getPublicPortfolio(userId)
      .then(setData)
      .catch((err) => {
        setData(null);
        setError(err.status === 403 ? "This student has not made their portfolio public." : "Portfolio not found.");
      });
  }, [userId]);

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-hairline bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-2">
          <img src={logo} alt="SkillBridge" className="h-7" />
          <span className="text-sm text-muted">Skill Passport</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {data === undefined && <p className="text-sm text-muted text-center py-20">Loading…</p>}

        {data === null && (
          <div className="flex flex-col items-center justify-center text-center gap-3 py-24">
            <WarningCircle size={32} className="text-muted" />
            <p className="text-base font-medium text-ink">{error}</p>
          </div>
        )}

        {data && (
          <>
            <section className="bg-white border border-hairline rounded-xl p-8 mb-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {data.basics?.avatarUrl && (
                  <img className="w-24 h-24 rounded-full object-cover border border-hairline" alt={data.name} src={data.basics.avatarUrl} />
                )}
                <div>
                  <h1 className="font-geist text-3xl text-ink tracking-tight mb-1">{data.name}</h1>
                  {(data.basics?.headline || data.basics?.institution) && (
                    <p className="text-muted mb-2">
                      {data.basics?.headline}
                      {data.basics?.headline && data.basics?.institution && " · "}
                      {data.basics?.institution}
                    </p>
                  )}
                  {data.basics?.bio && <p className="text-charcoal max-w-2xl leading-relaxed">{data.basics.bio}</p>}
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 flex flex-col gap-6">
                <section className="bg-white border border-hairline rounded-xl p-6">
                  <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Certifications</h3>
                  {data.certifications.length === 0 && <p className="text-sm text-muted">No certifications listed.</p>}
                  <ul className="flex flex-col gap-4">
                    {data.certifications.map((c) => (
                      <li key={c.id} className="border-b border-hairline pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="text-sm text-ink">{c.title}</p>
                          <CertificationStatusBadge status={c.verificationStatus} />
                        </div>
                        <p className="text-xs text-muted mt-0.5">
                          {c.issuer}
                          {c.date && ` • ${new Date(c.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`}
                        </p>
                        {c.fileUrl && (
                          <a href={c.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-ink hover:underline mt-1 inline-block">
                            View certificate
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="lg:col-span-2 flex flex-col gap-6">
                <section>
                  <h3 className="text-base font-medium text-ink mb-4">Projects</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.projects.length === 0 && <p className="text-sm text-muted">No projects listed.</p>}
                    {data.projects.map((p) => (
                      <div key={p.id} className="bg-white border border-hairline rounded-xl p-5">
                        <h4 className="text-sm font-medium text-ink mb-1">{p.title}</h4>
                        <p className="text-sm text-muted mb-3 leading-relaxed">{p.description}</p>
                        <div className="flex gap-1.5 flex-wrap">
                          {(p.skills ?? []).map((skill) => (
                            <span key={skill} className="bg-bone text-charcoal px-2 py-0.5 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <section className="bg-white border border-hairline rounded-xl p-6">
                    <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Internships</h3>
                    {data.internships.length === 0 && <p className="text-sm text-muted">No internships listed.</p>}
                    <ul className="flex flex-col gap-4">
                      {data.internships.map((i) => (
                        <li key={i.id} className="border-b border-hairline pb-4 last:border-b-0 last:pb-0">
                          <p className="text-sm text-ink">{i.role}</p>
                          <p className="text-xs text-muted mt-0.5">
                            {i.company} • {i.period}
                          </p>
                          {i.note && <p className="text-xs text-charcoal mt-1.5">{i.note}</p>}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section className="bg-white border border-hairline rounded-xl p-6">
                    <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Achievements</h3>
                    {data.achievements.length === 0 && <p className="text-sm text-muted">No achievements listed.</p>}
                    <ul className="flex flex-col gap-3 list-disc list-inside text-sm text-charcoal">
                      {data.achievements.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
