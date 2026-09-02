import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import { getCourses } from "../../services/coursesService";
import { MagnifyingGlass, Bank, Clock, ChartBar, GraduationCap } from "@phosphor-icons/react";

export default function CourseCatalog() {
  const [courses, setCourses] = useState(undefined);

  useEffect(() => {
    getCourses().then(setCourses);
  }, []);

  return (
    <DashboardLayout>
      {/*Header*/}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-hairline pb-6">
        <div>
          <h2 className="font-editorial text-3xl text-ink tracking-tight mb-2">Course Catalog</h2>
          <p className="text-muted max-w-2xl leading-relaxed">
            Discover curated learning paths and advanced modules provided by leading institutional partners.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="pl-9 pr-4 py-2 border border-hairline rounded-md bg-white text-sm text-charcoal focus:border-ink focus:ring-0 outline-none w-64 transition-colors"
              placeholder="Search courses..."
              type="text"
            />
          </div>
          <button className="bg-ink text-white px-4 py-2 rounded-md text-sm hover:bg-[#333333] active:scale-[0.98] transition-all">Search</button>
        </div>
      </header>

      {/*Filters + Course List*/}
      <div className="flex flex-col md:flex-row gap-6">
        {/*Left Filter Sidebar*/}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border border-hairline rounded-xl p-5">
            <h3 className="text-sm font-medium text-ink mb-4 border-b border-hairline pb-3">Filters</h3>
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-wide text-muted mb-2">Skill Category</h4>
              <div className="flex flex-col gap-2">
                {["Data Science", "Material Engineering", "Quantum Computing", "Bioinformatics"].map((c, i) => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer">
                    <input defaultChecked={i === 0} className="rounded border-hairline text-ink focus:ring-0" type="checkbox" />
                    <span className="text-sm text-charcoal">{c}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-wide text-muted mb-2">Duration</h4>
              <div className="flex flex-col gap-2">
                {["Short (< 4 weeks)", "Medium (4-8 weeks)", "Extensive (8+ weeks)"].map((d, i) => (
                  <label key={d} className="flex items-center gap-2 cursor-pointer">
                    <input defaultChecked={i === 1} className="rounded border-hairline text-ink focus:ring-0" type="checkbox" />
                    <span className="text-sm text-charcoal">{d}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wide text-muted mb-2">Provider</h4>
              <div className="flex flex-col gap-2">
                {["Zurich Institute of Technology", "Global Research Consortium", "TechCorp Academy"].map((p, i) => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer">
                    <input defaultChecked={i === 1} className="rounded border-hairline text-ink focus:ring-0" type="checkbox" />
                    <span className="text-sm text-charcoal">{p}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/*Course List Area*/}
        <section className="flex-1 flex flex-col gap-4">
          {courses && (
            <div className="flex justify-between items-center bg-white border border-hairline rounded-xl px-4 py-3">
              <span className="text-sm text-muted">Showing {courses.length} results</span>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wide text-muted">Sort by:</span>
                <select className="border border-hairline rounded-md bg-white text-sm text-charcoal focus:border-ink focus:ring-0 outline-none py-1 pl-2 pr-8">
                  <option>Relevance</option>
                  <option>Newest</option>
                  <option>Duration (Low to High)</option>
                </select>
              </div>
            </div>
          )}

          {courses === undefined && <LoadingState label="Loading courses…" />}

          {courses && courses.length === 0 && (
            <EmptyState icon={GraduationCap} title="No courses available" description="Check back soon for new course listings." />
          )}

          {courses && courses.length > 0 && (
            <div className="bg-white border border-hairline rounded-xl flex flex-col">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 border-b border-hairline last:border-b-0 hover:bg-bone transition-colors"
                >
                  <div className="flex-1 mb-3 md:mb-0">
                    <h3 className="text-base font-medium text-ink mb-1.5">{course.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-2">
                      <span className="flex items-center gap-1.5">
                        <Bank size={14} /> {course.provider}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ChartBar size={14} /> {course.level}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {course.tags.map((tag) => (
                        <span key={tag} className="bg-bone px-2 py-0.5 rounded text-xs text-charcoal">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-3">
                    <Link to={`/courses/${course.id}`} className="text-ink text-sm hover:underline">
                      View Details
                    </Link>
                    <button className="bg-ink text-white px-4 py-2 rounded-md text-sm hover:bg-[#333333] active:scale-[0.98] transition-all">Enroll</button>
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
