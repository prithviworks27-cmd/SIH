import DashboardLayout from "../../components/layout/DashboardLayout";

export default function ProfileSettings() {
  return (
    <DashboardLayout>
      <header className="mb-xl">
      <h2 className="font-headline-lg text-headline-lg text-primary">Profile Settings</h2>
      <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Manage your personal information and preferences.</p>
      </header>
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-xl mb-xl">
      <h3 className="font-headline-md text-headline-md text-on-background mb-lg border-b border-outline-variant pb-sm">Personal Information</h3>
      <div className="flex items-center gap-xl mb-lg">
      <div className="w-24 h-24 rounded-full border border-outline-variant overflow-hidden bg-surface-container flex items-center justify-center shrink-0">
      <img className="w-full h-full object-cover" data-alt="A professional headshot of a student in a bright, modern corporate academic setting. The lighting is soft and even, typical of a professional studio portrait. The subject is wearing business casual attire, looking directly at the camera with a subtle, confident smile. The background is a clean, neutral off-white wall." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfTSQqh-b-LjAXzyldqlfIvNOk06pl-LS1B2PAPFR5TGDL5MKGdhfbtj0cL6hsvk3I8qtEMcKBcJAR4ULRysIzZnXVLUM-0ZbHYjl2GkQu2F1oHXWJs8WI_7d7Pc7gmmr2hlPaIzV14ARj3-lQ5UYjMWVaa6_TFJB80gBPLKAzUjstAmbZ-s55xhdHEmmejd0DJRv6zm7zBr_LvN5JzbdaBuYAb1tpLoZhaE78l-VTtVTCSGsjcPUJ"/>
      </div>
      <div>
      <button className="bg-primary-container text-on-primary px-md py-sm rounded font-label-md text-label-md hover:bg-primary transition-colors">Change Photo</button>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">JPG, GIF or PNG. Max size of 800K</p>
      </div>
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-lg">
      <div className="flex flex-col gap-xs">
      <label className="font-label-md text-label-md text-on-background">First Name</label>
      <input className="border border-outline-variant rounded px-md py-sm font-body-md text-body-md focus:border-primary focus:ring-0 focus:outline-none bg-surface-container-lowest text-on-background" type="text" defaultValue="Jane"/>
      </div>
      <div className="flex flex-col gap-xs">
      <label className="font-label-md text-label-md text-on-background">Last Name</label>
      <input className="border border-outline-variant rounded px-md py-sm font-body-md text-body-md focus:border-primary focus:ring-0 focus:outline-none bg-surface-container-lowest text-on-background" type="text" defaultValue="Doe"/>
      </div>
      <div className="flex flex-col gap-xs md:col-span-2">
      <label className="font-label-md text-label-md text-on-background">Email Address</label>
      <input className="border border-outline-variant rounded px-md py-sm font-body-md text-body-md focus:border-primary focus:ring-0 focus:outline-none bg-surface-container-lowest text-on-background" type="email" defaultValue="jane.doe@university.edu"/>
      </div>
      <div className="flex flex-col gap-xs md:col-span-2">
      <label className="font-label-md text-label-md text-on-background">Phone Number</label>
      <input className="border border-outline-variant rounded px-md py-sm font-body-md text-body-md focus:border-primary focus:ring-0 focus:outline-none bg-surface-container-lowest text-on-background" type="tel" defaultValue="+1 (555) 123-4567"/>
      </div>
      </form>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-xl mb-xl">
      <h3 className="font-headline-md text-headline-md text-on-background mb-lg border-b border-outline-variant pb-sm">Security</h3>
      <form className="grid grid-cols-1 gap-lg max-w-md">
      <div className="flex flex-col gap-xs">
      <label className="font-label-md text-label-md text-on-background">Current Password</label>
      <input className="border border-outline-variant rounded px-md py-sm font-body-md text-body-md focus:border-primary focus:ring-0 focus:outline-none bg-surface-container-lowest text-on-background" placeholder="••••••••" type="password"/>
      </div>
      <div className="flex flex-col gap-xs">
      <label className="font-label-md text-label-md text-on-background">New Password</label>
      <input className="border border-outline-variant rounded px-md py-sm font-body-md text-body-md focus:border-primary focus:ring-0 focus:outline-none bg-surface-container-lowest text-on-background" type="password"/>
      </div>
      <div className="flex flex-col gap-xs">
      <label className="font-label-md text-label-md text-on-background">Confirm New Password</label>
      <input className="border border-outline-variant rounded px-md py-sm font-body-md text-body-md focus:border-primary focus:ring-0 focus:outline-none bg-surface-container-lowest text-on-background" type="password"/>
      </div>
      </form>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-xl mb-xl">
      <h3 className="font-headline-md text-headline-md text-on-background mb-lg border-b border-outline-variant pb-sm">Notifications</h3>
      <div className="flex flex-col gap-md">
      <div className="flex items-center justify-between py-sm">
      <div>
      <p className="font-label-md text-label-md text-on-background">Email Notifications</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Receive updates about new opportunities.</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
      <input defaultChecked className="sr-only peer" type="checkbox" value=""/>
      <div className="w-11 h-6 bg-surface-container border border-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-background after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container peer-checked:after:bg-on-primary"></div>
      </label>
      </div>
      <div className="flex items-center justify-between py-sm border-t border-outline-variant">
      <div>
      <p className="font-label-md text-label-md text-on-background">SMS Alerts</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Get text messages for important account alerts.</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
      <input className="sr-only peer" type="checkbox" value=""/>
      <div className="w-11 h-6 bg-surface-container border border-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-background after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container peer-checked:after:bg-on-primary"></div>
      </label>
      </div>
      <div className="flex items-center justify-between py-sm border-t border-outline-variant">
      <div>
      <p className="font-label-md text-label-md text-on-background">Application Updates</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Notify me when my application status changes.</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
      <input defaultChecked className="sr-only peer" type="checkbox" value=""/>
      <div className="w-11 h-6 bg-surface-container border border-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-background after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container peer-checked:after:bg-on-primary"></div>
      </label>
      </div>
      </div>
      </div>
      <div className="flex justify-end gap-md mt-xl border-t border-outline-variant pt-lg pb-xl">
      <button className="bg-surface-container-lowest border border-outline-variant text-on-background px-lg py-sm rounded font-label-md text-label-md hover:bg-surface-container transition-colors">Cancel</button>
      <button className="bg-primary-container text-on-primary px-lg py-sm rounded font-label-md text-label-md hover:bg-primary transition-colors">Save Changes</button>
      </div>
    </DashboardLayout>
  );
}
