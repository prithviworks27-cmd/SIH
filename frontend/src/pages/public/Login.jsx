import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { EnvelopeSimple, LockSimple, ArrowClockwise, WarningCircle } from "@phosphor-icons/react";

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
    <div className="min-h-screen flex items-center justify-center bg-canvas text-charcoal px-4">
      <main className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="text-center mb-10">
          <h1 className="font-editorial italic text-3xl text-ink tracking-tight">
            AcademiaLink
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white border border-hairline rounded-lg p-8">
          {errorMessage && (
            <div className="mb-5 px-3 py-2.5 bg-pastel-red rounded-md">
              <div className="flex items-start gap-2">
                <WarningCircle size={18} weight="bold" className="text-pastel-red-ink flex-shrink-0 mt-0.5" />
                <p className="text-sm text-pastel-red-ink">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-wide text-muted mb-1.5" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeSimple size={17} className="text-muted" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2.5 border border-hairline rounded-md bg-white text-charcoal focus:ring-0 focus:border-ink placeholder:text-muted text-sm outline-none transition-colors"
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

            {/* Password */}
            <div>
              <label className="block text-xs uppercase tracking-wide text-muted mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockSimple size={17} className="text-muted" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2.5 border border-hairline rounded-md bg-white text-charcoal focus:ring-0 focus:border-ink placeholder:text-muted text-sm outline-none transition-colors"
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
              <a className="block mt-1.5 text-xs text-muted hover:text-ink transition-colors" href="#">
                Forgot password?
              </a>
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                className="h-4 w-4 rounded border-hairline text-ink focus:ring-0 focus:ring-offset-0"
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              <label className="ml-2 text-sm text-muted" htmlFor="remember-me">
                Remember my credentials
              </label>
            </div>

            {/* Submit */}
            <div className="pt-1">
              <button
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium text-white bg-ink hover:bg-[#333333] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <>
                    <ArrowClockwise size={16} className="animate-spin" />
                    Logging in
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-hairline" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-muted">Need an account?</span>
            </div>
          </div>

          {/* Sign up */}
          <div className="mt-6 text-center">
            <a
              className="text-xs uppercase tracking-wide text-ink hover:text-muted transition-colors"
              href="/signup"
            >
              REGISTER
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted">© 2024 AcademiaLink Collaboration Portal.</p>
        </div>
      </main>
    </div>
  );
}
