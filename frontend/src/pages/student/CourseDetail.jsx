import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import { getCourseById } from "../../services/coursesService";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    let active = true;
    setCourse(undefined);
    getCourseById(courseId).then((data) => {
      if (active) setCourse(data);
    });
    return () => {
      active = false;
    };
  }, [courseId]);

  return (
    <DashboardLayout>
      {course === undefined && <LoadingState label="Loading course…" />}

      {course === null && (
        <EmptyState
          icon="search_off"
          title="Course not found"
          description="This course may have been removed, or the link you followed is incorrect."
          actionLabel="Back to Catalog"
          onAction={() => navigate("/courses")}
        />
      )}

      {course && (
        <>
          {/*Breadcrumb / Back*/}
          <div className="mb-lg flex items-center gap-sm font-label-md text-label-md text-on-surface-variant">
            <span
              className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors"
              onClick={() => navigate("/courses")}
            >
              arrow_back
            </span>
            <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigate("/courses")}>
              Course Catalog
            </span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-primary font-bold">{course.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/*Main Content Area*/}
            <div className="lg:col-span-8 flex flex-col gap-xl">
              {/*Header / Title block*/}
              <header className="border-b border-outline-variant pb-xl">
                <div className="flex items-center gap-md mb-md">
                  {course.category && (
                    <span className="bg-surface-container-high px-sm py-xs rounded text-on-surface font-label-sm text-label-sm border border-outline-variant">
                      {course.category}
                    </span>
                  )}
                  <span className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">schedule</span> {course.duration}
                  </span>
                  <span className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">school</span> {course.level}
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">{course.title}</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">corporate_fare</span>
                  Provided by {course.department ? `${course.department}, ` : ""}
                  {course.provider}
                </p>
              </header>

              {/*Description*/}
              {course.overview && (
                <section>
                  <h2 className="font-headline-sm text-headline-sm text-primary mb-md">Course Overview</h2>
                  <div className="font-body-md text-body-md text-on-surface flex flex-col gap-md">
                    {course.overview.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              )}

              {/*Skills*/}
              {course.skillsAcquired && (
                <section>
                  <h2 className="font-headline-sm text-headline-sm text-primary mb-md">Skills &amp; Competencies Acquired</h2>
                  <div className="flex flex-wrap gap-sm">
                    {course.skillsAcquired.map((skill) => (
                      <span
                        key={skill}
                        className="px-md py-sm rounded bg-surface-container-high border border-outline-variant font-label-md text-label-md text-on-surface"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/*Syllabus*/}
              {course.syllabus && (
                <section className="border border-outline-variant rounded bg-surface-container-lowest p-lg">
                  <h2 className="font-headline-sm text-headline-sm text-primary mb-lg border-b border-outline-variant pb-sm">
                    Syllabus Overview
                  </h2>
                  <ol className="flex flex-col">
                    {course.syllabus.map((item, i) => (
                      <li key={i} className="flex gap-md py-md border-b border-outline-variant last:border-0 last:pb-0 first:pt-0">
                        <div className="font-headline-md text-headline-md font-bold text-primary-container min-w-[32px]">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <h3 className="font-label-md text-label-md font-bold text-on-surface mb-xs">{item.title}</h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{item.description}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
            </div>

            {/*Sticky Sidebar / Action Area*/}
            <div className="lg:col-span-4">
              <div className="sticky top-margin flex flex-col gap-md border border-outline-variant bg-surface-container-lowest p-lg rounded">
                <div className="mb-sm">
                  <div className="font-headline-sm text-headline-sm text-primary mb-xs">
                    {course.enrollmentStatus || "Enrollment Open"}
                  </div>
                  {course.cohortStart && (
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Cohort begins {course.cohortStart}</div>
                  )}
                </div>
                <button className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-md px-lg rounded flex justify-center items-center gap-sm hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined">how_to_reg</span>
                  Enroll in Course
                </button>
                <button className="w-full bg-surface-container-lowest text-on-surface font-label-md text-label-md py-md px-lg rounded border border-outline-variant flex justify-center items-center gap-sm hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined">download</span>
                  Download Syllabus PDF
                </button>
                {(course.format || course.commitment || course.prerequisites) && (
                  <div className="mt-lg pt-lg border-t border-outline-variant flex flex-col gap-sm">
                    {course.format && (
                      <div className="flex justify-between items-center font-body-sm text-body-sm">
                        <span className="text-on-surface-variant">Format</span>
                        <span className="font-medium text-on-surface">{course.format}</span>
                      </div>
                    )}
                    {course.commitment && (
                      <div className="flex justify-between items-center font-body-sm text-body-sm">
                        <span className="text-on-surface-variant">Commitment</span>
                        <span className="font-medium text-on-surface">{course.commitment}</span>
                      </div>
                    )}
                    {course.prerequisites && (
                      <div className="flex justify-between items-center font-body-sm text-body-sm">
                        <span className="text-on-surface-variant">Prerequisites</span>
                        <span className="font-medium text-on-surface">{course.prerequisites}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
