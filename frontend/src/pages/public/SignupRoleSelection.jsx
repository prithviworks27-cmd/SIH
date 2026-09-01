import { useState } from "react";

const ROLES = [
  { icon: "school", label: "Student" },
  { icon: "domain", label: "Industry Partner" },
  { icon: "science", label: "Academician" },
  { icon: "account_balance", label: "Institution" },
];

export default function SignupRoleSelection() {
  const [selectedRole, setSelectedRole] = useState("");

  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen flex flex-col font-body-md text-body-md antialiased">
      {/*Transactional Page - No Navigation Shell*/}
      <main className="flex-grow flex items-center justify-center py-xl px-margin md:px-margin sm:px-md">
      <div className="max-w-[600px] w-full">
      <div className="text-center mb-xl">
      <h1 className="font-headline-lg text-headline-lg md:font-headline-lg md:text-headline-lg font-headline-lg-mobile text-headline-lg-mobile text-primary mb-sm">Create your account</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">Join AcademiaLink to collaborate and innovate.</p>
      </div>
      <form className="space-y-xl">
      {/*Role Selection*/}
      <div>
      <label className="block font-label-md text-label-md text-primary mb-md">Select your role</label>
      <div className="grid grid-cols-2 gap-md">
      {ROLES.map((role) => (
        <div
          key={role.label}
          onClick={() => setSelectedRole(role.label)}
          className={`role-card border rounded-DEFAULT p-md cursor-pointer transition-colors text-center flex flex-col items-center justify-center gap-sm bg-surface-container-lowest ${
            selectedRole === role.label
              ? "border-primary ring-1 ring-primary"
              : "border-outline-variant hover:border-outline"
          }`}
        >
          <span className="material-symbols-outlined text-primary text-[32px]">{role.icon}</span>
          <span className="font-label-md text-label-md text-on-surface">{role.label}</span>
        </div>
      ))}
      </div>
      <input id="selected-role" name="role" required type="hidden" value={selectedRole} readOnly/>
      </div>
      {/*Account Details*/}
      <div className="space-y-md">
      <div>
      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs" htmlFor="fullname">Full Name</label>
      <input className="w-full border border-outline-variant rounded-lg px-md py-[10px] bg-surface-container-lowest focus:border-primary focus:ring-0 font-body-md text-body-md placeholder:text-outline outline-none" id="fullname" name="fullname" placeholder="Jane Doe" required type="text"/>
      </div>
      <div>
      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs" htmlFor="email">Work Email</label>
      <input className="w-full border border-outline-variant rounded-lg px-md py-[10px] bg-surface-container-lowest focus:border-primary focus:ring-0 font-body-md text-body-md placeholder:text-outline outline-none" id="email" name="email" placeholder="jane@university.edu" required type="email"/>
      </div>
      <div>
      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs" htmlFor="password">Password</label>
      <input className="w-full border border-outline-variant rounded-lg px-md py-[10px] bg-surface-container-lowest focus:border-primary focus:ring-0 font-body-md text-body-md placeholder:text-outline outline-none" id="password" name="password" placeholder="••••••••" required type="password"/>
      </div>
      </div>
      {/*Submit*/}
      <button className="w-full bg-primary-container text-on-primary rounded-lg py-[12px] px-md font-label-md text-label-md transition-colors hover:bg-primary" type="submit">
                          Sign Up
                      </button>
      <div className="text-center font-body-sm text-body-sm text-on-surface-variant mt-md">
                          Already have an account? <a className="text-primary hover:underline" href="#">Login</a>
      </div>
      </form>
      </div>
      </main>
      {/*Footer - Transactional Context, simplified*/}
      <footer className="w-full py-xl px-margin flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-lowest border-t border-outline-variant font-body-sm text-body-sm text-secondary">
      <div>© 2024 AcademiaLink Collaboration Portal. All rights reserved.</div>
      <div className="flex gap-md">
      <a className="hover:text-primary transition-colors duration-200" href="#">Privacy Policy</a>
      <a className="hover:text-primary transition-colors duration-200" href="#">Terms of Service</a>
      <a className="hover:text-primary transition-colors duration-200" href="#">Contact Us</a>
      <a className="hover:text-primary transition-colors duration-200" href="#">Help Center</a>
      </div>
      </footer>
    </div>
  );
}
