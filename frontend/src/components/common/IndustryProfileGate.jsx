import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCompanyProfile, isCompanyProfileComplete } from "../../services/companyProfileService";
import LoadingState from "./LoadingState";

// Wraps every /industry/* route except onboarding itself. Sends a recruiter
// who hasn't saved a company profile yet (fresh signup, or an older account
// that skipped it) to /industry/onboarding instead of straight into the
// dashboard — mirrors ProtectedRoute's role check, one layer in.
export default function IndustryProfileGate({ children }) {
  const [status, setStatus] = useState("checking"); // checking | complete | incomplete

  useEffect(() => {
    let mounted = true;
    getCompanyProfile()
      .then((profile) => {
        if (mounted) setStatus(isCompanyProfileComplete(profile) ? "complete" : "incomplete");
      })
      .catch(() => {
        // If the check fails, don't block the recruiter out of their dashboard.
        if (mounted) setStatus("complete");
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") {
    return <LoadingState fullScreen label="Loading your workspace…" />;
  }

  if (status === "incomplete") {
    return <Navigate to="/industry/onboarding" replace />;
  }

  return children;
}
