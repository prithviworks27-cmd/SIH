import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import { getInternshipById } from "../../services/internshipsService";

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
          icon="search_off"
          title="Opportunity not found"
          description="This internship or job may have closed, or the link you followed is incorrect."
          actionLabel="Back to Internships/Jobs"
          onAction={() => navigate("/internships")}
        />
      )}

      {job && (
        <div className="max-w-4xl mx-auto w-full">
          <button
            className="inline-flex items-center gap-sm text-secondary hover:text-primary transition-colors font-body-sm text-body-sm mb-lg"
            onClick={() => navigate("/internships")}
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Internships
          </button>

          <header className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-lg mb-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
            <div className="flex items-center gap-lg">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">{job.title}</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant flex items-center gap-sm">
                  <span className="material-symbols-outlined text-[20px]">domain</span>
                  {job.company}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-md w-full md:w-auto">
              <div className="flex items-center gap-sm font-label-md text-label-md text-primary">
                <span className="material-symbols-outlined text-[20px] text-green-700">check_circle</span>
                <span>{job.matchPercent}% Skill Match</span>
              </div>
              <button className="bg-primary-container text-white px-lg py-sm rounded-DEFAULT font-label-md text-label-md hover:bg-opacity-90 transition-opacity w-full md:w-auto">
                Apply Now
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            <div className="lg:col-span-2 space-y-lg">
              {job.overview && (
                <section className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-lg">
                  <h2 className="font-headline-md text-headline-md text-primary mb-md border-b border-outline-variant pb-sm">
                    Overview
                  </h2>
                  <div className="space-y-md font-body-md text-body-md text-on-surface">
                    {job.overview.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                    {job.responsibilities && (
                      <>
                        <h3 className="font-headline-sm text-headline-sm text-primary mt-lg mb-sm">Key Responsibilities</h3>
                        <ul className="list-disc pl-lg space-y-sm text-on-surface-variant">
                          {job.responsibilities.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </section>
              )}

              <section className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-lg">
                <h2 className="font-headline-md text-headline-md text-primary mb-md border-b border-outline-variant pb-sm">
                  Required Competencies
                </h2>
                <div className="flex flex-wrap gap-sm">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-surface-container-high text-on-background px-md py-xs rounded-sm font-label-sm text-label-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-lg">
              <aside className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-lg">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-md border-b border-outline-variant pb-sm">
                  Details
                </h3>
                <ul className="space-y-md font-body-sm text-body-sm">
                  <li className="flex items-start gap-md">
                    <span className="material-symbols-outlined text-outline">location_on</span>
                    <div>
                      <span className="block font-label-md text-label-md text-on-surface">Location</span>
                      <span className="text-on-surface-variant">{job.location}</span>
                    </div>
                  </li>
                  {job.duration && (
                    <li className="flex items-start gap-md">
                      <span className="material-symbols-outlined text-outline">calendar_month</span>
                      <div>
                        <span className="block font-label-md text-label-md text-on-surface">Duration</span>
                        <span className="text-on-surface-variant">{job.duration}</span>
                      </div>
                    </li>
                  )}
                  {job.stipend && (
                    <li className="flex items-start gap-md">
                      <span className="material-symbols-outlined text-outline">payments</span>
                      <div>
                        <span className="block font-label-md text-label-md text-on-surface">Compensation</span>
                        <span className="text-on-surface-variant">{job.stipend}</span>
                      </div>
                    </li>
                  )}
                  {job.commitment && (
                    <li className="flex items-start gap-md">
                      <span className="material-symbols-outlined text-outline">schedule</span>
                      <div>
                        <span className="block font-label-md text-label-md text-on-surface">Commitment</span>
                        <span className="text-on-surface-variant">{job.commitment}</span>
                      </div>
                    </li>
                  )}
                </ul>
              </aside>

              {job.aboutCompany && (
                <aside className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-lg">
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-md border-b border-outline-variant pb-sm">
                    About the Partner
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{job.aboutCompany}</p>
                </aside>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
