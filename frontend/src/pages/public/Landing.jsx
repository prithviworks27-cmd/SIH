import { useState } from "react";
import { Link } from "react-router-dom";
import { List, X, ChartLineUp, Handshake, RocketLaunch } from "@phosphor-icons/react";
import useScrollReveal from "../../hooks/useScrollReveal";

const STEPS = [
  {
    number: "01",
    icon: ChartLineUp,
    tint: "bg-pastel-blue text-pastel-blue-ink",
    title: "Skill mapping",
    body: "Coursework and research experience are assessed against industry skill ontologies to surface core competencies automatically.",
  },
  {
    number: "02",
    icon: Handshake,
    tint: "bg-pastel-green text-pastel-green-ink",
    title: "Industry connection",
    body: "Direct, authenticated channels to corporate R&D teams and university recruiters replace cold outreach and static resumes.",
  },
  {
    number: "03",
    icon: RocketLaunch,
    tint: "bg-pastel-yellow text-pastel-yellow-ink",
    title: "Career placement",
    body: "Applications, contract negotiation, and placement tracking live in a single dashboard from first match to signed offer.",
  },
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useScrollReveal();
  const stepsHeaderRef = useScrollReveal();

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-charcoal antialiased">
      {/* Nav */}
      <header className="w-full sticky top-0 z-50 bg-canvas/90 backdrop-blur border-b border-hairline">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">
          <Link className="font-editorial italic text-xl text-ink flex items-center gap-2" to="/">
            AcademiaLink
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a className="text-ink border-b border-ink pb-0.5" href="#how-it-works">
              How it works
            </a>
            <a className="text-muted hover:text-ink transition-colors" href="#">
              For students
            </a>
            <a className="text-muted hover:text-ink transition-colors" href="#">
              For industry
            </a>
            <a className="text-muted hover:text-ink transition-colors" href="#">
              For institutions
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              className="hidden md:block text-sm text-ink border border-hairline px-4 py-2 rounded-md hover:bg-bone transition-colors"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="text-sm text-white bg-ink px-4 py-2 rounded-md hover:bg-[#333333] active:scale-[0.98] transition-all"
              to="/signup"
            >
              Sign up
            </Link>
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="md:hidden text-ink p-1.5"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </div>

        <nav className={`${menuOpen ? "flex" : "hidden"} md:hidden flex-col gap-1 px-4 pb-4 text-sm`}>
          <a className="text-ink py-2" href="#how-it-works">
            How it works
          </a>
          <a className="text-muted py-2" href="#">
            For students
          </a>
          <a className="text-muted py-2" href="#">
            For industry
          </a>
          <a className="text-muted py-2" href="#">
            For institutions
          </a>
        </nav>
      </header>

      <main className="flex-grow flex flex-col">
        {/* Hero */}
        <section className="relative w-full px-4 md:px-6 py-24 md:py-36 border-b border-hairline overflow-hidden">
          <div
            aria-hidden="true"
            className="ambient-blob pointer-events-none absolute -top-1/3 right-0 w-[600px] h-[600px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #1F6C9F 0%, transparent 70%)" }}
          />

          <div ref={heroRef} className="reveal relative max-w-3xl mx-auto text-center space-y-7">
            <h1 className="font-editorial text-4xl md:text-6xl leading-[1.1] tracking-tight text-ink">
              Bridge the gap between <em className="not-italic text-pastel-blue-ink">academia</em> and{" "}
              <em className="not-italic text-pastel-green-ink">industry</em>
            </h1>
            <p className="text-base md:text-lg text-muted max-w-xl mx-auto leading-relaxed">
              A unified platform for skill mapping, internships, and placements — built to streamline
              institutional partnerships and career trajectories with data-driven precision.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                className="text-sm font-medium text-white bg-ink px-6 py-3 rounded-md w-full sm:w-auto hover:bg-[#333333] active:scale-[0.98] transition-all"
                to="/signup"
              >
                Get started
              </Link>
            </div>
          </div>
        </section>

        {/* How it works — bento grid */}
        <section className="w-full py-24 px-4 md:px-6 max-w-5xl mx-auto" id="how-it-works">
          <div ref={stepsHeaderRef} className="reveal text-center mb-16 space-y-3">
            <h2 className="font-editorial text-3xl md:text-4xl text-ink tracking-tight">
              A structured pathway
            </h2>
            <p className="text-muted max-w-xl mx-auto leading-relaxed">
              Three steps take a student from coursework to a verified industry placement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <StepCard key={step.number} step={step} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-canvas border-t border-hairline mt-auto">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 flex flex-col items-center gap-1">
          <span className="font-editorial italic text-base text-ink">AcademiaLink</span>
          <span className="text-xs text-muted">© 2024 AcademiaLink Collaboration Portal.</span>
        </div>
      </footer>
    </div>
  );
}

function StepCard({ step }) {
  const ref = useScrollReveal();
  const Icon = step.icon;

  return (
    <div
      ref={ref}
      className="reveal border border-hairline rounded-xl p-8 bg-white hover:shadow-lift transition-shadow flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <span className={`w-10 h-10 rounded-md flex items-center justify-center ${step.tint}`}>
          <Icon size={20} weight="bold" />
        </span>
        <span className="font-mono text-xs text-muted">{step.number}</span>
      </div>
      <h3 className="text-lg font-medium text-ink">{step.title}</h3>
      <p className="text-sm text-muted leading-relaxed">{step.body}</p>
    </div>
  );
}
