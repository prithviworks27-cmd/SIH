import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import { getInternships } from "../../services/internshipsService";
import { Briefcase } from "@phosphor-icons/react";

export default function InternshipJobListings() {
  const [jobs, setJobs] = useState(undefined);

  useEffect(() => {
    getInternships().then(setJobs);
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-6">
        {/*Filter Sidebar (Left)*/}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border border-hairline rounded-xl p-5 md:sticky md:top-10">
            <h2 className="text-sm font-medium text-ink mb-4">Filters</h2>
            <div className="mb-6 border-b border-hairline pb-4">
              <h3 className="text-xs uppercase tracking-wide text-muted mb-2">Skills</h3>
              <div className="space-y-2">
                {["Python", "Java", "React", "Data Analysis"].map((skill) => (
                  <label key={skill} className="flex items-center gap-2 cursor-pointer">
                    <input className="rounded border-hairline text-ink focus:ring-ink h-4 w-4" type="checkbox" />
                    <span className="text-sm text-charcoal">{skill}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6 border-b border-hairline pb-4">
              <h3 className="text-xs uppercase tracking-wide text-muted mb-2">Location</h3>
              <div className="space-y-2">
                {["Remote", "Bangalore", "Mumbai"].map((loc) => (
                  <label key={loc} className="flex items-center gap-2 cursor-pointer">
                    <input className="rounded border-hairline text-ink focus:ring-ink h-4 w-4" type="checkbox" />
                    <span className="text-sm text-charcoal">{loc}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wide text-muted mb-2">Type</h3>
              <div className="space-y-2">
                {["Full-time", "Internship", "Part-time"].map((type, i) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input defaultChecked={i < 2} className="rounded border-hairline text-ink focus:ring-ink h-4 w-4" type="checkbox" />
                    <span className="text-sm text-charcoal">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/*Opportunities List (Right)*/}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-ink">Available Opportunities</h2>
            {jobs && <span className="text-sm text-muted">Showing {jobs.length} results</span>}
          </div>

          {jobs === undefined && <LoadingState label="Loading opportunities…" />}

          {jobs && jobs.length === 0 && (
            <EmptyState icon={Briefcase} title="No opportunities available" description="Check back soon for new listings." />
          )}

          {jobs && jobs.length > 0 && (
            <div className="space-y-3">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/internships/${job.id}`}
                  className="bg-white border border-hairline rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center hover:shadow-lift transition-shadow cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-medium text-ink">{job.title}</h3>
                      <span className="bg-bone px-2 py-0.5 rounded text-xs text-charcoal">{job.type}</span>
                    </div>
                    <p className="text-sm text-muted mb-2">
                      {job.company} • {job.location}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.map((skill) => (
                        <span key={skill} className="bg-bone px-2 py-0.5 rounded text-xs text-muted">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 border-t md:border-t-0 border-hairline pt-4 md:pt-0 mt-4 md:mt-0">
                    <div className="text-right">
                      <span className="block font-editorial text-2xl text-ink">{job.matchPercent}%</span>
                      <span className="text-xs text-muted">Match</span>
                    </div>
                    <span className="bg-ink text-white px-4 py-2 rounded-md text-sm hover:bg-[#333333] transition-colors">View Details</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
