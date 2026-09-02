import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { CheckCircle } from "@phosphor-icons/react";

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
      <header className="mb-10">
        <h2 className="font-editorial text-3xl text-ink tracking-tight mb-2">Recommended Learning Paths</h2>
        <p className="text-muted max-w-2xl leading-relaxed">
          Curated sequences of academic modules and practical assessments designed to bridge knowledge gaps for industry placement.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {PATHS.map((path) => (
          <article key={path.title} className="bg-white border border-hairline rounded-xl flex flex-col h-full">
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-ink">{path.title}</h3>
                <span className="bg-bone px-2.5 py-1 rounded-full text-xs uppercase tracking-wide text-charcoal whitespace-nowrap">
                  {path.duration}
                </span>
              </div>
              <h4 className="text-xs uppercase tracking-wide text-muted mb-2">Required Modules</h4>
              <ul className="flex flex-col gap-2 mb-6 border-t border-hairline pt-3">
                {path.modules.map((module) => (
                  <li key={module} className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-muted mt-0.5" />
                    <span className="text-sm text-charcoal">{module}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 border-t border-hairline mt-auto">
              <Link
                to="/courses"
                className="block text-center w-full bg-ink text-white rounded-md text-sm py-2.5 hover:bg-[#333333] active:scale-[0.98] transition-all"
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
