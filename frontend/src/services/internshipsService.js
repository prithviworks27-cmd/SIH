import { resolveMock } from "./mockClient";
import { internships as seedInternships } from "./mockData/internships";
import { industryAPI } from "./api";

// Shared opportunity store for BOTH sides of the platform: internships.js
// seeds the initial catalog, and anything an industry user posts (see
// opportunitiesService.createOpportunity) is layered on top — now from
// Supabase's opportunities table (readable by any authenticated user) with
// localStorage as a same-tab cache/offline fallback. Students browsing
// /internships and industry managing /industry/opportunities read the exact
// same underlying list — a posted opportunity really does show up for
// students, it isn't two disconnected datasets.
const STORAGE_KEY = "postedOpportunities";

function loadPostedLocally() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function persistPostedLocally(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // best-effort — posted opportunities just won't survive a reload if storage is unavailable
  }
}

async function loadPosted() {
  try {
    const { opportunities } = await industryAPI.getPostedOpportunities();
    persistPostedLocally(opportunities);
    return opportunities;
  } catch (err) {
    console.warn("Could not load posted opportunities from backend, using local cache only:", err.message);
    return loadPostedLocally();
  }
}

async function allOpportunities() {
  const posted = await loadPosted();
  // Posted opportunities are shown first (newest activity), seed data after.
  return [...posted, ...seedInternships];
}

export async function getInternships() {
  const all = await allOpportunities();
  return resolveMock(all.filter((o) => (o.status ?? "Active") === "Active"));
}

export async function getInternshipById(jobId) {
  const all = await allOpportunities();
  const internship = all.find((j) => j.id === jobId);
  return resolveMock(internship ?? null);
}

// Industry-side reads: unlike getInternships(), this returns every status
// (Active/Draft/Closed) since the manage-opportunities view needs all of them.
export async function getAllOpportunitiesIncludingInactive() {
  return resolveMock(await allOpportunities());
}
