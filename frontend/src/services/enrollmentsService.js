import { resolveMock } from "./mockClient";

const STORAGE_KEY = "courseEnrollments";

function loadEnrolled() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // best-effort — enrollment just won't survive a reload if storage is unavailable
  }
}

export async function isEnrolled(courseId) {
  return resolveMock(loadEnrolled().includes(courseId), { delay: 0 });
}

export async function enrollInCourse(courseId) {
  const enrolled = loadEnrolled();
  if (!enrolled.includes(courseId)) {
    persist([...enrolled, courseId]);
  }
  return resolveMock(true, { delay: 400 });
}
