import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ROLES = [
  { id: "student", icon: "school", label: "Student" },
  { id: "industry", icon: "domain", label: "Industry Partner" },
  { id: "academician", icon: "science", label: "Academician" },
];

export default function SignupRoleSelection() {
  const navigate = useNavigate();
  const { register, loading, error: authError } = useAuth();

  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError("");
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setIsSubmitting(true);

    try {
      // Validate inputs
      if (!selectedRole) {
        setLocalError("Please select a role");
        setIsSubmitting(false);
        return;
      }

      if (!formData.fullname.trim()) {
        setLocalError("Full name is required");
        setIsSubmitting(false);
        return;
      }

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

      // Password requirements check
      if (formData.password.length < 8) {
        setLocalError("Password must be at least 8 characters");
        setIsSubmitting(false);
        return;
      }

      if (!/[A-Z]/.test(formData.password)) {
        setLocalError("Password must contain uppercase letter");
        setIsSubmitting(false);
        return;
      }

      if (!/[a-z]/.test(formData.password)) {
        setLocalError("Password must contain lowercase letter");
        setIsSubmitting(false);
        return;
      }

      if (!/[0-9]/.test(formData.password)) {
        setLocalError("Password must contain a number");
        setIsSubmitting(false);
        return;
      }

      // Call register function
      await register(
        formData.email,
        formData.password,
        formData.fullname,
        selectedRole
      );

      // Redirect to dashboard on successful registration
      navigate("/dashboard");
    } catch (err) {
      setLocalError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorMessage = localError || authError;

  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen flex flex-col font-body-md text-body-md antialiased">
      {/*Transactional Page - No Navigation Shell*/}
      <main className="flex-grow flex items-center justify-center py-xl px-margin md:px-margin sm:px-md">
        <div className="max-w-[600px] w-full">
          <div className="text-center mb-xl">
            <h1 className="font-headline-lg text-headline-lg md:font-headline-lg md:text-headline-lg font-headline-lg-mobile text-headline-lg-mobile text-primary mb-sm">
              Create your account
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Join AcademiaLink to collaborate and innovate.
            </p>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-xl">
            {/*Role Selection*/}
            <div>
              <label className="block font-label-md text-label-md text-primary mb-md">
                Select your role
              </label>
              <div className="grid grid-cols-3 gap-md">
                {ROLES.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`role-card border rounded-DEFAULT p-md cursor-pointer transition-colors text-center flex flex-col items-center justify-center gap-sm bg-surface-container-lowest ${
                      selectedRole === role.id
                        ? "border-primary ring-1 ring-primary"
                        : "border-outline-variant hover:border-outline"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-primary text-[32px]"
                    >
                      {role.icon}
                    </span>
                    <span className="font-label-md text-label-md text-on-surface">
                      {role.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/*Account Details*/}
            <div className="space-y-md">
              <div>
                <label
                  className="block font-label-sm text-label-sm text-on-surface-variant mb-xs"
                  htmlFor="fullname"
                >
                  Full Name
                </label>
                <input
                  className="w-full border border-outline-variant rounded-lg px-md py-[10px] bg-surface-container-lowest focus:border-primary focus:ring-0 font-body-md text-body-md placeholder:text-outline outline-none"
                  id="fullname"
                  name="fullname"
                  placeholder="Jane Doe"
                  type="text"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  disabled={isSubmitting || loading}
                  required
                />
              </div>
              <div>
                <label
                  className="block font-label-sm text-label-sm text-on-surface-variant mb-xs"
                  htmlFor="email"
                >
                  Work Email
                </label>
                <input
                  className="w-full border border-outline-variant rounded-lg px-md py-[10px] bg-surface-container-lowest focus:border-primary focus:ring-0 font-body-md text-body-md placeholder:text-outline outline-none"
                  id="email"
                  name="email"
                  placeholder="jane@university.edu"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting || loading}
                  required
                />
              </div>
              <div>
                <label
                  className="block font-label-sm text-label-sm text-on-surface-variant mb-xs"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="w-full border border-outline-variant rounded-lg px-md py-[10px] bg-surface-container-lowest focus:border-primary focus:ring-0 font-body-md text-body-md placeholder:text-outline outline-none"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting || loading}
                  required
                />
                <p className="text-xs text-on-surface-variant mt-xs">
                  Min 8 characters, 1 uppercase, 1 lowercase, 1 number
                </p>
              </div>
            </div>

            {/*Submit*/}
            <button
              className="w-full bg-primary-container text-on-primary rounded-lg py-[12px] px-md font-label-md text-label-md transition-colors hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <>
                  <span
                    className="material-symbols-outlined animate-spin inline-block mr-sm"
                    style={{ fontSize: "16px" }}
                  >
                    sync
                  </span>
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <div className="text-center font-body-sm text-body-sm text-on-surface-variant mt-md">
              Already have an account?{" "}
              <a
                className="text-primary hover:underline"
                href="/login"
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </main>

      {/*Footer - Transactional Context, simplified*/}
      <footer className="w-full py-xl px-margin flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-lowest border-t border-outline-variant font-body-sm text-body-sm text-secondary">
        <div>© 2024 AcademiaLink Collaboration Portal. All rights reserved.</div>
        <div className="flex gap-md">
          <a className="hover:text-primary transition-colors duration-200" href="#">
            Privacy Policy
          </a>
          <a
            className="hover:text-primary transition-colors duration-200"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="hover:text-primary transition-colors duration-200"
            href="#"
          >
            Contact Us
          </a>
          <a
            className="hover:text-primary transition-colors duration-200"
            href="#"
          >
            Help Center
          </a>
        </div>
      </footer>
    </div>
  );
}
