export default function Landing() {
  return (
    <div className="font-body-md text-body-md antialiased min-h-screen flex flex-col">
      {/*TopNavBar*/}
      <header className="bg-surface-container-lowest border-b border-outline-variant w-full sticky top-0 z-50">
      <div className="flex justify-between items-center px-4 md:px-margin py-md w-full max-w-max-width mx-auto">
      {/*Brand*/}
      <a className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2" href="#">
      <span aria-hidden="true" className="material-symbols-outlined" data-weight="fill">hub</span>
                       AcademiaLink
                  </a>
      {/*Navigation Links (Desktop)*/}
      <nav className="hidden md:flex items-center gap-lg">
      <a className="font-body-md text-body-md text-primary border-b-2 border-primary pb-1 transition-colors duration-200" href="#how-it-works">How it works</a>
      <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer" href="#">For Students</a>
      <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer" href="#">For Industry</a>
      <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer" href="#">For Institutions</a>
      </nav>
      {/*Actions*/}
      <div className="flex items-center gap-md">
      <button className="hidden md:block font-label-md text-label-md text-primary bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded hover:bg-surface-container-low transition-colors duration-200">
                          Login
                      </button>
      <button className="font-label-md text-label-md text-on-primary bg-primary-container px-4 py-2 rounded hover:bg-primary transition-colors duration-200 shadow-none">
                          Sign Up
                      </button>
      {/*Mobile Menu Toggle*/}
      <button className="md:hidden text-primary p-2">
      <span className="material-symbols-outlined">menu</span>
      </button>
      </div>
      </div>
      </header>
      {/*Main Content*/}
      <main className="flex-grow flex flex-col">
      {/*Hero Section*/}
      <section className="w-full bg-surface-container-lowest py-24 md:py-32 px-4 md:px-margin border-b border-outline-variant flex flex-col items-center justify-center text-center">
      <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface">
                          Bridge the Gap Between <span className="text-primary">Academia</span> and <span className="text-primary">Industry</span>
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
                          A unified platform for skill mapping, internships, and placements. Streamline institutional partnerships and elevate career trajectories with data-driven precision.
                      </p>
      <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button className="font-label-md text-label-md text-on-primary bg-primary-container px-8 py-3 rounded w-full sm:w-auto hover:bg-primary transition-colors duration-200 shadow-none">
                              Get Started
                          </button>
      <button className="font-label-md text-label-md text-primary bg-surface-container-lowest border border-outline-variant px-8 py-3 rounded w-full sm:w-auto hover:bg-surface-container-low transition-colors duration-200">
                              View Demo
                          </button>
      </div>
      </div>
      </section>
      {/*How It Works Section*/}
      <section className="w-full py-24 px-4 md:px-margin bg-surface max-w-max-width mx-auto" id="how-it-works">
      <div className="text-center mb-16 space-y-4">
      <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-on-surface">Structured Pathway to Success</h2>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                          Our methodology simplifies complex transitions from academic environments to corporate roles.
                      </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/*Step 1*/}
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col gap-4 relative">
      <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary-container text-on-primary rounded flex items-center justify-center font-label-md text-label-md border-4 border-surface">
                               1
                           </div>
      <div className="text-primary mb-2 mt-4">
      <span className="material-symbols-outlined text-4xl" data-weight="fill">insights</span>
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface">Skill Mapping</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant flex-grow">
                               Algorithmic assessment of academic coursework and research experience to identify core competencies and match them against industry standard skill ontologies.
                           </p>
      </div>
      {/*Step 2*/}
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col gap-4 relative">
      <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary-container text-on-primary rounded flex items-center justify-center font-label-md text-label-md border-4 border-surface">
                               2
                           </div>
      <div className="text-primary mb-2 mt-4">
      <span className="material-symbols-outlined text-4xl" data-weight="fill">handshake</span>
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface">Industry Connection</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant flex-grow">
                               Direct access to curated corporate R&amp;D teams and university recruiters through authenticated, secure communication channels.
                           </p>
      </div>
      {/*Step 3*/}
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col gap-4 relative">
      <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary-container text-on-primary rounded flex items-center justify-center font-label-md text-label-md border-4 border-surface">
                               3
                           </div>
      <div className="text-primary mb-2 mt-4">
      <span className="material-symbols-outlined text-4xl" data-weight="fill">rocket_launch</span>
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface">Career Placement</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant flex-grow">
                               End-to-end management of internship applications, contract negotiations, and final role placement tracking within a single dashboard.
                           </p>
      </div>
      </div>
      </section>
      </main>
      {/*Footer*/}
      <footer className="bg-surface-container-lowest border-t border-outline-variant mt-auto">
      <div className="w-full py-xl px-4 md:px-margin max-w-max-width mx-auto flex flex-col md:flex-row justify-between items-center gap-md">
      {/*Brand / Copyright*/}
      <div className="flex flex-col items-center md:items-start gap-2">
      <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1">
      <span className="material-symbols-outlined text-sm" data-weight="fill">hub</span>
                          AcademiaLink
                      </span>
      <span className="font-body-sm text-body-sm text-secondary">
                          © 2024 AcademiaLink Collaboration Portal. All rights reserved.
                      </span>
      </div>
      {/*Links*/}
      <nav className="flex flex-wrap justify-center gap-6">
      <a className="font-body-sm text-body-sm text-on-secondary-fixed-variant hover:text-primary transition-colors duration-200" href="#">Privacy Policy</a>
      <a className="font-body-sm text-body-sm text-on-secondary-fixed-variant hover:text-primary transition-colors duration-200" href="#">Terms of Service</a>
      <a className="font-body-sm text-body-sm text-on-secondary-fixed-variant hover:text-primary transition-colors duration-200" href="#">Contact Us</a>
      <a className="font-body-sm text-body-sm text-on-secondary-fixed-variant hover:text-primary transition-colors duration-200" href="#">Help Center</a>
      </nav>
      </div>
      </footer>
    </div>
  );
}
