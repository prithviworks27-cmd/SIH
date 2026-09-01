export default function Notifications() {
  return (
    <div className="bg-background text-on-background antialiased flex">
      {/*SideNavBar*/}
      <aside className="bg-surface-container-low border-r border-outline-variant w-64 h-screen fixed left-0 top-0 flex flex-col py-xl px-md md:flex hidden z-10">
      <div className="mb-xl px-md">
      <h1 className="font-headline-sm text-headline-sm font-bold text-primary">Student Portal</h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Academic Collaboration</p>
      </div>
      <nav className="flex-1 flex flex-col gap-sm">
      {/*Inactive*/}
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>dashboard</span>
                      Dashboard
                  </a>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>quiz</span>
                      Skill Assessment
                  </a>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>school</span>
                      Learning Paths
                  </a>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>work</span>
                      Internships/Jobs
                  </a>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>description</span>
                      My Applications
                  </a>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>account_circle</span>
                      Portfolio
                  </a>
      {/*Active State via Fallback intent*/}
      <a className="flex items-center gap-md px-md py-sm rounded-r text-primary font-bold border-l-4 border-primary bg-surface-container-high transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>notifications</span>
                      Notifications
                  </a>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>mail</span>
                      Messages
                  </a>
      </nav>
      <div className="mt-auto pt-xl border-t border-outline-variant flex flex-col gap-sm">
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>settings</span>
                      Settings
                  </a>
      <a className="flex items-center gap-md px-md py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>logout</span>
                      Logout
                  </a>
      </div>
      </aside>
      {/*Main Content Canvas*/}
      <main className="flex-1 ml-0 md:ml-64 p-md md:p-margin min-h-screen">
      <header className="mb-xl flex justify-between items-end border-b border-outline-variant pb-md">
      <div>
      <h2 className="font-headline-lg text-headline-lg text-primary md:block hidden">Notifications</h2>
      <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary block md:hidden">Notifications</h2>
      <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Your recent activity and updates.</p>
      </div>
      <button className="bg-surface-container-lowest border border-outline-variant text-on-background px-md py-sm rounded hover:bg-surface-container transition-colors font-label-md text-label-md">
                      Mark all as read
                  </button>
      </header>
      <div className="bg-surface-container-lowest border border-outline-variant rounded flex flex-col">
      {/*Unread Notification*/}
      <div className="p-md flex items-start gap-md border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
      <span className="material-symbols-outlined text-primary mt-1" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>description</span>
      <div className="flex-1">
      <p className="font-body-md text-body-md text-on-background font-semibold">Your application for "Optimization of Semi-Transparent Photovoltaics" has been received.</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Zurich Institute of Technology</p>
      </div>
      <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">10m ago</span>
      </div>
      {/*Unread Notification*/}
      <div className="p-md flex items-start gap-md border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
      <span className="material-symbols-outlined text-primary mt-1" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>science</span>
      <div className="flex-1">
      <p className="font-body-md text-body-md text-on-background font-semibold">New grant opportunity matches your research profile: Advanced Materials Synthesis.</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">National Science Foundation</p>
      </div>
      <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">2h ago</span>
      </div>
      {/*Read Notification*/}
      <div className="p-md flex items-start gap-md border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
      <span className="material-symbols-outlined text-on-surface-variant mt-1" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>check_circle</span>
      <div className="flex-1">
      <p className="font-body-md text-body-md text-on-background">Your profile review is complete. You are now verified as a Doctoral Candidate.</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">System Administrator</p>
      </div>
      <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">1d ago</span>
      </div>
      {/*Read Notification*/}
      <div className="p-md flex items-start gap-md border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
      <span className="material-symbols-outlined text-on-surface-variant mt-1" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>forum</span>
      <div className="flex-1">
      <p className="font-body-md text-body-md text-on-background">Dr. Emily Chen commented on your portfolio artifact "Neural Network Optimization".</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">"Excellent methodology in section 3. Consider expanding on the..."</p>
      </div>
      <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">2d ago</span>
      </div>
      {/*Read Notification*/}
      <div className="p-md flex items-start gap-md border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
      <span className="material-symbols-outlined text-on-surface-variant mt-1" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>event</span>
      <div className="flex-1">
      <p className="font-body-md text-body-md text-on-background">Reminder: The deadline for the Global Innovation Fellowship is approaching.</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Due in 5 days</p>
      </div>
      <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">3d ago</span>
      </div>
      {/*Read Notification*/}
      <div className="p-md flex items-start gap-md hover:bg-surface-container-low transition-colors cursor-pointer">
      <span className="material-symbols-outlined text-on-surface-variant mt-1" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>group_add</span>
      <div className="flex-1">
      <p className="font-body-md text-body-md text-on-background">You were added to the working group "Sustainable Urban Infrastructure".</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">By Prof. James Sterling</p>
      </div>
      <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">1w ago</span>
      </div>
      </div>
      </main>
    </div>
  );
}
