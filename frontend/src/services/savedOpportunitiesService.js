import { resolveMock } from "./mockClient";
import { studentStateAPI } from "./api";
import { getInternshipById } from "./internshipsService";

// "Save for Later" — a real per-user record in Supabase's saved_opportunities
// table (see matching_profile_schema.sql), with localStorage as a same-tab
// cache/offline fallback, same resilience pattern as every other migrated
// service. Previously the Save for Later button just navigated away and
// persisted nothing.
const STORAGE_KEY = "savedOpportunityIds";

function loadStoredLocally() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistLocally(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // best-effort — saved state just won't survive a reload if storage is unavailable
  }
}

export async function getSavedOpportunityIds() {
  try {
    const { opportunityIds } = await studentStateAPI.getSavedOpportunityIds();
    persistLocally(opportunityIds);
    return resolveMock(opportunityIds);
  } catch (err) {
    console.warn("Could not load saved opportunities from backend, using local cache only:", err.message);
    return resolveMock(loadStoredLocally());
  }
}

export async function saveOpportunity(opportunityId) {
  const next = Array.from(new Set([...loadStoredLocally(), opportunityId]));
  persistLocally(next);
  try {
    await studentStateAPI.saveOpportunity(opportunityId);
  } catch (err) {
    console.warn("Could not sync saved opportunity to backend, kept in local cache only:", err.message);
  }
  return resolveMock(next, { delay: 200 });
}

export async function unsaveOpportunity(opportunityId) {
  const next = loadStoredLocally().filter((id) => id !== opportunityId);
  persistLocally(next);
  try {
    await studentStateAPI.unsaveOpportunity(opportunityId);
  } catch (err) {
    console.warn("Could not sync removed saved opportunity to backend, kept in local cache only:", err.message);
  }
  return resolveMock(next, { delay: 200 });
}

export function isOpportunitySaved(opportunityId, savedIds) {
  return savedIds?.includes(opportunityId) ?? false;
}

// Full opportunity records for the student's saved list — same lookup path
// listings/detail pages use (getInternshipById), so a saved opportunity that
// closed/was removed is handled the same way everywhere (returns null,
// filtered out) rather than showing a stale stub.
export async function getSavedOpportunities() {
  const ids = await getSavedOpportunityIds();
  const all = await Promise.all(ids.map((id) => getInternshipById(id)));
  return all.filter(Boolean);
}

// Convenience for a listings page that already loaded the full job list —
// avoids an extra getInternshipById round-trip per job.
export async function getSavedOpportunitiesFrom(jobs) {
  const ids = new Set(await getSavedOpportunityIds());
  return (jobs ?? []).filter((job) => ids.has(job.id));
}
