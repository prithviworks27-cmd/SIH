import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const INITIAL_SECONDS = 24 * 60 + 15;

export default function ProofOfSkillChallenge() {
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((t) => (t > 0 ? t - 1 : t));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timerLabel = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <DashboardLayout>
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-lg">
        {/*Header Section*/}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-outline-variant pb-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">Technical Challenge: Data Cleaning &amp; Analysis</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Identify and resolve the anomalies in the provided dataset. Ensure robust handling of missing values and document your
              optimization strategies for scalability.
            </p>
          </div>
          <div className="mt-md md:mt-0 flex items-center gap-sm bg-surface-container py-sm px-md rounded-DEFAULT border border-outline-variant">
            <span className="material-symbols-outlined text-on-surface-variant">timer</span>
            <span className={`font-mono font-semibold text-lg ${timeRemaining < 300 ? "text-error" : "text-on-surface"}`}>{timerLabel}</span>
          </div>
        </div>

        {/*Editor Section*/}
        <div className="flex flex-col gap-sm">
          <div className="flex justify-between items-center bg-surface-container-low px-md py-sm border-t border-l border-r border-outline-variant rounded-t-DEFAULT">
            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-xs">
              <span className="material-symbols-outlined text-[16px]">code</span> main.py
            </span>
            <div className="flex gap-sm">
              <button className="text-on-surface-variant hover:text-primary transition-colors" title="Reset Code">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
          </div>
          <div className="relative w-full h-[500px] border border-outline-variant bg-surface-container-lowest rounded-b-DEFAULT overflow-hidden">
            {/*Line Numbers (Simulated)*/}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-surface-container-low border-r border-outline-variant text-right pr-sm py-md text-on-surface-variant font-mono text-sm opacity-50 pointer-events-none select-none">
              1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10<br />11<br />12<br />13<br />14<br />15
            </div>
            {/*Editable Area*/}
            <textarea
              className="w-full h-full pl-[60px] pr-md py-md font-mono text-body-sm text-[#333333] bg-transparent border-none focus:ring-0 resize-none outline-none leading-relaxed"
              spellCheck="false"
              defaultValue={`import pandas as pd
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
# cleaned_df = clean_experimental_data(raw_df)`}
            />
          </div>
        </div>

        {/*Actions*/}
        <div className="flex justify-end gap-md pt-sm">
          <button className="bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md px-lg py-sm rounded-DEFAULT hover:bg-surface-container-low transition-colors">
            Run Tests
          </button>
          <button className="bg-primary-container text-on-primary font-label-md text-label-md px-lg py-sm rounded-DEFAULT hover:bg-primary transition-colors flex items-center gap-sm">
            Submit for Review
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>

        {/*Rubric*/}
        <div className="mt-xl border border-outline-variant bg-surface-container-lowest rounded-DEFAULT p-lg">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-md border-b border-outline-variant pb-sm">Evaluation Criteria</h3>
          <ul className="flex flex-col gap-sm">
            {[
              { icon: "check_circle", title: "Code Correctness", body: "Passes all hidden unit tests and handles edge cases appropriately." },
              { icon: "visibility", title: "Readability", body: "Clear variable naming, logical structure, and adherence to PEP 8 style guidelines." },
              { icon: "speed", title: "Algorithmic Efficiency", body: "Optimal time and space complexity suitable for large-scale datasets." },
              { icon: "description", title: "Documentation", body: "Concise inline comments and updated docstrings explaining methodology." },
            ].map((item, i, arr) => (
              <li
                key={item.title}
                className={`flex items-start gap-md py-sm ${i < arr.length - 1 ? "border-b border-outline-variant" : ""}`}
              >
                <span className="material-symbols-outlined text-outline mt-xs">{item.icon}</span>
                <div>
                  <span className="font-label-md text-label-md text-on-surface block">{item.title}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{item.body}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
