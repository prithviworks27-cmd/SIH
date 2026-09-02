import { resolveMock } from "./mockClient";
import { skillGaps, overallMatchPercent } from "./mockData/skills";

export async function getSkillProfile() {
  return resolveMock({ skillGaps, overallMatchPercent });
}
