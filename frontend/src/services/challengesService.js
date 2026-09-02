import { resolveMock } from "./mockClient";
import { verifySkillViaChallenge } from "./assessmentService";

export const DATA_CLEANING_CHALLENGE = {
  id: "challenge-data-cleaning",
  skill: "Python Programming",
  title: "Technical Challenge: Data Cleaning & Analysis",
  description:
    "Identify and resolve the anomalies in the provided dataset. Ensure robust handling of missing values and document your optimization strategies for scalability.",
  starterCode: `import pandas as pd
import numpy as np

def clean_experimental_data(df):
    """
    Cleans raw sensor data from the photovoltaic test rig.
    TODO:
    1. Handle NaN values in 'irradiance' column (interpolate).
    2. Remove outliers where 'temperature' > 100C.
    3. Normalize 'voltage' readings.
    """

    # Your code here

    return df

# Sample usage
# raw_df = pd.read_csv('test_run_042.csv')
# cleaned_df = clean_experimental_data(raw_df)`,
  timeLimitSeconds: 24 * 60 + 15,
};

// Mock evaluation: a real platform would run the submitted code against
// hidden tests. Here we score based on whether the student made a
// substantive attempt (more than the untouched starter code) — enough to
// demonstrate the score → verification → trust level flow honestly, without
// pretending to execute untrusted code client-side.
export async function runTests(code) {
  const meaningfulChange = code.replace(/\s/g, "").length > DATA_CLEANING_CHALLENGE.starterCode.replace(/\s/g, "").length + 20;
  const passed = meaningfulChange ? 4 : Math.random() > 0.5 ? 2 : 1;
  return resolveMock({ passed, total: 4 }, { delay: 800 });
}

export async function submitChallenge(code) {
  const { passed, total } = await runTests(code);
  const score = Math.round((passed / total) * 100);
  const passing = score >= 75;

  if (passing) {
    await verifySkillViaChallenge(DATA_CLEANING_CHALLENGE.skill, score);
  }

  return resolveMock({ score, passed, total, passing }, { delay: 400 });
}
