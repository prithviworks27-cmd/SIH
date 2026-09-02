import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

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
import SkillPassportTrustLevels from "./pages/student/SkillPassportTrustLevels.jsx";
import RecommendedLearningPaths from "./pages/student/RecommendedLearningPaths.jsx";
import InternshipJobListings from "./pages/student/InternshipJobListings.jsx";
import InternshipJobDetail from "./pages/student/InternshipJobDetail.jsx";
import MyApplications from "./pages/student/MyApplications.jsx";
import MessagesInbox from "./pages/student/MessagesInbox.jsx";
import Notifications from "./pages/student/Notifications.jsx";
import ProfileSettings from "./pages/student/ProfileSettings.jsx";
import ProofOfSkillChallenge from "./pages/student/ProofOfSkillChallenge.jsx";
import ExplainableMatchBreakdown from "./pages/student/ExplainableMatchBreakdown.jsx";

const STUDENT_ROLES = ["student"];

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
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
          <Route
            path="/skill-passport"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <SkillPassportTrustLevels />
              </ProtectedRoute>
            }
          />
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
            path="/match-breakdown"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <ExplainableMatchBreakdown />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
