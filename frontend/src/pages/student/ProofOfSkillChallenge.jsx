import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased">
      {/*Top Navigation Bar*/}
      <header className="bg-surface-container-lowest border-b border-outline-variant docked full-width top-0 z-50">
      <div className="flex justify-between items-center px-margin py-md w-full max-w-max-width mx-auto">
      <div className="flex items-center gap-lg">
      <Link className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-sm" to="/">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>science</span>
                          AcademiaLink
                      </Link>
      </div>
      <nav className="hidden md:flex items-center gap-lg font-body-md text-body-md">
      <a className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer duration-200" href="#">How it works</a>
      <a className="text-primary border-b-2 border-primary pb-1 cursor-pointer duration-200" href="#">For Students</a>
      <a className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer duration-200" href="#">For Industry</a>
      <a className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer duration-200" href="#">For Institutions</a>
      </nav>
      <div className="flex items-center gap-md">
      <button className="font-label-md text-label-md text-on-surface hover:text-primary transition-colors cursor-pointer">Login</button>
      <button className="bg-primary-container text-on-primary font-label-md text-label-md px-md py-sm rounded-DEFAULT hover:bg-primary transition-colors cursor-pointer">Sign Up</button>
      </div>
      </div>
      </header>
      {/*Main Content Area*/}
      <main className="flex-grow w-full max-w-max-width mx-auto px-margin py-xl flex flex-col md:flex-row gap-xl mt-8">
      {/*Left Sidebar Structure (Optional, suppressed for focus but keeping structural consistency if needed, here we use full width for focus)*/}
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-lg">
      {/*Header Section*/}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-outline-variant pb-md">
      <div>
      <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">Technical Challenge: Data Cleaning &amp; Analysis</h1>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                              Identify and resolve the anomalies in the provided dataset. Ensure robust handling of missing values and document your optimization strategies for scalability.
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
                              1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8<br/>9<br/>10<br/>11<br/>12<br/>13<br/>14<br/>15
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
      <li className="flex items-start gap-md py-sm border-b border-outline-variant last:border-b-0 last:pb-0">
      <span className="material-symbols-outlined text-outline mt-xs">check_circle</span>
      <div>
      <span className="font-label-md text-label-md text-on-surface block">Code Correctness</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Passes all hidden unit tests and handles edge cases appropriately.</span>
      </div>
      </li>
      <li className="flex items-start gap-md py-sm border-b border-outline-variant last:border-b-0 last:pb-0">
      <span className="material-symbols-outlined text-outline mt-xs">visibility</span>
      <div>
      <span className="font-label-md text-label-md text-on-surface block">Readability</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Clear variable naming, logical structure, and adherence to PEP 8 style guidelines.</span>
      </div>
      </li>
      <li className="flex items-start gap-md py-sm border-b border-outline-variant last:border-b-0 last:pb-0">
      <span className="material-symbols-outlined text-outline mt-xs">speed</span>
      <div>
      <span className="font-label-md text-label-md text-on-surface block">Algorithmic Efficiency</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Optimal time and space complexity suitable for large-scale datasets.</span>
      </div>
      </li>
      <li className="flex items-start gap-md py-sm border-b border-outline-variant last:border-b-0 last:pb-0">
      <span className="material-symbols-outlined text-outline mt-xs">description</span>
      <div>
      <span className="font-label-md text-label-md text-on-surface block">Documentation</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Concise inline comments and updated docstrings explaining methodology.</span>
      </div>
      </li>
      </ul>
      </div>
      </div>
      </main>
      {/*Footer*/}
      <footer className="bg-surface-container-lowest border-t border-outline-variant docked full-width bottom mt-auto">
      <div className="w-full py-xl px-margin flex flex-col md:flex-row justify-between items-center gap-md max-w-max-width mx-auto">
      <div className="font-label-md text-label-md font-bold text-primary">
                      AcademiaLink
                  </div>
      <div className="font-body-sm text-body-sm text-secondary">
                      © 2024 AcademiaLink Collaboration Portal. All rights reserved.
                  </div>
      <div className="flex gap-lg font-body-sm text-body-sm">
      <a className="text-on-secondary-fixed-variant hover:text-primary transition-colors duration-200" href="#">Privacy Policy</a>
      <a className="text-on-secondary-fixed-variant hover:text-primary transition-colors duration-200" href="#">Terms of Service</a>
      <a className="text-on-secondary-fixed-variant hover:text-primary transition-colors duration-200" href="#">Contact Us</a>
      <a className="text-on-secondary-fixed-variant hover:text-primary transition-colors duration-200" href="#">Help Center</a>
      </div>
      </div>
      </footer>
    </div>
  );
}
