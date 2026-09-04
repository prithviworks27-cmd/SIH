# Complete Product Feature & System Navigation Documentation

**Product:** SkillBridge — Academia–Industry Skill Intelligence & Collaboration Portal
**Repository layout:** `frontend/` (React 18 + Vite SPA) · `backend/` (Node/Express API) · Supabase (Postgres + Auth)
**Source of truth for this document:** direct inspection of routes, controllers, services, SQL schema, pages and components in this repository.
**Rule followed throughout:** nothing is described unless it exists in the code. Every feature carries an explicit status label.

### Status legend used in this document

| Label | Meaning |
| --- | --- |
| **Fully Implemented** | Frontend + backend + persistence all real and wired end-to-end. |
| **Partially Implemented** | Works, but one layer is mock/seed data, or a stated capability is only partly real. |
| **UI Only / Placeholder** | Renders and may respond to clicks, but changes no persisted state and calls no API. |
| **Planned / Not Implemented** | Referenced in naming, comments, or product concept, but no code exists. |
| **Broken / Needs Fix** | Code exists but a real defect prevents it working as intended. |

---

## 1. Product Overview

### What the platform is

SkillBridge is a four-sided web platform connecting **students**, **academic institutions (admin)**, **faculty/academicians**, and **industry recruiters** around one shared object: a **verified skill profile**.

Instead of a résumé (a self-reported claim), a student's employability here is a per-skill record carrying a score, a **trust level** (how the score was earned), and a timestamp. Everything else in the product — gap analysis, career readiness, learning recommendations, opportunity matching, the portfolio, institution analytics — is derived from that one record.

### The problem it solves

1. **Students don't know what they're missing.** Coursework doesn't map to job requirements. SkillBridge computes the gap explicitly against a chosen target role.
2. **Recruiters can't trust résumés.** Every claimed skill carries a provenance label (Self-Declared → Assessed → Assessment Verified → Project-Verified), so a recruiter sees *how* a skill was proven.
3. **Institutions have no visibility.** Skill data aggregated across the student body yields a real placement-readiness distribution and the institution's top skill gaps.

### Who uses it

| User | Entry point | Portal |
| --- | --- | --- |
| Student | Self-registration | `/dashboard` — Student Portal |
| Industry partner / recruiter | Self-registration | `/industry/dashboard` — Industry Portal |
| Academician (faculty) | Self-registration | `/academician/dashboard` — Faculty Portal |
| Institution admin | **Cannot self-register** — role assigned directly in the database | `/admin/dashboard` — Institution Portal |

### Core value proposition

> A skill claim on SkillBridge is only as strong as the evidence behind it — and every downstream decision (match score, career readiness, recruiter shortlist, institution analytics) is computed from that evidence rather than asserted.

### The main product loop — implementation status

```
  Student
     |
     v
  Assessment ------------> IMPLEMENTED (two paths: self-rating survey + 12 MCQ skill tests)
     |
     v
  Skill Profile ---------> IMPLEMENTED (Supabase table `skill_profile`, one row per user+skill)
     |
     v
  Skill Gap -------------> IMPLEMENTED (/skill-gap: target role vs. verified skills)
     |
     v
  Career Path -----------> IMPLEMENTED (/career-path: 4 roles ranked by readiness + roadmap)
     |
     v
  Learning --------------> PARTIAL (module lists are static mock content;
     |                     progress + completion ARE persisted per user)
     v
  Re-assessment ---------> PARTIAL (completing a path bumps the skill score by a
     |                     formula — it is not a real re-test)
     v
  Portfolio -------------> PARTIAL (basics editable + persisted; projects, certifications,
     |                     internships, achievements are seeded and read-only)
     v
  Opportunity Matching --> IMPLEMENTED (7-dimension weighted engine, real skill data in)
     |
     v
  Internship / Job ------> IMPLEMENTED (student applies for real; a real application
     |                     now appears in the recruiter's Applicant Pipeline
     v                     alongside the seeded demo entries)
  Placement -------------> PARTIAL ("Selected" stage exists and feeds institution
                           analytics, but institution/faculty analytics still
                           run over the mock candidate pool, not real students)
```

**The most important remaining caveat in this document:** the loop is closed on the *student* side (assessment → skills → gap → career → learning → portfolio → match → apply) and on the *industry* side (post → match → pipeline → select), and as of this update **the join between them is wired** — a real application now surfaces in the recruiter's Applicant Pipeline (`GET /api/industry/applications`) and a recruiter's stage move writes back to that same application (`PATCH /api/applications/:id/status`), visible on the student's own `/applications` page. What is **still** not wired is the *third* leg: Institution and Faculty analytics (§20, §21) still read the mock candidate pool, not real registered students, and the recruiter's Candidate Detail / Candidates List view still ranks mock candidates rather than real applicants. See §14 and §27.

---

## 2. User Roles / Ecosystem

Four roles exist, enforced in three places:

- **Database:** `users.role` with `CHECK (role IN ('student','academician','industry','admin'))` — `backend/src/database/schema.sql`
- **Backend registration validator:** only `student`, `academician`, `industry` accepted — `backend/src/validators/authValidator.js`
- **Frontend route guard:** `ProtectedRoute allowedRoles={[...]}` — `frontend/src/App.jsx`

### 2.1 Student

- **Purpose:** build a verified skill profile, discover gaps, close them, convert them into applications.
- **Who uses it:** anyone who self-registers and picks "Student".
- **Can access:** all 24 student routes.
- **Cannot access:** any `/industry/*`, `/admin/*`, `/academician/*` route — redirected to `/dashboard`.
- **Dashboard:** `/dashboard` → `StudentDashboard.jsx`
- **Sidebar:** `config/studentNavConfig.js` — 13 main items + Settings in footer.
- **Data they create:** skill test results, skill profile entries, target role, learning progress, course enrollments, applications, portfolio basics, sent messages, notification read-state, preferences.
- **Data they consume:** skill test catalog, career roles, courses, opportunities (seed + industry-posted), industry skill programs, notifications, conversations.
- **Interacts with:** Industry (applies to their opportunities, sees their skill programs). Faculty and Institution consume student data one-way — currently over the mock candidate pool (§20, §21).

### 2.2 Industry

- **Purpose:** post opportunities with explicit skill requirements, rank candidates by real skill fit, run a hiring pipeline, create skill development programs.
- **Can access:** 9 `/industry/*` routes.
- **Dashboard:** `/industry/dashboard` → `IndustryDashboard.jsx`
- **Sidebar:** `config/industryNavConfig.js` — 6 items + Settings.
- **Data they create:** company profile, opportunities, pipeline stage overrides, skill programs.
- **Data they consume:** candidate pool (mock), pipeline entries (seeded), computed match scores.
- **Interacts with:** Students — posted opportunities and skill programs are genuinely visible to students; candidate review is over mock data.

### 2.3 Academician (Faculty)

- **Purpose:** monitor assigned students' skill readiness and gaps.
- **Can access:** exactly 2 routes — `/academician/dashboard`, `/academician/students/:studentId`.
- **Sidebar:** `config/academicianNavConfig.js` — **1 item only** ("My Students"); footer array is empty (no Settings page exists for this role).
- **Data they create:** **none persisted.** The only action ("Recommend Learning") sets local component state.
- **Data they consume:** student roster + per-student detail, both derived from `mockData/candidates.js`.
- **Interacts with:** students one-way, read-only, over mock data.

### 2.4 Admin (Institution)

- **Purpose:** institution-wide analytics — readiness distribution, top skill gaps, demand-vs-supply, student roster.
- **Who uses it:** users whose `users.role` was set to `admin` **directly in the database**. There is no self-registration path and no admin-creation endpoint.
- **Can access:** 3 `/admin/*` routes.
- **Sidebar:** `config/adminNavConfig.js` — 3 items, no footer items.
- **Data they create:** none.
- **Data they consume:** aggregates computed in `institutionService.js` from the mock candidate pool + the real opportunity list + the pipeline.

### 2.5 Role summary table

| Role | Purpose | Dashboard | Main Features | Interacts With |
| --- | --- | --- | --- | --- |
| **Student** | Build & prove skills, find opportunities | `/dashboard` | Assessments, My Skills, Skill Gap, Career Path, Learning, Courses, Opportunities, Applications, Portfolio, Messages, Notifications, AI Advisor, Settings, Proof-of-Skill, Career Twin, Employer Trust, Match Breakdown | Industry (apply, programs); Faculty & Institution read their data |
| **Industry** | Hire on verified skill fit | `/industry/dashboard` | Company Profile, Post/Manage Opportunities, Candidates + match, Candidate Detail with tunable weights, Applicant Pipeline, Skill Programs, Settings | Students (opportunities, programs, and real applications all flow through); the Candidates search/ranking view still ranks a mock pool |
| **Academician** | Monitor student progress | `/academician/dashboard` | My Students roster, Student Detail (skills, gaps, internship activity), "Recommend Learning" (UI only) | Students (read-only, mock data) |
| **Admin** | Institution analytics | `/admin/dashboard` | Overview KPIs, Top Skill Gaps, Placement Readiness, Student Management, Skill Analytics (demand vs supply) | Aggregates student + industry data |

---

## 3. Authentication & Entry Flow

### 3.1 Two parallel authentication paths (both implemented, coexisting)

**Path A — Email/password (legacy JWT).** `authController.register`/`login` hash with bcrypt into `users.password`, sign a 7-day JWT (`{id, email, role}`), and set it as an **HttpOnly cookie** named `auth_token` (`utils/authCookie.js`) — `SameSite=None; Secure` in production, `SameSite=Lax` in development.

**Path B — Google OAuth via Supabase.** `AuthContext.loginWithGoogle` calls `supabase.auth.signInWithOAuth({provider:'google'})` redirecting to `/login`. On return, `onAuthStateChange` fires `syncSession`, which POSTs the Supabase access token to `/api/auth/sync`. That endpoint upserts a `users` row keyed by `auth_user_id`, applies the role stashed pre-redirect in `localStorage.pendingGoogleRole`, and issues the same HttpOnly JWT cookie.

`authMiddleware` accepts **either**: it first tries `supabase.auth.getUser(token)`; on failure it falls back to `jwt.verify`. `utils/resolveUserId.js` normalizes the two id spaces (`users.id` vs `users.auth_user_id`) so every controller scopes data identically.

### 3.2 Registration — `/signup` (`SignupRoleSelection.jsx`)

- **Role picker:** three cards — Student, Industry Partner, Academician. **Admin is deliberately absent.**
- **Fields:** Full Name, Work Email, Password.
- **Password policy (enforced client-side AND server-side):** ≥8 chars, ≥1 uppercase, ≥1 lowercase, ≥1 number.
- **Rate limit:** 5 registrations / 15 min (`registerLimiter`).
- **On success:** cookie set, user cached in `localStorage.user`, redirect via `getPostLoginRedirect(role)`.

### 3.3 Login — `/login` (`Login.jsx`)

- **Fields:** email, password, "Remember my credentials".
- **Rate limit:** 10 attempts / 15 min (`loginLimiter`). Also updates `users.last_login`.

Status notes on this page:
- **"Forgot password?"** is `<a href="#">` — **UI Only / Placeholder**. No reset flow, endpoint, or email service exists.
- **"Remember my credentials"** is bound to state but **never read**. Session length is always the JWT's fixed 7 days. **UI Only / Placeholder.**

### 3.4 Session handling

- Token lives in an HttpOnly cookie — never in `localStorage` (which holds only a non-sensitive cached user object).
- `AuthProvider` on mount: if Supabase is configured, checks for a Supabase session; otherwise restores the cached user then re-validates via `GET /api/auth/me`. A failed validation clears the cache and logs out.
- All API calls send `credentials: "include"`.

### 3.5 Protected routes & role gating

`ProtectedRoute`:
1. `loading` → full-screen "Checking your session…".
2. Not authenticated → `<Navigate to="/login" state={{from: location}} />`.
3. Authenticated but wrong role → `<Navigate to={getPostLoginRedirect(user.role)} />` — deliberately not a hardcoded `/dashboard`, which the in-code comment notes would infinite-loop for non-student roles.

`state.from` is captured but **never consumed** — after login the user always lands on their role's default dashboard, never the originally requested page. **Partially Implemented.**

### 3.6 Logout

`AuthContext.logout()`: Supabase sign-out → `POST /api/auth/logout` (clears cookie server-side) → clear `localStorage.user` → null user state. Triggered from the sidebar Logout button (all roles) and the Log Out card in student Settings.

### 3.7 The pending-portal fallback

`getPostLoginRedirect` returns `/portal-pending` for any null/unrecognized role — which occurs when a Google user completes OAuth without a role stashed. `PortalPending.jsx` shows "Your {role} portal is coming soon" plus a Logout button. It is the **only** handling for a roleless account; there is no in-app way to then choose a role. **Partially Implemented.**

### 3.8 Entry flow (actual routes)

```
   /  (RootRoute)
   |
   +- authenticated? --yes--> Navigate to getPostLoginRedirect(user.role)
   |                            student     -> /dashboard
   |                            industry    -> /industry/dashboard
   |                            admin       -> /admin/dashboard
   |                            academician -> /academician/dashboard
   |                            (null/other)-> /portal-pending
   +- no --> <Landing />
              |
     +--------+--------+
     v                 v
  /login            /signup
     |                 |
     |  +--------------+--------------+
     |  v                             v
     | email+password              Google OAuth
     | POST /api/auth/register     supabase.signInWithOAuth
     | POST /api/auth/login          -> redirect /login
     |       |                       -> onAuthStateChange
     |       |                       -> POST /api/auth/sync
     +-------+---------------+---------------+
                             v
              HttpOnly cookie `auth_token` set (7d JWT)
                             |
                             v
                   ProtectedRoute checks role
                             |
                             v
                     Role-specific dashboard
```

### 3.9 Profile setup

There is **no onboarding wizard**. A newly registered student lands on an already-populated dashboard because `assessmentService.getStoredSkillProfileOrDemo()` falls back to `buildDemoSkillProfile()` (a hardcoded 12-skill demo profile averaging 79%) and `portfolioService.getPortfolio()` seeds `DEFAULT_PORTFOLIO` into Supabase on first load. **A brand-new user therefore sees skills and projects they never entered.** Deliberate demo behaviour; marked **Partially Implemented / demo-seeded**.

---

## 4. Complete Site Map

Every route below is taken verbatim from `frontend/src/App.jsx`. **38 route definitions** exist (4 public, 25 student including 1 redirect, 9 industry, 3 admin, 2 faculty).

### 4.1 Public routes

```
/                      RootRoute  -> Landing (anonymous) or role dashboard (authenticated)
/login                 Login
/signup                SignupRoleSelection
/portal-pending        PortalPending          (protected, any authenticated role)
```

### 4.2 Student sitemap

```
Student Portal (sidebar: studentNavConfig.js)
├── /dashboard                      Dashboard              [nav]
├── /skill-assessment               Skill Assessment       [nav]  self-rating survey
├── /skill-tests                    Assessments            [nav]  12 MCQ domains + history
│   ├── /skill-tests/:testId               Take assessment
│   └── /skill-tests/:testId/result        Result screen
├── /skills                         My Skills              [nav]
├── /skill-gap                      Skill Gap              [nav]  target role selector
├── /career-path                    Career Path            [nav]  4 roles + roadmap
├── /ai-advisor                     AI Advisor             [nav]  Gemini-backed chat
├── /learning-paths                 Learning Paths         [nav]  gap-driven modules
├── /internships                    Internships/Jobs       [nav]  filters + match %
│   └── /internships/:jobId                Opportunity detail + Apply
├── /applications                   My Applications        [nav]  status table
├── /portfolio                      Portfolio              [nav]  digital portfolio
│   └── /portfolio/edit                    Edit basics
├── /messages                       Messages               [nav]  inbox + threads
├── /notifications                  Notifications          [nav]
└── /settings                       Settings               [footer nav]

Reachable but NOT in the sidebar (deep links / dashboard cards / in-page links):
├── /courses                        Course Catalog         (dashboard "Browse Full Catalog", notification notif-006)
│   └── /courses/:courseId                 Course detail + enroll
├── /skill-profile/gap-report       Skill Profile and Gap Report  (dashboard "View details")
├── /skill-profile/graph            Living Skill Graph            (test result "View My Skills")
├── /proof-of-skill                 Proof-of-Skill Challenge      (dashboard Career Tools)
├── /career-twin                    Career Digital Twin           (dashboard Career Tools)
├── /employer-trust                 Employer Trust Layer          (dashboard Career Tools)
├── /match-breakdown/:jobId         Explainable Match Breakdown   ("Why this match?")
└── /skill-passport                 -> redirects to /portfolio    (legacy alias)
```

### 4.3 Industry sitemap

```
Industry Portal (sidebar: industryNavConfig.js)
├── /industry/dashboard             Dashboard            [nav]
├── /industry/profile               Company Profile      [nav]
├── /industry/opportunities         Opportunities        [nav]  manage/close posted roles
│   └── /industry/opportunities/create     Post Opportunity  (button, not in sidebar)
├── /industry/applications          Applications         [nav]  kanban pipeline
├── /industry/candidates            Candidates           [nav]  ranked by match
│   └── /industry/candidates/:candidateId  Candidate Detail + tunable weights
├── /industry/skill-programs        Skill Programs       [nav]
└── /industry/settings              Settings             [footer nav]
```

### 4.4 Institution (Admin) sitemap

```
Institution Portal (sidebar: adminNavConfig.js)
├── /admin/dashboard                Dashboard        [nav]
├── /admin/students                 Students         [nav]
└── /admin/skill-analytics          Skill Analytics  [nav]
```

### 4.5 Faculty sitemap

```
Faculty Portal (sidebar: academicianNavConfig.js)
└── /academician/dashboard          My Students      [nav]  <- the ONLY sidebar item
    └── /academician/students/:studentId    Student Detail  (table link, not in sidebar)
```

### 4.6 Route reference table

| Route | Page component | Role | Purpose | Access | Main actions | Connected features |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | `RootRoute`/`Landing` | Public | Marketing entry | None | Login, Sign up | Auth |
| `/login` | `Login` | Public | Sign in | None | Email login, Google login | Auth, role redirect |
| `/signup` | `SignupRoleSelection` | Public | Register + pick role | None | Select role, register | Auth |
| `/portal-pending` | `PortalPending` | Any auth | Roleless fallback | Auth | Logout | Auth |
| `/dashboard` | `StudentDashboard` | Student | Progress summary | Auth+role | Navigate to gap report, opportunities, courses, career tools | Skills, applications, matching, courses |
| `/skill-assessment` | `SkillAssessment` | Student | Self-rating survey | Auth+role | Answer 12 questions, submit, retake | Skill profile |
| `/skill-tests` | `SkillTests` | Student | 12 MCQ domains + history | Auth+role | Search, filter, start, retake, view result | Skill profile, portfolio |
| `/skill-tests/:testId` | `SkillTestStart` | Student | Take a test | Auth+role | Answer, prev/next, submit, exit | Skill profile |
| `/skill-tests/:testId/result` | `SkillTestResult` | Student | Pass/fail result | Auth+role | View skills, retake | Skill profile |
| `/skills` | `MySkills` | Student | All skills by category | Auth+role | Go to assessments / gap | Skill profile |
| `/skill-gap` | `SkillGap` | Student | Gap vs target role | Auth+role | Change target role, assess a skill | Career path, learning |
| `/career-path` | `CareerPath` | Student | Role readiness + roadmap | Auth+role | Select role, close a gap | Skill gap, learning |
| `/ai-advisor` | `AICareerAdvisor` | Student | Grounded AI chat | Auth+role | Ask, use suggested prompts | Skill profile, target role, Gemini |
| `/learning-paths` | `RecommendedLearningPaths` | Student | Gap-driven modules + industry programs | Auth+role | Complete next module | Skill profile, re-assessment, industry programs |
| `/courses` | `CourseCatalog` | Student | Course catalog | Auth+role | Search, filter, enroll | Enrollments |
| `/courses/:courseId` | `CourseDetail` | Student | Course detail | Auth+role | Enroll | Enrollments |
| `/internships` | `InternshipJobListings` | Student | Browse opportunities | Auth+role | Filter by skill/mode/city/type, open detail | Matching engine, industry posts |
| `/internships/:jobId` | `InternshipJobDetail` | Student | Opportunity detail | Auth+role | Apply, "Why this match?" | Applications, matching |
| `/match-breakdown/:jobId` | `ExplainableMatchBreakdown` | Student | Full match explanation | Auth+role | Apply, Save for Later (no-op) | Matching engine |
| `/applications` | `MyApplications` | Student | Application history | Auth+role | Filter by status | Applications |
| `/portfolio` | `DigitalPortfolio` | Student | Employer-facing profile | Auth+role | Edit, share modal, download resume (print), skill evidence panel | Skills, assessments, portfolio tables |
| `/portfolio/edit` | `DigitalPortfolioEdit` | Student | Edit basics | Auth+role | Save headline/institution/graduation/bio | Portfolio, settings |
| `/messages` | `MessagesInbox` | Student | Conversations | Auth+role | Search, open thread, send, mark read | Messages tables |
| `/notifications` | `Notifications` | Student | Activity feed | Auth+role | Click (navigates), mark all read | Read-state table |
| `/settings` | `ProfileSettings` | Student | Account/privacy/security | Auth+role | Edit phone/course, toggles, visibility, change password, logout | Preferences, auth |
| `/proof-of-skill` | `ProofOfSkillChallenge` | Student | Coding challenge | Auth+role | Edit code, run tests, submit | Skill profile (Project-Verified) |
| `/career-twin` | `CareerDigitalTwin` | Student | Projected readiness | Auth+role | Go to learning paths | Skills, learning |
| `/employer-trust` | `EmployerTrustLayer` | Student | Verification preview | Auth+role | read-only | Skills, portfolio |
| `/skill-profile/gap-report` | `SkillProfileGapReport` | Student | Strengths + gaps report | Auth+role | Retake assessment, view path | Skills, learning |
| `/skill-profile/graph` | `SkillProfileGraph` | Student | Living skill graph | Auth+role | Begin challenge, explore courses | Skills, challenge, courses |
| `/industry/dashboard` | `IndustryDashboard` | Industry | Recruitment overview | Auth+role | View all, manage, post new | Opportunities, pipeline, programs |
| `/industry/profile` | `CompanyProfile` | Industry | Company details | Auth+role | Save profile | Opportunities (company name) |
| `/industry/opportunities` | `ManageOpportunities` | Industry | Manage posted roles | Auth+role | View applicants, close | Opportunities table |
| `/industry/opportunities/create` | `PostOpportunity` | Industry | Create a role | Auth+role | Pick skills, eligibility, publish | Matching, student listings |
| `/industry/applications` | `ApplicantPipeline` | Industry | Kanban pipeline | Auth+role | Advance stage, reject, contact (UI only) | Pipeline overrides |
| `/industry/candidates` | `CandidatesList` | Industry | Ranked candidates | Auth+role | Change opportunity, open candidate | Matching engine |
| `/industry/candidates/:candidateId` | `CandidateDetail` | Industry | Candidate + weights | Auth+role | Change opportunity, tune weights | Matching engine |
| `/industry/skill-programs` | `SkillPrograms` | Industry | Create/list programs | Auth+role | Create program | Student learning page |
| `/industry/settings` | `IndustrySettings` | Industry | Account info | Auth+role | read-only | Auth |
| `/admin/dashboard` | `AdminDashboard` | Admin | Institution KPIs | Auth+role | Drill to analytics/students | Institution service |
| `/admin/students` | `StudentManagement` | Admin | Full roster | Auth+role | read-only table | Institution service |
| `/admin/skill-analytics` | `SkillAnalytics` | Admin | Gaps + demand/supply | Auth+role | read-only | Opportunities, candidates |
| `/academician/dashboard` | `FacultyDashboard` | Academician | My students | Auth+role | View details | Faculty service |
| `/academician/students/:studentId` | `StudentDetail` | Academician | Student drill-down | Auth+role | Recommend learning (UI only) | Faculty service, pipeline |

---

## 5. Student Dashboard — Complete Documentation

**Route:** `/dashboard` · **Component:** `pages/student/StudentDashboard.jsx` · **Layout:** `DashboardLayout` (default student nav)

On mount it fires four parallel loads:

```js
getSkillProfile()            // services/skillsService.js
getApplications()            // services/applicationsService.js
getInternshipsWithMatch()    // services/matchService.js   -> .slice(0,2)
getCourses()                 // services/coursesService.js -> .slice(0,1)
```

### 5.1 Welcome Header

- **Purpose:** personalized greeting.
- **Data shown:** `user.name` from `AuthContext` (falls back to "Student"), plus a static subtitle.
- **Action / Navigation:** none.
- **Backend/data:** `GET /api/auth/me` -> `users.name`.
- **Status:** Fully Implemented.

### 5.2 Stat cards (3, component `StatCard`)

**Skill Match**
- **Purpose:** headline number for overall readiness.
- **Data shown:** `skillProfile.overallMatchPercent` — the mean of `min(currentScore / requiredScore, 1)` across all 15 catalog skills, times 100.
- **Action:** none (not clickable).
- **Backend/data:** `GET /api/assessments/skill-profile`, merged over the local/demo base in `assessmentService.getStoredSkillProfileOrDemo()`.
- **Connected features:** the same number drives the Skill Profile Graph, the Career Digital Twin's "current" figure, and gap ordering.
- **Status:** Fully Implemented (real once any assessment is taken; demo-seeded before that).

**Active Applications**
- **Purpose:** how many applications are still live.
- **Data shown:** count of applications whose `status` is neither `Closed` nor `Rejected`.
- **Backend/data:** `GET /api/applications` (real rows) **concatenated with 4 seeded demo applications** from `mockData/applications.js`.
- **Status:** **Partially Implemented** — the count always includes seeded demo rows, so it is never purely the user's own data.

**Upcoming Interviews**
- **Purpose:** interview-stage count.
- **Data shown:** applications with `status === "Interview"`.
- **Backend/data:** same source. No code path ever sets a real application's status to `Interview` — rows are inserted as `"Applied"` and never updated — so **this card can only be non-zero because of the seeded demo row `app-002`.**
- **Status:** **Partially Implemented / demo-driven.**

### 5.3 Skill Gap Analysis card

- **Purpose:** show the three widest gaps at a glance.
- **Data shown:** `skillProfile.skillGaps.slice(0,3)` rendered via `SkillProgress` — skills where `currentScore < requiredScore`, sorted by gap size descending.
- **Action:** "View details" link.
- **Navigation:** `/skill-profile/gap-report`.
- **Backend/data:** `skillsService.getSkillProfile()` derived from the merged skill profile; `requiredScore` comes from `SKILL_CATALOG` in `mockData/skills.js`.
- **Connected features:** Learning Paths generates one path per gap; Career Digital Twin projects improvement per gap; the Institution "Top Skill Gaps" chart uses the same threshold logic across the student body.
- **Status:** Fully Implemented.

### 5.4 Recommended Opportunities

- **Purpose:** top 2 opportunities by match score.
- **Data shown:** title, company, `match.overallScore` percent badge.
- **Action:** "View Opportunity" per card.
- **Navigation:** `/internships/:jobId`.
- **Backend/data:** `matchService.getInternshipsWithMatch()` — loads posted opportunities via `GET /api/industry/opportunities`, concatenates the 7 seeded jobs, scores each with `calculateMatch()` against the student's real skills plus portfolio evidence, sorts descending; the dashboard takes the first two.
- **Connected features:** the identical engine and score appear on `/internships`, `/internships/:jobId` and `/match-breakdown/:jobId` — there is no second scoring path anywhere.
- **Status:** Fully Implemented (catalog is seed + real posts).

### 5.5 Recommended Courses

- **Purpose:** surface a course.
- **Data shown:** the **first course in the catalog** — `getCourses().then(c => c.slice(0,1))`.
- **Action:** click card -> course detail; "Browse Full Catalog" -> `/courses`.
- **Backend/data:** `mockData/courses.js` (4 static courses).
- **Status:** **Partially Implemented.** Labelled "Recommended" but there is **no recommendation logic** — it is `courses[0]` regardless of the student's gaps. (Contrast Learning Paths, which genuinely is gap-driven.)

### 5.6 Career Tools (4 cards)

| Card | Route | What it does | Status |
| --- | --- | --- | --- |
| Preview Portfolio | `/portfolio` | Employer-facing profile view | Fully Implemented |
| Proof-of-Skill Challenge | `/proof-of-skill` | Python challenge -> Project-Verified trust level | Partially Implemented (heuristic grading, see 7.5) |
| Career Digital Twin | `/career-twin` | Projected readiness after learning | Fully Implemented (labelled "Estimate") |
| Employer Trust Layer | `/employer-trust` | Verification checklist preview | Fully Implemented (read-only) |

These four cards are **the only navigation path to those routes** — none appear in the sidebar.

### 5.7 Sidebar (`components/layout/Sidebar.jsx`)

- Fixed left rail (w-64) on desktop; on mobile a top bar with a hamburger opens it as an overlay with an X to close.
- Items come from the `navItems` prop (`studentNavConfig.js` by default); icons resolve through an `ICONS` map onto Phosphor icons, defaulting to `SquaresFour` for unknown names.
- Active-route styling via `NavLink`'s `isActive`.
- Footer renders `footerNavItems` (Settings) plus a **Logout** button calling `logout()` then `navigate("/login")`.
- Title/subtitle are props — "Student Portal / Academic Collaboration" by default, overridden per portal.
- **Status:** Fully Implemented, shared by all four roles.

### 5.8 Header, notifications, messages — what does NOT exist

- **No global top header bar** on dashboard pages. `DashboardLayout` renders only the sidebar plus a `<main>`.
- **No notification bell with an unread badge** anywhere in the chrome. Notifications are reachable only via the sidebar link.
- **No message indicator** in the chrome — `/messages` shows its own in-page unread count.
- **No global search** and **no profile avatar dropdown**.
- **Status:** header bar, notification badge, message badge, global search — all **Planned / Not Implemented.**

### 5.9 Dashboard elements explicitly NOT present

Charts (no charting library is installed — `frontend/package.json` has no chart dependency; every "chart" in this product is a CSS-width `div` bar), a recent-activity feed, alert banners, quick actions beyond the four Career Tools cards, and a profile-completion meter. All **Planned / Not Implemented**.

---

## 6. Student Profile

There is **no single "Profile" page.** A student's profile is deliberately split across three surfaces, each owning different fields — the code comments call this out explicitly to avoid two sources of truth.

### 6.1 Where each field lives

| Field | Owned by | Editable? | Stored in |
| --- | --- | --- | --- |
| Name | `users` table | **No** — read-only everywhere ("managed by your institution") | `users.name` |
| Email | `users` table | **No** — read-only | `users.email` |
| Role | `users` table | **No** | `users.role` |
| Phone | Settings | Yes (text input, saves on blur) | `notification_preferences.phone` |
| Course / Branch | Settings | Yes (text input, saves on blur) | `notification_preferences.course` |
| Headline / Major | Portfolio Edit | Yes | `portfolio_basics.headline` |
| Institution / College | Portfolio Edit | Yes | `portfolio_basics.institution` |
| Expected Graduation | Portfolio Edit | Yes (`type="month"`) | `portfolio_basics.expected_graduation` |
| Bio / Summary | Portfolio Edit | Yes (textarea) | `portfolio_basics.bio` |
| Avatar URL | seeded only | **No UI to change it** | `portfolio_basics.avatar_url` |
| Skills | Assessments | Indirectly (by being assessed) | `skill_profile` |
| Projects | seeded | **No** | `portfolio_projects` |
| Certifications | seeded | **No** | `portfolio_certifications` |
| Internships / Experience | seeded | **No** | `portfolio_internships` |
| Achievements | seeded | **No** | `portfolio_achievements` |
| Visibility settings | Settings | Yes | `notification_preferences.*_visibility` |

Settings shows College and Expected Graduation as **disabled inputs** with the note "College and graduation year come from your Portfolio — edit them there."

### 6.2 Fields the product does NOT have

**CGPA, branch as a structured field, year of study, roll number, resume upload, and profile photo upload do not exist for the logged-in student.** (Note: `year` and `institution` *do* exist on the mock candidate records that Faculty and Institution read — but those are not the logged-in student's own record.) A "Minimum CGPA 7.0" string is offered as an eligibility *suggestion* when a recruiter posts a role, but no student CGPA is ever stored or checked against it. **Planned / Not Implemented.**

**Profile completion percentage:** does not exist anywhere. **Planned / Not Implemented.**

### 6.3 How profile information is consumed

```
  users.name / .email
      -> Dashboard greeting, Portfolio header, Settings, Employer Trust ("Identity Verified")

  portfolio_basics (headline, institution, bio, avatar, graduation)
      -> Digital Portfolio header
      -> Settings (read-only mirror of institution + graduation)

  portfolio_projects / _certifications / _internships
      -> Digital Portfolio sections
      -> portfolioService.getStudentEvidence()
           -> matchingEngine: projects, certifications, experience dimensions
              (so portfolio content genuinely moves opportunity match percentages)
      -> Employer Trust Layer checklist counts
      -> SkillEvidencePanel (which project/cert backs a given skill)

  skill_profile
      -> everything: My Skills, Gap, Career Path, Learning, Matching, Portfolio, AI Advisor
```

**Important:** the Institution and Faculty dashboards do **not** read the logged-in student's profile. They read `mockData/candidates.js`. So "profile -> Institution" is **Planned / Not Implemented** as a real data path (§20, §21).

---

## 7. Assessment System

Two distinct assessment systems exist, both feeding the same `skill_profile` table.

### 7.1 System A — Self-Rating Assessment (`/skill-assessment`)

- **Source:** `mockData/assessmentQuestions.js` — 12 questions across 2 sections (Technical Skills: 8, Soft Skills: 4).
- **Format:** each question maps to exactly one `SKILL_CATALOG` skill; the same 4 options every time — Beginner (25), Intermediate (55), Advanced (80), Expert (95).
- **Scoring:** `assessmentService.scoreAssessment()` — the chosen option's score becomes that skill's `currentScore`; unanswered skills keep their previous score, so a partial retake never wipes existing data.
- **Trust level produced:** `Assessed` — capped deliberately, since self-rating is not evidence.
- **Draft autosave:** answers persist to `localStorage.skillAssessmentDraft` on every selection.
- **Already-completed guard:** if `completedAt` exists, the page shows a summary card ("You've already completed this assessment") with **View My Skill Profile** and **Retake Self-Assessment**, instead of forcing the form again.
- **Persistence:** on submit, every answered skill is pushed to `POST /api/assessments/skill-profile/upsert` in parallel (best-effort; failures are logged, not blocking).
- **Status:** Fully Implemented.

### 7.2 System B — Skill Tests / "My Assessments" (`/skill-tests`)

**12 assessment domains exist** in `mockData/skillTests.js` (1,454 lines of real question banks):

| # | Test id | Skill | Category | Duration | Pass mark |
| --- | --- | --- | --- | --- | --- |
| 1 | `python` | Python Programming | Technical Skill | 15 min | 70% |
| 2 | `sql` | SQL / Databases | Technical Skill | 15 min | 70% |
| 3 | `communication` | Communication | Soft Skill | 10 min | 70% |
| 4 | `javascript` | JavaScript | Technical Skill | 15 min | 70% |
| 5 | `react` | React | Technical Skill | 15 min | 70% |
| 6 | `dsa` | Data Structures & Algorithms | Technical Skill | 20 min | 70% |
| 7 | `cloud-aws` | Cloud Computing (AWS) | Technical Skill | 15 min | 70% |
| 8 | `machine-learning` | Machine Learning | Technical Skill | 20 min | 70% |
| 9 | `git-version-control` | Git & Version Control | Technical Skill | 12 min | 70% |
| 10 | `teamwork` | Teamwork | Soft Skill | 10 min | **75%** |
| 11 | `problem-solving` | Problem Solving | Soft Skill | 12 min | **80%** |
| 12 | `time-management` | Time Management | Soft Skill | 10 min | 70% |

Pass marks are per-test properties, not a magic number in the UI, so they can be tuned per skill in one place.

**Assessment list page (`/skill-tests`):**
- Search box over test titles; category filter (All Domains / Technical / Soft Skills); count line ("N of 12 domains").
- Each `SkillTestCard` shows question count, duration and a **last-result badge** (Verified / Not Passed with the score).
- **Assessment History section** below: every past attempt grouped per test, showing latest score, best score (with a trophy icon), attempt count, and date — with **View Result** and **Retake** buttons. Backed by `skill_test_results`, which never overwrites: both passed and failed attempts are kept as separate rows.

**Taking a test (`/skill-tests/:testId`):**
- One question per screen, progress bar (`(current+1)/total`), Previous / Next / Submit, and an Exit link.
- Validation: cannot advance or submit without selecting an option.
- **Security note:** `getSkillTestForAttempt()` strips `correctValue` from every question before handing them to the UI, so the answer key is never in browser memory during the attempt. Grading then re-reads the full definition at submit time.

**Scoring (`skillTestService.scoreSkillTest`):** `correct/total` -> `scorePercent`; `passed = scorePercent >= test.passingScore`; also returns a per-question `breakdown` (computed but **not rendered anywhere** — no answer review screen exists).

**Result screen (`/skill-tests/:testId/result`):** score percent, Passed/Not Passed pill, correct answers (or the required percent if failed), skill status ("Assessment Verified" or "Not Verified"), and a primary button — **View My Skills** (`/skill-profile/graph`) when passed, **Retake Assessment** when not.

**Status:** Fully Implemented, with one architectural caveat below.

### 7.3 Where grading actually happens

**Grading is client-side.** `POST /api/assessments/skill-tests/:testId/submit` accepts an already-computed result (`scorePercent`, `passed`, etc.) and only persists it. The backend does not hold the question bank and does not re-grade. This is documented in the controller comments as a deliberate scope decision, but it means **a user could submit an arbitrary score to the API.** Flagged as **Partially Implemented / integrity gap** — the honest statement is that assessment results are persisted server-side but not *verified* server-side.

### 7.4 Domain -> skill -> verification flow

```
  Domain (e.g. "python")
      -> skillName: "Python Programming"   (must match SKILL_CATALOG exactly)
      -> Questions (MCQ, one correct answer)
      -> Score = correct/total
      -> passed = score >= passingScore (70/75/80 per test)
      -> if passed:
             skill_profile UPSERT (user_id, skill_name)
                current_score   = MAX(existing, new)   <- a retake never lowers a verified score
                trust_level     = "Assessment Verified"
                proficiency_level = Expert>=90 / Advanced>=75 / Intermediate>=50 / Beginner
                last_updated    = now
      -> if failed: attempt row is still stored; skill profile untouched
```

### 7.5 Proof-of-Skill Challenge (`/proof-of-skill`) — a third assessment path

- **Content:** one hardcoded Python challenge (`challengesService.DATA_CLEANING_CHALLENGE`) — data cleaning on sensor data, with starter code and a 24:15 countdown timer.
- **UI:** a plain `<textarea>` code editor (no syntax highlighting, no real editor library), Reset, Run Tests, Submit.
- **Grading:** **heuristic, not real execution.** `runTests()` checks whether the submitted code is more than ~20 non-whitespace characters longer than the starter code; if so it awards 4/4, otherwise 1 or 2 at random. The code comment states this openly ("without pretending to execute untrusted code client-side").
- **Effect on passing (>=75%):** `verifySkillViaChallenge("Python Programming", score)` raises the skill's score and sets trust level to **Project-Verified**, synced to `skill_profile`.
- **Status:** **Partially Implemented.** The verification *plumbing* is entirely real and correctly wired; the *grading* is a placeholder. Because the heuristic is trivially satisfiable, Project-Verified is effectively obtainable by typing anything into the editor.

### 7.6 Connection to My Skills

Every assessment path writes to the same `skill_profile` table, and `skillsService.getSkillProfile()` is the single read path used by My Skills, the dashboard, the gap report, the skill graph, the portfolio, matching, and the AI Advisor. There is no page with its own hardcoded skill list.

---

## 8. My Skills

**Route:** `/skills` · **Component:** `MySkills.jsx`

- **Data:** `skillsService.getSkillProfile()` -> full profile, grouped into `Technical` then `Soft Skills`, sorted by score descending within each group.
- **Rendering:** `SkillCard` per skill — name, category, level label, score percent, progress bar, and a `SkillTrustBadge` (or an em-dash pill if Self-Declared).
- **Level bands (in `SkillCard`):** Expert >=90, Advanced >=70, Intermediate >=40, Beginner >0, Untested = 0.
- **Actions:** "Take an Assessment" -> `/skill-tests`; "View Skill Gap" -> `/skill-gap`.
- **Status:** Fully Implemented.

### 8.1 The trust-level ladder

Defined once in `mockData/skills.js` as `TRUST_LEVELS` with an explicit ordering array `TRUST_LEVEL_ORDER` and a `trustLevelRank()` helper:

| Rank | Trust level | How it is reached | Exists? |
| --- | --- | --- | --- |
| 0 | **Self-Declared** | Default state, score 0 | **Yes** — real |
| 1 | **Assessed** | Self-rating assessment, or a completed learning path | **Yes** — real |
| 2 | **Assessment Verified** | Passing a skill test | **Yes** — real |
| 3 | **Project-Verified** | Passing the Proof-of-Skill Challenge; also hardcoded on 2 seeded portfolio projects | **Yes** — real (grading is heuristic) |
| 4 | **Certified** | — | **Defined but never assigned by any code path** |
| 5 | **Institution-Verified** | — | **Defined but never assigned by any code path** |
| 6 | **Industry-Verified** | — | **Defined but never assigned by any code path** |

The badge component (`SkillTrustBadge`) has colour tones for all seven, and `mockData/candidates.js` uses some of the upper levels as static values on mock candidates — but **no runtime code ever promotes a real student's skill to Certified, Institution-Verified, or Industry-Verified.**

### 8.2 Actual lifecycle in this codebase

```
  Self-Declared  (score 0, default for every catalog skill)
        |
        | self-rating assessment  OR  completing a learning path
        v
  Assessed
        |
        | pass a skill test (>= passing score)
        v
  Assessment Verified          <- highest level reachable through assessment
        |
        | pass the Proof-of-Skill Challenge (>= 75%)
        v
  Project-Verified             <- highest level any real user can reach

  ---- ceiling of the implemented system ----

  Certified            [Planned / Not Implemented]
  Institution-Verified [Planned / Not Implemented] - no institution review UI or endpoint exists
  Industry-Verified    [Planned / Not Implemented] - no industry endorsement UI or endpoint exists
```

### 8.3 Score-merge rules (worth knowing)

- Skill tests and the challenge use `Math.max(existing, new)` — **a retake can never lower a verified score.**
- The self-rating assessment and learning-path re-assessment write unconditionally through `upsertSkillProfileEntry`, so a *lower* self-rating can reduce a score.
- `getStoredSkillProfileOrDemo()` layers three sources, weakest first: the demo/local base, then per-skill overrides from Supabase (authoritative when reachable). If the backend is unreachable it degrades to the local cache with a console warning rather than failing.

### 8.4 Skill Evidence Panel

Clicking a skill on the Portfolio opens `SkillEvidencePanel` — a modal listing what backs that skill: the assessment result ("Scored 85% — March 2026"), plus any portfolio project whose `skills` array contains it and any certification whose `relatedSkill` matches. If nothing backs it: "No evidence yet — this skill is self-declared." **Fully Implemented.**

---

## 9. Skill Gap Analysis

**Two different gap definitions exist in this product.** Both are real; they answer different questions.

### 9.1 Gap definition A — target-role gap (`/skill-gap`)

- **Question answered:** "Which skills does my chosen target role require that I don't have?"
- **Logic:** `careerRoleService.getRoleReadiness(roleId)` treats a career role as a synthetic opportunity and runs it through the **same** `calculateMatch()` engine every opportunity uses, but with `ROLE_READINESS_WEIGHTS = { skillMatch: 100, everything else: 0 }` — because role readiness is fundamentally "do you have the required skills", unlike an opportunity match which also weighs education/projects/location.
- **Matched vs missing rule:** a skill counts as *matched* if the student's `currentScore >= 50`; otherwise it is *missing* (with its current score shown, which may be non-zero).
- **UI:** a target-role `<select>` (4 roles), a readiness card ("N of M required skills verified"), a **Skills You Have** list with scores, and a **Missing Skills** list where each row links to `/skill-tests` ("Assess this skill ->").
- **Target role persistence:** `student_target_role` table via `POST /api/student/target-role`, with `localStorage.targetRoleId` as a synchronous cache so the select renders instantly, then reconciled from the backend. Default: `data-analyst`.
- **Status:** Fully Implemented.

### 9.2 Gap definition B — catalog-threshold gap (`skillsService.getSkillProfile`)

- **Question answered:** "Which of my skills are below their catalog-required proficiency?"
- **Logic:** `profile.filter(s => s.currentScore < s.requiredScore)`, each annotated with `gap = requiredScore - currentScore`, sorted by gap descending. `requiredScore` is a fixed per-skill constant in `SKILL_CATALOG` (e.g. Python 85, React 80, Power BI 70).
- **Used by:** the dashboard Skill Gap card, `/skill-profile/gap-report`, `/skill-profile/graph`, Career Digital Twin, and as the **fallback** in Learning Paths when the target role has no gaps.
- **Status:** Fully Implemented.

### 9.3 The Skill Profile & Gap Report (`/skill-profile/gap-report`)

- **Core Competency Overview:** Overall Proficiency label (Expert >=85 / Advanced >=70 / Intermediate >=50 / Developing), Primary Domain (the category of the top strong skill), and Identified Gaps count.
- **Validated Strengths:** every skill scoring >=70 (`STRONG_SKILL_THRESHOLD`), with level label and bar.
- **Identified Skill Gaps:** each gap with its level pill, bar, and the sentence "N points below the X% target for {category} readiness", plus a "View recommended path ->" link to `/learning-paths`.
- **Header action:** "Retake Assessment" -> `/skill-assessment`. Shows "Last assessed: {date}".
- **Status:** Fully Implemented.

### 9.4 Readiness percentage — the two formulas

| Where | Formula |
| --- | --- |
| `overallMatchPercent` (dashboard, graph, digital twin) | mean over all 15 catalog skills of `min(currentScore/requiredScore, 1)`, times 100 |
| `readinessPercent` (skill gap, career path, AI advisor) | `matchedSkills.length / requiredSkills.length` for the selected role, times 100 |

These are different numbers by design, and the UI labels them differently ("Skill Match" vs "Readiness for {Role}").

### 9.5 Flow

```
  skill_profile (verified skills, per user)
            +
  CAREER_ROLES[targetRole].requiredSkills
            |
            v
  calculateMatch(student, role, {skillMatch:100})
            |
            +--> readinessPercent
            +--> matchedSkills[]  -> "Skills You Have"
            +--> missingSkills[]  -> "Missing Skills"
                        |
                        v
            learningPathsService.getLearningPaths()
                        |
                        v
            one learning path per missing skill
                        |
                        v
            complete final module -> re-assessment -> score bumped
                        |
                        v
            skill_profile updated -> readiness recomputed everywhere
```

This loop genuinely closes: completing a learning path raises the score, which changes the missing-skills list, which changes readiness on the next load.

---

## 10. Career Path / Career Intelligence

**Route:** `/career-path` · **Component:** `CareerPath.jsx`

### 10.1 The four career roles (`mockData/careerRoles.js`)

| id | Title | Category | Required skills |
| --- | --- | --- | --- |
| `data-analyst` | Data Analyst | Data & Analytics | Python Programming, SQL / Databases, Power BI, Statistics, Excel |
| `frontend-developer` | Frontend Developer | Software Engineering | JavaScript, React, Git & Version Control, Problem Solving |
| `cloud-engineer` | Cloud Engineer | Infrastructure | Cloud Computing (AWS), Git & Version Control, Problem Solving, Python Programming |
| `ml-engineer` | Machine Learning Engineer | Data & Analytics | Python Programming, Machine Learning, Data Structures & Algorithms, Statistics |

Skill names must match `SKILL_CATALOG` exactly — a mismatch would silently render as permanently missing.

### 10.2 Page features

**Recommended Roles** — all four roles scored via `getRankedRoleReadiness()` (a `Promise.all` over `getRoleReadiness`), sorted by readiness descending, shown as clickable cards with category, title and readiness percent. Clicking one selects it **and persists it as the target role** — so this page and `/skill-gap` share one selection.

**Selected Role panel** — title, readiness percent, description, **Strong Skills** (matched) and **Needs Improvement** (missing) lists, and a "Close a Skill Gap" button -> `/skill-tests`.

**Career Roadmap** — a 7-step vertical track from the role's `roadmap` array, e.g. for Data Analyst: Current Skills -> Learn Power BI -> Improve Statistics -> Complete Project -> Re-assessment -> Internship -> Data Analyst.

### 10.3 Roadmap progress — an honest limitation

`currentIndex` is computed as: **all steps done if `missingSkills.length === 0`, otherwise only step 0 ("Current Skills")**. There is no per-step progress tracking. The in-code comment states this is deliberate — marking later steps complete would overstate readiness, since no page tracks project completion, internship status, etc.

**Status:** Career Path is **Fully Implemented** for role ranking, readiness, and gap lists; the **roadmap step tracking is Partially Implemented** (binary, not stepwise).

### 10.4 Career Digital Twin (`/career-twin`)

- **Current Profile:** `overallMatchPercent`.
- **Projected After Learning Paths:** re-computes the same formula after adding **+25 points (capped at `requiredScore`)** to every skill that currently has a learning path.
- **Skill Gaps Driving This Projection:** top 5 gaps, each showing `current% -> projected% (est.)` with a two-layer bar.
- Every projected figure is explicitly badged **"Estimate"** and the copy says "estimated, not guaranteed".
- **Status:** Fully Implemented (an honest, clearly-labelled heuristic projection).

### 10.5 Connections

```
  skill_profile ──► Career Path readiness ──► target role stored (student_target_role)
                                                    │
                    ┌───────────────────────────────┼──────────────────────────┐
                    ▼                               ▼                          ▼
              /skill-gap                    /learning-paths              /ai-advisor
         (same readiness object)      (paths built from missingSkills)  (context sent to Gemini)
```

Opportunity matching does **not** read the target role — it scores against each opportunity's own skill list independently.

---

## 11. Learning / Skill Development

**Route:** `/learning-paths` · **Component:** `RecommendedLearningPaths.jsx`

### 11.1 How paths are generated

`learningPathsService.getLearningPaths()`:
1. Gets `getTargetRoleReadiness()` -> `missingSkills`.
2. If there are none, falls back to the top 6 threshold-based gaps, so the page is never empty for a role-ready student.
3. For each gap skill, builds a path: title `Close the gap: {skill}`, duration `modules.length * 2 Weeks`, the module list from `MODULES_BY_SKILL`, the persisted completion count, a progress percent, and a recommended project from `PROJECTS_BY_SKILL`.

**Module content** (`mockData/learningPathModules.js`) is hand-authored per skill — e.g. React: "React Fundamentals", "Hooks & State Management", "API Integration", "Build & Deploy a React Project". Unknown skills fall back to a generic 3-module sequence. **These are titles only — there is no lesson content, video, or material behind any module.**

**Recommended projects** (`mockData/recommendedProjects.js`) — one brief per skill, e.g. Power BI -> "Dashboard Building Project: Build an interactive sales dashboard from a raw CSV dataset."

### 11.2 Per-path card contents

Title, duration pill, progress bar with percent, module checklist (completed modules struck through with a filled check), the recommended project, and a **"Complete Next Module"** button (becomes "Path Complete ✓" when finished).

### 11.3 Completing a module — what actually happens

`completeNextModule(skillName)`:
1. Increments the count locally, persists to `localStorage`, and calls `POST /api/student/learning-progress` -> `learning_path_progress` table (unique per user+skill).
2. If this was the **final** module, calls `reassessSkillOnPathComplete(skillName)`:
   - New score = `min(requiredScore, max(currentScore, 40) + 25)` — capped at the required bar, so a path can bring a skill to "ready" but not beyond.
   - Trust level: promoted from `Self-Declared` to `Assessed`; an already-higher level is left intact (so completing a path never *downgrades* an Assessment-Verified skill).
   - Pushed to `POST /api/assessments/skill-profile/upsert`.
3. The page reloads the paths and shows a green banner: "{skill} path complete — your skill level was updated from this re-assessment."

**Status:** progress tracking and the score update are **Fully Implemented**; the "re-assessment" is **Partially Implemented** — it is a formula, not a re-test. The code comment is explicit that a real skill test still yields stronger, test-backed verification.

### 11.4 Industry Programs section

Below the paths, `getIndustryPrograms()` (which delegates to `skillProgramsService.getAllSkillPrograms()`) renders every program — the 2 seeded ones from `mockData/industryPrograms.js` **plus every program any industry user has created**, read live from `GET /api/industry/skill-programs`. Each card shows title, company, duration in weeks, and the full week-by-week focus list.

**This is one of the few genuinely cross-role live data paths in the product:** a recruiter creating a program at `/industry/skill-programs` makes it appear on every student's Learning page. **Fully Implemented.**

### 11.5 Course Catalog (`/courses`, `/courses/:courseId`) — a separate learning surface

- 4 static courses in `mockData/courses.js` (title, provider, duration, level, tags).
- **Filters:** search box, plus checkbox groups for Category (4 options, keyword-matched against tags), Duration (Short <4wks / Medium 4-8 / Extensive 8+, parsed from the duration string) and Provider (3 options).
- **Enroll** button on both the catalog and the detail page -> `POST /api/student/enrollments` -> `course_enrollments` table (unique per user+course).
- **Status:** **Partially Implemented.** Enrollment is genuinely persisted, but enrolling unlocks no content, tracks no progress, and feeds nothing back into the skill profile. Courses are also **not** gap-driven — unlike Learning Paths, the catalog has no relationship to the student's skills.

### 11.6 The learning loop

```
  Skill Gap (missing skills for target role)
        v
  Recommended Learning  (one path per missing skill, modules + project)
        v
  Complete Next Module  -> learning_path_progress (persisted)
        v
  Final module completed?
        v  yes
  Re-assessment (formula: +25, capped at requiredScore; trust -> Assessed)
        v
  skill_profile updated
        v
  Readiness / gap / match percentages all recompute on next load
```

---

## 12. Opportunities / Internships / Jobs

### 12.1 One shared opportunity store

`internshipsService.js` is the single source for both sides of the platform:

```
  allOpportunities() = [ ...posted from Supabase , ...7 seeded jobs ]
                          |                            |
       GET /api/industry/opportunities        mockData/internships.js
       (readable by ANY authenticated user)   (frontend-only demo catalog)
```

- `getInternships()` — **student view**: only `status === "Active"`.
- `getAllOpportunitiesIncludingInactive()` — **industry/institution view**: every status.
- Posted opportunities are listed **first** (newest activity), seed data after.

**This means an opportunity a recruiter posts genuinely appears in the student listing.** Confirmed real, not two disconnected datasets. **Fully Implemented.**

### 12.2 The 7 seeded opportunities

| id | Title | Company | Type | Location | Duration | Stipend |
| --- | --- | --- | --- | --- | --- | --- |
| job-001 | Machine Learning Engineer Intern | TechCorp AI Labs | Internship | Remote | 3 Months | ₹25,000/mo |
| job-002 | Junior Backend Developer | Global Systems Solutions | Full-time | Bangalore (Hybrid) | Full-time role | ₹6,00,000/yr |
| job-003 | Frontend Engineer Intern | Creative Digital Agency | Internship | Mumbai | 6 Months | ₹18,000/mo |
| job-004 | Full Stack Developer Intern | Nexus Systems Institute | Internship | Remote | 4 Months | ₹20,000/mo |
| job-005 | Data Analyst Intern | Global Health Initiative | Internship | Remote | 3 Months | ₹15,000/mo |
| job-006 | Cloud Infrastructure Intern | Acme Software Solutions | Internship | Bangalore (Hybrid) | 6 Months | ₹22,000/mo |
| job-007 | Materials Science Research Intern | Zurich Institute of Technology — R&D | Internship | Zurich, Switzerland (Hybrid) | 6 Months | 3,500 CHF/mo |

Each carries `skills[]` (matched against `SKILL_CATALOG`), `eligibility[]` as `{label, met}` pairs, `overview[]`, and `responsibilities[]`.

### 12.3 Listings page (`/internships`)

**Filters (all client-side, all real):**

| Filter | Options | Source |
| --- | --- | --- |
| Skills | 4 fixed: Python Programming, React, SQL / Databases, Cloud Computing (AWS) | Hardcoded `SKILL_FILTERS` |
| Work Mode | Remote, Hybrid, On-site | `WORK_MODES` in `utils/locationUtils.js` |
| Location | "Remote" + **every distinct city actually present** in the loaded list | `getDistinctCities(jobs)` — dynamic, so cities from newly-posted roles appear automatically |
| Type | Full-time, Internship (both pre-checked) | Hardcoded `TYPE_FILTERS` |

**Location parsing** (`utils/locationUtils.js`) splits legacy free-text location strings into `{city, mode}` — `"Bangalore (Hybrid)"` -> `{city:"Bangalore", mode:"Hybrid"}`, `"Remote"` -> `{city:"Remote", mode:"Remote"}`, `"Mumbai"` -> `{city:"Mumbai", mode:"On-site"}` (no stated mode is assumed on-site). This avoids migrating existing records while letting every card, detail view and filter read location consistently.

**Each result row shows:** title, type pill, mode pill, company, city, duration, stipend, **green pills for matched skills, grey pills for missing skills**, a "Missing N of M required skills" line, the match percent in large type, and a View Details button. Sorted by match score descending. Result count shown.

**Status:** Fully Implemented.

### 12.4 Opportunity Detail (`/internships/:jobId`)

- Header: title, company, "N% Skill Match", a **"Why this match?"** link -> `/match-breakdown/:jobId`, and the **Apply Now** button.
- Body: Overview paragraphs, Key Responsibilities list, Required Competencies pills.
- Sidebar: Location, Mode, Duration, Compensation, Commitment.
- Apply button state: "Apply Now" -> "Applying…" -> "Applied ✓" (disabled). Duplicate applications surface the message "You've already applied to this opportunity."
- Not-found state: a proper `EmptyState` with a back action.
- **Status:** Fully Implemented.

### 12.5 Who does what

| Question | Answer |
| --- | --- |
| Who creates opportunities? | Industry users, at `/industry/opportunities/create`. |
| Who sees them? | Every authenticated user — the GET endpoint is deliberately not role-restricted, because students need posted roles alongside the seed catalog. |
| Who can apply? | Students only (`/internships/*` is student-gated; the applications API scopes to the calling user). |
| Who evaluates applications? | **The recruiter who posted the opportunity**, via `/industry/applications`. Real applications now populate that pipeline (§14.4). |
| How does matching work? | §13. |

---

## 13. Opportunity Matching System

**File:** `frontend/src/services/matchingEngine.js` — one shared engine used by *every* page that shows a match percentage. No page carries a hardcoded percentage.

### 13.1 The seven dimensions and their default weights

```js
DEFAULT_WEIGHTS = {
  skillMatch:     40,
  education:      15,
  projects:       10,
  certifications: 10,
  experience:     10,
  location:        5,
  other:          10,   //  total = 100
}
```

The final score is `round(weightedSum / totalWeight)` — normalized, so weights need not sum to 100 (which is what allows the recruiter's tunable sliders in §19).

### 13.2 What each dimension actually computes

| Dimension | Real data? | Computation |
| --- | --- | --- |
| **Skill Match** | **Yes — fully real** | For each required skill, look up the student's profile by normalized name; matched if `currentScore >= 50`. Score = `matched/required * 100`. |
| **Education** | **Partially** | Reads the opportunity's `eligibility[]` array; score = `met/total * 100`. Because a recruiter always posts criteria with `met: true` (they are defining a requirement, not evaluating a person), **this dimension is effectively always 100% for posted roles.** No student attribute is ever checked against it. |
| **Projects** | **Yes — real** | `min(portfolio.projects.length * 40, 100)`. Fed by `portfolioService.getStudentEvidence()`. |
| **Certifications** | **Yes — real** | `min(portfolio.certifications.length * 50, 100)`. |
| **Experience** | **Yes — real** | `hasPriorInternship ? 100 : 40`, derived from `portfolio.internships.length > 0`. |
| **Location** | **Partially** | 100 if the opportunity is Remote **or** the student has no stated preference; otherwise 100 on a substring match, else 50. **`student.preferredLocation` is never set by any code path**, so in practice this always returns 100. |
| **Other** | **No — constant** | Always returns 70. A deliberately neutral placeholder for future signals (portfolio completeness, response rate, freshness). |

### 13.3 Factors that are NOT used — stated plainly

The task brief lists possible factors; here is the honest accounting:

| Factor | Used? |
| --- | --- |
| Skills | **Yes** (40% weight, real) |
| Skill proficiency | **Yes** — the `>=50` threshold; note it is a threshold, not a graded contribution |
| Projects | **Yes** (count-based) |
| Certifications | **Yes** (count-based) |
| Experience | **Yes** (boolean has-internship) |
| Education | **Nominally** — the dimension exists but no student education attribute is compared |
| Branch / Course | **No** |
| CGPA | **No** — not stored for students at all |
| Location | **Nominally** — no student location preference exists, so it is constant |
| Work mode | **No** — used for *filtering* the list, never scored |
| Availability | **No** |
| Duration | **No** |
| Interests | **No** |

### 13.4 Best next action

`bestNextAction()` returns, in priority order: the top missing skill ("Improve {skill} — it's the top missing skill for this match."), else the first unmet eligibility criterion, else "You're a strong match — apply with confidence."

### 13.5 Explainable Match Breakdown (`/match-breakdown/:jobId`)

Renders the shared `WhyThisMatch` component: overall score, **Matched Skills** (green checks) and **Missing Skills** (red X) columns, the full **Eligibility** checklist, and the **Best next action** panel with a "Start Learning Path" button -> `/learning-paths`. An Apply Now button is present here too.

**"Save for Later"** on this page calls `navigate("/internships")` — it saves nothing. **UI Only / Placeholder.**

### 13.6 Flow

```
  Student Profile                         Opportunity
  ├─ skill_profile (verified skills)      ├─ skills[]      (required)
  ├─ portfolio_projects                   ├─ eligibility[] ({label, met})
  ├─ portfolio_certifications             └─ location
  └─ portfolio_internships
            │                                    │
            └────────────┬───────────────────────┘
                         ▼
              calculateMatch(student, opportunity, weights)
                         │
        ┌────────────────┼─────────────────┬──────────────┐
        ▼                ▼                 ▼              ▼
   overallScore   matchedSkills[]   missingSkills[]  bestNextAction
        │                │                 │              │
        └────────────────┴────────┬────────┴──────────────┘
                                  ▼
        Listings card % · Detail header % · WhyThisMatch panel
        · Career-role readiness (skillMatch:100 variant)
        · Industry Candidates ranking · Candidate Detail (tunable weights)
```

**Status:** **Fully Implemented as an engine**, **Partially Implemented as a matching model** — three of seven dimensions (education, location, other) contribute effectively constant values with the data the product currently stores, so in practice the score is driven by skills, projects, certifications and experience.

---

## 14. Application Management

### 14.1 Applying

`applicationsService.applyToOpportunity(opportunity)` sends `{opportunityId, companyName, department: opportunity.type, role: opportunity.title, roleSubtext: opportunity.location}` to `POST /api/applications`.

Backend (`applicationsController.applyToOpportunity`):
- Checks for an existing row for this `(user_id, opportunity_id)`; returns **409** if found -> the UI shows "You've already applied to this opportunity."
- Inserts with `status: "Applied"` and `applied_at = now`.
- Table enforces `UNIQUE (user_id, opportunity_id)`.

Offline fallback: if the backend is unreachable, a local-only record is written to `localStorage.myApplications` so applying still "works" in a demo, with a console warning.

**Entry points:** Apply Now appears on `/internships/:jobId` and `/match-breakdown/:jobId`.

### 14.2 Application history (`/applications`)

Table with Company/Institution, Role/Program, Date Applied, and a colour-coded `ApplicationStatus` pill. A status `<select>` filters across: All, Applied, Under Review, Shortlisted, Interview, Selected, Rejected, Closed. Shows "Showing 1 to N of M entries".

`getApplications()` returns **real rows first, then 4 seeded demo applications** (`app-001` Under Review, `app-002` Interview, plus two more). Marked **Partially Implemented** — the list is a blend of real and demo data.

### 14.3 Status lifecycle — now joined

**Fixed.** A student's real application and the recruiter's pipeline now share one status.

| Stage | Student side (`applications.status`) | Industry side (Applicant Pipeline) |
| --- | --- | --- |
| Applied | **Real** — inserted on apply | **Real** — the recruiter sees it immediately in the Applied column |
| Screening | **Real** — set when the recruiter advances the card | **Real** |
| Shortlisted | **Real** | **Real** |
| Assessment | **Real** | **Real** |
| Interview | **Real** | **Real** |
| Selected | **Real** | **Real** |
| Rejected | **Real** — reachable from any stage | **Real** |

`PATCH /api/applications/:id/status` (`backend/src/routes/applicationsRoutes.js`) lets the recruiter who owns the opportunity move a real applicant's status; ownership is enforced by joining through `opportunities.posted_by`, not by a column on `applications` itself, so a recruiter can never move another company's applicant. The write lands directly on the student's own `applications.status`, so it shows up on `/applications` too, not only on the recruiter's board.

### 14.4 The join — how it works now

```
  STUDENT SIDE                              INDUSTRY SIDE
  ────────────                              ─────────────
  Student clicks Apply                      Recruiter opens /industry/applications
        │                                          │
        ▼                                          ▼
  POST /api/applications                    getPipeline()
        │                                          │
        ▼                                          ▼
  applications table                        GET /api/industry/applications
  (user_id, opportunity_id, "Applied")        (applications joined to this
        │                                       recruiter's own opportunities,
        │                                       via opportunities.posted_by)
        ▼                                          │
  /applications shows it                           ▼
        ▲                                    Kanban shows the REAL applicant
        │                                          │
        │                                          ▼
        │                                    Recruiter clicks "Move to {stage}"
        │                                          │
        │                                          ▼
        └──────── PATCH /api/applications/:id/status ◄──── same application row
```

`GET /api/industry/applications` (`backend/src/controllers/industryController.js`) scopes to the calling recruiter by first fetching their own `opportunities` rows, then filtering `applications` by `opportunity_id IN (...)` — a two-query join rather than a SQL join, because `applications.opportunity_id` is a plain VARCHAR (it also has to hold non-UUID seed ids like `"job-001"`), so it can't carry a foreign-key relationship to `opportunities.id`.

**Status: Fully Implemented.** A real student application now genuinely reaches the recruiter, and a recruiter's stage move genuinely reaches the student.

### 14.5 Recruiter-side stage movement (what IS real)

`pipelineService.moveStage(entryId, newStage)` routes to one of two places depending on the entry: for a real application (id prefixed `real-`) it calls `PATCH /api/applications/:id/status`, updating the same row the student's own application list reads; for a legacy/local pipeline entry it still upserts into `pipeline_stage_overrides`. `rejectCandidate()` is a separate function because Rejected is a terminal side-branch reachable from any stage, not the next step in `PIPELINE_STAGES`. The seeded demo pipeline entries and the mock candidate pool that used to fill this board have been removed (`mockData/pipeline.js` no longer exports `seedPipeline`) — the board is now populated entirely by real applicants.

### 14.6 Interview scheduling

No calendar, no scheduling, no interview date field, no interview invitation. "Interview" is only a stage label. **Planned / Not Implemented.**

---

## 15. Digital Portfolio

**Routes:** `/portfolio` (`DigitalPortfolio.jsx`), `/portfolio/edit` (`DigitalPortfolioEdit.jsx`)
`/skill-passport` is a permanent `<Navigate>` redirect to `/portfolio` — the Skill Passport concept was merged into the portfolio, with trust levels and evidence living here.

### 15.1 Sections and their data sources

| Section | Content | Source | Editable? |
| --- | --- | --- | --- |
| Profile header | Avatar, name, headline, institution, bio | `users.name` + `portfolio_basics` | Headline/institution/bio yes; avatar no |
| **Skills & Trust Levels** | Strong skills (>=70) or the first 6, each with a trust badge; **clickable** | `skill_profile` via `skillsService` | Indirectly (via assessments) |
| Certifications | Title, issuer, date | `portfolio_certifications` | **No** |
| **Assessment Results** | Every **passed** skill test with its score | `getAssessmentResults()` -> `skill_test_results` | Auto |
| Projects | Title, description, skill tags, trust badge | `portfolio_projects` | **No** |
| Internships | Role, company, period, note | `portfolio_internships` | **No** |
| Achievements | Bullet list | `portfolio_achievements` | **No** |
| Résumé | "Generated from your verified skills, projects, certifications and experience above" | — | see 15.4 |

### 15.2 Seeding behaviour

`portfolioService.getPortfolio()`: fetch `GET /api/portfolio`. If `basics` is null (new user), it POSTs `DEFAULT_PORTFOLIO` from `mockData/portfolio.js` to `POST /api/portfolio/seed`, which writes all five tables. The endpoint guards against double-seeding: if a `portfolio_basics` row already exists it returns `{seeded:false, alreadyExisted:true}` — necessary because the child tables have no natural unique key and React StrictMode double-invokes effects in dev.

**Consequence:** every new student's portfolio is pre-populated with 2 demo projects, certifications, internships and achievements they did not create. **Partially Implemented / demo-seeded.**

### 15.3 Editing (`/portfolio/edit`)

Only 4 fields: Headline/Major, Institution, Expected Graduation (`type="month"`), Bio. Name is shown disabled with the tooltip "Update your name in Settings" (though Settings also shows it disabled — see §22.5). Saves via `POST /api/portfolio/basics`, then navigates back to `/portfolio`.

**There is no UI to add, edit, or delete a project, certification, internship, or achievement.** The backend confirms this: `portfolioRoutes.js` has only `GET /`, `POST /basics`, `POST /seed` — no write endpoints for the four child tables. **Planned / Not Implemented.**

### 15.4 Portfolio actions

| Action | What it does | Status |
| --- | --- | --- |
| **Edit Portfolio** | -> `/portfolio/edit` | Fully Implemented |
| **Share Portfolio** | Opens a modal with a read-only URL `https://skillbridge.edu/passport/{email-local-part}` and a Copy button (`navigator.clipboard`) | **UI Only / Placeholder** — that URL is fabricated; no public portfolio route exists, and `skillbridge.edu` is not a real host. Copying it yields a dead link. |
| **Download Resume** | `window.print()` | **Partially Implemented** — it opens the browser print dialog on the portfolio page. There is no PDF generation library, no résumé template, and no print stylesheet, so output is whatever the screen layout prints as. |
| **Click a skill** | Opens `SkillEvidencePanel` with the backing evidence | Fully Implemented |

### 15.5 How portfolio data flows outward

```
  Assessment (passed skill test)
        └──► skill_profile ──► "Skills & Trust Levels" badges
        └──► skill_test_results ──► "Assessment Results" section (scores behind the badges)

  portfolio_projects ─────┐
  portfolio_certifications├──► getStudentEvidence() ──► matchingEngine
  portfolio_internships ──┘        (projects / certifications / experience dimensions)
                                            │
                                            ▼
                                   opportunity match %

  portfolio_projects + certifications ──► SkillEvidencePanel (per-skill evidence)
  portfolio_* + skill_profile ──────────► Employer Trust Layer checklist
  portfolio_basics ─────────────────────► Settings (read-only institution + graduation)
```

### 15.6 Employer Trust Layer (`/employer-trust`)

A six-item verification checklist computed live from real data: Identity Verified (has an email), N Skills Assessed, N Skills Project-Verified, N Certifications ("Self-reported"), N Verified Projects, and **"Communication & Soft Skills — Self-reported, not independently verified"** which is hardcoded as unmet. Header shows "N of 6 checks verified". The page is honest about being a preview of what an employer would see. **Fully Implemented** (read-only, real data).

**Note:** no industry-side route renders this view of a real student. It is a student-facing preview only.

---

## 16. Messages / Communication

**Route:** `/messages` · **Component:** `MessagesInbox.jsx` (note: this page renders `Sidebar` directly rather than using `DashboardLayout`, so it can run a full-height two-pane layout)

### 16.1 What is real vs. seeded

| Piece | Status |
| --- | --- |
| The 4 conversations and every "them" message | **Seed data** — `mockData/conversations.js` |
| Messages the student sends | **Real** — `sent_messages` table |
| Per-conversation unread state | **Real** — `conversation_read_state` table |

`messagesService.getConversations()` merges: seed conversations, plus the user's own sent messages appended to the right thread (labelled "Just now"), plus unread overrides.

### 16.2 The four seeded conversations

| id | Name | Subtitle | Unread |
| --- | --- | --- | --- |
| conv-001 | Dr. Aris Thorne | Department of Materials Science, ZIT | No |
| conv-002 | NexTech R&D Dept | Company | **Yes** |
| conv-003 | Sarah Jenkins | Peer Researcher | No |
| conv-004 | Photovoltaic Synergy Team | Group | No |

The schema comment is explicit: these are demo contacts, **not real user accounts** — which is why only the student's own side is persisted.

### 16.3 Features that work

- **Conversation list** with avatar (image or icon), name, subtitle, last-message preview ("You: …" prefix for own messages), timestamp, and a blue unread dot.
- **Unread count badge** in the panel header ("N new").
- **Search** filtering by conversation name, with a "No conversations match" message.
- **Thread view:** full message history, own messages right-aligned with a double-check icon, auto-scroll to newest on thread change.
- **Send:** textarea, Enter to send / Shift+Enter for newline, plus a Send button. Persists via `POST /api/messages/send`, which also marks the conversation read as a side effect (a failure there does not fail the send).
- **Mark read:** opening a conversation calls `POST /api/messages/read`.
- **Mobile:** list and thread swap via a back arrow.

### 16.4 Features that do NOT work

| Element | Status |
| --- | --- |
| **Paperclip / attachment button** | **UI Only** — renders, no handler, no upload |
| **Search-in-conversation icon** (thread header) | **UI Only** — no handler |
| **Three-dot "More options"** (thread header) | **UI Only** — no handler |
| **Replies** | No second party exists; nobody ever replies |
| **Student ↔ Industry messaging** | **Not Implemented.** Industry has no messages route at all. The Applicant Pipeline "Contact" button just flips a label to "Contacted ✓" for 2 seconds — its code comment states plainly that no messaging backend is wired to the industry side. |
| **Student ↔ Faculty messaging** | **Not Implemented.** Faculty has no messages route. (`conv-001` merely *looks* like a faculty contact.) |
| **Starting a new conversation** | **Not Implemented** — no compose button, no user directory, no way to discover who to message. |

### 16.5 How users discover who they can message

They do not. There is no directory, no search-for-people, and no compose flow. A student can only reply into the four pre-existing seeded threads. **Partially Implemented** overall: real persistence for the student's own half of a fundamentally one-sided conversation.

---

## 17. AI Advisor

**Route:** `/ai-advisor` (student only, in the sidebar) · **Component:** `AICareerAdvisor.jsx` · **Backend:** `aiAdvisorController.js`

This is the most complete third-party integration in the product.

### 17.1 Provider and key handling

- **Provider:** Google Gemini, `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`.
- **Model:** `process.env.GEMINI_MODEL`, defaulting to `gemini-3.8-flash` (also set explicitly in `render.yaml`).
- **Key handling:** `GEMINI_API_KEY` is read **only** in the backend. The browser calls `/api/ai-advisor/ask`; the key never reaches the client. Confirmed — no `VITE_GEMINI*` variable exists anywhere in the frontend.
- **Generation config:** `temperature: 0.4`, `maxOutputTokens: 500`.

### 17.2 Authentication and rate limiting

`router.post("/ask", aiAdvisorLimiter, authMiddleware, askCareerAdvisor)` — **15 requests / 15 minutes**, tighter than the other limiters because each call is a real paid API call. Requires a valid session.

### 17.3 Input validation

Message must be a non-empty string and **at most 1000 characters**. Express is configured with `express.json({ limit: "10kb", strict: true })` globally.

### 17.4 Context sent to the model

The frontend builds context from the student's real data (`buildContext()`):

```js
{
  targetRole:       readiness.role.title,
  readinessPercent: readiness.readinessPercent,
  matchedSkills:    [...],
  missingSkills:    [...],
  allSkills:        [{name, currentScore, trustLevel}, ...]
}
```

The backend's `buildContextSummary()` flattens this into labelled lines ("Target role: …", "Readiness for target role: 72%", "Skills already verified for this role: …", "Full verified skill profile: JavaScript (88%, Assessed); …").

**Architectural note (from the code comments):** the frontend supplies this rather than the backend re-deriving it, because the readiness/gap logic lives in frontend services over a mix of Supabase and local state. The trade-off — the client controls what the model is told — is worth stating.

### 17.5 System prompt constraints

The system prompt instructs the model to: use the student's actual numbers, never invent skills or roles, structure answers as readiness -> skills held -> skills needed -> 2–4 prioritized next steps, decline to answer for roles not set as the student's target, stay under ~180 words, **recommend rather than verify** ("final verification always comes from real assessments, projects, or institution/industry review"), and reply in **plain text only** (no markdown), because the UI renders the reply verbatim.

### 17.6 UI

Chat bubbles (user right/dark, assistant left/white), three suggested prompts on the empty state ("How ready am I for my target role?", "What should I focus on next?", "Which skill gap matters most right now?"), a "Thinking…" indicator, auto-scroll, a disclaimer line, and a banner if no target role is set, linking to `/skill-gap`.

### 17.7 Error handling

`friendlyAdvisorError()` maps status codes to calm messages and deliberately never leaks internals like "No token provided":

| Condition | Message |
| --- | --- |
| 401 | "Your session has expired. Please log in again…" |
| 429 | "You've sent a lot of messages in a short time…" |
| 502 / 503 / network | "AI Advisor is temporarily unavailable…" |

Backend: 503 if `GEMINI_API_KEY` is unset, 400 for bad input, **502** if the Gemini call fails or returns empty, 500 otherwise.

### 17.8 Known limitation

**The conversation is stateless.** Each request sends only the current message plus context — prior turns are never included in the Gemini payload, and nothing is persisted. Follow-ups like "tell me more about that" will not resolve. History also vanishes on reload. **Partially Implemented.**

### 17.9 Flow

```
  Student types a question
        │
        ▼
  AICareerAdvisor.jsx  ── buildContext() from getTargetRoleReadiness() + getSkillProfile()
        │
        ▼
  aiAdvisorAPI.ask(message, context)      POST /api/ai-advisor/ask   (cookie auth)
        │
        ▼
  aiAdvisorLimiter (15/15min) ─► authMiddleware ─► askCareerAdvisor
        │
        ▼
  buildContextSummary(context) + SYSTEM_PROMPT
        │
        ▼
  Google Gemini API   (key server-side only)
        │
        ▼
  candidates[0].content.parts[].text  ──► { reply }
        │
        ▼
  Rendered as a plain-text assistant bubble
```

**Status: Fully Implemented** for single-turn, grounded advice — the only genuine LLM feature in the product, and the key handling is correct.

---

## 18. Certificate / Document Verification

**Status: Planned / Not Implemented.**

A repository-wide search for `qr`, `QRCode`, `fraud`, `certificate verif`, `upload`, `multer`, `blockchain`, and file-upload handling returns **no implementation**. Specifically:

| Capability | Status |
| --- | --- |
| Certificate upload | **Planned / Not Implemented** — no file input, no `multer`, no storage bucket, no upload endpoint anywhere |
| QR code generation or scanning | **Planned / Not Implemented** — no QR library in `package.json` |
| Issuer verification | **Planned / Not Implemented** |
| Institution manual verification | **Planned / Not Implemented** — the `Institution-Verified` trust level is defined but never assigned; the admin portal is read-only analytics with no review queue |
| AI fraud detection | **Planned / Not Implemented** |
| Document verification status | **Planned / Not Implemented** |

**What does exist:** `portfolio_certifications` rows (title, issuer, issued date, related skill), seeded from `DEFAULT_PORTFOLIO` and displayed on the portfolio. They are **self-reported and unverifiable** — the Employer Trust Layer says so explicitly in its own copy: *"Certifications — Self-reported, uploaded to portfolio."* (Note: even the word "uploaded" there is inaccurate; nothing is uploaded.)

The only real verification mechanisms in the product are the skill tests (Assessment Verified) and the Proof-of-Skill Challenge (Project-Verified). Nothing verifies a *document*.

---

## 19. Industry Dashboard

**Portal title:** "Industry Portal / Talent & Recruitment" · **Nav:** `industryNavConfig.js` (6 items + Settings)

### 19.1 Dashboard (`/industry/dashboard`)

**Four stat cards:**

| Card | Computation | Source |
| --- | --- | --- |
| Active Opportunities | count where `status === "Active"` | `getMyOpportunities()` |
| Applications | `pipeline.length` | `getPipeline()` — **real applications** against this recruiter's opportunities |
| Matched Candidates | pipeline entries at or beyond `Shortlisted` in the stage order | `getPipeline()` |
| Skill Programs | `programs.length` | `getMySkillPrograms()` |

**Recent Applications** — first 5 pipeline entries with candidate name, opportunity title, and stage pill; "View all" -> `/industry/applications`.
**Active Opportunities** — first 5 active roles with type and location; "Manage" -> `/industry/opportunities`.
**Top Candidates** — pipeline entries at Interview or Shortlisted (max 3), linking to the candidate detail page; plus a **Post New Opportunity** button.

**Status:** Fully Implemented — the opportunity and program counts are real, and the application/candidate counts now come from real student applications via `GET /api/industry/applications` (§14.4). The "Top Candidates" link still points at `/industry/candidates/:id`, which is a separate view over the mock candidate pool (§19.5) rather than the real applicant just counted here — that mismatch is a remaining rough edge, not something this fix touched.

**Important scoping caveat:** `getMyOpportunities()` calls `getAllOpportunitiesIncludingInactive()`, which returns **every** opportunity in the system plus all 7 seed jobs — it is **not filtered to the logged-in company**. A recruiter therefore sees other companies' postings in their "Active Opportunities" list and stat card. The `posted_by` column exists and *is* enforced for updates (`updateOpportunityStatus` filters `.eq("posted_by", userId)`), but not for reads. **Broken / Needs Fix.**

### 19.2 Company Profile (`/industry/profile`)

Five fields: Company Name, Industry, Website, **Company Size**, **About**. Saved via `POST /api/industry/company-profile`.

**Broken / Needs Fix — field mismatch.** The form edits `size` and `about`. The backend controller destructures `{ name, industry, website, description, logoUrl }` and the `company_profiles` table has columns `description` and `logo_url` — there is **no `size` column and no `about` column**. So:
- **Company Size and About are silently dropped on save** — they persist only in `localStorage`, and are lost on another device or after a cache clear.
- `description` and `logo_url` are never populated by any UI.

Name, Industry and Website do save correctly.

### 19.3 Post an Opportunity (`/industry/opportunities/create`)

Fields: Title, Opportunity Type (Internship / Full-time / Part-time), **Work Mode** (Remote / Hybrid / On-site), City (auto-disabled and dimmed when Remote), Duration, Stipend/Salary, Commitment, Description.

**Required Skills** — toggle chips over the **entire 15-skill `SKILL_CATALOG`**, guaranteeing the names match what the matching engine compares against.

**Eligibility Requirements** — 5 suggestion chips ("3rd year or above", "Final year or recent graduate", "Remote-friendly", "Willing to relocate", "Minimum CGPA 7.0") plus a free-text field with Enter-to-add and per-item removal. Stored as `{label, met: true}` — `met` is always true because the recruiter is defining a requirement, not evaluating a person.

**Validation:** title required; city required unless Remote; at least one skill required.
**On submit:** city and mode are combined into a single location string (`"Bangalore (Hybrid)"`) for compatibility with existing data, then `POST /api/industry/opportunities` inserts with `status: "Active"`, and the user is redirected to the manage page.

**Status:** Fully Implemented. **This is the strongest cross-role path in the product** — a role posted here is immediately visible and scored on every student's `/internships`.

### 19.4 Manage Opportunities (`/industry/opportunities`)

Table of Title / Type / Location / Status / Actions, with colour-coded status pills (Active, Draft, Closed, Expired). Actions: **View Applicants** (links to the pipeline — not filtered to that opportunity) and **Close** (`PATCH /api/industry/opportunities/:id/status` with `"Closed"`, ownership-checked via `posted_by`).

Missing: no edit, no delete, no reopen, no draft creation (the Draft/Expired pill styles exist but nothing sets those statuses). **Partially Implemented.**

### 19.5 Candidates (`/industry/candidates`)

- Loads the 5 mock candidates and the active opportunities; scores every candidate against the selected opportunity with `calculateMatch()`, sorted by score descending.
- An opportunity `<select>` re-ranks the list live.
- **Candidate pool:** `mockData/candidates.js` — Priya Sharma, Rohan Verma, Ananya Iyer, Karan Mehta, Sneha Reddy. Each carries a full skill profile in exactly the shape `skillsService` produces for a real student, plus projects, certifications and `hasPriorInternship` — which is why the same engine scores them.

**Status: Partially Implemented.** The ranking is genuinely computed, but **no real registered student ever appears here.** This is a distinct gap from §14 (which is now fixed) — Candidates is a *search/discovery* surface over the whole student body, not the *applicant* view; there is still no endpoint that lists registered students to a recruiter, and the `opportunityVisibility` privacy setting a student can toggle in Settings has no reader. **Integration Missing.**

### 19.6 Candidate Detail (`/industry/candidates/:candidateId`)

- Header with avatar initial, name, institution, year.
- **Verified Skill Profile** — every skill with score and trust badge, so the recruiter sees provenance rather than a bare percentage.
- **Matching against** selector (which opportunity to score against; also accepts an `?opportunityId=` query param from the list page).
- **Matching Weights** — live sliders (0–100, step 5) that re-run `calculateMatch()` on every change, with a running total that turns red when it is not 100 and the note "the score is normalized automatically".
- **Why This Match?** — the same `WhyThisMatch` component the student sees, with the action button relabelled "View in Pipeline".

**Minor defect:** `WEIGHT_LABELS` defines labels for only 5 keys (`skillMatch`, `eligibility`, `projects`, `certifications`, `experience`), but `DEFAULT_WEIGHTS` has 7 (`education`, `location`, `other` instead of `eligibility`). So three sliders render with an **empty label** and the `eligibility` label is never used. **Broken / Needs Fix** (cosmetic — the sliders still function).

### 19.7 Applicant Pipeline (`/industry/applications`)

Kanban with 7 columns: **Applied -> Screening -> Shortlisted -> Assessment -> Interview -> Selected**, plus a separate **Rejected** column (a terminal side-branch reachable from any stage, deliberately not part of the forward sequence).

Each card: candidate name (links to detail), opportunity title, a **"Move to {next stage}"** button, **Contact**, and **Reject**. Empty columns show a dashed "Empty" placeholder. Cards now populate entirely from **real student applications** against this recruiter's own opportunities (`GET /api/industry/applications`); the seeded demo entries and the mock candidate pool that used to fill this board have been removed. Stage moves persist directly to the real application's `status` (`PATCH /api/applications/:id/status`) — the same field the student's own `/applications` page reads.

**Contact button:** sets local state to show "Contacted ✓" for 2 seconds. Sends nothing. **UI Only / Placeholder** — the code comment says so directly. This is unchanged; the fix in §14 did not add messaging.

**"View Applicants" from candidate links:** the card's candidate-name link still points at `/industry/candidates/:candidateId` (§19.6), which is scoped to the mock candidate pool, not the real applicant just shown — a real applicant clicking through will land on an empty/not-found candidate detail page. This is a remaining rough edge from the fact that Candidate Detail hasn't been migrated to read real applicants; it is *not* something this fix silently broke, since that link behaved the same way before.

**Status:** Fully Implemented (§14.4) — real applications, real stage persistence, both directions.

### 19.8 Skill Programs (`/industry/skill-programs`)

The "we need candidates but nobody is ready" feature. A recruiter defines a week-by-week program: title, plus target skills chosen from `SKILL_CATALOG`. Weeks are auto-generated — one content week per selected skill, then **Industry Project**, then **Final Assessment** (so 4 skills yields a 6-week program). Validation requires a title, >=1 skill, >=1 week.

`POST /api/industry/skill-programs` -> `skill_programs` table. The list view (`getMySkillPrograms`) filters to the logged-in company by name.

**Cross-role effect: real.** `GET /api/industry/skill-programs` returns **all** programs, and the student Learning page renders them. A program created here genuinely appears for students. **Fully Implemented.**

### 19.9 Industry Settings (`/industry/settings`)

Displays Name and Email as static text. **No editable settings, no notification preferences, no privacy controls, no password change.** Compare with the student Settings page (§22.1). **Partially Implemented / near-placeholder.**

### 19.10 Features the industry portal does NOT have

Industry analytics dashboard, messaging, interview scheduling, offer management, team/multi-recruiter accounts, opportunity editing, candidate notes or ratings, saved searches, and company verification. All **Planned / Not Implemented**.

### 19.11 Flow

```
  Company Profile (name)
        ▼
  Post Opportunity ── required skills chosen from SKILL_CATALOG
        ▼
  opportunities table (status Active, posted_by)
        ├──────────────► students' /internships  (REAL: scored + listed)
        │                       ▼
        │                 Student applies ──► applications table (REAL)
        │                       │
        │                       ▼
        │                 GET /api/industry/applications (REAL join on posted_by)
        │                       ▼
        │                 Applicant Pipeline (REAL applicants)
        │                       ▼
        │                 stage moves ──► applications.status (REAL, both directions)
        │                       ▼
        │                 "Selected" ──► counted as a placement in Institution analytics
        │                                (Institution analytics still run over the
        │                                 MOCK candidate pool for everything else — §20)
        └──────────────► /industry/candidates    (search/discovery — still scored
                                                    against the MOCK candidate pool, §19.5)
```

---

## 20. Institution Dashboard (Admin)

**Portal title:** "Institution Portal / Admin Analytics" · **Nav:** `adminNavConfig.js` (3 items, no footer)

### 20.1 The data source caveat, stated first

Every number on all three admin pages derives from `mockData/candidates.js` — **the same 5 mock candidates the industry side uses**. The service file states this explicitly: it is the same student pool seen from the institution's side rather than a recruiter's, and a real deployment would swap it for enrolled-student records without changing anything downstream.

**No registered student's real skill data ever reaches the institution dashboard.** Every metric below is therefore **Partially Implemented**: the computation is real, the population is mock.

### 20.2 Dashboard (`/admin/dashboard`)

**Six KPI cards** (from `getInstitutionOverview()`):

| KPI | Computation |
| --- | --- |
| Students | roster length |
| Assessed | students with >=1 non-Self-Declared skill |
| Verified Skills | total count of non-Self-Declared skills across the roster |
| Avg. Readiness | mean of per-student readiness |
| Active Opportunities | active opportunities **including real posted ones** |
| Placements | pipeline entries at stage `Selected` |

Per-student readiness = mean over that student's skills of `min(currentScore/requiredScore, 1)`, times 100 — the same formula the student's own `overallMatchPercent` uses.

**Top Skill Gaps** — for each catalog skill, the percentage of the student body whose score is below that skill's `requiredScore` (or who lack it entirely). Rendered as red bars. Matches the brief's presentation ("Power BI 42%").

**Placement Readiness** — three buckets: Ready (>=70%), Developing (40–69%), Early Stage (<40%), with counts.

**Industry Partnerships** — the count of **distinct companies with at least one active opportunity**. The code comment is candid: no partnership data model exists, so this is "the closest honest proxy available". **Partially Implemented.**

**Students table** — first 5 of the roster (name, program, skills verified, readiness), with "Manage students" -> `/admin/students`.

### 20.3 Student Management (`/admin/students`)

The full roster sorted by readiness descending: Student, Institution, Program, Skills Verified (`n / m`), Readiness (colour-coded green >=70 / blue >=40 / muted below).

**It is a read-only table.** Despite the name "Management" there is no add, edit, remove, invite, import, export, bulk action, search, or filter. **Partially Implemented — the name overstates it.**

### 20.4 Skill Analytics (`/admin/skill-analytics`)

- **Top Skill Gaps** — the same computation as the dashboard, but across all 15 catalog skills.
- **Industry Demand vs. Student Supply** — demand = how many opportunities require each skill (computed over the real opportunity list, seed + posted); supply = how many students score >=50 on it. Rendered as paired bars with a legend, normalized to the max value, sorted by demand.

This is the one admin view whose **demand** half reflects genuinely live data — posting a new opportunity changes it. **Partially Implemented** (real demand, mock supply).

### 20.5 What the institution dashboard does NOT have

Departments/branches, per-department breakdowns, cohort or batch filters, date-range filters, report export (PDF/CSV/print), internship tracking as its own view, an industry-partnership management surface, student invitation or onboarding, faculty management, and any admin settings page. All **Planned / Not Implemented**.

### 20.6 Flow (intended vs. actual)

```
  INTENDED                              ACTUAL (as coded)
  ────────                              ─────────────────
  Students                              mockData/candidates.js  (5 fixed records)
     ▼                                       ▼
  Assessments                           skills[] already hardcoded per candidate
     ▼                                       ▼
  Verified Skills ─────────────────────► readinessForCandidate()
     ▼                                       ▼
  Skill Gaps ──────────────────────────► getTopSkillGaps() vs SKILL_CATALOG
     ▼                                       ▼
  Institution Analytics ───────────────► AdminDashboard / SkillAnalytics
                                             ▲
  Real opportunities ────────────────────────┘  (this half IS live)
```

---

## 21. Faculty Dashboard

**Portal title:** "Faculty Portal / Student Mentorship" · **Nav:** `academicianNavConfig.js` — **one item**, empty footer. This is by far the thinnest of the four portals: 2 routes, 199 lines of page code total.

### 21.1 My Students (`/academician/dashboard`)

Table: Student, Program, Skills Verified (`n / m`), Readiness (colour-coded: green >=80, blue >=60, red below), and a **View Details** link.

**How "my students" is determined:** `facultyService.MY_STUDENT_IDS = candidates.slice(0, 4).map(c => c.id)` — **the first 4 mock candidates, hardcoded at module load.** The comment states no advisor-assignment model exists yet and that this is a stand-in for a real assignment table. **Partially Implemented / hardcoded.**

Empty state: "No students assigned to you yet."

### 21.2 Student Detail (`/academician/students/:studentId`)

Three sections, all from `facultyService.getStudentDetail()`:

- **Skills & Assessments** — every skill with score and trust badge.
- **Skill Gaps** — skills where `currentScore < requiredScore`, each with "N points below target" and a **Recommend Learning** button.
- **Internship Activity** — pipeline entries for this candidate showing opportunity title, company, and stage pill. Empty state: "No internship applications yet." Now that the Applicant Pipeline (§14.4, §19.7) reads real applications keyed by real `users.id`, and this section still filters by a mock `cand-00X` id, **this section will always show "No internship applications yet" for every faculty student** — the two ids can never match. This section was already Partially Implemented over mock data; it is now an empty always-mismatched read rather than a matched mock read, functionally the same "not real" outcome the student saw either way.

**"Recommend Learning" button: UI Only / Placeholder.** It calls `setRecommended(skillName)`, flipping the label to "Recommended ✓". Nothing is persisted, no endpoint is called, and **the student is never notified** — there is no faculty-to-student channel of any kind.

### 21.3 What the faculty portal does NOT have

Learning-progress visibility (`learning_path_progress` is never read by faculty), assessment history per student, messaging, notifications, a settings page, intervention tracking, cohort analytics, industry collaboration, attendance, grading, and any ability to write data at all. All **Planned / Not Implemented**.

### 21.4 Flow

```
  Faculty logs in
        ▼
  MY_STUDENT_IDS = first 4 mock candidates   ◄── hardcoded, not an assignment table
        ▼
  getStudentRoster() ──► readiness + verified-skill counts
        ▼
  Student Detail ──► skills · gaps · pipeline activity
        ▼
  "Recommend Learning" ──► local component state only
        ✗
  (no intervention is recorded, and the student never learns of it)
```

---

## 22. Settings

### 22.1 Student Settings (`/settings`) — the only substantial settings page

**Profile Settings section**

| Field | Editable | Saved to |
| --- | --- | --- |
| First / Last Name | No (disabled) | — |
| Email | No (disabled) | — |
| **Phone** | Yes — saves on blur | `notification_preferences.phone` |
| College / Institution | No (mirror of portfolio) | — |
| Expected Graduation | No (mirror of portfolio) | — |
| **Course / Branch** | Yes — saves on blur | `notification_preferences.course` |

With an "Edit in Portfolio" link and a note explaining the split ownership.

**Account Settings** — three toggles, each saving immediately on change: Email Notifications, SMS Alerts, Application Updates. Plus a **Language** select that is **hardcoded to English and disabled** — **UI Only / Placeholder**.

**Privacy** — three selects and one toggle, all persisted and all DB-constrained:

| Setting | Options | Column |
| --- | --- | --- |
| Profile Visibility | Public / Institution Only / Private | `profile_visibility` (CHECK constraint) |
| Portfolio Visibility | Public / Institution Only / Private | `portfolio_visibility` (CHECK constraint) |
| Opportunity Visibility | Visible to Recruiters / Hidden | `opportunity_visibility` (CHECK constraint) |
| Data Sharing | toggle | `data_sharing_consent` |

**Critical caveat: none of these four privacy settings has a reader.** No query filters on them, no page respects them. The recruiter Candidates list reads mock data and never consults `opportunity_visibility`; nothing enforces `profile_visibility` or `portfolio_visibility`; no export path consults `data_sharing_consent`. **They are persisted preferences with no enforcement.** Status: **Partially Implemented (stored, not enforced)** — an important honesty point, since these are privacy controls.

**Security** — a real change-password form (current / new / confirm), validating >=8 characters and matching confirmation client-side, then `POST /api/auth/change-password`. The backend verifies the current password with bcrypt and rejects Google-authenticated accounts with a clear message ("This account signs in with Google — change your password from your Google Account settings"). Also shows Last login. **Fully Implemented.**

**Log Out** — a dedicated card calling the same `logout()` as the sidebar. **Fully Implemented.**

Save feedback: a "Saving…" line while in flight, then "Preferences saved." with a green check.

### 22.2 Industry Settings (`/industry/settings`)

Name and Email as static text. **Nothing editable.** No notifications, no privacy, no password change, no logout card (logout is available only from the sidebar). **Partially Implemented / near-placeholder.**

### 22.3 Institution (Admin) Settings

**Does not exist.** `adminNavConfig.js` has no footer items and no `/admin/settings` route is defined. **Planned / Not Implemented.**

### 22.4 Faculty Settings

**Does not exist.** `academicianFooterNavItems` is an empty array; no route exists. **Planned / Not Implemented.**

### 22.5 A note on name editing

Portfolio Edit shows Name disabled with the tooltip "Update your name in Settings" — but Settings also shows it disabled ("managed by your institution"). **There is no way for any user to change their own name**, and there is no endpoint that updates `users.name` after registration. **Broken / Needs Fix** (the tooltip points somewhere that cannot do it).

---

## 23. Notifications

**Route:** `/notifications` (student only) · **Component:** `Notifications.jsx`

### 23.1 What is real vs. seeded

| Piece | Status |
| --- | --- |
| The 6 notifications themselves | **Seed data** — `mockData/notifications.js`, identical for every user |
| Which ones a user has read | **Real** — `notification_read_state` table |

**No notification is ever generated by an event.** Applying to a job, passing an assessment, or having a program posted creates nothing. There is no notification-creation endpoint and no `notifications` table — only a read-state table keyed by seed notification id.

### 23.2 The six seeded notifications

| id | Title | Links to |
| --- | --- | --- |
| notif-001 | Your application for "Machine Learning Engineer Intern" has been received. | `/applications` |
| notif-002 | New internship matching your profile: Full Stack Developer Intern. | `/internships` |
| notif-003 | Your application has been shortlisted. | `/applications` |
| notif-004 | Dr. Aris Thorne sent you a new message. | `/messages` |
| notif-005 | Reminder: Take your skill assessment to unlock better matches. | `/skill-assessment` |
| notif-006 | New course recommended based on your skill gaps: Advanced Data Structures. | `/courses` |

Each has an icon name resolved through an `ICONS` map and an `unread` seed flag.

### 23.3 Behaviour that works

- **Clicking a notification** marks it read (`POST /api/student/notification-read-state`), reloads the list, then navigates to `linkTo` — satisfying "clicking a notification should navigate to the related page". `notif-006` is one of the few links to `/courses`, which has no sidebar entry.
- **Mark all as read** — sends every seed id in one request.
- Unread rows render with a bolder title and a darker icon; a proper `EmptyState` shows when the list is empty.
- **Fully Implemented** for read-state persistence.

### 23.4 What does not exist

| Capability | Status |
| --- | --- |
| Event-triggered notifications (application received, status change, assessment passed, new match, new message) | **Planned / Not Implemented** |
| A notification bell / unread badge in the app chrome | **Planned / Not Implemented** |
| Real-time delivery (websockets, polling, push) | **Planned / Not Implemented** |
| **Email notifications** | **Planned / Not Implemented** — the Settings toggle is stored but no email service, provider, or send code exists anywhere |
| **SMS alerts** | **Planned / Not Implemented** — same; the toggle is stored, `phone` is stored, nothing sends |
| Notifications for Industry, Faculty, or Admin | **Planned / Not Implemented** — no route, no nav item, no data for any of the three |
| Notification categories/filtering | **Planned / Not Implemented** |

**Overall status: Partially Implemented** — a real read-state layer over a static, universal, non-generated list.

---

## 24. Database / Data Model

**Engine:** Supabase (PostgreSQL). **19 tables** across 4 migration files, applied in order:
`schema.sql` -> `assessments_schema.sql` -> `full_migration_schema.sql` -> `settings_schema.sql`

There is **no ORM and no model layer** — `backend/src/models/` contains only a `.gitkeep`. Every controller queries Supabase directly via `supabase.from("table")`.

### 24.1 Design principle stated in the schema

The migration header is explicit: **read-only seed catalogs are deliberately NOT in the database.** `SKILL_CATALOG`, `CAREER_ROLES`, seed internships, the mock candidate pool, skill test question banks, learning modules, courses, conversations and notifications all stay as frontend mock data. **Only mutable per-user state was migrated.** This is why so many features below are "real persistence over seed content".

### 24.2 Core identity

**`users`** — *the root entity.*
- Fields: `id` (uuid PK), `auth_user_id` (uuid, unique, FK -> `auth.users`, nullable), `email` (unique), `password` (bcrypt hash, nullable — null for Google accounts), `name`, `role` (CHECK: student/academician/industry/admin, nullable), `created_at`, `updated_at`, `last_login`, `is_active`.
- Indexes on `email` and `role`; a trigger auto-maintains `updated_at`.
- **Created by:** registration or Google sync. **Read by:** every authenticated request. **Used by:** everything — all 18 other tables cascade-delete from it.
- The dual `id` / `auth_user_id` design is what `resolveUserId.js` normalizes.

### 24.3 Assessment entities

**`skill_test_results`** — one row per attempt, **never overwritten**.
- `user_id`, `test_id`, `skill_name`, `total_questions`, `correct_answers`, `score_percent`, `passing_score`, `passed`, `completed_at`.
- **Created by:** submitting a skill test (pass or fail). **Read by:** Assessment History, the last-result badge, and the portfolio's Assessment Results section.

**`skill_profile`** — **the canonical skill record; the single most important table in the product.**
- `user_id` + `skill_name` (UNIQUE together), `current_score`, `trust_level` (default `Self-Declared`), `proficiency_level`, `last_updated`.
- **Written by three paths:** passing a skill test (`Math.max`, trust -> Assessment Verified), the self-rating assessment (unconditional, trust -> Assessed), and learning-path re-assessment / the Proof-of-Skill challenge.
- **Read by:** My Skills, dashboard, gap report, skill graph, career readiness, learning paths, matching, portfolio, AI advisor — everything.

### 24.4 Student state

| Table | Key | Purpose | Written by |
| --- | --- | --- | --- |
| `student_target_role` | `user_id` (PK) | Selected career role | Skill Gap / Career Path selectors |
| `learning_path_progress` | unique (`user_id`,`skill_name`) | Completed module count | "Complete Next Module" |
| `course_enrollments` | unique (`user_id`,`course_id`) | Enrolled course ids | Enroll buttons |
| `notification_read_state` | unique (`user_id`,`notification_id`) | Which seed notifications are read | Clicking / Mark all read |
| `notification_preferences` | `user_id` (PK) | **Doubles as the account-settings row** | Settings page |

`notification_preferences` columns: `email_notifications`, `sms_alerts`, `application_updates`, and (added by `settings_schema.sql`) `phone`, `course`, `profile_visibility`, `portfolio_visibility`, `opportunity_visibility` (all three CHECK-constrained), `data_sharing_consent`. The schema comment explains the reuse: one settings row per user rather than a parallel table for a handful of columns.

### 24.5 Portfolio (5 tables)

- **`portfolio_basics`** — `user_id` (PK), `headline`, `bio`, `avatar_url`, `institution`, `expected_graduation`. **The only one with a write endpoint.**
- **`portfolio_projects`** — `title`, `description`, `skills` (JSONB array), `trust_level`.
- **`portfolio_certifications`** — `title`, `issuer`, `issued_date`, `related_skill`.
- **`portfolio_internships`** — `role`, `company`, `period`, `note`.
- **`portfolio_achievements`** — `description`.

The four child tables are **write-once via `/api/portfolio/seed`** and have **no natural unique key** — which is exactly why the seed endpoint guards against double-seeding. **Read by:** the portfolio page, `getStudentEvidence()` (feeding the matching engine), the Skill Evidence panel, and the Employer Trust Layer.

### 24.6 Applications

**`applications`** — `user_id`, `opportunity_id` (VARCHAR — deliberately not an FK, since seed opportunity ids like `job-001` are not UUIDs), `company_name`, `department`, `role`, `role_subtext`, `status` (default `"Applied"`), `applied_at`. **UNIQUE (`user_id`,`opportunity_id`)** enforces one application per opportunity.
- **Created by:** the student's Apply button. **Read by:** My Applications and the dashboard stat cards. **Read by industry: never** (§14.4).

### 24.7 Messages

- **`sent_messages`** — `user_id`, `conversation_id` (VARCHAR, references a seed conversation), `text`, `sent_at`. Only the student's own messages.
- **`conversation_read_state`** — unique (`user_id`,`conversation_id`), `unread` boolean.

### 24.8 Industry entities

- **`company_profiles`** — `user_id` (PK), `name`, `industry`, `website`, `description`, `logo_url`. (See §19.2: the UI's `size`/`about` fields have no columns here.)
- **`opportunities`** — `posted_by` (FK -> users), `title`, `company`, `type`, `location`, `duration`, `stipend`, `commitment`, `overview` (JSONB), `skills` (JSONB), `eligibility` (JSONB), `status` (default `Active`), `created_at`. Indexed on `posted_by` and `status`. **The only industry-created table students read directly.**
- **`pipeline_stage_overrides`** — unique (`updated_by`,`pipeline_entry_id`), `stage`. Per-recruiter stage moves over seeded pipeline entries.
- **`skill_programs`** — `created_by`, `title`, `company`, `duration_weeks`, `skills` (JSONB), `weeks` (JSONB). **Readable by all authenticated users** so students see them.

### 24.9 Entities the brief asks about that do NOT exist

| Entity | Status |
| --- | --- |
| `Institution` | **No table.** Institution is a free-text string on `portfolio_basics` and on mock candidates. |
| `Faculty` / advisor assignment | **No table.** Faculty-student assignment is `candidates.slice(0,4)` in code. |
| `Skill` (catalog) | **No table** — `SKILL_CATALOG` is frontend mock data. |
| `CareerRole` | **No table** — `CAREER_ROLES` is frontend mock data. |
| `Assessment` / question bank | **No table** — `SKILL_TESTS` is frontend mock data. |
| `LearningResource` / module | **No table** — module lists are frontend mock data. |
| `Notification` | **No table** — only `notification_read_state`. |
| `Conversation` / `Contact` | **No table** — only `sent_messages` + read-state. |
| `SkillGap` | **No table** — always computed on the fly, never stored. |
| `Certificate` verification | **No table.** |
| `Interview` | **No table.** |

### 24.10 Relationship diagram

```
                          ┌──────────────┐
                          │    users     │  (id, auth_user_id, email, role)
                          └──────┬───────┘
        ┌────────────────────────┼────────────────────────────┐
        │ (student)              │ (any)                      │ (industry)
        ▼                        ▼                            ▼
 skill_test_results       notification_preferences      company_profiles
 skill_profile ◄────┐     notification_read_state       opportunities ──┐
 student_target_role│     sent_messages                 pipeline_stage_ │
 learning_path_prog.│     conversation_read_state         overrides     │
 course_enrollments │                                    skill_programs │
 applications       │                                                   │
 portfolio_basics   │                                                   │
 portfolio_projects ┼── getStudentEvidence() ──► matchingEngine ◄───────┘
 portfolio_certs    │                                (opportunity.skills,
 portfolio_internsh.┘                                 eligibility, location)
 portfolio_achieve.

 Every child table: user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
```

---

## 25. API Documentation

**Base URL:** `{VITE_API_URL}/api` (the client normalizes duplicate `/api` segments). **Auth:** HttpOnly cookie `auth_token`, or `Authorization: Bearer <supabase-token>`. All requests send `credentials: "include"`.

**33 endpoints across 8 route files.** Note: `roleMiddleware` exists in `authMiddleware.js` but **is never applied to any route** — every protected endpoint is authenticated-only, with ownership enforced by `user_id` scoping in controllers rather than by role.

### 25.1 Health

| Method | Endpoint | Purpose | Role | Input | Output | Used By |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/health` | Liveness probe | Public | — | `{status:"ok"}` | Render `healthCheckPath` |

### 25.2 Auth (`authRoutes.js`)

| Method | Endpoint | Purpose | Role | Input | Output | Used By |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/api/auth/register` | Create account (5/15min) | Public | `{email,password,name,role}` | `{message,user}` + cookie | `SignupRoleSelection` |
| POST | `/api/auth/login` | Sign in (10/15min) | Public | `{email,password}` | `{message,user}` + cookie | `Login` |
| POST | `/api/auth/sync` | Upsert profile from Google (20/15min) | Auth (Bearer) | `{name?,role?}` | `{user}` + cookie | `AuthContext.syncSession` |
| POST | `/api/auth/logout` | Clear cookie | Public | — | 204 | `logout()` |
| GET | `/api/auth/me` | Current user | Auth | — | `{user}` | `AuthContext` restore |
| POST | `/api/auth/change-password` | Change password | Auth | `{currentPassword,newPassword}` | `{message}` | Settings > Security |

### 25.3 Assessments (`assessmentRoutes.js`)

| Method | Endpoint | Purpose | Role | Input | Output | Used By |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/assessments/skill-tests/results` | All attempts | Auth (student) | — | `{results:[...]}` | Assessment list + History |
| POST | `/api/assessments/skill-tests/:testId/submit` | Persist a result; upsert profile on pass | Auth (student) | `{testId,skillName,totalQuestions,correctAnswers,scorePercent,passingScore,passed}` | `{result,profile}` | `submitSkillTest` |
| GET | `/api/assessments/skill-profile` | Current skill profile | Auth (student) | — | `{profile:[...]}` | `getStoredSkillProfileOrDemo` |
| POST | `/api/assessments/skill-profile/upsert` | Write one skill entry | Auth (student) | `{skillName,currentScore,trustLevel,proficiencyLevel?}` | `{entry}` | Self-assessment, challenge, path completion |

### 25.4 AI Advisor (`aiAdvisorRoutes.js`)

| Method | Endpoint | Purpose | Role | Input | Output | Used By |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/api/ai-advisor/ask` | Proxy to Gemini (15/15min) | Auth | `{message (<=1000 chars), context}` | `{reply}` | `AICareerAdvisor` |

### 25.5 Student state (`studentStateRoutes.js`)

| Method | Endpoint | Purpose | Role | Input | Output | Used By |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/student/target-role` | Read target role | Auth | — | `{roleId}` | Skill Gap, Career Path |
| POST | `/api/student/target-role` | Set target role | Auth | `{roleId}` | `{roleId}` | Role selectors |
| GET | `/api/student/learning-progress` | Modules completed per skill | Auth | — | `{progress:{skill:n}}` | Learning Paths |
| POST | `/api/student/learning-progress` | Save progress | Auth | `{skillName,completedModules}` | echo | Complete Next Module |
| GET | `/api/student/notification-preferences` | Read all settings | Auth | — | `{preferences}` | Settings |
| POST | `/api/student/notification-preferences` | Save all settings | Auth | full prefs object | `{preferences}` | Settings |
| GET | `/api/student/notification-read-state` | Read notification ids | Auth | — | `{readIds:[...]}` | Notifications |
| POST | `/api/student/notification-read-state` | Mark read | Auth | `{notificationIds:[...]}` | echo | Notifications |
| GET | `/api/student/enrollments` | Enrolled course ids | Auth | — | `{courseIds:[...]}` | Courses |
| POST | `/api/student/enrollments` | Enroll | Auth | `{courseId}` | `{courseId,enrolled:true}` | Enroll buttons |

### 25.6 Portfolio (`portfolioRoutes.js`)

| Method | Endpoint | Purpose | Role | Input | Output | Used By |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/portfolio` | Basics + all 4 child collections | Auth | — | `{basics,projects,certifications,internships,achievements}` | Portfolio, Trust Layer, Settings, matching |
| POST | `/api/portfolio/basics` | Save the 5 editable fields | Auth | `{headline,bio,avatarUrl,institution,expectedGraduation}` | echo | Portfolio Edit |
| POST | `/api/portfolio/seed` | One-time seed of all 5 tables | Auth | full portfolio object | `{seeded}` or `{alreadyExisted:true}` | First portfolio load |

### 25.7 Applications (`applicationsRoutes.js`)

| Method | Endpoint | Purpose | Role | Input | Output | Used By |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/applications` | Own applications | Auth (student) | — | `{applications:[...]}` | My Applications, dashboard |
| POST | `/api/applications` | Apply (409 if duplicate) | Auth (student) | `{opportunityId,companyName,department,role,roleSubtext}` | `{application}` | Apply Now |
| PATCH | `/api/applications/:id/status` | Recruiter moves a real applicant's status; ownership checked by joining through the opportunity's `posted_by` | Auth (industry) | `{status}` | `{application}` | Applicant Pipeline move/reject |

### 25.8 Messages (`messagesRoutes.js`)

| Method | Endpoint | Purpose | Role | Input | Output | Used By |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/messages` | Sent messages + unread overrides | Auth | — | `{messagesByConversation,unreadOverrides}` | Inbox |
| POST | `/api/messages/send` | Send (also marks read) | Auth | `{conversationId,text}` | `{message}` | Send button |
| POST | `/api/messages/read` | Mark conversation read | Auth | `{conversationId}` | echo | Opening a thread |

### 25.9 Industry (`industryRoutes.js`)

| Method | Endpoint | Purpose | Role | Input | Output | Used By |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/industry/company-profile` | Own company profile | Auth (industry) | — | `{profile}` | Company Profile, Post Opportunity |
| POST | `/api/industry/company-profile` | Save profile | Auth (industry) | `{name,industry,website,description,logoUrl}` | `{profile}` | Company Profile |
| GET | `/api/industry/opportunities` | **All** posted opportunities | **Any auth** | — | `{opportunities:[...]}` | Student listings AND industry manage |
| POST | `/api/industry/opportunities` | Create opportunity | Auth (industry) | `{title,company,type,location,duration,stipend,commitment,overview,skills,eligibility}` | `{opportunity}` | Post Opportunity |
| PATCH | `/api/industry/opportunities/:id/status` | Change status (ownership-checked) | Auth (industry) | `{status}` | `{opportunity}` | Close button |
| GET | `/api/industry/applications` | Real applications against this recruiter's opportunities, joined via `posted_by` | Auth (industry) | — | `{applications:[...]}` | Applicant Pipeline |
| GET | `/api/industry/pipeline-overrides` | Own stage moves (legacy/local entries only — a real entry's stage lives on the application itself, see `/api/applications/:id/status`) | Auth (industry) | — | `{overrides:{entryId:stage}}` | Pipeline |
| POST | `/api/industry/pipeline-overrides` | Set a stage | Auth (industry) | `{entryId,stage}` | echo | Move / Reject |
| GET | `/api/industry/skill-programs` | **All** programs | **Any auth** | — | `{programs:[...]}` | Student Learning AND industry list |
| POST | `/api/industry/skill-programs` | Create program | Auth (industry) | `{title,company,skills,weeks}` | `{program}` | Skill Programs |

The two deliberately-public GETs are what make the industry-to-student data path real.

### 25.10 Institution and Faculty APIs

**None exist.** There is no `/api/admin/*`, no `/api/institution/*`, and no `/api/academician/*` route file. `institutionService.js` and `facultyService.js` are **frontend-only**, computing everything from `mockData/candidates.js` with no network call. This is the structural reason those two dashboards cannot show real students. **Backend Missing.**

### 25.11 Cross-cutting behaviour

- **CORS:** `localhost:5173`, `localhost:5174`, plus every origin in `FRONTEND_URL` (comma-separated, trailing slashes stripped), with `credentials: true`.
- **Body limit:** `express.json({limit:"10kb", strict:true})`.
- **`app.set("trust proxy", 1)`** so rate limiting works behind Render's proxy.
- **404 handler:** `{error:"Route not found"}`. **Error handler:** logs the stack, returns a generic `{error:"Internal server error"}` — internals are never leaked.
- **Resilience pattern (every migrated service):** try the backend, on failure log `console.warn` and fall back to `localStorage`, so the demo keeps working offline. The consequence is that **failures are silent to the user** — a student may believe data saved when only the local cache was written.

---

## 26. Complete Data Flow

### 26.1 The full chain, annotated with what is real

```
 1. Student registers                    POST /api/auth/register
        │                                users row created (role='student')
        ▼                                                            [REAL]
 2. First dashboard load                 getPortfolio() finds no basics row
        │                                -> POST /api/portfolio/seed (DEFAULT_PORTFOLIO)
        │                                -> skill profile falls back to buildDemoSkillProfile()
        ▼                                                            [REAL persistence of DEMO content]
 3. Student takes an assessment
        │  a) /skill-assessment -> scoreAssessment() -> N parallel upserts
        │  b) /skill-tests/:id  -> scoreSkillTest() (client-side)
        │                       -> POST /api/assessments/skill-tests/:id/submit
        ▼                                                            [REAL]
 4. Result stored                        skill_test_results (every attempt kept)
        ▼                                                            [REAL]
 5. Skill profile updated                skill_profile UPSERT
        │                                  score = MAX(existing, new) on a pass
        │                                  trust_level = 'Assessment Verified'
        ▼                                                            [REAL]
 6. Skill gap calculated                 calculateMatch(profile, role.requiredSkills,
        │                                                {skillMatch:100})
        │                                  -> readinessPercent, matched[], missing[]
        ▼                                                            [REAL, computed live, never stored]
 7. Career recommendation                all 4 roles scored and ranked; selection
        │                                persisted to student_target_role
        ▼                                                            [REAL]
 8. Learning recommended                 one path per missing skill, from
        │                                MODULES_BY_SKILL + PROJECTS_BY_SKILL
        ▼                                                            [REAL generation over MOCK content]
 9. Student completes modules            POST /api/student/learning-progress
        ▼                                                            [REAL]
10. Re-assessment on final module        score = min(required, max(current,40)+25)
        │                                trust: Self-Declared -> Assessed
        │                                POST /api/assessments/skill-profile/upsert
        ▼                                                            [REAL write, FORMULA-based]
11. Portfolio reflects the change        Skills & Trust Levels + Assessment Results
        │                                (both read live from skill_profile /
        │                                 skill_test_results)
        ▼                                                            [REAL]
12. Matching engine re-evaluates         getStudentForMatching() =
        │                                  skill_profile + getStudentEvidence()
        │                                calculateMatch() per opportunity, sorted
        ▼                                                            [REAL]
13. Industry SEARCHES for candidates      /industry/candidates reads mockData/candidates.js
        │                                (a separate discovery surface, still mock —
        ▼                                 this leg was not part of the applications fix) [INTEGRATION MISSING]
14. Student applies                      POST /api/applications (status 'Applied')
        ▼                                                            [REAL]
15. Industry reviews                     GET /api/industry/applications joins
        │                                applications -> opportunities on posted_by;
        │                                the Applicant Pipeline shows the REAL applicant
        ▼                                                            [REAL]
16. Application status updated           PATCH /api/applications/:id/status,
        │                                ownership-checked via the opportunity's
        │                                posted_by; writes straight to the same
        │                                applications.status row the student reads
        ▼                                                            [REAL]
17. Placement                            'Selected' is a real status on a real
                                         application; institution analytics (§20)
                                         still compute placement counts over the
                                         MOCK candidate pool, not this real data yet
                                                                     [REAL application data,
                                                                      PARTIAL institution rollup]
```

### 26.2 The genuinely live cross-role paths

1. **Industry posts an opportunity -> student sees and is scored against it.**
   `opportunities` table -> `GET /api/industry/opportunities` (deliberately open to any authenticated user) -> `internshipsService.allOpportunities()` -> `matchService` -> student listings, detail, breakdown, and dashboard recommendations.

2. **Industry creates a skill program -> student sees it.**
   `skill_programs` table -> `GET /api/industry/skill-programs` (also open) -> `learningPathsService.getIndustryPrograms()` -> the Industry Programs section of `/learning-paths`.

3. **Industry closes an opportunity -> it disappears from student listings.**
   `PATCH .../status` sets `Closed`; `getInternships()` filters to Active only.

4. **Student applies -> recruiter sees it in their pipeline -> recruiter moves it -> student sees the update.** (§14.4) `applications` table -> `GET /api/industry/applications` (scoped to the recruiter's own `opportunities.posted_by`) -> Applicant Pipeline -> `PATCH /api/applications/:id/status` -> back to `/applications`.

Everything else remains single-role: `mockData/candidates.js` still stands in for the student body on the Candidates search page (§19.5) and across Institution (§20) and Faculty (§21) analytics.

### 26.3 The read-path hierarchy for skills

Every skill number in the entire product resolves through this chain — there is no second path:

```
  assessmentService.getStoredSkillProfileOrDemo()
        │  layer 1: localStorage 'skillProfile' OR buildDemoSkillProfile()
        │  layer 2: GET /api/assessments/skill-profile  ← authoritative per skill
        │           (merged by skill_name; backend wins)
        ▼
  skillsService.getSkillProfile()
        │  derives: strongSkills (>=70), skillGaps (<requiredScore), overallMatchPercent
        ▼
  ┌─────────────┬──────────────┬───────────────┬──────────────┬─────────────┐
  ▼             ▼              ▼               ▼              ▼             ▼
Dashboard   My Skills    Gap Report /     careerRoleService  matchService  AI Advisor
                          Skill Graph      (readiness)       (matching)     (context)
                                                 ▼                ▼
                                          Career Path      Listings/Detail/
                                          Skill Gap        Breakdown/Candidates
                                          Learning Paths
                                          Digital Twin
```

### 26.4 The offline-fallback pattern (and its cost)

Every migrated service follows: **try backend -> on failure `console.warn` -> use `localStorage`**. This keeps a demo working without a backend, but means a failed write is **invisible to the user**. Only `applicationsService` surfaces anything (the 409 duplicate message). Worth stating plainly as a UX risk.

---

## 27. Cross-Dashboard Connections

### 27.1 The honest connection matrix

| From ↓ / To → | Student | Faculty | Institution | Industry |
| --- | --- | --- | --- | --- |
| **Student** | — | ✗ no real path (faculty reads mock candidates) | ✗ no real path (admin reads mock candidates) | **✓ real applications** (§14.4) reach the recruiter's Applicant Pipeline; the Candidates search page (§19.5) is still ✗ mock |
| **Faculty** | ✗ "Recommend Learning" is local state only | — | ✗ | ✗ |
| **Institution** | ✗ no write capability at all | ✗ | — | ✗ (reads opportunity counts only) |
| **Industry** | **✓ opportunities** · **✓ skill programs** · **✓ application status** (writes back to the student's own `/applications`) | ✗ | **✓ (one-way)** opportunities feed admin demand/partner counts | — |

**Real arrows now exist in both directions between Student and Industry** — opportunities/programs flow Industry -> Student, and applications flow Student -> Industry with status updates flowing back. Every other cell is still Planned / Not Implemented: Faculty and Institution remain wired to the fixed mock candidate pool rather than to real students, and the Industry Candidates *search* page (distinct from the Applicant Pipeline) is unaffected by this fix.

### 27.2 Worked example A — the brief's scenario, traced honestly

```
  Student completes an assessment
        ▼  [REAL]
  skill_profile updated (Assessment Verified)
        ▼  [REAL]
  Student's own dashboard, gap, career, portfolio and match % all update
        ▼
  Faculty sees progress?          ✗ NO — FacultyDashboard reads mockData/candidates.js
        ▼
  Institution analytics update?   ✗ NO — institutionService reads the same mock pool
        ▼
  Industry sees the verified skill on the Candidates SEARCH page? ✗ NO — CandidatesList
        │                                                          reads the same mock pool
        ▼
  Matching recommends an opportunity to the student   ✓ YES — this part is real
        ▼
  Student applies -> Industry sees the APPLICATION in their pipeline  ✓ YES (§14.4, fixed)
```

The student-facing half of the loop is genuinely closed, and it now genuinely reaches Industry the moment a student applies. Faculty, Institution, and Industry's separate Candidates *search* page remain wired to a fixed mock population — none of them can discover a student before that student applies somewhere.

### 27.3 Worked example B — the industry scenario, traced honestly

```
  Industry creates an internship at /industry/opportunities/create
        ▼  [REAL]
  Required skills stored as JSONB on the opportunities row
        ▼  [REAL]
  Matching engine compares students?
        ├─ For the LOGGED-IN STUDENT browsing /internships:  ✓ REAL
        │     the new role is fetched, scored against their real skill profile,
        │     and ranked among the seed jobs
        └─ For the RECRUITER viewing /industry/candidates (SEARCH):   ✗ MOCK
              the new role IS selectable, but it is scored against the
              5 mock candidates, not against registered students —
              this is a proactive-search feature, distinct from the
              pipeline below, and this fix did not touch it
        ▼
  Matched students receive the opportunity?  ✗ no push, no notification —
                                               they must browse to find it
        ▼
  Students apply                             ✓ REAL (applications table)
        ▼
  Industry sees the applications             ✓ YES (fixed) — GET /api/industry/applications
        │                                    joins applications -> opportunities on
        │                                    posted_by; shows up in the Applicant Pipeline
        ▼
  Industry moves the applicant through stages ✓ YES (fixed) — PATCH /api/applications/:id/status
        │                                    writes back to the same row the student's
        │                                    /applications page reads
        ▼
  Faculty/Institution track internship status ✗ still only over the mock candidate pool —
                                               this fix did not extend to Faculty/Institution
```

### 27.4 What is now fixed, and what structurally remains

The application-to-pipeline join (item 2 below) has been closed. Two gaps remain, and they explain the two ✗ rows still in the matrix above:

1. **No student-listing endpoint.** Nothing exposes the full body of registered students to industry (for proactive search), faculty, or admin. Without it, the Candidates search page and both observer dashboards still fall back to `mockData/candidates.js`. **Not addressed by this fix** — it is a separate, larger endpoint (a role-gated `GET /api/students`) that Faculty, Institution, and the Candidates search page would all need to adopt.
2. ~~No application-to-pipeline join.~~ **Fixed.** `GET /api/industry/applications` + `PATCH /api/applications/:id/status` now connect the `applications` table directly to the Applicant Pipeline, in both directions.
3. **No institution/faculty association model.** No table links a student to an institution or an advisor — institution is a free-text string, and advisees are `candidates.slice(0,4)`. **Not addressed by this fix.**

### 27.5 The shape a further fix would take (for reference, not a claim of work done)

- Add `GET /api/students` (role-gated) returning skill profiles + portfolio evidence in the shape `calculateMatch` already accepts — `mockData/candidates.js` deliberately mirrors that shape, so the engine would need no changes. This would let the Candidates search page, Faculty, and Institution all move off the mock pool.
- Add `institution_id` on `users` and a `faculty_students` assignment table, so Faculty and Institution can be scoped to real cohorts instead of a hardcoded slice.

---

## 28. Feature Dependency Map

| Feature | Depends On | Used By | Output | Status |
| --- | --- | --- | --- | --- |
| **Auth / session** | `users`, JWT, Supabase | Every protected route | Authenticated identity + role | Fully Implemented |
| **Skill Catalog** | `mockData/skills.js` | Assessments, gap, matching, post-opportunity, programs, analytics | 15 skills + requiredScore + trust ladder | Fully Implemented (frontend constant) |
| **Self-Rating Assessment** | Skill catalog, questions | Skill profile | Scores, trust = Assessed | Fully Implemented |
| **Skill Tests** | Skill catalog, `SKILL_TESTS` | Skill profile, portfolio, history | Score, pass/fail, trust = Assessment Verified | Fully Implemented (client-side grading) |
| **Proof-of-Skill Challenge** | Skill profile | Skill profile | Trust = Project-Verified | Partially Implemented (heuristic grading) |
| **Skill Profile** | All three assessment paths | **Everything downstream** | Per-skill score + trust + timestamp | Fully Implemented |
| **Skill Gap (role)** | Skill profile + `CAREER_ROLES` + target role | Career Path, Learning, AI Advisor | readiness%, matched[], missing[] | Fully Implemented |
| **Skill Gap (threshold)** | Skill profile + `requiredScore` | Dashboard, gap report, graph, digital twin, learning fallback | Ranked gaps with point deltas | Fully Implemented |
| **Target Role** | `CAREER_ROLES` | Skill Gap, Career Path, Learning, AI Advisor | `student_target_role` row | Fully Implemented |
| **Career Path** | Skill profile + all roles | Target role selection, roadmap | Ranked roles + roadmap | Fully Implemented (binary roadmap progress) |
| **Career Digital Twin** | Skill profile + learning paths | Student (motivation) | Projected readiness (labelled Estimate) | Fully Implemented |
| **Learning Paths** | Role gaps -> threshold gaps fallback, modules, projects | Re-assessment, digital twin | Paths + progress + project briefs | Partially Implemented (mock content) |
| **Learning Progress** | Learning paths | Re-assessment, digital twin | `learning_path_progress` | Fully Implemented |
| **Re-assessment** | Learning progress | Skill profile | Bumped score, trust >= Assessed | Partially Implemented (formula) |
| **Course Catalog** | `mockData/courses.js` | Enrollments | Course list + filters | Partially Implemented |
| **Enrollments** | Courses | Nothing downstream | `course_enrollments` | Partially Implemented (dead-ends) |
| **Portfolio** | `portfolio_*` tables + skill profile + test results | Matching evidence, Trust Layer, evidence panel | Employer-facing profile | Partially Implemented (children read-only) |
| **Student Evidence** | Portfolio child tables | Matching engine | projects/certs/experience dimensions | Fully Implemented |
| **Opportunities** | Company profile (name), skill catalog | Student listings, matching, candidates, analytics demand | `opportunities` rows | Fully Implemented |
| **Matching Engine** | Skill profile + evidence + opportunity | Listings, detail, breakdown, dashboard, career readiness, candidates | overallScore + explanation | Fully Implemented (3 of 7 dimensions near-constant) |
| **Applications** | Opportunities | My Applications, dashboard stats, **Applicant Pipeline** | `applications` rows, status now updatable by the owning recruiter | Fully Implemented |
| **Applicant Pipeline** | Real applications (joined on `opportunities.posted_by`) | Industry dashboard | Stage per real applicant; writes back to `applications.status` | Fully Implemented (faculty internship activity and institution placements still read the separate mock candidate/pipeline path, not this real one) |
| **Skill Programs** | Company profile, skill catalog | **Student Learning page** | `skill_programs` rows | Fully Implemented |
| **Messages** | Seed conversations | Student inbox | `sent_messages`, read-state | Partially Implemented (one-sided) |
| **Notifications** | Seed notifications | Student | Read-state only | Partially Implemented (no generation) |
| **Preferences / Settings** | — | Nothing reads visibility settings | `notification_preferences` row | Partially Implemented (stored, unenforced) |
| **AI Advisor** | Skill profile + role readiness + Gemini | Student | Grounded plain-text advice | Fully Implemented (stateless) |
| **Institution Analytics** | **Mock candidates** + real opportunities + pipeline | Admin pages | KPIs, gaps, readiness buckets, demand/supply | Partially Implemented |
| **Faculty Monitoring** | **Mock candidates** + pipeline | Faculty pages | Roster, per-student detail | Partially Implemented |

---

## 29. User Journeys

Each step is marked with what actually happens.

### 29.1 Student Journey

| # | Step | Route | Reality |
| --- | --- | --- | --- |
| 1 | Register, pick "Student" | `/signup` | **Real** |
| 2 | Land on dashboard | `/dashboard` | **Real**, but pre-populated with demo skills + portfolio |
| 3 | Complete the self-rating assessment | `/skill-assessment` | **Real** — 12 questions, trust = Assessed |
| 4 | Take skill tests | `/skill-tests/:id` | **Real** — 12 domains, trust = Assessment Verified on a pass |
| 5 | Review skills | `/skills` | **Real** |
| 6 | Pick a target role, see the gap | `/skill-gap` | **Real** — persisted target role |
| 7 | Explore career readiness + roadmap | `/career-path` | **Real** (roadmap progress is binary) |
| 8 | Ask the AI Advisor | `/ai-advisor` | **Real** — Gemini, grounded, single-turn |
| 9 | Work a learning path | `/learning-paths` | **Real progress** over mock module titles |
| 10 | Final module -> re-assessment | `/learning-paths` | **Real write**, formula-based score bump |
| 11 | Verify a skill by challenge | `/proof-of-skill` | **Real trust upgrade**, heuristic grading |
| 12 | Edit portfolio basics | `/portfolio/edit` | **Real** (4 fields only) |
| 13 | Review the portfolio | `/portfolio` | **Real** — projects/certs/internships are seeded |
| 14 | Browse opportunities, filter | `/internships` | **Real** — seed + industry-posted, scored + ranked |
| 15 | Read "Why this match?" | `/match-breakdown/:jobId` | **Real** explanation |
| 16 | Apply | `/internships/:jobId` | **Real** — one row, status 'Applied'; now appears in the recruiter's Applicant Pipeline |
| 17 | Track the application | `/applications` | **Real row + 4 demo rows**; status now updates in real time as the recruiter moves it |
| 18 | Interview / Selection | `/applications` | **Real** — the recruiter moves the real applicant to Interview/Selected via `/industry/applications`, and the status change lands on this exact row |
| 19 | Internship / Job | — | ✗ **Not Implemented** — reaching "Selected" is real, but nothing beyond the stage label (onboarding, offer letter, start date) exists |

### 29.2 Industry Journey

| # | Step | Route | Reality |
| --- | --- | --- | --- |
| 1 | Register, pick "Industry Partner" | `/signup` | **Real** |
| 2 | Verification | — | ✗ **Not Implemented** — no company verification exists; access is immediate |
| 3 | Set up the company profile | `/industry/profile` | **Partial** — Size and About are silently dropped (§19.2) |
| 4 | Post an opportunity | `/industry/opportunities/create` | **Real** — skills from the catalog, eligibility, work mode |
| 5 | Define required skills | same page | **Real** — drives matching directly |
| 6 | Receive matches | `/industry/candidates` | **Mock** — 5 fixed candidates, genuinely scored |
| 7 | View a candidate + tune weights | `/industry/candidates/:id` | **Real engine**, mock candidate; 3 sliders unlabelled |
| 8 | Shortlist / advance | `/industry/applications` | **Real** — real applicants, real stage persistence, writes back to the student's own application |
| 9 | Message a candidate | — | ✗ **UI Only** — "Contact" flips a label for 2 seconds |
| 10 | Recruit / offer | — | ✗ **Not Implemented** beyond the 'Selected' stage label |
| 11 | Create a skill program | `/industry/skill-programs` | **Real** — and genuinely visible to students |

### 29.3 Faculty Journey

| # | Step | Route | Reality |
| --- | --- | --- | --- |
| 1 | Register, pick "Academician", log in | `/signup`, `/login` | **Real** |
| 2 | Land on My Students | `/academician/dashboard` | **Real page**, roster = first 4 mock candidates |
| 3 | Monitor skills | same | **Mock data**, real computation |
| 4 | Identify gaps | `/academician/students/:id` | **Mock data**, real computation |
| 5 | Recommend learning | same | ✗ **UI Only** — local state; the student never learns of it |
| 6 | Track learning progress | — | ✗ **Not Implemented** — `learning_path_progress` is never read here |
| 7 | Track internships | `/academician/students/:id` | **Seeded pipeline entries only** |
| 8 | Communicate | — | ✗ **Not Implemented** — no faculty messaging exists |

### 29.4 Institution Journey

| # | Step | Route | Reality |
| --- | --- | --- | --- |
| 1 | Log in (role set in DB by hand) | `/login` | **Real**, but **no self-registration path exists** |
| 2 | Institution dashboard | `/admin/dashboard` | **Real computation** over mock students + real opportunities |
| 3 | Student analytics | `/admin/students` | **Read-only table**, mock population |
| 4 | Skill-gap analytics | `/admin/skill-analytics` | **Real demand** (live opportunities) vs **mock supply** |
| 5 | Placement readiness | `/admin/dashboard` | **Real buckets** over mock students |
| 6 | Industry collaboration | `/admin/dashboard` | **Proxy only** — count of distinct companies with active roles |
| 7 | Reports / export | — | ✗ **Not Implemented** — no export, print, or download anywhere |
| 8 | Manage students / faculty | — | ✗ **Not Implemented** — the portal is entirely read-only |

---

## 30. Route → Feature → Role Matrix

**Legend:** ✓ = accessible · — = not accessible · **P** = planned · **UI** = UI only

| Route | Feature | Student | Faculty | Institution | Industry |
| --- | --- | :---: | :---: | :---: | :---: |
| `/` | Landing / role redirect | ✓ | ✓ | ✓ | ✓ |
| `/login` | Login | ✓ | ✓ | ✓ | ✓ |
| `/signup` | Register (3 roles) | ✓ | ✓ | — | ✓ |
| `/portal-pending` | Roleless fallback | ✓ | ✓ | ✓ | ✓ |
| `/dashboard` | Student dashboard | ✓ | — | — | — |
| `/skill-assessment` | Self-rating assessment | ✓ | — | — | — |
| `/skill-tests` | Assessments + history | ✓ | — | — | — |
| `/skill-tests/:testId` | Take an assessment | ✓ | — | — | — |
| `/skill-tests/:testId/result` | Assessment result | ✓ | — | — | — |
| `/skills` | My Skills | ✓ | — | — | — |
| `/skill-gap` | Skill gap vs target role | ✓ | — | — | — |
| `/career-path` | Career readiness + roadmap | ✓ | — | — | — |
| `/ai-advisor` | AI Career Advisor | ✓ | — | — | — |
| `/learning-paths` | Learning + industry programs | ✓ | — | — | — |
| `/courses` | Course catalog | ✓ | — | — | — |
| `/courses/:courseId` | Course detail + enroll | ✓ | — | — | — |
| `/internships` | Opportunity listings | ✓ | — | — | — |
| `/internships/:jobId` | Opportunity detail + apply | ✓ | — | — | — |
| `/match-breakdown/:jobId` | Match explanation | ✓ | — | — | — |
| `/applications` | Application history | ✓ | — | — | — |
| `/portfolio` | Digital portfolio | ✓ | — | — | — |
| `/portfolio/edit` | Edit portfolio basics | ✓ | — | — | — |
| `/skill-passport` | Redirect -> `/portfolio` | ✓ | — | — | — |
| `/skill-profile/gap-report` | Gap report | ✓ | — | — | — |
| `/skill-profile/graph` | Living skill graph | ✓ | — | — | — |
| `/proof-of-skill` | Proof-of-Skill challenge | ✓ | — | — | — |
| `/career-twin` | Career digital twin | ✓ | — | — | — |
| `/employer-trust` | Employer trust layer | ✓ | — | — | — |
| `/messages` | Messaging | ✓ | **P** | **P** | **P** |
| `/notifications` | Notifications | ✓ | **P** | **P** | **P** |
| `/settings` | Full settings | ✓ | **P** | **P** | partial (see below) |
| `/industry/dashboard` | Recruitment overview | — | — | — | ✓ |
| `/industry/profile` | Company profile | — | — | — | ✓ |
| `/industry/opportunities` | Manage opportunities | — | — | — | ✓ |
| `/industry/opportunities/create` | Post opportunity | — | — | — | ✓ |
| `/industry/applications` | Applicant pipeline | — | — | — | ✓ |
| `/industry/candidates` | Ranked candidates | — | — | — | ✓ |
| `/industry/candidates/:id` | Candidate detail + weights | — | — | — | ✓ |
| `/industry/skill-programs` | Skill programs | — | — | — | ✓ |
| `/industry/settings` | Account info (read-only) | — | — | — | **UI** |
| `/admin/dashboard` | Institution overview | — | — | ✓ | — |
| `/admin/students` | Student roster (read-only) | — | — | ✓ | — |
| `/admin/skill-analytics` | Skill analytics | — | — | ✓ | — |
| `/academician/dashboard` | My students | — | ✓ | — | — |
| `/academician/students/:id` | Student detail | — | ✓ | — | — |
| *(none)* | Certificate verification | **P** | **P** | **P** | **P** |
| *(none)* | Password reset | **P** | **P** | **P** | **P** |
| *(none)* | Admin/faculty settings | — | **P** | **P** | — |
| *(none)* | Industry analytics | — | — | — | **P** |

---

## 31. Implementation Status

| Feature | Status | Frontend | Backend | Database | Notes |
| --- | --- | --- | --- | --- | --- |
| Email/password auth | Fully Implemented | ✓ | ✓ | ✓ | bcrypt + 7d JWT in an HttpOnly cookie |
| Google OAuth (Supabase) | Fully Implemented | ✓ | ✓ | ✓ | `auth_user_id` link + `/auth/sync` |
| Role-based routing | Fully Implemented | ✓ | ✓ | ✓ | `roleMiddleware` exists but is unused on routes |
| Rate limiting | Fully Implemented | — | ✓ | — | 4 limiters (login/register/sync/AI) |
| Password change | Fully Implemented | ✓ | ✓ | ✓ | Correctly rejects Google accounts |
| **Password reset** | **Planned** | ✗ | ✗ | ✗ | "Forgot password?" is `href="#"` |
| Self-rating assessment | Fully Implemented | ✓ | ✓ | ✓ | 12 questions, draft autosave, retake guard |
| Skill tests (12 domains) | Fully Implemented | ✓ | ✓ | ✓ | **Grading is client-side** — integrity gap |
| Assessment history | Fully Implemented | ✓ | ✓ | ✓ | Every attempt kept; best + latest shown |
| Answer review after a test | Planned | ✗ | ✗ | ✗ | `breakdown` is computed but never rendered |
| Skill profile | Fully Implemented | ✓ | ✓ | ✓ | The canonical record; 3 write paths |
| Trust levels (4 of 7) | Partially Implemented | ✓ | ✓ | ✓ | Certified / Institution- / Industry-Verified never assigned |
| Proof-of-Skill challenge | Partially Implemented | ✓ | ✓ | ✓ | Real trust upgrade, **heuristic grading** |
| Skill gap (both kinds) | Fully Implemented | ✓ | ✓ | ✓ | Computed live, never stored |
| Target role | Fully Implemented | ✓ | ✓ | ✓ | Shared by gap, career, learning, AI |
| Career path + roadmap | Fully Implemented | ✓ | ✓ | ✓ | Roadmap progress is binary by design |
| Career digital twin | Fully Implemented | ✓ | ✓ | ✓ | Clearly labelled "Estimate" |
| Learning paths | Partially Implemented | ✓ | ✓ | ✓ | Real progress over **mock module titles** |
| Learning re-assessment | Partially Implemented | ✓ | ✓ | ✓ | Formula (+25 capped), not a re-test |
| Course catalog + enroll | Partially Implemented | ✓ | ✓ | ✓ | Enrollment persists but unlocks nothing |
| Digital portfolio | Partially Implemented | ✓ | ✓ | ✓ | Only 4 basics editable; children seeded read-only |
| Portfolio -> matching evidence | Fully Implemented | ✓ | ✓ | ✓ | Projects/certs/internships move match % |
| Portfolio share link | **UI Only** | ✓ | ✗ | ✗ | Fabricated `skillbridge.edu` URL |
| Résumé download | Partially Implemented | ✓ | ✗ | ✗ | `window.print()`; no PDF, no template |
| Employer trust layer | Fully Implemented | ✓ | ✓ | ✓ | Read-only, computed from real data |
| Opportunity listings + filters | Fully Implemented | ✓ | ✓ | ✓ | Skill/mode/city/type; dynamic city list |
| Matching engine | Fully Implemented | ✓ | — | — | Frontend-only; 3 of 7 dimensions near-constant |
| Explainable match | Fully Implemented | ✓ | — | — | Shared `WhyThisMatch` on both sides |
| Apply to opportunity | Fully Implemented | ✓ | ✓ | ✓ | Duplicate-guarded (409) |
| Application status updates | Fully Implemented | ✓ | ✓ | ✓ | `PATCH /api/applications/:id/status`, ownership-checked via the opportunity's `posted_by` |
| **Applications -> recruiter pipeline** | Fully Implemented | ✓ | ✓ | ✓ | `GET /api/industry/applications` joins on `posted_by`; the former biggest gap in the product |
| Messaging (student side) | Partially Implemented | ✓ | ✓ | ✓ | One-sided; seed contacts; attach/search/menu are UI-only |
| Industry/faculty messaging | Planned | ✗ | ✗ | ✗ | No routes exist |
| Notifications | Partially Implemented | ✓ | ✓ | ✓ | Read-state real; **no notification is ever generated** |
| Email / SMS delivery | Planned | ✗ | ✗ | ✓ (toggles) | No provider, no send code |
| AI Career Advisor | Fully Implemented | ✓ | ✓ | — | Gemini, key server-side, grounded, **stateless** |
| Student settings | Fully Implemented | ✓ | ✓ | ✓ | Except: Language is disabled |
| Privacy / visibility settings | Partially Implemented | ✓ | ✓ | ✓ | **Stored but never enforced** |
| Company profile | **Broken / Needs Fix** | ✓ | ✓ | ✓ | `size`/`about` have no DB columns — silently dropped |
| Post opportunity | Fully Implemented | ✓ | ✓ | ✓ | Strongest cross-role path |
| Manage opportunities | Partially Implemented | ✓ | ✓ | ✓ | Close only; no edit/delete/reopen |
| Opportunity list scoping | **Broken / Needs Fix** | ✗ | ✗ | ✓ | Industry sees **all** companies' postings |
| Candidate list + ranking | Partially Implemented | ✓ | ✗ | ✗ | Real engine, **mock candidates** |
| Candidate weight sliders | Partially Implemented | ✓ | — | — | 3 sliders render with **empty labels** |
| Applicant pipeline | Fully Implemented | ✓ | ✓ | ✓ | Real applicants, real stage moves, both directions with `applications.status` |
| Pipeline "Contact" | **UI Only** | ✓ | ✗ | ✗ | Flips a label for 2 seconds |
| Industry skill programs | Fully Implemented | ✓ | ✓ | ✓ | Genuinely visible to students |
| Industry settings | **UI Only** | ✓ | — | — | Static name + email |
| Institution dashboard | Partially Implemented | ✓ | ✗ | ✗ | Real math over **mock students** |
| Student management | Partially Implemented | ✓ | ✗ | ✗ | Read-only despite the name |
| Skill analytics | Partially Implemented | ✓ | ✗ | ✗ | Real demand, mock supply |
| Faculty dashboard | Partially Implemented | ✓ | ✗ | ✗ | Roster = `candidates.slice(0,4)` |
| Faculty "Recommend Learning" | **UI Only** | ✓ | ✗ | ✗ | Local state; student never notified |
| Certificate verification / QR | Planned | ✗ | ✗ | ✗ | Nothing exists |
| File upload (any kind) | Planned | ✗ | ✗ | ✗ | No multer, no storage bucket |
| Reports / export | Planned | ✗ | ✗ | ✗ | No CSV/PDF anywhere |
| Charts (real library) | Planned | ✗ | — | — | All "charts" are CSS-width divs |
| Interview scheduling | Planned | ✗ | ✗ | ✗ | "Interview" is only a stage label |

---

## 32. Missing / Incomplete Features

### 32.1 Critical Missing Features

1. **Real student data still never reaches Industry's proactive Candidates search, Faculty, or Institution.** All three read `mockData/candidates.js`. Without a general student-listing endpoint, they can never show a real user *before* that student applies to something. (The Applicant Pipeline is the one exception now — see item 2.)
2. ~~Student applications never reach the recruiter.~~ **Fixed.** `applications` and the Applicant Pipeline are now joined via `GET /api/industry/applications`.
3. ~~Application status can never change.~~ **Fixed.** `PATCH /api/applications/:id/status` lets the owning recruiter move it, and the change is visible on the student's own `/applications`.
4. **Assessment grading is client-side**, so a submitted score is not server-verifiable.
5. **No password reset** — a user who forgets their password is locked out permanently.
6. **Privacy settings are unenforced** — `profile_visibility`, `portfolio_visibility`, `opportunity_visibility`, and `data_sharing_consent` are stored but no query respects them.
7. **No notification is ever generated by an event.**

### 32.2 Partially Implemented Features

- Learning paths (real progress, mock module content, formula-based re-assessment)
- Portfolio (4 editable fields; projects/certs/internships/achievements seeded and read-only)
- Applications (real insert and status updates from the recruiter; the student-facing list is still blended with 4 seed demo rows)
- Messaging (real send/read for a one-sided conversation with seed contacts)
- Notifications (real read-state over a static universal list)
- Matching engine (3 of 7 dimensions contribute near-constant values)
- All Institution and Faculty analytics (real computation, mock population)
- Course enrollment (persisted, but unlocks nothing and feeds nothing back)
- Career roadmap (binary rather than stepwise progress)
- Résumé download (`window.print()` with no template)
- Proof-of-Skill challenge (real verification plumbing, placeholder grading)
- Industry settings (display only)

### 32.3 UI-only Features

| Element | Location |
| --- | --- |
| "Forgot password?" link | `/login` |
| "Remember my credentials" checkbox | `/login` |
| Language selector (disabled) | `/settings` |
| Share Portfolio modal + fabricated URL | `/portfolio` |
| Attachment / search-in-thread / three-dot menu | `/messages` |
| "Contact" button | `/industry/applications` |
| "Recommend Learning" button | `/academician/students/:id` |
| "Save for Later" button | `/match-breakdown/:jobId` |
| Landing footer links (Privacy, Terms, Contact, Help) | `/signup`, `/` |

### 32.4 Backend Missing

- ~~`PATCH /api/applications/:id/status`~~ — added.
- ~~`GET /api/industry/applications` (real applications for a company)~~ — added.
- Any general student-listing endpoint (`GET /api/students`) — still missing; needed by Industry's Candidates search page, Faculty, and Institution, none of which this fix touched
- Any `/api/admin/*` or `/api/academician/*` route file
- Password-reset endpoints
- Notification-creation endpoint
- Portfolio child-table write endpoints (projects, certifications, internships, achievements)
- Any file-upload endpoint
- Server-side assessment grading
- Any endpoint that updates `users.name`

### 32.5 Database Missing

- `institutions` table (institution is free text)
- `faculty_students` assignment table
- `notifications` table (only read-state exists)
- `conversations` / `contacts` tables
- `interviews` table
- `certificates` / verification table
- `skills`, `career_roles`, `courses`, `learning_modules` as tables (all frontend constants)
- `company_profiles.size` and `.about` columns (the UI edits fields that do not exist)
- `applications.updated_at` / status-history

### 32.6 Integration Missing

1. ~~Applications ↔ recruiter pipeline~~ — **fixed** (§14.4).
2. ~~Recruiter stage changes ↔ student application status~~ — **fixed**, same change (§14.4).
3. Real students ↔ candidate search (Industry's *proactive* search page, `/industry/candidates` — distinct from the now-fixed Applicant Pipeline)
4. Real students ↔ institution analytics
5. Real students ↔ faculty roster
6. Faculty recommendations ↔ student notifications
7. Course completion ↔ skill profile
8. Privacy settings ↔ any query that reads student data
9. Email/SMS toggles ↔ any delivery provider

### 32.7 Features Required for MVP

Ordered by dependency; the first two are now done.

1. ~~`GET /api/industry/applications` joining `applications` -> `opportunities` on `posted_by`.~~ **Done.**
2. ~~`PATCH /api/applications/:id/status` so recruiter stage moves write back to the student's row.~~ **Done.**
3. `GET /api/students` returning skill profiles + portfolio evidence in the shape `calculateMatch` already accepts (the mock data deliberately mirrors it, so the engine needs no change) — would let Industry's Candidates search page, Faculty, and Institution all move off the mock candidate pool.
4. Server-side assessment grading (move `SKILL_TESTS` behind the API).
5. Password reset.
6. Enforce the four privacy settings in every read path that exposes a student.
7. Event-driven notification creation (application received, status changed, assessment passed) — now has real material to trigger on, since a status change is real.
8. Fix the company-profile field mismatch and the industry opportunity scoping.
9. Portfolio child-record CRUD.

### 32.8 Features for Future Versions

Certificate/document verification with QR and issuer checks; AI fraud detection; institution and industry endorsement flows (unlocking the top three trust levels); real learning content and providers; interview scheduling; offer management; a real code-execution sandbox for challenges; multi-turn AI advisor with persisted history; real-time messaging with a user directory; report export; a charting library; departments/cohorts; multi-recruiter company accounts; and admin/faculty settings pages.

---

## 33. Final System Architecture

```
   ┌──────────┐   ┌──────────┐   ┌───────────────┐   ┌──────────┐
   │ STUDENT  │   │ INDUSTRY │   │ ACADEMICIAN   │   │  ADMIN   │
   └────┬─────┘   └────┬─────┘   └──────┬────────┘   └────┬─────┘
        └──────────────┴────────────────┴─────────────────┘
                              │  browser
                              ▼
   ╔══════════════════════════════════════════════════════════════╗
   ║  FRONTEND — React 18 + Vite SPA  (Vercel, vercel.json SPA)   ║
   ║                                                              ║
   ║  BrowserRouter ─► ProtectedRoute(allowedRoles) ─► Page        ║
   ║  AuthContext (session)   DashboardLayout + Sidebar (4 navs)   ║
   ║                                                              ║
   ║  services/   ── api.js (all fetch, credentials:'include')     ║
   ║              ── matchingEngine.js   ◄── ALL match scoring     ║
   ║              ── skillsService.js    ◄── ALL skill reads       ║
   ║              ── 20 feature services, each with a              ║
   ║                 localStorage offline fallback                 ║
   ║  mockData/   ── SEED CATALOGS (not in the DB):                ║
   ║                 skills · careerRoles · skillTests(12) ·       ║
   ║                 internships(7) · candidates(5) · courses(4) · ║
   ║                 conversations(4) · notifications(6) ·         ║
   ║                 pipeline(6) · portfolio · learning modules    ║
   ╚═══════════════════════════════╤══════════════════════════════╝
                                   │  HTTPS · HttpOnly cookie `auth_token`
                                   ▼
   ╔══════════════════════════════════════════════════════════════╗
   ║  BACKEND — Node + Express  (Render, /api/health)              ║
   ║                                                              ║
   ║  CORS(FRONTEND_URL) ─► json(10kb) ─► rateLimiters ─►          ║
   ║  authMiddleware (Supabase token OR JWT) ─► resolveUserId ─►   ║
   ║  controller                                                   ║
   ║                                                              ║
   ║  8 route files / 35 endpoints:                                ║
   ║   auth · assessments · ai-advisor · student · portfolio ·     ║
   ║   applications · messages · industry                          ║
   ║   (no admin, no academician — by omission, not by design)      ║
   ╚════════════╤═══════════════════════════════════╤═════════════╝
                │                                   │
                ▼                                   ▼
   ┌────────────────────────────┐      ┌──────────────────────────┐
   │  SUPABASE                  │      │  GOOGLE GEMINI           │
   │  ├ Postgres — 19 tables    │      │  gemini-3.8-flash        │
   │  │   users (root)          │      │  GEMINI_API_KEY is       │
   │  │   skill_profile ◄─ core │      │  SERVER-SIDE ONLY        │
   │  │   skill_test_results    │      │  temp 0.4 / 500 tokens   │
   │  │   portfolio_* (5)       │      └──────────────────────────┘
   │  │   opportunities         │
   │  │   applications          │      Auth: bcrypt + jsonwebtoken
   │  │   skill_programs        │            + Supabase Auth (Google)
   │  │   + 9 state tables      │
   │  └ Auth — Google OAuth     │
   └────────────────────────────┘

   NOTE: no ORM (models/ is empty); controllers query Supabase directly.
   NOTE: institution + faculty analytics never reach this layer —
         they are computed in the browser from mockData/candidates.js.
```

---

## 34. How Everything Is Connected — In Plain Language

Imagine a student, Priya, opening SkillBridge for the first time.

**She creates an account** and picks "Student". She is asked for nothing more than a name, an email, and a password — no forms about her college, no résumé to upload.

**She proves what she knows.** There are two ways. She can rate herself across twelve skills — quick, but the platform labels those skills only "Assessed", because saying you know Python isn't proof. Or she can take an actual test: twelve subjects are available, from Python and SQL to Communication and Teamwork, each with a real question bank and a pass mark. Pass one, and the skill is stamped **"Assessment Verified"** — a label an employer can weigh differently from a claim. Every attempt is kept, so she can see that she scored 62% in March and 88% in June.

**The platform works out what she's missing.** Priya picks a target role — Data Analyst. The system knows that role needs Python, SQL, Power BI, Statistics and Excel. It checks her verified skills against that list and tells her plainly: three verified, two missing, 60% ready. It does the same for the other three roles so she can see which one she's actually closest to.

**It suggests how to close the gap.** For each missing skill, she gets a short learning path — a sequence of modules and a hands-on project brief. She works through them, ticking modules off. When she finishes the last one, the platform nudges that skill's level up and re-labels it. (Honest caveat: those module titles are placeholders — there is no lesson content behind them yet, and finishing a path raises the score by a formula rather than by a real re-test.)

**Her portfolio strengthens as she goes.** Her verified skills, her passed test scores, her projects, certifications and internships all sit on one page — the version an employer would see. Clicking any skill opens the evidence behind it: which test, what score, which project used it.

**Meanwhile, a company posts a job.** A recruiter at TechCorp writes an internship, picks the required skills from the same shared list Priya's assessments come from, and publishes it. Because both sides speak the same skill vocabulary, the platform can compare them precisely.

**The system matches them.** Priya opens the opportunities page and every role carries a percentage. That number isn't decorative: 40% of it is how many required skills she's actually verified, plus contributions from her projects, certifications and prior internships. She can tap **"Why this match?"** and see exactly which skills matched, which are missing, and what the single most useful next step is.

**She applies.** One click, recorded — and now it genuinely lands on the recruiter's desk. TechCorp's Applicant Pipeline shows Priya by name, at the "Applied" stage, tied to the exact role she applied for. When the recruiter moves her card to "Interview," that isn't just a note on their own board — it writes straight back to the same row Priya reads on her own Applications page, so she sees "Interview" the next time she checks, without either side doing anything special to sync it.

**And here is where the story still stops short.** That connection exists specifically for applicants — students who have taken the step of applying somewhere. Before that step, industry can't proactively search the real student body: TechCorp's "Candidates" search page still ranks five demonstration profiles, not real students, because no endpoint yet lists registered students to a recruiter. Priya's faculty advisor's dashboard still shows students with skill gaps drawn from the same demonstration set. Her institution's analytics still compute readiness distributions and top skill gaps — with real formulas, over that same demonstration population.

**So what data actually moves between people now?** Four things. Three flow from industry to students, unchanged: a posted opportunity really does appear in every student's list and gets scored against their real skills; a skill development programme a company creates really does show up on every student's learning page; and closing a role really does remove it. The fourth is new and flows both ways: a real application genuinely reaches the recruiter who posted the role, and a real stage change genuinely reaches back to the student who applied. What still has no reader outside the student's own screens is everything *before* an application exists — the verified skill profile itself, on Faculty's and Institution's dashboards, and on Industry's proactive search.

**The one piece of intelligence that is fully live end-to-end** is the AI Career Advisor. When Priya asks "what should I focus on next?", her real readiness percentage, her real verified skills and her real gaps are sent to Google's Gemini model from the server (never from her browser, so the API key stays secret), and the answer comes back grounded in her actual numbers rather than generic advice. The advisor is explicitly instructed never to invent a skill she doesn't have, and never to claim it can verify anything — verification, it says, comes from real assessments and real review.

**The shape of what's built, in one sentence:** the student's own journey is a complete, working loop; the industry-to-student direction is real in both post-and-browse and apply-and-track; and the two observer dashboards (Faculty, Institution) plus Industry's proactive candidate search remain fully built interfaces running real calculations over demonstration data, waiting on the same missing piece — an endpoint that lets them see real students before those students apply anywhere.

---

# Documentation Summary

- **Total user roles:** **4** — Student, Industry, Academician (Faculty), Admin (Institution). Only 3 can self-register; Admin is database-assigned.
- **Total major modules:** **21** — Authentication, Student Dashboard, Profile, Assessment (self-rating), Assessment (skill tests), Proof-of-Skill Challenge, My Skills / Skill Profile, Skill Gap, Career Path, Career Digital Twin, Learning Paths, Course Catalog, Opportunities, Matching Engine, Applications, Digital Portfolio, Employer Trust Layer, Messages, Notifications, AI Career Advisor, Settings — plus the Industry, Institution and Faculty portals.
- **Total routes:** **38 route definitions** (4 public · 25 student including 1 redirect · 9 industry · 3 admin · 2 faculty). 45 rows appear in the matrix in §30 because unimplemented capabilities are listed there too.
- **Total dashboards:** **4** (Student, Industry, Institution/Admin, Faculty).
- **Fully implemented features:** **~30** — including both auth paths, role gating, rate limiting, password change, both assessment systems, assessment history, the skill profile, skill gap (both definitions), target role, career path, career digital twin, portfolio→matching evidence, employer trust layer, opportunity listings with filters, the matching engine, explainable match, applying, **applications ↔ recruiter pipeline (fixed this update)**, posting opportunities, the Applicant Pipeline, industry skill programs, student settings, and the AI Career Advisor.
- **Partially implemented features:** **~15** — learning paths, learning re-assessment, course enrollment, digital portfolio, résumé download, applications (student-facing list still blended with 4 seed demo rows), messaging, notifications, trust levels (4 of 7), Proof-of-Skill challenge, manage opportunities, candidate search/ranking, institution dashboard, student management, skill analytics, faculty dashboard.
- **UI-only features:** **9** — Forgot password, Remember me, Language selector, Share Portfolio, message attachment/search/menu, pipeline Contact, faculty Recommend Learning, Save for Later.
- **Planned features:** **~14** — certificate/QR/document verification, AI fraud detection, file upload, password reset, event-driven notifications, email/SMS delivery, industry & faculty messaging, interview scheduling, offer management, report export, real charts, admin/faculty settings, industry analytics, departments/cohorts.
- **Broken / needs fix:** **4** — company profile `size`/`about` silently dropped (no DB columns); industry opportunity list not scoped to the logged-in company; three unlabelled weight sliders on Candidate Detail; name marked "update in Settings" where it is also uneditable.
- **Critical missing integrations:** **7** — (1) real students ↔ Industry's proactive candidate search, (2) real students ↔ institution analytics, (3) real students ↔ faculty roster, (4) faculty recommendations ↔ student notifications, (5) course completion ↔ skill profile, (6) privacy settings ↔ any read path, (7) notification toggles ↔ an email/SMS provider. (Applications ↔ recruiter pipeline, and recruiter stage changes ↔ student application status, were both fixed this update — see §14.4.)

---

*Generated by direct inspection of the SkillBridge codebase. Every route, endpoint, table, and component named in this document exists in the repository at the time of writing; every gap noted was verified by searching for the absent implementation rather than inferred.*
