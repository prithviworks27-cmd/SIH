import { resolveMock } from "./mockClient";
import { studentStateAPI } from "./api";

const STORAGE_KEY = "courseEnrollments";

function loadEnrolledLocally() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistLocally(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // best-effort — enrollment just won't survive a reload if storage is unavailable
  }
}

export async function isEnrolled(courseId) {
  try {
    const { courseIds } = await studentStateAPI.getEnrolledCourseIds();
    persistLocally(courseIds);
    return resolveMock(courseIds.includes(courseId), { delay: 0 });
  } catch (err) {
    console.warn("Could not load enrollments from backend, using local cache only:", err.message);
    return resolveMock(loadEnrolledLocally().includes(courseId), { delay: 0 });
  }
}

export async function enrollInCourse(courseId) {
  const enrolled = loadEnrolledLocally();
  if (!enrolled.includes(courseId)) {
    persistLocally([...enrolled, courseId]);
  }

  try {
    await studentStateAPI.enrollInCourse(courseId);
  } catch (err) {
    console.warn(`Could not sync enrollment in ${courseId} to backend:`, err.message);
  }

  return resolveMock(true, { delay: 400 });
}
