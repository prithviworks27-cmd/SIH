import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Landing from "./pages/public/Landing.jsx";
import Login from "./pages/public/Login.jsx";
import SignupRoleSelection from "./pages/public/SignupRoleSelection.jsx";

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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupRoleSelection />} />

          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/portfolio" element={<DigitalPortfolio />} />
          <Route path="/portfolio/edit" element={<DigitalPortfolioEdit />} />
          <Route path="/skill-assessment" element={<SkillAssessment />} />
          <Route path="/skill-profile/gap-report" element={<SkillProfileGapReport />} />
          <Route path="/skill-profile/graph" element={<SkillProfileGraph />} />
          <Route path="/skill-passport" element={<SkillPassportTrustLevels />} />
          <Route path="/learning-paths" element={<RecommendedLearningPaths />} />
          <Route path="/internships" element={<InternshipJobListings />} />
          <Route path="/internships/:jobId" element={<InternshipJobDetail />} />
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/messages" element={<MessagesInbox />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/proof-of-skill" element={<ProofOfSkillChallenge />} />
          <Route path="/match-breakdown" element={<ExplainableMatchBreakdown />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
