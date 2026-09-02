import { resolveMock } from "./mockClient";
import { internships as seedInternships } from "./mockData/internships";

// Shared opportunity store for BOTH sides of the platform: internships.js
// seeds the initial catalog, and anything an industry user posts (see
// opportunitiesService.createOpportunity) is layered on top via localStorage.
// Students browsing /internships and industry managing /industry/opportunities
// read the exact same underlying list — a posted opportunity really does
// show up for students, it isn't two disconnected mock datasets.
const STORAGE_KEY = "postedOpportunities";

function loadPosted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function persistPosted(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // best-effort — posted opportunities just won't survive a reload if storage is unavailable
  }
}

function allOpportunities() {
  const posted = loadPosted();
  // Posted opportunities are shown first (newest activity), seed data after.
  return [...posted, ...seedInternships];
}

export async function getInternships() {
  return resolveMock(allOpportunities().filter((o) => (o.status ?? "Active") === "Active"));
}

export async function getInternshipById(jobId) {
  const internship = allOpportunities().find((j) => j.id === jobId);
  return resolveMock(internship ?? null);
}

// Industry-side reads: unlike getInternships(), this returns every status
// (Active/Draft/Closed) since the manage-opportunities view needs all of them.
export async function getAllOpportunitiesIncludingInactive() {
  return resolveMock(allOpportunities());
}
