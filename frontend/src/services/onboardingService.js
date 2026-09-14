import { onboardingAPI } from "./api";

export async function getOnboardingStatus() {
  const { completed } = await onboardingAPI.getStatus();
  return completed;
}

export async function getSkillSuggestions() {
  const { skills } = await onboardingAPI.getSkillSuggestions();
  return skills;
}

export async function submitOnboarding(fields) {
  return onboardingAPI.submit(fields);
}

export async function getOnboardingResponse() {
  const { response } = await onboardingAPI.getResponse();
  return response;
}
