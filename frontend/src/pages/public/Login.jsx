export default function Login() {
  return (
    <div className="h-full flex items-center justify-center bg-surface-container-lowest text-on-surface">
      <main className="w-full max-w-md p-lg">
      {/*Header / Logo*/}
      <div className="text-center mb-xl">
      <h1 className="font-headline-lg text-headline-lg font-bold text-primary mb-xs">AcademiaLink</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">Secure Access Portal</p>
      </div>
      {/*Login Form Container*/}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg">
      <form action="#" className="space-y-md" method="POST">
      {/*Email Field*/}
      <div>
      <label className="block font-label-md text-label-md text-on-surface mb-sm" htmlFor="email">Email Address</label>
      <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
      <span className="material-symbols-outlined text-outline" style={{ fontSize: "20px" }}>mail</span>
      </div>
      <input className="block w-full pl-xl pr-sm py-sm border border-outline-variant rounded bg-surface-container-lowest text-on-surface focus:ring-0 focus:border-primary-container font-body-md text-body-md placeholder-outline transition-colors" id="email" name="email" placeholder="colleague@university.edu" required type="email"/>
      </div>
      </div>
      {/*Password Field*/}
      <div>
      <div className="flex items-center justify-between mb-sm">
      <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
      <a className="font-body-sm text-body-sm text-primary hover:underline transition-all" href="#">Forgot password?</a>
      </div>
      <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
      <span className="material-symbols-outlined text-outline" style={{ fontSize: "20px" }}>lock</span>
      </div>
      <input className="block w-full pl-xl pr-sm py-sm border border-outline-variant rounded bg-surface-container-lowest text-on-surface focus:ring-0 focus:border-primary-container font-body-md text-body-md placeholder-outline transition-colors" id="password" name="password" placeholder="••••••••" required type="password"/>
      </div>
      </div>
      {/*Remember Me (Optional but good for professional forms)*/}
      <div className="flex items-center">
      <input className="h-4 w-4 text-primary-container border-outline-variant rounded focus:ring-primary-container focus:ring-offset-0 bg-surface-container-lowest" id="remember-me" name="remember-me" type="checkbox"/>
      <label className="ml-sm block font-body-sm text-body-sm text-on-surface-variant" htmlFor="remember-me">
                              Remember my institutional device
                          </label>
      </div>
      {/*Submit Button*/}
      <div className="pt-sm">
      <button className="w-full flex justify-center py-sm px-md border border-transparent rounded-DEFAULT shadow-sm font-label-md text-label-md text-white bg-primary-container hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container transition-colors" type="submit">
                              Login
                          </button>
      </div>
      </form>
      {/*Divider*/}
      <div className="mt-lg">
      <div className="relative">
      <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-outline-variant"></div>
      </div>
      <div className="relative flex justify-center text-sm">
      <span className="px-sm bg-surface-container-lowest text-on-surface-variant font-body-sm text-body-sm">
                                  Need an account?
                              </span>
      </div>
      </div>
      </div>
      {/*Sign Up Link*/}
      <div className="mt-lg text-center">
      <a className="font-label-md text-label-md text-primary-container hover:text-primary transition-colors hover:underline" href="#">
                          Apply for Access
                      </a>
      </div>
      </div>
      {/*Footer / Legal minimal*/}
      <div className="mt-lg text-center">
      <p className="font-body-sm text-body-sm text-outline">
                      © 2024 AcademiaLink Collaboration Portal.
                  </p>
      </div>
      </main>
    </div>
  );
}
