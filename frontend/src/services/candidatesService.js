import { resolveMock } from "./mockClient";
import { candidates } from "./mockData/candidates";

export async function getCandidates() {
  return resolveMock(candidates);
}

export async function getCandidateById(candidateId) {
  const candidate = candidates.find((c) => c.id === candidateId);
  return resolveMock(candidate ?? null);
}
