import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Timer, Code, ArrowClockwise, PaperPlaneTilt, CheckCircle, Eye, Gauge, FileText } from "@phosphor-icons/react";

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
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        {/*Header Section*/}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-hairline pb-6">
          <div>
            <h1 className="font-editorial text-2xl text-ink tracking-tight mb-2">Technical Challenge: Data Cleaning &amp; Analysis</h1>
            <p className="text-muted max-w-2xl leading-relaxed">
              Identify and resolve the anomalies in the provided dataset. Ensure robust handling of missing values and document your
              optimization strategies for scalability.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-bone py-2 px-4 rounded-md">
            <Timer size={18} className="text-muted" />
            <span className={`font-mono font-medium text-lg ${timeRemaining < 300 ? "text-pastel-red-ink" : "text-ink"}`}>{timerLabel}</span>
          </div>
        </div>

        {/*Editor Section*/}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center bg-bone px-4 py-2 border-t border-l border-r border-hairline rounded-t-xl">
            <span className="text-xs text-muted flex items-center gap-1.5">
              <Code size={14} /> main.py
            </span>
            <div className="flex gap-2">
              <button className="text-muted hover:text-ink transition-colors" title="Reset Code">
                <ArrowClockwise size={16} />
              </button>
            </div>
          </div>
          <div className="relative w-full h-[500px] border border-hairline bg-white rounded-b-xl overflow-hidden">
            {/*Line Numbers (Simulated)*/}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-bone border-r border-hairline text-right pr-2 py-4 text-muted font-mono text-sm opacity-50 pointer-events-none select-none">
              1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10<br />11<br />12<br />13<br />14<br />15
            </div>
            {/*Editable Area*/}
            <textarea
              className="w-full h-full pl-[60px] pr-4 py-4 font-mono text-sm text-charcoal bg-transparent border-none focus:ring-0 resize-none outline-none leading-relaxed"
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
        <div className="flex justify-end gap-3 pt-2">
          <button className="border border-hairline text-charcoal text-sm px-6 py-2.5 rounded-md hover:bg-bone transition-colors">
            Run Tests
          </button>
          <button className="bg-ink text-white text-sm px-6 py-2.5 rounded-md hover:bg-[#333333] active:scale-[0.98] transition-all flex items-center gap-2">
            Submit for Review
            <PaperPlaneTilt size={16} />
          </button>
        </div>

        {/*Rubric*/}
        <div className="mt-6 border border-hairline bg-white rounded-xl p-8">
          <h3 className="text-base font-medium text-ink mb-4 border-b border-hairline pb-3">Evaluation Criteria</h3>
          <ul className="flex flex-col gap-3">
            {[
              { icon: CheckCircle, title: "Code Correctness", body: "Passes all hidden unit tests and handles edge cases appropriately." },
              { icon: Eye, title: "Readability", body: "Clear variable naming, logical structure, and adherence to PEP 8 style guidelines." },
              { icon: Gauge, title: "Algorithmic Efficiency", body: "Optimal time and space complexity suitable for large-scale datasets." },
              { icon: FileText, title: "Documentation", body: "Concise inline comments and updated docstrings explaining methodology." },
            ].map((item, i, arr) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className={`flex items-start gap-3 py-3 ${i < arr.length - 1 ? "border-b border-hairline" : ""}`}>
                  <Icon size={18} className="text-muted mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-ink block">{item.title}</span>
                    <span className="text-sm text-muted">{item.body}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
