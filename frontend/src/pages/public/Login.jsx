import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setIsSubmitting(true);

    try {
      // Validate inputs
      if (!formData.email.trim()) {
        setLocalError("Email is required");
        setIsSubmitting(false);
        return;
      }

      if (!formData.password) {
        setLocalError("Password is required");
        setIsSubmitting(false);
        return;
      }

      // Call login function
      await login(formData.email, formData.password);

      // Redirect to dashboard on successful login
      navigate("/dashboard");
    } catch (err) {
      setLocalError(err.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorMessage = localError || authError;

  return (
    <div className="h-full flex items-center justify-center bg-surface-container-lowest text-on-surface">
      <main className="w-full max-w-md p-lg">
        {/*Header / Logo*/}
        <div className="text-center mb-xl">
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary mb-xs">
            AcademiaLink
          </h1>
        </div>

        {/*Login Form Container*/}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg">
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-md p-sm bg-error-container rounded border border-error text-on-error-container font-body-sm text-body-sm">
              <div className="flex items-start gap-sm">
                <span
                  className="material-symbols-outlined flex-shrink-0"
                  style={{ fontSize: "20px" }}
                >
                  error
                </span>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-md">
            {/*Email Field*/}
            <div>
              <label
                className="block font-label-md text-label-md text-on-surface mb-sm"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
                  <span
                    className="material-symbols-outlined text-outline"
                    style={{ fontSize: "20px" }}
                  >
                    mail
                  </span>
                </div>
                <input
                  className="block w-full pl-xl pr-sm py-sm border border-outline-variant rounded bg-surface-container-lowest text-on-surface focus:ring-0 focus:border-primary-container font-body-md text-body-md placeholder-outline transition-colors"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="colleague@university.edu"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/*Password Field*/}
            <div>
              <div className="flex items-center justify-between mb-sm">
                <label
                  className="block font-label-md text-label-md text-on-surface"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  className="font-body-sm text-body-sm text-primary hover:underline transition-all"
                  href="#"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
                  <span
                    className="material-symbols-outlined text-outline"
                    style={{ fontSize: "20px" }}
                  >
                    lock
                  </span>
                </div>
                <input
                  className="block w-full pl-xl pr-sm py-sm border border-outline-variant rounded bg-surface-container-lowest text-on-surface focus:ring-0 focus:border-primary-container font-body-md text-body-md placeholder-outline transition-colors"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/*Remember Me*/}
            <div className="flex items-center">
              <input
                className="h-4 w-4 text-primary-container border-outline-variant rounded focus:ring-primary-container focus:ring-offset-0 bg-surface-container-lowest"
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              <label
                className="ml-sm block font-body-sm text-body-sm text-on-surface-variant"
                htmlFor="remember-me"
              >
                Remember my credentials
              </label>
            </div>

            {/*Submit Button*/}
            <div className="pt-sm">
              <button
                className="w-full flex justify-center py-sm px-md border border-transparent rounded-DEFAULT shadow-sm font-label-md text-label-md text-white bg-primary-container hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <>
                    <span
                      className="material-symbols-outlined animate-spin mr-sm"
                      style={{ fontSize: "20px" }}
                    >
                      sync
                    </span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
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
            <a
              className="font-label-md text-label-md text-primary-container hover:text-primary transition-colors hover:underline"
              href="/signup"
            >
              REGISTER
            </a>
          </div>
        </div>

        {/*Footer*/}
        <div className="mt-lg text-center">
          <p className="font-body-sm text-body-sm text-outline">
            © 2024 AcademiaLink Collaboration Portal.
          </p>
        </div>
      </main>
    </div>
  );
}
