export default function MessagesInbox() {
  return (
    <div className="bg-background text-on-surface flex min-h-screen font-body-md">
      {/*SideNavBar (Shared Component)*/}
      <nav className="bg-surface-container-low border-r border-outline-variant fixed left-0 top-0 h-screen w-64 flex flex-col py-xl px-md z-10 hidden md:flex">
      {/*Header*/}
      <div className="mb-xl px-sm flex items-center gap-md">
      <img className="w-10 h-10 rounded-full border border-outline-variant object-cover" data-alt="A minimalist, monochromatic corporate logo featuring abstract geometric shapes representing academic collaboration. Clean lines, dark navy on white, high resolution." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcZns8OyxVtF-5_7pPIjBCfRG-TPQYTCMb_Ncl3SItc6HT6ZGx9iHHd8K9k5l_B8fCOFxIbJ6RYzMLEd2LDmtyDKyYtXb4pd6LiV9SfPN0B3WMZNV4yBwbECBu991aiPQfQL6eZhRVcwkDjag3syKyYkce4MbOiNxoQaib14R_oFkkVdD_fvN6IdR3ulbSrjw8oHK3HKZ5rxZZBVkxRLM0C6JPKtUqiLqSLjZaCd8RmZjZeHLU5vse"/>
      <div>
      <h1 className="font-headline-sm text-headline-sm font-bold text-primary">Student Portal</h1>
      <p className="font-label-sm text-label-sm text-on-surface-variant">Academic Collaboration</p>
      </div>
      </div>
      {/*Main Navigation*/}
      <ul className="flex-1 space-y-sm">
      <li>
      <a className="flex items-center gap-md px-sm py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">dashboard</span>
                          Dashboard
                      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-sm py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">quiz</span>
                          Skill Assessment
                      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-sm py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">school</span>
                          Learning Paths
                      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-sm py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">work</span>
                          Internships/Jobs
                      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-sm py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">description</span>
                          My Applications
                      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-sm py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">account_circle</span>
                          Portfolio
                      </a>
      </li>
      <li>
      {/*ACTIVE STATE APPLIED HERE*/}
      <a className="flex items-center gap-md px-sm py-sm rounded transition-all scale-95 active:scale-90 font-label-md text-label-md text-primary font-bold border-l-4 border-primary bg-surface-container-high" href="#">
      <span className="material-symbols-outlined">mail</span>
                          Messages
                      </a>
      </li>
      </ul>
      {/*Footer Navigation*/}
      <ul className="mt-auto space-y-sm pt-md border-t border-outline-variant">
      <li>
      <a className="flex items-center gap-md px-sm py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">settings</span>
                          Settings
                      </a>
      </li>
      <li>
      <a className="flex items-center gap-md px-sm py-sm rounded text-on-secondary-fixed-variant hover:bg-secondary-container transition-all scale-95 active:scale-90 font-label-md text-label-md" href="#">
      <span className="material-symbols-outlined">logout</span>
                          Logout
                      </a>
      </li>
      </ul>
      </nav>
      {/*Main Content Area*/}
      <main className="md:ml-64 flex-1 flex flex-col h-screen overflow-hidden">
      {/*Two Column Layout Container*/}
      <div className="flex-1 flex w-full bg-surface-container-lowest h-full border-t md:border-t-0 border-outline-variant">
      {/*Left Column: Conversation List*/}
      <div className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 border-r border-outline-variant flex flex-col bg-surface-container-lowest">
      {/*Search Header*/}
      <div className="p-lg border-b border-outline-variant">
      <h2 className="font-headline-md text-headline-md mb-md text-primary">Messages</h2>
      <div className="relative">
      <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">search</span>
      <input className="w-full pl-xl pr-md py-sm border border-outline-variant bg-surface-container-lowest rounded text-body-sm focus:border-primary focus:outline-none focus:ring-0 placeholder:text-outline" placeholder="Search conversations..." type="text"/>
      </div>
      </div>
      {/*List*/}
      <div className="flex-1 overflow-y-auto">
      {/*Active Conversation Item*/}
      <div className="p-md border-b border-outline-variant bg-surface-container-low cursor-pointer flex gap-md items-center">
      <img className="w-12 h-12 rounded object-cover border border-outline-variant" data-alt="Professional headshot of a middle-aged academic researcher wearing a dark suit against a neutral grey background. Clear lighting, high resolution." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6hv8810zgGJZvPmS3Qd2moc7zbrwa7fTdNc3qB8g_ODKmnn-PhZUnz5zqqmQesbMuhCkCh7zNh1moYaRmZteN5qCgUYuD9B_fXhgDdSpq1Ln_LdEAnLcjmf-ez9AKWjbf-OW8psEXbLGUdE4zLetT4VTctlQ_2W7y8rRmXXTlw9EqQoMsqasMa3FU7G2qGgGDeyHJUDkvPQlZ41swmia0KjtB1a6lttbgwKDz0BUmjBJIDoUzHVmX"/>
      <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline mb-xs">
      <h3 className="font-label-md text-label-md text-on-surface truncate">Dr. Aris Thorne</h3>
      <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">10:42 AM</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">The preliminary data looks promising. Can we discuss...</p>
      </div>
      </div>
      {/*Inactive Conversation Items*/}
      <div className="p-md border-b border-outline-variant hover:bg-surface-container-low cursor-pointer flex gap-md items-center transition-colors">
      <div className="w-12 h-12 rounded bg-surface border border-outline-variant flex items-center justify-center text-outline">
      <span className="material-symbols-outlined">corporate_fare</span>
      </div>
      <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline mb-xs">
      <h3 className="font-label-md text-label-md text-on-surface truncate font-semibold">NexTech R&amp;D Dept</h3>
      <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">Yesterday</span>
      </div>
      <p className="font-body-sm text-body-sm text-primary font-medium truncate">Regarding the grant proposal structure...</p>
      </div>
      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
      </div>
      <div className="p-md border-b border-outline-variant hover:bg-surface-container-low cursor-pointer flex gap-md items-center transition-colors">
      <img className="w-12 h-12 rounded object-cover border border-outline-variant" data-alt="Portrait of a young female graduate student in a laboratory setting. She is wearing a white lab coat and safety glasses. Bright, clinical lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCq40VWBsgJCYBsPBhrMtlQZzF6mjLV6FQsOm5Eiq6A3_xrJkfob6AjTD3-pX5LfeCL8HbZckFxPSwEbuvUwj91lVi-eIlCTC1Pky5A6QvqtrjV5A5-iidzU6i1ZdhrGGTy32vUdIAslUIRdC8tVLyDk-NjG_GSfjgsbd7YBAfqW9WxRPxV22IqiLLUyOWr-fX1yGsTjW4u9Lz3BdAXLjUudD_B-hWcAIoL8AWvEOxGXjUaxAwkwZh"/>
      <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline mb-xs">
      <h3 className="font-label-md text-label-md text-on-surface truncate">Sarah Jenkins</h3>
      <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">Mon</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">I've attached the literature review draft.</p>
      </div>
      </div>
      <div className="p-md border-b border-outline-variant hover:bg-surface-container-low cursor-pointer flex gap-md items-center transition-colors">
      <div className="w-12 h-12 rounded bg-surface border border-outline-variant flex items-center justify-center text-outline">
      <span className="material-symbols-outlined">group</span>
      </div>
      <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline mb-xs">
      <h3 className="font-label-md text-label-md text-on-surface truncate">Photovoltaic Synergy Team</h3>
      <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">Oct 12</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Meeting minutes from last Thursday.</p>
      </div>
      </div>
      </div>
      </div>
      {/*Right Column: Open Thread*/}
      <div className="flex-1 flex flex-col bg-surface-container-lowest hidden md:flex">
      {/*Thread Header*/}
      <div className="px-xl py-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
      <div className="flex items-center gap-md">
      <img className="w-10 h-10 rounded object-cover border border-outline-variant" data-alt="Professional headshot of a middle-aged academic researcher wearing a dark suit against a neutral grey background. Clear lighting, high resolution." src="https://lh3.googleusercontent.com/aida-public/AB6AXuClKEyQUjAFjqjO28swVGch2_IybaN3BeXxuygjQoznzJ5PQPMz2DWWOBKUErMqAI_oz0O7zNlUBEAxQhWd1d2a30ZkaZsEgFCdC-zvxFWGwiat2YGS2NOis2EVLZCuaK2m267nuiXiLFBrSk0Z3qwXPq7kQJl2C_tVUrhdCCpnPkEtNwjhEqA3ZyoM6ftknttjcC76S4kR-eMlbxNCsjJNz82NfUAPXjfU9qFhgcrXp2ODwFHSviGf"/>
      <div>
      <h2 className="font-headline-sm text-headline-sm text-on-surface">Dr. Aris Thorne</h2>
      <p className="font-label-sm text-label-sm text-on-surface-variant">Department of Materials Science, ZIT</p>
      </div>
      </div>
      <div className="flex gap-sm">
      <button className="p-sm text-outline hover:text-primary transition-colors">
      <span className="material-symbols-outlined">search</span>
      </button>
      <button className="p-sm text-outline hover:text-primary transition-colors">
      <span className="material-symbols-outlined">more_vert</span>
      </button>
      </div>
      </div>
      {/*Message History*/}
      <div className="flex-1 overflow-y-auto p-xl flex flex-col gap-lg bg-background">
      {/*Date Separator*/}
      <div className="flex justify-center my-md">
      <span className="bg-surface-container-lowest border border-outline-variant px-md py-xs rounded font-label-sm text-label-sm text-on-surface-variant">Today</span>
      </div>
      {/*Received Message*/}
      <div className="flex flex-col gap-xs self-start max-w-[80%] lg:max-w-[60%]">
      <div className="bg-surface-container-lowest border border-outline-variant p-md rounded text-body-md text-on-surface rounded-tl-none">
      <p>Good morning. I've reviewed the latest simulation results for the urban infrastructure integration.</p>
      </div>
      <span className="font-label-sm text-label-sm text-on-surface-variant ml-sm">10:15 AM</span>
      </div>
      {/*Received Message (Consecutive)*/}
      <div className="flex flex-col gap-xs self-start max-w-[80%] lg:max-w-[60%] -mt-md">
      <div className="bg-surface-container-lowest border border-outline-variant p-md rounded text-body-md text-on-surface">
      <p>The preliminary data looks promising. Can we discuss the thermal dissipation metrics? They seem slightly elevated compared to our initial model.</p>
      </div>
      <span className="font-label-sm text-label-sm text-on-surface-variant ml-sm">10:42 AM</span>
      </div>
      {/*Sent Message*/}
      <div className="flex flex-col gap-xs self-end max-w-[80%] lg:max-w-[60%] items-end">
      <div className="bg-surface border border-outline-variant p-md rounded text-body-md text-on-surface rounded-tr-none">
      <p>Absolutely. I noticed the same anomaly around the 400nm wavelength absorption phase.</p>
      </div>
      <div className="flex items-center gap-xs mr-sm">
      <span className="font-label-sm text-label-sm text-on-surface-variant">11:05 AM</span>
      <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>
      </div>
      </div>
      {/*Sent Message (Consecutive)*/}
      <div className="flex flex-col gap-xs self-end max-w-[80%] lg:max-w-[60%] items-end -mt-md">
      <div className="bg-surface border border-outline-variant p-md rounded text-body-md text-on-surface">
      <p>I'm compiling a comparative chart now. Should be ready for review by 2 PM. Are you available for a brief sync then?</p>
      </div>
      <div className="flex items-center gap-xs mr-sm">
      <span className="font-label-sm text-label-sm text-on-surface-variant">11:07 AM</span>
      <span className="material-symbols-outlined text-[14px] text-outline-variant">done</span>
      </div>
      </div>
      </div>
      {/*Input Area*/}
      <div className="p-lg border-t border-outline-variant bg-surface-container-lowest">
      <div className="flex items-end gap-md">
      <button className="p-sm text-outline hover:text-primary transition-colors flex-shrink-0 mb-xs">
      <span className="material-symbols-outlined">attach_file</span>
      </button>
      <div className="flex-1 relative">
      <textarea
        className="w-full resize-none border border-outline-variant bg-surface-container-lowest rounded p-md text-body-md focus:border-primary focus:ring-0 focus:outline-none min-h-[48px] max-h-[120px]"
        placeholder="Type a message..."
        rows="1"
        style={{ overflowY: "hidden" }}
        onInput={(e) => {
          e.target.style.height = "";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      />
      </div>
      <button className="bg-primary-container text-on-primary px-lg py-sm rounded border border-transparent font-label-md text-label-md flex items-center gap-xs hover:opacity-90 transition-opacity mb-xs">
      <span>Send</span>
      <span className="material-symbols-outlined text-[18px]">send</span>
      </button>
      </div>
      </div>
      </div>
      </div>
      </main>
    </div>
  );
}
