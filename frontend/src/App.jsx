import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import IndustryProfileGate from "./components/common/IndustryProfileGate";
import StudentOnboardingGate from "./components/common/StudentOnboardingGate";
import DashboardLayout from "./components/layout/DashboardLayout";
import { industryNavItems, industryFooterNavItems } from "./config/industryNavConfig";
import { useAuth } from "./hooks/useAuth";
import { getPostLoginRedirect } from "./utils/roleRedirect";
import LoadingState from "./components/common/LoadingState";

import Landing from "./pages/public/Landing.jsx";
import Login from "./pages/public/Login.jsx";
import SignupRoleSelection from "./pages/public/SignupRoleSelection.jsx";
import PortalPending from "./pages/public/PortalPending.jsx";
import NotFound from "./pages/public/NotFound.jsx";

import StudentOnboarding from "./pages/student/StudentOnboarding.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import CourseCatalog from "./pages/student/CourseCatalog.jsx";
import CourseDetail from "./pages/student/CourseDetail.jsx";
import DigitalPortfolio from "./pages/student/DigitalPortfolio.jsx";
import DigitalPortfolioEdit from "./pages/student/DigitalPortfolioEdit.jsx";
import PortfolioManage from "./pages/student/PortfolioManage.jsx";
import PublicPortfolio from "./pages/public/PublicPortfolio.jsx";
import SkillAssessment from "./pages/student/SkillAssessment.jsx";
import SkillTests from "./pages/student/SkillTests.jsx";
import SkillTestStart from "./pages/student/SkillTestStart.jsx";
import SkillTestResult from "./pages/student/SkillTestResult.jsx";
import DynamicTestRun from "./pages/student/DynamicTestRun.jsx";
import DynamicTestSummary from "./pages/student/DynamicTestSummary.jsx";
import MySkills from "./pages/student/MySkills.jsx";
import SkillGap from "./pages/student/SkillGap.jsx";
import CareerPath from "./pages/student/CareerPath.jsx";
import AICareerAdvisor from "./pages/student/AICareerAdvisor.jsx";
import SkillProfileGapReport from "./pages/student/SkillProfileGapReport.jsx";
import SkillProfileGraph from "./pages/student/SkillProfileGraph.jsx";
import RecommendedLearningPaths from "./pages/student/RecommendedLearningPaths.jsx";
import LearningPathStudy from "./pages/student/LearningPathStudy.jsx";
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
import CompanyOnboarding from "./pages/industry/CompanyOnboarding.jsx";
import CompanyProfile from "./pages/industry/CompanyProfile.jsx";
import PostOpportunity from "./pages/industry/PostOpportunity.jsx";
import ManageOpportunities from "./pages/industry/ManageOpportunities.jsx";
import ApplicantPipeline from "./pages/industry/ApplicantPipeline.jsx";
import CandidatesList from "./pages/industry/CandidatesList.jsx";
import CandidateDetail from "./pages/industry/CandidateDetail.jsx";
import IndustryMessages from "./pages/industry/IndustryMessages.jsx";
import IndustrySettings from "./pages/industry/IndustrySettings.jsx";
import SkillPrograms from "./pages/industry/SkillPrograms.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import StudentManagement from "./pages/admin/StudentManagement.jsx";
import SkillAnalytics from "./pages/admin/SkillAnalytics.jsx";
import CertificateReview from "./pages/admin/CertificateReview.jsx";

import FacultyDashboard from "./pages/academician/FacultyDashboard.jsx";
import StudentDetail from "./pages/academician/StudentDetail.jsx";

const STUDENT_ROLES = ["student"];
const INDUSTRY_ROLES = ["industry"];
const ADMIN_ROLES = ["admin"];
const ACADEMICIAN_ROLES = ["academician"];

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

// Persistent layout route for the industry section — mounted once and kept
// alive across /industry/* navigation via <Outlet/>, instead of each page
// re-mounting its own <DashboardLayout> (and thereby its own Sidebar +
// MessagesBar, refetching conversations from scratch every click).
function IndustryLayout() {
  return (
    <DashboardLayout navItems={industryNavItems} footerNavItems={industryFooterNavItems} title="Industry Portal" subtitle="Talent & Recruitment">
      <Outlet />
    </DashboardLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/passport/:userId" element={<PublicPortfolio />} />
          <Route path="/signup" element={<SignupRoleSelection />} />
          <Route
            path="/portal-pending"
            element={
              <ProtectedRoute>
                <PortalPending />
              </ProtectedRoute>
            }
          />

          {/* Not gated — this is the questionnaire itself. */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <StudentDashboard />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <CourseCatalog />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <CourseDetail />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <DigitalPortfolio />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio/edit"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <DigitalPortfolioEdit />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio/manage"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <PortfolioManage />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-assessment"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <SkillAssessment />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-tests"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <SkillTests />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-tests/:testId"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <SkillTestStart />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-tests/:testId/result"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <SkillTestResult />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-tests/dynamic/summary"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <DynamicTestSummary />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-tests/dynamic/run"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <DynamicTestRun />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <MySkills />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-gap"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <SkillGap />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-path"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <CareerPath />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-advisor"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <AICareerAdvisor />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-profile/gap-report"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <SkillProfileGapReport />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-profile/graph"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <SkillProfileGraph />
                </StudentOnboardingGate>
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
                <StudentOnboardingGate>
                  <RecommendedLearningPaths />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning-paths/study"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <LearningPathStudy />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/internships"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <InternshipJobListings />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/internships/:jobId"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <InternshipJobDetail />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <MyApplications />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <MessagesInbox />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <Notifications />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <ProfileSettings />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/proof-of-skill"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <ProofOfSkillChallenge />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/match-breakdown/:jobId"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <ExplainableMatchBreakdown />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-twin"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <CareerDigitalTwin />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer-trust"
            element={
              <ProtectedRoute allowedRoles={STUDENT_ROLES}>
                <StudentOnboardingGate>
                  <EmployerTrustLayer />
                </StudentOnboardingGate>
              </ProtectedRoute>
            }
          />

          {/* Industry */}
          <Route
            path="/industry/onboarding"
            element={
              <ProtectedRoute allowedRoles={INDUSTRY_ROLES}>
                <CompanyOnboarding />
              </ProtectedRoute>
            }
          />
          {/* Messages keeps its own bespoke full-height layout (ConversationInbox
              renders its own Sidebar, no MessagesBar) rather than joining the
              persistent IndustryLayout below — left as a standalone route. */}
          <Route
            path="/industry/messages"
            element={
              <ProtectedRoute allowedRoles={INDUSTRY_ROLES}>
                <IndustryProfileGate>
                  <IndustryMessages />
                </IndustryProfileGate>
              </ProtectedRoute>
            }
          />

          {/* Everything below shares one persistent DashboardLayout instance
              (sidebar + MessagesBar mount once, not per page) via IndustryLayout's
              <Outlet/>, instead of each page re-mounting its own. */}
          <Route
            element={
              <ProtectedRoute allowedRoles={INDUSTRY_ROLES}>
                <IndustryLayout />
              </ProtectedRoute>
            }
          >
            {/* Not gated — this is the page a recruiter uses to complete their
                profile if they land here via nav instead of the onboarding flow. */}
            <Route path="/industry/profile" element={<CompanyProfile />} />

            <Route element={<IndustryProfileGate><Outlet /></IndustryProfileGate>}>
              <Route path="/industry/dashboard" element={<IndustryDashboard />} />
              <Route path="/industry/opportunities" element={<ManageOpportunities />} />
              <Route path="/industry/opportunities/create" element={<PostOpportunity />} />
              <Route path="/industry/applications" element={<ApplicantPipeline />} />
              <Route path="/industry/candidates" element={<CandidatesList />} />
              <Route path="/industry/candidates/:candidateId" element={<CandidateDetail />} />
              <Route path="/industry/skill-programs" element={<SkillPrograms />} />
              <Route path="/industry/settings" element={<IndustrySettings />} />
            </Route>
          </Route>

          {/* Institution Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                <StudentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/skill-analytics"
            element={
              <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                <SkillAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/certificate-review"
            element={
              <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                <CertificateReview />
              </ProtectedRoute>
            }
          />

          {/* Faculty */}
          <Route
            path="/academician/dashboard"
            element={
              <ProtectedRoute allowedRoles={ACADEMICIAN_ROLES}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academician/students/:studentId"
            element={
              <ProtectedRoute allowedRoles={ACADEMICIAN_ROLES}>
                <StudentDetail />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
