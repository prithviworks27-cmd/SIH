import { resolveMock } from "./mockClient";
import { internships } from "./mockData/internships";

export async function getInternships() {
  return resolveMock(internships);
}

export async function getInternshipById(jobId) {
  const internship = internships.find((j) => j.id === jobId);
  return resolveMock(internship ?? null);
}
