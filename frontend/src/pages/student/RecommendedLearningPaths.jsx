import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

const PATHS = [
  {
    title: "Advanced Materials Characterization",
    duration: "12 Weeks",
    modules: [
      "Principles of Electron Microscopy",
      "Spectroscopic Analysis Techniques",
      "Data Interpretation & Modeling",
      "Industrial Application Lab",
    ],
  },
  {
    title: "Quantitative Financial Analysis",
    duration: "8 Weeks",
    modules: ["Stochastic Calculus Foundations", "Algorithmic Trading Strategies", "Risk Modeling Frameworks"],
  },
  {
    title: "Sustainable Urban Infrastructure",
    duration: "16 Weeks",
    modules: [
      "Smart Grid Integration",
      "Eco-Materials Engineering",
      "Policy & Urban Planning",
      "Life Cycle Assessment (LCA)",
      "Capstone: City Proposal",
    ],
  },
];

export default function RecommendedLearningPaths() {
  return (
    <DashboardLayout>
      <header className="mb-xl">
        <h2 className="font-display-lg text-display-lg text-primary mb-sm">Recommended Learning Paths</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Curated sequences of academic modules and practical assessments designed to bridge knowledge gaps for industry placement.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-gutter">
        {PATHS.map((path) => (
          <article key={path.title} className="bg-surface-container-lowest border border-outline-variant rounded flex flex-col h-full">
            <div className="p-lg flex-grow">
              <div className="flex justify-between items-start mb-md">
                <h3 className="font-headline-md text-headline-md text-primary">{path.title}</h3>
                <span className="bg-surface-container-high px-sm py-xs rounded font-label-sm text-label-sm text-on-secondary-container">
                  {path.duration}
                </span>
              </div>
              <h4 className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase tracking-wider">Required Modules</h4>
              <ul className="flex flex-col gap-sm mb-lg border-t border-outline-variant pt-sm">
                {path.modules.map((module) => (
                  <li key={module} className="flex items-start gap-sm">
                    <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: "18px" }}>check_circle</span>
                    <span className="font-body-md text-body-md text-on-surface">{module}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-lg border-t border-outline-variant mt-auto bg-surface">
              <Link
                to="/courses"
                className="block text-center w-full bg-primary-container text-on-primary rounded font-label-md text-label-md py-sm transition-colors hover:bg-primary"
              >
                View Path Details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </DashboardLayout>
  );
}
