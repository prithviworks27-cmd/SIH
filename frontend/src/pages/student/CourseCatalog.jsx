import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import { getCourses } from "../../services/coursesService";

export default function CourseCatalog() {
  const [courses, setCourses] = useState(undefined);

  useEffect(() => {
    getCourses().then(setCourses);
  }, []);

  return (
    <DashboardLayout>
      {/*Header*/}
      <header className="mb-xl flex flex-col md:flex-row justify-between items-start md:items-end gap-md border-b border-outline-variant pb-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-sm">Course Catalog</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Discover curated learning paths and advanced modules provided by leading institutional partners.
          </p>
        </div>
        <div className="flex gap-md">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="pl-[36px] pr-md py-[6px] border border-outline-variant rounded bg-surface-container-lowest font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-0 focus:outline-none w-64"
              placeholder="Search courses..."
              type="text"
            />
          </div>
          <button className="bg-primary-container text-white px-md py-[6px] rounded font-label-md text-label-md">Search</button>
        </div>
      </header>

      {/*Filters + Course List*/}
      <div className="flex flex-col md:flex-row gap-gutter">
        {/*Left Filter Sidebar*/}
        <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-surface-container-lowest border border-outline-variant rounded p-md">
              <h3 className="font-headline-sm text-headline-sm text-primary mb-md border-b border-outline-variant pb-sm">Filters</h3>
              <div className="mb-lg">
                <h4 className="font-label-md text-label-md text-on-surface mb-sm">Skill Category</h4>
                <div className="flex flex-col gap-xs">
                  {["Data Science", "Material Engineering", "Quantum Computing", "Bioinformatics"].map((c, i) => (
                    <label key={c} className="flex items-center gap-sm cursor-pointer">
                      <input defaultChecked={i === 0} className="rounded border-outline-variant text-primary focus:ring-0" type="checkbox" />
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{c}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-lg">
                <h4 className="font-label-md text-label-md text-on-surface mb-sm">Duration</h4>
                <div className="flex flex-col gap-xs">
                  {["Short (< 4 weeks)", "Medium (4-8 weeks)", "Extensive (8+ weeks)"].map((d, i) => (
                    <label key={d} className="flex items-center gap-sm cursor-pointer">
                      <input defaultChecked={i === 1} className="rounded border-outline-variant text-primary focus:ring-0" type="checkbox" />
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{d}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-label-md text-label-md text-on-surface mb-sm">Provider</h4>
                <div className="flex flex-col gap-xs">
                  {["Zurich Institute of Technology", "Global Research Consortium", "TechCorp Academy"].map((p, i) => (
                    <label key={p} className="flex items-center gap-sm cursor-pointer">
                      <input defaultChecked={i === 1} className="rounded border-outline-variant text-primary focus:ring-0" type="checkbox" />
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/*Course List Area*/}
          <section className="flex-1 flex flex-col gap-md">
            {courses && (
              <div className="flex justify-between items-center bg-surface-container-lowest border border-outline-variant rounded px-md py-sm">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Showing {courses.length} results</span>
                <div className="flex items-center gap-sm">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Sort by:</span>
                  <select className="border border-outline-variant rounded bg-surface-container-lowest font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-0 focus:outline-none py-1 pl-2 pr-8">
                    <option>Relevance</option>
                    <option>Newest</option>
                    <option>Duration (Low to High)</option>
                  </select>
                </div>
              </div>
            )}

            {courses === undefined && <LoadingState label="Loading courses…" />}

            {courses && courses.length === 0 && (
              <EmptyState icon="school" title="No courses available" description="Check back soon for new course listings." />
            )}

            {courses && courses.length > 0 && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded flex flex-col">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-md border-b border-outline-variant last:border-b-0 hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex-1 mb-sm md:mb-0">
                      <h3 className="font-headline-sm text-headline-sm text-primary mb-xs">{course.title}</h3>
                      <div className="flex flex-wrap items-center gap-md font-body-sm text-body-sm text-on-surface-variant mb-sm">
                        <span className="flex items-center gap-[2px]">
                          <span className="material-symbols-outlined text-[16px]">account_balance</span> {course.provider}
                        </span>
                        <span className="flex items-center gap-[2px]">
                          <span className="material-symbols-outlined text-[16px]">schedule</span> {course.duration}
                        </span>
                        <span className="flex items-center gap-[2px]">
                          <span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span> {course.level}
                        </span>
                      </div>
                      <div className="flex gap-sm">
                        {course.tags.map((tag) => (
                          <span key={tag} className="bg-surface-container-high px-sm py-[2px] rounded-sm font-label-sm text-label-sm text-on-background">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-sm">
                      <Link to={`/courses/${course.id}`} className="text-primary font-label-md text-label-md hover:underline">
                        View Details
                      </Link>
                      <button className="bg-primary-container text-white px-md py-[6px] rounded font-label-md text-label-md">Enroll</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
      </div>
    </DashboardLayout>
  );
}
