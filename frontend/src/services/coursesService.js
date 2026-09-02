import { resolveMock } from "./mockClient";
import { courses } from "./mockData/courses";

export async function getCourses() {
  return resolveMock(courses);
}

export async function getCourseById(courseId) {
  const course = courses.find((c) => c.id === courseId);
  return resolveMock(course ?? null);
}
