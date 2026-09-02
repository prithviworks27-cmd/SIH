import DashboardLayout from "../../components/layout/DashboardLayout";

const inputClass =
  "border border-hairline rounded-md px-3 py-2.5 text-sm focus:border-ink focus:ring-0 focus:outline-none bg-white text-charcoal transition-colors";

function ToggleRow({ title, description, defaultChecked }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input defaultChecked={defaultChecked} className="sr-only peer" type="checkbox" />
        <div className="w-11 h-6 bg-bone border border-hairline peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-hairline after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ink" />
      </label>
    </div>
  );
}

export default function ProfileSettings() {
  return (
    <DashboardLayout>
      <header className="mb-10">
        <h2 className="font-editorial text-3xl text-ink tracking-tight">Profile Settings</h2>
        <p className="text-muted mt-2">Manage your personal information and preferences.</p>
      </header>

      <div className="bg-white border border-hairline rounded-xl p-8 mb-6">
        <h3 className="text-base font-medium text-ink mb-6 border-b border-hairline pb-3">Personal Information</h3>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full border border-hairline overflow-hidden bg-bone flex items-center justify-center shrink-0">
            <img
              className="w-full h-full object-cover"
              alt="Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfTSQqh-b-LjAXzyldqlfIvNOk06pl-LS1B2PAPFR5TGDL5MKGdhfbtj0cL6hsvk3I8qtEMcKBcJAR4ULRysIzZnXVLUM-0ZbHYjl2GkQu2F1oHXWJs8WI_7d7Pc7gmmr2hlPaIzV14ARj3-lQ5UYjMWVaa6_TFJB80gBPLKAzUjstAmbZ-s55xhdHEmmejd0DJRv6zm7zBr_LvN5JzbdaBuYAb1tpLoZhaE78l-VTtVTCSGsjcPUJ"
            />
          </div>
          <div>
            <button className="bg-ink text-white px-4 py-2 rounded-md text-sm hover:bg-[#333333] active:scale-[0.98] transition-all">
              Change Photo
            </button>
            <p className="text-sm text-muted mt-2">JPG, GIF or PNG. Max size of 800K</p>
          </div>
        </div>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-muted">First Name</label>
            <input className={inputClass} type="text" defaultValue="Jane" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-muted">Last Name</label>
            <input className={inputClass} type="text" defaultValue="Doe" />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs uppercase tracking-wide text-muted">Email Address</label>
            <input className={inputClass} type="email" defaultValue="jane.doe@university.edu" />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs uppercase tracking-wide text-muted">Phone Number</label>
            <input className={inputClass} type="tel" defaultValue="+1 (555) 123-4567" />
          </div>
        </form>
      </div>

      <div className="bg-white border border-hairline rounded-xl p-8 mb-6">
        <h3 className="text-base font-medium text-ink mb-6 border-b border-hairline pb-3">Security</h3>
        <form className="grid grid-cols-1 gap-4 max-w-md">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-muted">Current Password</label>
            <input className={inputClass} placeholder="••••••••" type="password" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-muted">New Password</label>
            <input className={inputClass} type="password" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-muted">Confirm New Password</label>
            <input className={inputClass} type="password" />
          </div>
        </form>
      </div>

      <div className="bg-white border border-hairline rounded-xl p-8 mb-6">
        <h3 className="text-base font-medium text-ink mb-6 border-b border-hairline pb-3">Notifications</h3>
        <div className="flex flex-col divide-y divide-hairline">
          <ToggleRow title="Email Notifications" description="Receive updates about new opportunities." defaultChecked />
          <ToggleRow title="SMS Alerts" description="Get text messages for important account alerts." />
          <ToggleRow title="Application Updates" description="Notify me when my application status changes." defaultChecked />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-10 border-t border-hairline pt-6 pb-10">
        <button className="border border-hairline text-charcoal px-5 py-2.5 rounded-md text-sm hover:bg-bone transition-colors">Cancel</button>
        <button className="bg-ink text-white px-5 py-2.5 rounded-md text-sm hover:bg-[#333333] active:scale-[0.98] transition-all">
          Save Changes
        </button>
      </div>
    </DashboardLayout>
  );
}
