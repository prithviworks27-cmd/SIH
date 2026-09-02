import Sidebar from "../../components/layout/Sidebar";
import { studentNavItems, studentFooterNavItems } from "../../config/studentNavConfig";
import { MagnifyingGlass, Buildings, UsersThree, Paperclip, PaperPlaneTilt, DotsThreeVertical, Check, Checks } from "@phosphor-icons/react";

export default function MessagesInbox() {
  return (
    <div className="bg-canvas text-charcoal flex min-h-screen">
      <Sidebar navItems={studentNavItems} footerNavItems={studentFooterNavItems} />
      {/*Main Content Area*/}
      <main className="md:ml-64 flex-1 flex flex-col h-screen overflow-hidden">
        {/*Two Column Layout Container*/}
        <div className="flex-1 flex w-full bg-white h-full border-t md:border-t-0 border-hairline">
          {/*Left Column: Conversation List*/}
          <div className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 border-r border-hairline flex flex-col bg-white">
            {/*Search Header*/}
            <div className="p-6 border-b border-hairline">
              <h2 className="font-editorial text-2xl text-ink mb-4">Messages</h2>
              <div className="relative">
                <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  className="w-full pl-9 pr-4 py-2 border border-hairline bg-white rounded-md text-sm focus:border-ink focus:outline-none focus:ring-0 placeholder:text-muted"
                  placeholder="Search conversations..."
                  type="text"
                />
              </div>
            </div>
            {/*List*/}
            <div className="flex-1 overflow-y-auto">
              {/*Active Conversation Item*/}
              <div className="p-4 border-b border-hairline bg-bone cursor-pointer flex gap-3 items-center">
                <img
                  className="w-11 h-11 rounded-lg object-cover"
                  alt="Dr. Aris Thorne"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6hv8810zgGJZvPmS3Qd2moc7zbrwa7fTdNc3qB8g_ODKmnn-PhZUnz5zqqmQesbMuhCkCh7zNh1moYaRmZteN5qCgUYuD9B_fXhgDdSpq1Ln_LdEAnLcjmf-ez9AKWjbf-OW8psEXbLGUdE4zLetT4VTctlQ_2W7y8rRmXXTlw9EqQoMsqasMa3FU7G2qGgGDeyHJUDkvPQlZ41swmia0KjtB1a6lttbgwKDz0BUmjBJIDoUzHVmX"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-sm font-medium text-ink truncate">Dr. Aris Thorne</h3>
                    <span className="text-xs text-muted whitespace-nowrap">10:42 AM</span>
                  </div>
                  <p className="text-sm text-muted truncate">The preliminary data looks promising. Can we discuss...</p>
                </div>
              </div>
              {/*Inactive Conversation Items*/}
              <div className="p-4 border-b border-hairline hover:bg-bone cursor-pointer flex gap-3 items-center transition-colors">
                <div className="w-11 h-11 rounded-lg bg-bone flex items-center justify-center text-muted">
                  <Buildings size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-sm font-medium text-ink truncate">NexTech R&amp;D Dept</h3>
                    <span className="text-xs text-muted whitespace-nowrap">Yesterday</span>
                  </div>
                  <p className="text-sm text-ink font-medium truncate">Regarding the grant proposal structure...</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-ink flex-shrink-0"></div>
              </div>
              <div className="p-4 border-b border-hairline hover:bg-bone cursor-pointer flex gap-3 items-center transition-colors">
                <img
                  className="w-11 h-11 rounded-lg object-cover"
                  alt="Sarah Jenkins"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCq40VWBsgJCYBsPBhrMtlQZzF6mjLV6FQsOm5Eiq6A3_xrJkfob6AjTD3-pX5LfeCL8HbZckFxPSwEbuvUwj91lVi-eIlCTC1Pky5A6QvqtrjV5A5-iidzU6i1ZdhrGGTy32vUdIAslUIRdC8tVLyDk-NjG_GSfjgsbd7YBAfqW9WxRPxV22IqiLLUyOWr-fX1yGsTjW4u9Lz3BdAXLjUudD_B-hWcAIoL8AWvEOxGXjUaxAwkwZh"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-sm font-medium text-ink truncate">Sarah Jenkins</h3>
                    <span className="text-xs text-muted whitespace-nowrap">Mon</span>
                  </div>
                  <p className="text-sm text-muted truncate">I've attached the literature review draft.</p>
                </div>
              </div>
              <div className="p-4 border-b border-hairline hover:bg-bone cursor-pointer flex gap-3 items-center transition-colors">
                <div className="w-11 h-11 rounded-lg bg-bone flex items-center justify-center text-muted">
                  <UsersThree size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-sm font-medium text-ink truncate">Photovoltaic Synergy Team</h3>
                    <span className="text-xs text-muted whitespace-nowrap">Oct 12</span>
                  </div>
                  <p className="text-sm text-muted truncate">Meeting minutes from last Thursday.</p>
                </div>
              </div>
            </div>
          </div>
          {/*Right Column: Open Thread*/}
          <div className="flex-1 flex flex-col bg-white hidden md:flex">
            {/*Thread Header*/}
            <div className="px-8 py-4 border-b border-hairline flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  className="w-10 h-10 rounded-lg object-cover"
                  alt="Dr. Aris Thorne"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuClKEyQUjAFjqjO28swVGch2_IybaN3BeXxuygjQoznzJ5PQPMz2DWWOBKUErMqAI_oz0O7zNlUBEAxQhWd1d2a30ZkaZsEgFCdC-zvxFWGwiat2YGS2NOis2EVLZCuaK2m267nuiXiLFBrSk0Z3qwXPq7kQJl2C_tVUrhdCCpnPkEtNwjhEqA3ZyoM6ftknttjcC76S4kR-eMlbxNCsjJNz82NfUAPXjfU9qFhgcrXp2ODwFHSviGf"
                />
                <div>
                  <h2 className="text-base font-medium text-ink">Dr. Aris Thorne</h2>
                  <p className="text-xs text-muted">Department of Materials Science, ZIT</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-muted hover:text-ink transition-colors">
                  <MagnifyingGlass size={18} />
                </button>
                <button className="p-2 text-muted hover:text-ink transition-colors">
                  <DotsThreeVertical size={18} />
                </button>
              </div>
            </div>
            {/*Message History*/}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-4 bg-canvas">
              {/*Date Separator*/}
              <div className="flex justify-center my-2">
                <span className="bg-white border border-hairline px-3 py-1 rounded-full text-xs text-muted">Today</span>
              </div>
              {/*Received Message*/}
              <div className="flex flex-col gap-1 self-start max-w-[80%] lg:max-w-[60%]">
                <div className="bg-white border border-hairline p-4 rounded-xl text-sm text-charcoal rounded-tl-sm">
                  <p>Good morning. I've reviewed the latest simulation results for the urban infrastructure integration.</p>
                </div>
                <span className="text-xs text-muted ml-2">10:15 AM</span>
              </div>
              {/*Received Message (Consecutive)*/}
              <div className="flex flex-col gap-1 self-start max-w-[80%] lg:max-w-[60%] -mt-2">
                <div className="bg-white border border-hairline p-4 rounded-xl text-sm text-charcoal">
                  <p>The preliminary data looks promising. Can we discuss the thermal dissipation metrics? They seem slightly elevated compared to our initial model.</p>
                </div>
                <span className="text-xs text-muted ml-2">10:42 AM</span>
              </div>
              {/*Sent Message*/}
              <div className="flex flex-col gap-1 self-end max-w-[80%] lg:max-w-[60%] items-end">
                <div className="bg-bone p-4 rounded-xl text-sm text-charcoal rounded-tr-sm">
                  <p>Absolutely. I noticed the same anomaly around the 400nm wavelength absorption phase.</p>
                </div>
                <div className="flex items-center gap-1 mr-2">
                  <span className="text-xs text-muted">11:05 AM</span>
                  <Checks size={14} className="text-ink" />
                </div>
              </div>
              {/*Sent Message (Consecutive)*/}
              <div className="flex flex-col gap-1 self-end max-w-[80%] lg:max-w-[60%] items-end -mt-2">
                <div className="bg-bone p-4 rounded-xl text-sm text-charcoal">
                  <p>I'm compiling a comparative chart now. Should be ready for review by 2 PM. Are you available for a brief sync then?</p>
                </div>
                <div className="flex items-center gap-1 mr-2">
                  <span className="text-xs text-muted">11:07 AM</span>
                  <Check size={14} className="text-muted" />
                </div>
              </div>
            </div>
            {/*Input Area*/}
            <div className="p-6 border-t border-hairline">
              <div className="flex items-end gap-3">
                <button className="p-2 text-muted hover:text-ink transition-colors flex-shrink-0 mb-0.5">
                  <Paperclip size={18} />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    className="w-full resize-none border border-hairline bg-white rounded-md p-3 text-sm focus:border-ink focus:ring-0 focus:outline-none min-h-[44px] max-h-[120px]"
                    placeholder="Type a message..."
                    rows="1"
                    style={{ overflowY: "hidden" }}
                    onInput={(e) => {
                      e.target.style.height = "";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  />
                </div>
                <button className="bg-ink text-white px-5 py-2.5 rounded-md text-sm flex items-center gap-1.5 hover:bg-[#333333] active:scale-[0.98] transition-all mb-0.5">
                  <span>Send</span>
                  <PaperPlaneTilt size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
