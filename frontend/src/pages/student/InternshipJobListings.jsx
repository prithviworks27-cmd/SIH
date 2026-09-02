import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import { getInternships } from "../../services/internshipsService";

export default function InternshipJobListings() {
  const [jobs, setJobs] = useState(undefined);

  useEffect(() => {
    getInternships().then(setJobs);
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-lg">
        {/*Filter Sidebar (Left)*/}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-md md:sticky md:top-margin">
            <h2 className="font-headline-sm text-headline-sm font-medium text-on-surface mb-md">Filters</h2>
            <div className="mb-lg border-b border-outline-variant pb-md">
              <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm">Skills</h3>
              <div className="space-y-sm">
                {["Python", "Java", "React", "Data Analysis"].map((skill) => (
                  <label key={skill} className="flex items-center gap-sm cursor-pointer">
                    <input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox" />
                    <span className="font-body-sm text-body-sm text-on-surface">{skill}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-lg border-b border-outline-variant pb-md">
              <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm">Location</h3>
              <div className="space-y-sm">
                {["Remote", "Bangalore", "Mumbai"].map((loc) => (
                  <label key={loc} className="flex items-center gap-sm cursor-pointer">
                    <input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox" />
                    <span className="font-body-sm text-body-sm text-on-surface">{loc}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface-variant mb-sm">Type</h3>
              <div className="space-y-sm">
                {["Full-time", "Internship", "Part-time"].map((type, i) => (
                  <label key={type} className="flex items-center gap-sm cursor-pointer">
                    <input defaultChecked={i < 2} className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox" />
                    <span className="font-body-sm text-body-sm text-on-surface">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/*Opportunities List (Right)*/}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-headline-md text-headline-md font-medium text-on-surface">Available Opportunities</h2>
            {jobs && <span className="font-body-sm text-body-sm text-on-surface-variant">Showing {jobs.length} results</span>}
          </div>

          {jobs === undefined && <LoadingState label="Loading opportunities…" />}

          {jobs && jobs.length === 0 && (
            <EmptyState icon="work_off" title="No opportunities available" description="Check back soon for new listings." />
          )}

          {jobs && jobs.length > 0 && (
            <div className="space-y-md">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/internships/${job.id}`}
                  className="bg-surface-container-lowest border border-outline-variant rounded p-md flex flex-col md:flex-row gap-md items-start md:items-center hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-sm mb-xs">
                      <h3 className="font-headline-sm text-headline-sm font-medium text-primary">{job.title}</h3>
                      <span className="bg-surface-container px-sm py-xs rounded-sm font-label-sm text-label-sm text-on-surface">{job.type}</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-sm">
                      {job.company} • {job.location}
                    </p>
                    <div className="flex flex-wrap gap-xs">
                      {job.skills.map((skill) => (
                        <span key={skill} className="bg-surface-container-high px-sm py-xs rounded font-label-sm text-label-sm text-on-surface-variant">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-md border-t md:border-t-0 border-outline-variant pt-md md:pt-0 mt-md md:mt-0">
                    <div className="text-right">
                      <span className="block font-headline-md text-headline-md text-primary font-bold">{job.matchPercent}%</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Match</span>
                    </div>
                    <span className="bg-primary-container text-on-primary px-md py-sm rounded font-label-md text-label-md hover:bg-primary transition-colors">
                      View Details
                    </span>
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
