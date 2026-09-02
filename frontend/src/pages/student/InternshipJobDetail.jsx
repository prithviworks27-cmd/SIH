import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import { getInternshipById } from "../../services/internshipsService";
import { ArrowLeft, Buildings, CheckCircle, MapPin, CalendarBlank, Money, Clock, MagnifyingGlass } from "@phosphor-icons/react";

export default function InternshipJobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    let active = true;
    setJob(undefined);
    getInternshipById(jobId).then((data) => {
      if (active) setJob(data);
    });
    return () => {
      active = false;
    };
  }, [jobId]);

  return (
    <DashboardLayout>
      {job === undefined && <LoadingState label="Loading opportunity…" />}

      {job === null && (
        <EmptyState
          icon={MagnifyingGlass}
          title="Opportunity not found"
          description="This internship or job may have closed, or the link you followed is incorrect."
          actionLabel="Back to Internships/Jobs"
          onAction={() => navigate("/internships")}
        />
      )}

      {job && (
        <div className="max-w-4xl mx-auto w-full">
          <button
            className="inline-flex items-center gap-2 text-muted hover:text-ink transition-colors text-sm mb-6"
            onClick={() => navigate("/internships")}
          >
            <ArrowLeft size={16} />
            Back to Internships
          </button>

          <header className="bg-white border border-hairline rounded-xl p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="font-editorial text-2xl text-ink tracking-tight mb-2">{job.title}</h1>
                <p className="text-muted flex items-center gap-2">
                  <Buildings size={18} />
                  {job.company}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-sm text-pastel-green-ink">
                <CheckCircle size={18} weight="fill" />
                <span>{job.matchPercent}% Skill Match</span>
              </div>
              <button className="bg-ink text-white px-6 py-2.5 rounded-md text-sm hover:bg-[#333333] active:scale-[0.98] transition-all w-full md:w-auto">
                Apply Now
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {job.overview && (
                <section className="bg-white border border-hairline rounded-xl p-8">
                  <h2 className="text-lg font-medium text-ink mb-4 border-b border-hairline pb-3">Overview</h2>
                  <div className="space-y-4 text-charcoal leading-relaxed">
                    {job.overview.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                    {job.responsibilities && (
                      <>
                        <h3 className="text-base font-medium text-ink mt-6 mb-2">Key Responsibilities</h3>
                        <ul className="list-disc pl-5 space-y-2 text-muted">
                          {job.responsibilities.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </section>
              )}

              <section className="bg-white border border-hairline rounded-xl p-8">
                <h2 className="text-lg font-medium text-ink mb-4 border-b border-hairline pb-3">Required Competencies</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill} className="bg-bone text-charcoal px-3 py-1.5 rounded-md text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <aside className="bg-white border border-hairline rounded-xl p-6">
                <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Details</h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <MapPin size={18} className="text-muted" />
                    <div>
                      <span className="block text-xs uppercase tracking-wide text-muted mb-0.5">Location</span>
                      <span className="text-charcoal">{job.location}</span>
                    </div>
                  </li>
                  {job.duration && (
                    <li className="flex items-start gap-3">
                      <CalendarBlank size={18} className="text-muted" />
                      <div>
                        <span className="block text-xs uppercase tracking-wide text-muted mb-0.5">Duration</span>
                        <span className="text-charcoal">{job.duration}</span>
                      </div>
                    </li>
                  )}
                  {job.stipend && (
                    <li className="flex items-start gap-3">
                      <Money size={18} className="text-muted" />
                      <div>
                        <span className="block text-xs uppercase tracking-wide text-muted mb-0.5">Compensation</span>
                        <span className="text-charcoal">{job.stipend}</span>
                      </div>
                    </li>
                  )}
                  {job.commitment && (
                    <li className="flex items-start gap-3">
                      <Clock size={18} className="text-muted" />
                      <div>
                        <span className="block text-xs uppercase tracking-wide text-muted mb-0.5">Commitment</span>
                        <span className="text-charcoal">{job.commitment}</span>
                      </div>
                    </li>
                  )}
                </ul>
              </aside>

              {job.aboutCompany && (
                <aside className="bg-white border border-hairline rounded-xl p-6">
                  <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">About the Partner</h3>
                  <p className="text-sm text-muted leading-relaxed">{job.aboutCompany}</p>
                </aside>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
