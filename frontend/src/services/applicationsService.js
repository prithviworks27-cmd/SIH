import { resolveMock } from "./mockClient";
import { applications } from "./mockData/applications";

export async function getApplications() {
  return resolveMock(applications);
}
