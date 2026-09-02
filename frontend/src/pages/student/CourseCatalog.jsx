import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import { getCourses } from "../../services/coursesService";
import { enrollInCourse, isEnrolled } from "../../services/enrollmentsService";
import { MagnifyingGlass, Bank, Clock, ChartBar, GraduationCap } from "@phosphor-icons/react";

export default function CourseCatalog() {
  const [courses, setCourses] = useState(undefined);
  const [search, setSearch] = useState("");
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [enrollingId, setEnrollingId] = useState(null);

  useEffect(() => {
    getCourses().then(async (list) => {
      setCourses(list);
      const flags = await Promise.all(list.map((c) => isEnrolled(c.id)));
      setEnrolledIds(new Set(list.filter((_, i) => flags[i]).map((c) => c.id)));
    });
  }, []);

  const filteredCourses = useMemo(() => {
    if (!courses) return courses;
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) => c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [courses, search]);

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    try {
      await enrollInCourse(courseId);
      setEnrolledIds((prev) => new Set(prev).add(courseId));
    } finally {
      setEnrollingId(null);
    }
  };

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
        <div className="relative">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="pl-9 pr-4 py-2 border border-hairline rounded-md bg-white text-sm text-charcoal focus:border-ink focus:ring-0 outline-none w-64 transition-colors"
            placeholder="Search courses..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <section className="flex-1 flex flex-col gap-4">
        {filteredCourses && (
          <div className="flex justify-between items-center bg-white border border-hairline rounded-xl px-4 py-3">
            <span className="text-sm text-muted">Showing {filteredCourses.length} results</span>
          </div>
        )}

        {courses === undefined && <LoadingState label="Loading courses…" />}

        {filteredCourses && filteredCourses.length === 0 && (
          <EmptyState icon={GraduationCap} title="No courses match your search" description="Try a different keyword." />
        )}

        {filteredCourses && filteredCourses.length > 0 && (
          <div className="bg-white border border-hairline rounded-xl flex flex-col">
            {filteredCourses.map((course) => {
              const enrolled = enrolledIds.has(course.id);
              return (
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
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrolled || enrollingId === course.id}
                      className="bg-ink text-white px-4 py-2 rounded-md text-sm hover:bg-[#333333] active:scale-[0.98] transition-all disabled:opacity-60"
                    >
                      {enrolled ? "Enrolled ✓" : enrollingId === course.id ? "Enrolling…" : "Enroll"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
