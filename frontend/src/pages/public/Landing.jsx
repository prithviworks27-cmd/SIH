import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChartLineUp, Handshake, RocketLaunch, ArrowUpRight } from "@phosphor-icons/react";
import useScrollReveal from "../../hooks/useScrollReveal";
import logo from "../../assets/logo.png";
import { AntiMetalButton } from "../../components/ui/anti-metal-button";
import PathwayPill from "../../components/common/PathwayPill";

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
  const navigate = useNavigate();
  const heroRef = useScrollReveal();
  const [pathwayOpen, setPathwayOpen] = useState(false);

  return (
    <div
      className="min-h-screen p-2.5 md:p-4"
      style={{ background: "linear-gradient(135deg, #060B24 0%, #0B1C6B 35%, #1E3FE0 62%, #050814 100%)" }}
    >
      <div className="bg-white rounded-[28px] md:rounded-[32px] min-h-[calc(100vh-20px)] md:min-h-[calc(100vh-32px)] flex flex-col overflow-hidden text-charcoal antialiased">
        {/* Nav */}
        <header className="w-full">
          <div className="flex justify-between items-center px-6 md:px-10 py-6">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="SkillBridge" className="w-20 h-20 rounded-full object-cover" />
            </Link>

            <nav className="flex items-center gap-8">
              <Link
                to="/login"
                className="text-xs font-bold uppercase tracking-[0.12em] text-ink/70 hover:text-ink transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] bg-ink text-white pl-5 pr-4 py-2.5 rounded-full hover:bg-[#222222] active:scale-[0.97] transition-all"
              >
                Sign Up
                <ArrowUpRight size={13} weight="bold" />
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="flex flex-col items-center justify-center px-6 md:px-10 py-10 md:py-16 text-center min-h-[calc(100vh-138px)] md:min-h-[calc(100vh-144px)]">
          <h1
            ref={heroRef}
            className="reveal font-sans font-black leading-[0.9] tracking-tight bg-clip-text text-transparent"
            style={{
              fontSize: "clamp(3.4rem, 11vw, 9.5rem)",
              backgroundImage: "linear-gradient(115deg, #4fadb0 0%, #7a6fe0 45%, #e4895c 85%)",
            }}
          >
            SKILLBRIDGE
          </h1>
          <p className="mt-8 max-w-md text-[15px] md:text-base font-medium text-charcoal/80 leading-relaxed">
            A skill-first platform for students, institutions, and employers — verified assessments,
            real matches, and career guidance grounded in data.
          </p>
          <AntiMetalButton
            className="mt-9"
            label="Get Started"
            onClick={() => navigate("/signup")}
          />
        </section>

        {/* How it works — bento grid */}
        <section className="w-full py-20 px-6 md:px-10 border-t border-hairline" id="how-it-works">
          <div className="flex justify-center mb-10">
            <PathwayPill
              steps={STEPS}
              expanded={pathwayOpen}
              onClick={() => setPathwayOpen((open) => !open)}
            />
          </div>

          <div
            className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
              pathwayOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pb-2">
                {STEPS.map((step, index) => (
                  <StepCard key={step.number} step={step} index={index} visible={pathwayOpen} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-hairline mt-auto">
          <div className="px-6 md:px-10 py-8 flex flex-col items-center gap-1">
            <span className="font-editorial italic text-base text-ink">SkillBridge</span>
            <span className="text-xs text-muted">© 2026 SkillBridge Collaboration Portal.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function StepCard({ step, index = 0, visible = true }) {
  const Icon = step.icon;

  return (
    <div
      className={`border border-hairline rounded-xl p-8 bg-white hover:shadow-lift flex flex-col gap-4 transition-[opacity,transform,box-shadow] duration-500 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
      style={{ transitionDelay: visible ? `${index * 120}ms` : "0ms" }}
    >
      <div className="flex items-center justify-between">
        <span className={`w-10 h-10 rounded-md flex items-center justify-center ${step.tint}`}>
          <Icon size={20} weight="bold" />
        </span>
        <span className="font-mono text-xs text-muted">{step.number}</span>
      </div>
      <h3 className="text-xl font-bold text-ink">{step.title}</h3>
      <p className="text-base font-medium text-charcoal/80 leading-relaxed">{step.body}</p>
    </div>
  );
}
