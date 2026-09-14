import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getOnboardingStatus } from "../../services/onboardingService";
import LoadingState from "./LoadingState";

// Wraps every student route except /onboarding itself. Sends a student who
// hasn't completed the one-time questionnaire yet (fresh signup, or an
// older account) to /onboarding instead of straight into the dashboard —
// mirrors IndustryProfileGate's company-profile check, one layer in.
export default function StudentOnboardingGate({ children }) {
  const [status, setStatus] = useState("checking"); // checking | complete | incomplete

  useEffect(() => {
    let mounted = true;
    getOnboardingStatus()
      .then((completed) => {
        if (mounted) setStatus(completed ? "complete" : "incomplete");
      })
      .catch(() => {
        // Do not allow a failed check to bypass onboarding.
        if (mounted) setStatus("incomplete");
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") {
    return <LoadingState fullScreen label="Loading your workspace…" />;
  }

  if (status === "incomplete") {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
