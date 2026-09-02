import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { getPostLoginRedirect } from "./utils/roleRedirect";
import LoadingState from "./components/common/LoadingState";

import Landing from "./pages/public/Landing.jsx";
import Login from "./pages/public/Login.jsx";
import SignupRoleSelection from "./pages/public/SignupRoleSelection.jsx";
import PortalPending from "./pages/public/PortalPending.jsx";

import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import CourseCatalog from "./pages/student/CourseCatalog.jsx";
import CourseDetail from "./pages/student/CourseDetail.jsx";
import DigitalPortfolio from "./pages/student/DigitalPortfolio.jsx";
import DigitalPortfolioEdit from "./pages/student/DigitalPortfolioEdit.jsx";
import SkillAssessment from "./pages/student/SkillAssessment.jsx";
import SkillProfileGapReport from "./pages/student/SkillProfileGapReport.jsx";
import SkillProfileGraph from "./pages/student/SkillProfileGraph.jsx";
import RecommendedLearningPaths from "./pages/student/RecommendedLearningPaths.jsx";
import InternshipJobListings from "./pages/student/InternshipJobListings.jsx";
import InternshipJobDetail from "./pages/student/InternshipJobDetail.jsx";
import MyApplications from "./pages/student/MyApplications.jsx";
import MessagesInbox from "./pages/student/MessagesInbox.jsx";
import Notifications from "./pages/student/Notifications.jsx";
import ProfileSettings from "./pages/student/ProfileSettings.jsx";
import ProofOfSkillChallenge from "./pages/student/ProofOfSkillChallenge.jsx";
import ExplainableMatchBreakdown from "./pages/student/ExplainableMatchBreakdown.jsx";
import CareerDigitalTwin from "./pages/student/CareerDigitalTwin.jsx";
import EmployerTrustLayer from "./pages/student/EmployerTrustLayer.jsx";

import IndustryDashboard from "./pages/industry/IndustryDashboard.jsx";
import CompanyProfile from "./pages/industry/CompanyProfile.jsx";
import PostOpportunity from "./pages/industry/PostOpportunity.jsx";
import ManageOpportunities from "./pages/industry/ManageOpportunities.jsx";
import ApplicantPipeline from "./pages/industry/ApplicantPipeline.jsx";
import CandidatesList from "./pages/industry/CandidatesList.jsx";
import CandidateDetail from "./pages/industry/CandidateDetail.jsx";
import IndustrySettings from "./pages/industry/IndustrySettings.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

const STUDENT_ROLES = ["student"];
const INDUSTRY_ROLES = ["industry"];
const ADMIN_ROLES = ["admin"];

function RootRoute() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingState fullScreen label="Checking your session…" />;
  }

  if (isAuthenticated) {
    return <Navigate to={getPostLoginRedirect(user.role)} replace />;
  }

  return <Landing />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupRoleSelection />} />
          <Route
            path="/portal-pending"
            element={
              <ProtectedRoute>
                <PortalPending />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <CourseCatalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <DigitalPortfolio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio/edit"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <DigitalPortfolioEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-assessment"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <SkillAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-profile/gap-report"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <SkillProfileGapReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-profile/graph"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <SkillProfileGraph />
              </ProtectedRoute>
            }
          />
          {/* Skill Passport was merged into the portfolio view — trust levels and
              evidence now live at /portfolio itself instead of a separate page. */}
          <Route path="/skill-passport" element={<Navigate to="/portfolio" replace />} />
          <Route
            path="/learning-paths"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <RecommendedLearningPaths />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internships"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <InternshipJobListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internships/:jobId"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <InternshipJobDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <MessagesInbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proof-of-skill"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <ProofOfSkillChallenge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/match-breakdown/:jobId"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <ExplainableMatchBreakdown />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-twin"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <CareerDigitalTwin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer-trust"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <EmployerTrustLayer />
              </ProtectedRoute>
            }
          />

          {/* Industry */}
          <Route
            path="/industry/dashboard"
            element={
              <ProtectedRoute allowedRoles={INDUSTRY_ROLES}>
                <IndustryDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/industry/profile"
            element={
              <ProtectedRoute allowedRoles={INDUSTRY_ROLES}>
                <CompanyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/industry/opportunities"
            element={
              <ProtectedRoute allowedRoles={INDUSTRY_ROLES}>
                <ManageOpportunities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/industry/opportunities/create"
            element={
              <ProtectedRoute allowedRoles={INDUSTRY_ROLES}>
                <PostOpportunity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/industry/applications"
            element={
              <ProtectedRoute allowedRoles={INDUSTRY_ROLES}>
                <ApplicantPipeline />
              </ProtectedRoute>
            }
          />
          <Route
            path="/industry/candidates"
            element={
              <ProtectedRoute allowedRoles={INDUSTRY_ROLES}>
                <CandidatesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/industry/candidates/:candidateId"
            element={
              <ProtectedRoute allowedRoles={INDUSTRY_ROLES}>
                <CandidateDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/industry/settings"
            element={
              <ProtectedRoute allowedRoles={INDUSTRY_ROLES}>
                <IndustrySettings />
              </ProtectedRoute>
            }
          />

          {/* Institution Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
