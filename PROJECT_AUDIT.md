# PROJECT AUDIT — AcademiaLink / SIH 2026 Portal

Audit date: 2026-09-03. Read-only, exhaustive review of `frontend/`, `backend/`, and root-level files (excluding `node_modules`, `.git`, build/dist output). Every source file was opened and read in full — nothing here is inferred from file/folder names alone.

---

## 0. PROJECT OVERVIEW

### 0.1 Folder tree — `frontend/`

```
frontend/
├── FRONTEND_LOGIN_SETUP.md
├── index.html
├── package.json / package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
├── vite.config.js
├── public/                              (empty, .gitkeep only)
└── src/
    ├── App.jsx                          — route table (react-router)
    ├── main.jsx                         — React root / entry
    ├── assets/
    │   ├── fonts/                       (empty)
    │   └── images/                      (empty)
    ├── components/
    │   ├── academician/                 (empty — no academician UI exists)
    │   ├── admin/                       (empty — AdminDashboard is self-contained)
    │   ├── common/
    │   │   ├── ApplicationStatus.jsx
    │   │   ├── EmptyState.jsx
    │   │   ├── LoadingState.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── SkillEvidencePanel.jsx
    │   │   ├── SkillProgress.jsx
    │   │   ├── SkillTrustBadge.jsx
    │   │   ├── StatCard.jsx
    │   │   └── WhyThisMatch.jsx
    │   ├── industry/                    (empty — industry pages are self-contained)
    │   ├── layout/
    │   │   ├── DashboardLayout.jsx
    │   │   └── Sidebar.jsx
    │   └── student/                     (empty — student pages are self-contained)
    ├── config/
    │   ├── industryNavConfig.js
    │   └── studentNavConfig.js
    ├── context/
    │   └── AuthContext.jsx
    ├── hooks/
    │   ├── useAuth.js
    │   └── useScrollReveal.js
    ├── pages/
    │   ├── academician/                 (empty — no academician pages/routes)
    │   ├── admin/
    │   │   └── AdminDashboard.jsx
    │   ├── industry/
    │   │   ├── ApplicantPipeline.jsx
    │   │   ├── CandidateDetail.jsx
    │   │   ├── CandidatesList.jsx
    │   │   ├── CompanyProfile.jsx
    │   │   ├── IndustryDashboard.jsx
    │   │   ├── IndustrySettings.jsx
    │   │   ├── ManageOpportunities.jsx
    │   │   └── PostOpportunity.jsx
    │   ├── public/
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── PortalPending.jsx
    │   │   └── SignupRoleSelection.jsx
    │   └── student/
    │       ├── CareerDigitalTwin.jsx
    │       ├── CourseCatalog.jsx
    │       ├── CourseDetail.jsx
    │       ├── DigitalPortfolio.jsx
    │       ├── DigitalPortfolioEdit.jsx
    │       ├── EmployerTrustLayer.jsx
    │       ├── ExplainableMatchBreakdown.jsx
    │       ├── InternshipJobDetail.jsx
    │       ├── InternshipJobListings.jsx
    │       ├── MessagesInbox.jsx
    │       ├── MyApplications.jsx
    │       ├── Notifications.jsx
    │       ├── ProfileSettings.jsx
    │       ├── ProofOfSkillChallenge.jsx
    │       ├── RecommendedLearningPaths.jsx
    │       ├── SkillAssessment.jsx
    │       ├── SkillProfileGapReport.jsx
    │       ├── SkillProfileGraph.jsx
    │       └── StudentDashboard.jsx
    ├── routes/                          (empty — routing lives in App.jsx, NOT here)
    ├── services/
    │   ├── api.js                       — real backend HTTP client (auth only)
    │   ├── applicationsService.js
    │   ├── assessmentService.js
    │   ├── candidatesService.js
    │   ├── challengesService.js
    │   ├── companyProfileService.js
    │   ├── coursesService.js
    │   ├── enrollmentsService.js
    │   ├── internshipsService.js
    │   ├── learningPathsService.js
    │   ├── matchService.js
    │   ├── matchingEngine.js
    │   ├── messagesService.js
    │   ├── mockClient.js                — fake-latency Promise wrapper
    │   ├── notificationsService.js
    │   ├── opportunitiesService.js
    │   ├── pipelineService.js
    │   ├── portfolioService.js
    │   ├── preferencesService.js
    │   ├── skillsService.js
    │   └── mockData/
    │       ├── applications.js
    │       ├── assessmentQuestions.js
    │       ├── candidates.js
    │       ├── companyProfile.js
    │       ├── conversations.js
    │       ├── courses.js
    │       ├── internships.js
    │       ├── learningPathModules.js
    │       ├── notifications.js
    │       ├── pipeline.js
    │       ├── portfolio.js
    │       └── skills.js
    ├── styles/
    │   └── index.css
    └── utils/
        └── roleRedirect.js
```

### 0.2 Folder tree — `backend/`

```
backend/
├── .env                                 (present, gitignored — see §16)
├── .env.example
├── AUTH_SETUP_GUIDE.md
├── package.json / package-lock.json
├── testSupabase.js                      — standalone connectivity-check script
└── src/
    ├── index.js                         — Express app entry
    ├── config/
    │   └── supabase.js                  — Supabase client init
    ├── controllers/
    │   └── authController.js            — register / login / getCurrentUser
    ├── database/
    │   └── schema.sql                   — `users` table only
    ├── middleware/
    │   └── authMiddleware.js            — JWT auth + role guard
    ├── models/                          (empty — no ORM/model layer; Supabase queried ad hoc)
    ├── routes/
    │   └── authRoutes.js
    ├── services/                        (empty — no business-logic layer)
    ├── utils/                           (empty)
    └── validators/
        └── authValidator.js
```

### 0.3 `package.json` — Frontend (`frontend/package.json`)

**Dependencies**
| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.3.1 | UI library |
| `react-dom` | ^18.3.1 | React DOM renderer |
| `react-router-dom` | ^6.26.0 | Client-side routing (`BrowserRouter`, `Routes`) |
| `@phosphor-icons/react` | ^2.1.10 | Icon set used across every page/component |

**devDependencies**
| Package | Version | Purpose |
|---|---|---|
| `vite` | ^5.4.1 | Dev server / bundler |
| `@vitejs/plugin-react` | ^4.3.1 | React fast-refresh plugin for Vite |
| `tailwindcss` | ^3.4.19 | Utility CSS framework (the entire UI is styled with it) |
| `autoprefixer` | ^10.5.4 | PostCSS vendor-prefixing |
| `postcss` | ^8.5.26 | CSS transform pipeline |
| `@tailwindcss/forms` | ^0.5.11 | Tailwind form-control reset/styling plugin |
| `@tailwindcss/container-queries` | ^0.1.1 | Tailwind container-query plugin (not observably used in any page) |

No `test`, `lint`, or `typecheck` script exists. No testing library (Jest/Vitest/RTL) is installed anywhere in the project.

### 0.4 `package.json` — Backend (`backend/package.json`)

**Dependencies**
| Package | Version | Purpose |
|---|---|---|
| `express` | ^4.19.2 | HTTP server framework |
| `cors` | ^2.8.5 | CORS middleware |
| `dotenv` | ^16.4.5 | `.env` loading |
| `@supabase/supabase-js` | ^2.38.4 | Supabase (Postgres-as-a-service) client |
| `bcryptjs` | ^2.4.3 | Password hashing |
| `jsonwebtoken` | ^9.0.0 | JWT sign/verify |
| `validator` | ^13.11.0 | Email/string validation helpers |

**devDependencies**
| Package | Version | Purpose |
|---|---|---|
| `nodemon` | ^3.1.4 | Dev auto-restart |

No test framework installed. No `helmet`, no rate-limiter, no logging library (`morgan`/`winston`), no ORM (Prisma/Sequelize/Knex) — all DB access is raw Supabase JS client calls inline in the controller.

### 0.5 Node/npm versions

No `engines` field in either `package.json`. No `.nvmrc` anywhere in the repo. `AUTH_SETUP_GUIDE.md` mentions "Node.js (v14 or higher)" as a prose prerequisite only — not enforced anywhere.

### 0.6 Config files present

| File | Configures |
|---|---|
| `frontend/vite.config.js` | Vite dev server (port 5173), `@vitejs/plugin-react` |
| `frontend/tailwind.config.js` | Full custom design-token system: Material-3-style color palette (`primary`, `surface-container-*`, etc.) **plus** a second "editorial minimalism" palette (`canvas`, `bone`, `ink`, `charcoal`, `muted`, `hairline`, pastel-* tones) that is what's actually used across the app; custom `borderRadius`, `boxShadow`, `spacing`, `fontFamily` (IBM Plex Sans + "Newsreader" editorial serif + JetBrains Mono), and `fontSize` scale. Loads `@tailwindcss/forms` and `@tailwindcss/container-queries` plugins. `darkMode: "class"` is set, but no component ever toggles a dark class or defines dark-variant utilities — dark mode is not implemented. |
| `frontend/postcss.config.js` | `tailwindcss` + `autoprefixer` plugins |
| `frontend/vercel.json` | SPA rewrite (`/(.*) → /index.html`) for Vercel static hosting |
| `render.yaml` (root) | Render.com deploy spec for `backend/` only — web service, `npm install` / `npm start`, health check `/api/health`, env vars `NODE_ENV`, `PORT`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` (both `sync:false`, i.e. must be set manually in the Render dashboard), `JWT_SECRET` (`generateValue: true`), `FRONTEND_URL` hardcoded to `https://sih-one-amber.vercel.app` |
| `.gitignore` (root) | `node_modules/`, `.env` + variants, `dist/`/`build/`/`.next/`, logs, editor/OS junk |
| `backend/.env.example` | Template for `PORT`, `NODE_ENV`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `JWT_SECRET`, `FRONTEND_URL` — no real values, appropriate for source control |

No `.eslintrc`, no `.prettierrc`, no `tsconfig.json` anywhere (project is plain JS/JSX, not TypeScript) — matches `ui-styling`/JS-only stack, but means there is zero static lint/type checking in CI or locally.

### 0.7 Scripts

**Frontend** (`npm run <script>` in `frontend/`):
- `dev` → `vite` (dev server, port 5173)
- `build` → `vite build`
- `preview` → `vite preview`

**Backend** (`npm run <script>` in `backend/`):
- `dev` → `nodemon src/index.js`
- `start` → `node src/index.js`

No `build`/`test`/`lint` script exists for the backend (it's plain Node, nothing to build).

---

## 1. FRONTEND — PAGES (`frontend/src/pages/**`)

Legend for **Status**: *Fully functional* = real interactive logic wired to a service (even if that service is a mock store) with persistence; *Partially functional* = interactive but with material gaps (missing states, no real backend, broken edge cases); *UI shell only* = static/hardcoded, no real interactivity.

Every page below uses the **mock data layer** (`services/*Service.js` → `mockClient.js` → `localStorage` + seed arrays in `services/mockData/`) — **not** the real Express/Supabase backend. Only auth (`api.js` → `authAPI`) talks to the real backend. This is called out per-page as "Mock-backed" and is the single most important fact about this codebase (see §15 and §17 for full analysis).

### Public (`pages/public/`)

| File | Purpose / functionality |
|---|---|
| **Landing.jsx** | Marketing landing page. Fully static — hardcoded "3 steps" content array, scroll-reveal animation via `useScrollReveal`. No API calls, none needed. **Status: UI shell (intentionally, correctly so).** Reachable at `/`. |
| **Login.jsx** | Real login form. Calls `useAuth().login()` → `authAPI.login()` → **real backend** `POST /api/auth/login`. Validates required fields client-side, shows server error, redirects via `getPostLoginRedirect(role)`. "Forgot password?" link is `href="#"` — dead. **Status: Fully functional** (against the real backend). Reachable at `/login`. |
| **SignupRoleSelection.jsx** | Real registration form with a 3-way role picker (student / industry / academician). Duplicates the backend's password-complexity regex client-side (min 8 chars, upper/lower/digit) before calling `useAuth().register()` → real backend `POST /api/auth/register`. Footer has 4 dead links (`Privacy Policy`, `Terms of Service`, `Contact Us`, `Help Center`, all `href="#"`). **Status: Fully functional.** Reachable at `/signup`. |
| **PortalPending.jsx** | Holding page shown to any authenticated user whose role isn't `student`/`industry`/`admin` in `getPostLoginRedirect` — i.e., **`academician`** always lands here (see §6, §17). Displays "Your {role} portal is coming soon" + logout button. **Status: Fully functional as a stub/placeholder** — by design, not a bug, but it does mean academician has *no product at all*. Reachable at `/portal-pending` (protected, any authenticated role). |

### Admin (`pages/admin/`)

| File | Purpose / functionality |
|---|---|
| **AdminDashboard.jsx** | Institution analytics dashboard. Computes average skill readiness and a skill-demand-vs-supply bar chart **client-side** from `mockData/candidates.js` (imported directly, not via a service) and `getAllOpportunitiesIncludingInactive()` / `getPipeline()`. All real computation over mock data (not hardcoded numbers), reactive to what's in `localStorage`. **Status: Fully functional against mock data.** Reachable at `/admin/dashboard`, restricted to role `admin`. **Critically: no signup path can ever create an `admin`-role user** (backend `validRoles` = `student`/`academician`/`industry` only) — this page is **permanently unreachable** through the app's own UI (see §17). |

### Student (`pages/student/`) — all mock-backed, all reachable via `/dashboard` sidebar + nested routes

| File | Role | Functionality | Status |
|---|---|---|---|
| **StudentDashboard.jsx** | student | Pulls skill profile, applications, top-2 job matches, top-1 course via 4 parallel service calls; renders stat cards, skill-gap progress bars, recommended jobs/courses, and 3 "career tool" links. | **Fully functional** (mock-backed) |
| **CourseCatalog.jsx** | student | Search + 3 filter groups (category/duration/provider) with a staged "Apply" button pattern (`pendingFilters` vs `appliedFilters`), enroll button per row backed by `enrollmentsService` (persists to `localStorage`). | **Fully functional** (mock-backed) |
| **CourseDetail.jsx** | student | Loads one course by ID, renders overview/skills/syllabus, enroll button. "Download Syllabus PDF" button has **no onClick handler** — dead button. | **Partially functional** — core flow works, one dead action |
| **DigitalPortfolio.jsx** | student | Renders skill profile + portfolio (avatar, bio, certifications, projects, internships, achievements) from two services; opens a skill-evidence modal and a "Share Portfolio" modal with a copy-to-clipboard link. Share link (`https://academialink.edu/passport/...`) is a fabricated domain that doesn't resolve to anything real. | **Fully functional** (mock-backed), share link is cosmetic-only |
| **DigitalPortfolioEdit.jsx** | student | Edits only 4 fields (headline, institution, expectedGraduation, bio) via `savePortfolioBasics`; explicitly does **not** support editing projects/certifications/internships/achievements (commented in source and in `portfolioService.js`). Name field shown disabled ("update in Settings" — but Settings also can't edit name, see below). | **Partially functional** — basics only, no full CRUD |
| **EmployerTrustLayer.jsx** | student | Read-only "trust checklist" derived from real skill/portfolio data (identity, assessed skills, project-verified skills, certifications, projects, and a permanently-unmet "Communication & Soft Skills" check). Pure display, no actions. | **Fully functional** (mock-backed, read-only by design) |
| **ExplainableMatchBreakdown.jsx** | student | `/match-breakdown/:jobId` — loads match + applications, renders shared `WhyThisMatch` component, Apply button. "Save for Later" button just navigates back to `/internships` — does not actually save anything. | **Partially functional** — Apply works, Save-for-Later is a no-op disguised as a button |
| **InternshipJobDetail.jsx** | student | `/internships/:jobId` — job detail + live match score + Apply flow (guards against double-apply via `hasAppliedTo`). | **Fully functional** (mock-backed) |
| **InternshipJobListings.jsx** | student | Filter sidebar (skills/location/type as **hardcoded option lists**, not derived from actual job data) + match-sorted list from `getInternshipsWithMatch()`. | **Fully functional** (mock-backed); filter option lists are hardcoded rather than derived |
| **MyApplications.jsx** | student | Table of applications with a status-filter dropdown; empty states differ for "no applications at all" vs "no applications matching filter." | **Fully functional** (mock-backed) |
| **MessagesInbox.jsx** | student | Two-pane chat UI: conversation list + thread. Send/read backed by `messagesService` (localStorage). Search box filters by name only (not message content). Attachment (`Paperclip`) and thread search/overflow (`MagnifyingGlass`, `DotsThreeVertical` in the header) buttons have **no handlers** — decorative only. | **Partially functional** — messaging core works, several buttons are dead |
| **Notifications.jsx** | student | List with per-item mark-read-on-click + "mark all read," persisted as read-state overrides in localStorage over a static seed list (no new notifications are ever generated by any real event in the app). | **Fully functional** (mock-backed), but notification content itself never grows/reacts to real actions |
| **ProfileSettings.jsx** | student | Name/email/role fields shown **disabled** (no edit capability at all, despite the page's premise); only the 3 notification-preference toggles are actually editable, persisted via `preferencesService`. | **Partially functional** — this is a "notification preferences" page wearing a "Profile Settings" label |
| **ProofOfSkillChallenge.jsx** | student | Timed coding-challenge UI (countdown timer, textarea code editor, Run Tests / Submit). Test evaluation in `challengesService.runTests()` is **explicitly mocked** — it does not execute code; it scores based on whether the textarea content differs "meaningfully" (>20 non-whitespace chars) from the starter code, or otherwise a random 1–2/4 score. A passing score (≥75%) upgrades a skill to "Project-Verified" via `verifySkillViaChallenge`. | **UI shell for the code-execution part; the skill-verification side-effect is real** (writes into the shared skill profile) |
| **RecommendedLearningPaths.jsx** | student | Learning paths generated per real skill gap (`getLearningPaths()` builds from `skillsService.getSkillProfile()`), with a "Complete Next Module" action that increments per-skill progress in localStorage. | **Fully functional** (mock-backed) |
| **SkillAssessment.jsx** | student | Multi-question wizard with per-answer localStorage draft persistence, back/next, save & exit, and final submit → `submitAssessment()` which recomputes the whole skill profile. | **Fully functional** (mock-backed) |
| **SkillProfileGapReport.jsx** | student | Summary cards (proficiency label, primary domain, gap count) + strong-skills bars + gap cards with links to Learning Paths. | **Fully functional** (mock-backed) |
| **SkillProfileGraph.jsx** | student | Readiness score, "recommended next activity," proven-skills list, missing-competencies list. | **Fully functional** (mock-backed) |
| **CareerDigitalTwin.jsx** | student | "Projected readiness" feature — client-side projection function (`+25 points per gap skill, capped at required score`) clearly labeled "Estimate" in the UI. Real gaps in, an honestly-labeled synthetic projection out. | **Fully functional** (mock-backed; projection math is intentionally simplistic, which the UI discloses) |

### Industry (`pages/industry/`) — all mock-backed, reachable via `/industry/*`, role `industry`

| File | Functionality | Status |
|---|---|---|
| **IndustryDashboard.jsx** | Stat cards (active opportunities, total applications, shortlisted, selected) + recent-applications list + active-opportunities list + top-candidates list, all derived from `opportunitiesService`/`pipelineService`. | **Fully functional** (mock-backed) |
| **CompanyProfile.jsx** | Editable org-details form (name/industry/website/size/about), persisted via `companyProfileService`. | **Fully functional** (mock-backed) |
| **PostOpportunity.jsx** | Full opportunity-creation form incl. multi-select skill chips from `SKILL_CATALOG`; on submit, fetches the company profile (to stamp the company name) then calls `createOpportunity()`. The new posting is immediately visible to students via the **shared** `postedOpportunities` localStorage key — genuinely cross-role-consistent within the mock layer. | **Fully functional** (mock-backed) |
| **ManageOpportunities.jsx** | Table of posted opportunities with a "Close" action (status → Closed) and a link to view applicants (routes to the *entire* pipeline, not filtered to that specific opportunity — see §17). "Edit" is not implemented — opportunities cannot be modified after posting except closing them. | **Partially functional** |
| **ApplicantPipeline.jsx** | Kanban-style board across `PIPELINE_STAGES`, one "Move to {next stage}" action per card advancing sequential stages (no drag-and-drop, no ability to move backward or reject directly from the board). | **Partially functional** — forward-only stage progression |
| **CandidatesList.jsx** | Candidate list ranked by match score against a selectable active opportunity, using the *same* `calculateMatch()` engine as the student side. | **Fully functional** (mock-backed) |
| **CandidateDetail.jsx** | Per-candidate match breakdown with **live-adjustable weight sliders** (skill/eligibility/projects/certifications/experience) recalculating `calculateMatch()` client-side in real time; reuses the shared `WhyThisMatch` component. Weight changes are session-only (not persisted). | **Fully functional** (mock-backed) |
| **IndustrySettings.jsx** | Read-only display of name/email/role from `useAuth()`. No editable fields, no save action anywhere on the page despite being named "Settings." | **UI shell only** |

**Orphaned pages:** none found — every page file under `pages/` is imported and routed in `App.jsx`, **except** the entire `pages/academician/` directory, which doesn't exist (empty folder, no files) — there is no academician page to be orphaned in the first place; academician users are routed to the generic `PortalPending` stub instead.

---

## 2. FRONTEND — COMPONENTS (`frontend/src/components/**`)

`components/academician/`, `components/admin/`, `components/industry/`, `components/student/` are **all empty** (`.gitkeep` only) — every page in those role folders is self-contained (no page-specific sub-components were ever extracted). Only `common/` and `layout/` contain real components.

| File | Renders | Props | Used by | State/logic |
|---|---|---|---|---|
| **common/ApplicationStatus.jsx** | Colored pill for an application/pipeline status string | `status` | `MyApplications`, `IndustryDashboard` | Presentational only (static lookup table) |
| **common/EmptyState.jsx** | Icon + title + optional description + optional CTA button | `icon`, `title`, `description`, `actionLabel`, `onAction` | `CourseCatalog`, `InternshipJobListings`, `InternshipJobDetail`, `ExplainableMatchBreakdown`, `MyApplications`, `Notifications`, `RecommendedLearningPaths`, `ManageOpportunities`, `ApplicantPipeline`, `CandidatesList`, `CandidateDetail`, `CourseDetail` | Presentational only |
| **common/LoadingState.jsx** | Spinner + label, optional full-screen | `label`, `fullScreen` | `ProtectedRoute` + nearly every page with async data | Presentational only |
| **common/ProtectedRoute.jsx** | Route guard: shows `LoadingState` while auth resolves, redirects to `/login` if unauthenticated, redirects to the user's own role home if role doesn't match `allowedRoles` | `children`, `allowedRoles` | `App.jsx` (wraps every protected `<Route>`) | Has real logic — reads `useAuth()`, computes redirect via `getPostLoginRedirect` |
| **common/SkillEvidencePanel.jsx** | Modal listing evidence (assessment result, related portfolio projects/certs) backing a given skill's trust level | `skill`, `portfolio`, `onClose` | `DigitalPortfolio` | Has logic — filters portfolio projects/certs by skill name |
| **common/SkillProgress.jsx** | Labeled horizontal progress bar | `label`, `percent`, `colorClass` | `StudentDashboard` | Presentational only |
| **common/SkillTrustBadge.jsx** | Colored pill for a skill trust level (Self-Declared/Assessed/Project-Verified/Certified/Industry-Verified) | `trustLevel`, `className` | `DigitalPortfolio`, `SkillEvidencePanel` | Presentational only |
| **common/StatCard.jsx** | Label + icon + big value card | `label`, `value`, `icon`, `iconColorClass`, `valueColorClass` | `StudentDashboard`, `IndustryDashboard`, `AdminDashboard` | Presentational only |
| **common/WhyThisMatch.jsx** | Full match-breakdown block (matched/missing skills, eligibility, best-next-action CTA) — takes the output shape of `calculateMatch()` directly so every consumer renders identically | `match`, `compact`, `action` | `ExplainableMatchBreakdown`, `InternshipJobDetail`-adjacent flow, `CandidateDetail` | Presentational, but tightly coupled to `matchingEngine.js`'s return shape |
| **layout/DashboardLayout.jsx** | Sidebar + main content wrapper, defaults nav items to the **student** config | `children`, `navItems`, `footerNavItems`, `title`, `subtitle`, `contentClassName` | Every student/admin/industry dashboard page except `MessagesInbox` (which composes `Sidebar` directly instead of going through this wrapper — see §17 inconsistency) | Presentational composition only |
| **layout/Sidebar.jsx** | Responsive nav sidebar (desktop fixed, mobile slide-over) + logout button | `navItems`, `footerNavItems`, `title`, `subtitle` | `DashboardLayout`, `MessagesInbox` (directly) | Has state (`mobileOpen`) and a real logout action via `useAuth()` |

**Unused components:** none. Every component in `common/` and `layout/` is imported by at least one page.

---

## 3. FRONTEND — HOOKS (`frontend/src/hooks/**`)

| File | Hook | What it does | Return | Used by | Status |
|---|---|---|---|---|---|
| **useAuth.js** | `useAuth()` | Thin wrapper around `useContext(AuthContext)`; throws if used outside `AuthProvider` | `{ user, loading, error, login, register, logout, isAuthenticated }` | `ProtectedRoute`, `Sidebar`, `Login`, `SignupRoleSelection`, `PortalPending`, `StudentDashboard`, `DigitalPortfolio`, `DigitalPortfolioEdit`, `EmployerTrustLayer`, `ProfileSettings`, `IndustryDashboard`, `IndustrySettings` | Fully implemented |
| **useScrollReveal.js** | `useScrollReveal()` | Attaches an `IntersectionObserver` to a ref; adds `.is-visible` class (CSS-driven fade/slide-in, see `styles/index.css`) once the element enters the viewport, then disconnects | A `ref` object | `Landing.jsx` only (hero + step cards) | Fully implemented, but single-use — arguably could just be inline in `Landing.jsx` given it has exactly one consumer |

**Duplicated-logic-that-should-be-a-hook:** every page repeats the identical `useState(undefined) + useEffect(() => service().then(setState), [])` "loading/undefined/null" data-fetch pattern by hand (20+ times across student/industry/admin pages). There is no shared `useAsync`/`useFetch`-style hook, so this boilerplate (and its "undefined = loading, null = not found" convention) is duplicated verbatim in nearly every page file rather than factored out.

---

## 4. FRONTEND — CONTEXT/STATE (`frontend/src/context/**`)

Only one context exists: **`AuthContext.jsx`**.

- **State exposed:** `user` (object or `null`), `loading` (bool), `error` (string or `null`), `isAuthenticated` (derived `!!user`).
- **Actions exposed:** `login(email, password)`, `register(email, password, name, role)`, `logout()`.
- **Mechanics:** On mount, reads `authToken` + `user` from `localStorage` to restore a session (no token-expiry check performed client-side — an expired JWT is treated as valid until the *next* authenticated API call fails). `login`/`register` call `authAPI` (real backend), persist `authToken` + `user` to `localStorage`, and set `user` in state. `logout()` just clears those two localStorage keys and resets `user` to `null` — no server-side token invalidation call exists (backend has no logout/blacklist endpoint).
- **Consumers:** Every page that needs `user` or auth actions goes through `useAuth()` (see §3); this is the app's **only** global state — there's no other cross-cutting context (no dark-mode context, no toast/notification context, no query-cache/react-query context). Everything else is per-page `useState` + direct service calls, or `localStorage` reads inside each mock service (i.e., "shared state" for the mock features is really just `localStorage` acting as a poor-man's cross-page store, not React state).

---

## 5. FRONTEND — SERVICES / API LAYER (`frontend/src/services/**`)

### 5.1 Real backend client — `api.js`

| Export | Method / Endpoint | Matches backend route? |
|---|---|---|
| `authAPI.register(email, password, name, role)` | `POST {VITE_API_URL}/auth/register` | ✅ `POST /api/auth/register` |
| `authAPI.login(email, password)` | `POST {VITE_API_URL}/auth/login` | ✅ `POST /api/auth/login` |
| `authAPI.getCurrentUser()` | `GET {VITE_API_URL}/auth/me` (Bearer token) | ✅ `GET /api/auth/me` — **exported but never called anywhere in the app** (dead export; nothing re-validates the session against the server) |
| `authAPI.logout()` | Client-side only — clears `localStorage` | N/A (no backend logout route exists) |

`VITE_API_URL` defaults to `http://localhost:5000/api` if the env var isn't set — this means a production build with no `VITE_API_URL` configured on Vercel will silently try to hit `localhost:5000` from the visitor's own browser and fail every auth call.

### 5.2 Mock/local services (everything else — 18 files)

**None of these call the real backend at all.** They all funnel through `mockClient.js`'s `resolveMock(data, {delay, shouldFail})`, which just `setTimeout`s and resolves a deep-cloned copy of in-memory/localStorage data. There is no `fetch`/`axios` call, no network request, in any of them.

| File | Exports | "Endpoint" (localStorage key) | Backend route equivalent? |
|---|---|---|---|
| `applicationsService.js` | `getApplications`, `applyToOpportunity`, `hasAppliedTo` | `myApplications` | ❌ none |
| `assessmentService.js` | `getAssessmentQuestions`, `scoreAssessment`, `submitAssessment`, `loadStoredProfile`(internal)/`getStoredSkillProfileOrDemo`, `verifySkillViaChallenge` | `skillProfile` | ❌ none |
| `candidatesService.js` | `getCandidates`, `getCandidateById` | (reads `mockData/candidates.js` directly, no persistence) | ❌ none |
| `challengesService.js` | `DATA_CLEANING_CHALLENGE`, `runTests`, `submitChallenge` | none (stateless mock scoring) | ❌ none |
| `companyProfileService.js` | `getCompanyProfile`, `saveCompanyProfile` | `companyProfile` | ❌ none |
| `coursesService.js` | `getCourses`, `getCourseById` | (static seed, no persistence) | ❌ none |
| `enrollmentsService.js` | `isEnrolled`, `enrollInCourse` | `courseEnrollments` | ❌ none |
| `internshipsService.js` | `getInternships`, `getInternshipById`, `getAllOpportunitiesIncludingInactive`, `persistPosted` | `postedOpportunities` | ❌ none |
| `learningPathsService.js` | `getLearningPaths`, `completeNextModule` | `learningPathProgress` | ❌ none |
| `matchService.js` | `getMatchForOpportunity`, `getInternshipsWithMatch` | (composes other services) | ❌ none |
| `matchingEngine.js` | `calculateMatch`, `DEFAULT_WEIGHTS` | (pure function, no I/O) | ❌ none |
| `messagesService.js` | `getConversations`, `sendMessage`, `markConversationRead` | `conversations` | ❌ none |
| `notificationsService.js` | `getNotifications`, `markNotificationRead`, `markAllNotificationsRead` | `notificationReadState` | ❌ none |
| `opportunitiesService.js` | `getMyOpportunities`, `createOpportunity`, `updateOpportunityStatus` | `postedOpportunities` (shared with `internshipsService`) | ❌ none |
| `pipelineService.js` | `getPipeline`, `moveStage`, `PIPELINE_STAGES` | `pipelineStageOverrides` | ❌ none |
| `portfolioService.js` | `getPortfolio`, `savePortfolioBasics` | `studentPortfolio` | ❌ none |
| `preferencesService.js` | `getPreferences`, `savePreferences` | `notificationPreferences` | ❌ none |
| `skillsService.js` | `getSkillProfile` | (derives from `assessmentService`) | ❌ none |

**Conclusion for §5:** Of the app's ~19 non-auth features (courses, internships, applications, portfolio, skills, messages, notifications, pipeline, candidates, company profile, opportunities, preferences, challenges, learning paths), **zero** have a matching backend route — because the backend implements *only* auth. This is architecturally consistent (nothing is broken/mismatched — the mock layer is self-contained and internally coherent) but means the "backend" in the traditional sense covers roughly 5% of the product surface.

---

## 6. FRONTEND — ROUTES (`frontend/src/routes/**`)

**This directory is empty** (`.gitkeep` only). All routing is defined directly in **`frontend/src/App.jsx`** instead — there is no dedicated `AppRoutes.jsx` despite the folder existing for one.

### Full route table (from `App.jsx`)

| Path | Component | Protected? | Role restriction |
|---|---|---|---|
| `/` | Landing | Public | — |
| `/login` | Login | Public | — |
| `/signup` | SignupRoleSelection | Public | — |
| `/portal-pending` | PortalPending | Protected | any authenticated user (no `allowedRoles`) |
| `/dashboard` | StudentDashboard | Protected | `student` |
| `/courses` | CourseCatalog | Protected | `student` |
| `/courses/:courseId` | CourseDetail | Protected | `student` |
| `/portfolio` | DigitalPortfolio | Protected | `student` |
| `/portfolio/edit` | DigitalPortfolioEdit | Protected | `student` |
| `/skill-assessment` | SkillAssessment | Protected | `student` |
| `/skill-profile/gap-report` | SkillProfileGapReport | Protected | `student` |
| `/skill-profile/graph` | SkillProfileGraph | Protected | `student` |
| `/skill-passport` | → redirects to `/portfolio` (`<Navigate replace>`) | — | — (legacy alias, documented inline) |
| `/learning-paths` | RecommendedLearningPaths | Protected | `student` |
| `/internships` | InternshipJobListings | Protected | `student` |
| `/internships/:jobId` | InternshipJobDetail | Protected | `student` |
| `/applications` | MyApplications | Protected | `student` |
| `/messages` | MessagesInbox | Protected | `student` |
| `/notifications` | Notifications | Protected | `student` |
| `/settings` | ProfileSettings | Protected | `student` |
| `/proof-of-skill` | ProofOfSkillChallenge | Protected | `student` |
| `/match-breakdown/:jobId` | ExplainableMatchBreakdown | Protected | `student` |
| `/career-twin` | CareerDigitalTwin | Protected | `student` |
| `/employer-trust` | EmployerTrustLayer | Protected | `student` |
| `/industry/dashboard` | IndustryDashboard | Protected | `industry` |
| `/industry/profile` | CompanyProfile | Protected | `industry` |
| `/industry/opportunities` | ManageOpportunities | Protected | `industry` |
| `/industry/opportunities/create` | PostOpportunity | Protected | `industry` |
| `/industry/applications` | ApplicantPipeline | Protected | `industry` |
| `/industry/candidates` | CandidatesList | Protected | `industry` |
| `/industry/candidates/:candidateId` | CandidateDetail | Protected | `industry` |
| `/industry/settings` | IndustrySettings | Protected | `industry` |
| `/admin/dashboard` | AdminDashboard | Protected | `admin` |

**Observations:**
- **No catch-all `*` / 404 route.** An unmatched URL renders nothing inside `<Routes>` (blank page under the app shell) rather than a not-found page.
- **No academician route exists at all** — `academician` is a valid signup role but has zero dedicated routes; it falls through to `/portal-pending` (any-authenticated-user route) via `getPostLoginRedirect`'s `default` case.
- **`/admin/dashboard` is unreachable in practice** — nothing in the signup flow or backend can create an `admin`-role user (see §17).

---

## 7. FRONTEND — UTILS & STYLES

### `frontend/src/utils/roleRedirect.js`
- **`getPostLoginRedirect(role)`** — single exported function; a `switch` mapping `student → /dashboard`, `industry → /industry/dashboard`, `admin → /admin/dashboard`, default → `/portal-pending`. This is the single source of truth for "where does this role land," used by `Login`, `SignupRoleSelection`, and `ProtectedRoute` (for role-mismatch bounces). Well-centralized — no duplicated redirect logic found elsewhere.

### `frontend/src/styles/index.css`
- Tailwind's three `@tailwind` directives.
- A `body { font-family: "IBM Plex Sans" }` base rule.
- `.material-symbols-outlined` class definition — **but the project uses `@phosphor-icons/react` everywhere, not Material Symbols; this class appears unused** (no `<span className="material-symbols-outlined">` found in any component — leftover from the nav-config's `icon: "dashboard"` string-based system, which is actually consumed by `Sidebar.jsx`'s own `ICONS` phosphor-icon lookup table, not this CSS class).
- `.reveal` / `.reveal.is-visible` — the fade+translateY scroll-reveal animation driven by `useScrollReveal`.
- `@keyframes drift` / `.ambient-blob` — slow drifting radial-gradient blob animation, used once in `Landing.jsx`'s hero background.

No separate theme/token file beyond `tailwind.config.js` (see §0.6) — colors/fonts/spacing are defined there, not in CSS.

---

## 8. BACKEND — SERVER ENTRY & CONFIG

### `backend/src/index.js`
- Loads `dotenv`, creates an Express app.
- **CORS:** allow-list built from `["http://localhost:5173", "http://localhost:5174", process.env.FRONTEND_URL].filter(Boolean)`, `credentials: true`. Reasonably scoped (not `origin: "*"`).
- `express.json()` body parser.
- Routes: `GET /api/health` → `{status:"ok"}`; `app.use("/api/auth", authRoutes)`.
- **404 handler:** catch-all returning `{error:"Route not found"}` for anything else.
- **Error handler:** generic `(err,req,res,next)` handler logging `err.stack` and returning a bare `500 {error:"Internal server error"}` — no request-id/correlation, no structured logging.
- Listens on `process.env.PORT || 5000`.
- No `helmet`, no rate limiting, no request logging middleware (`morgan`), no compression.

### `backend/src/config/supabase.js`
- Creates a Supabase client from `SUPABASE_URL` + `SUPABASE_ANON_KEY` env vars.
- **Throws at import time** if either is missing — meaning a missing `.env` crashes the whole server on boot (fail-fast, which is reasonable, but it means there's no degraded/offline mode).
- Uses the **anon key**, not a service-role key — meaning all DB access is subject to Supabase Row Level Security (RLS) policies on the `users` table, if any are configured (schema.sql defines no RLS policies at all — see §16).

**Is the DB actually connecting or stubbed?** It's real — `authController.js` performs live `supabase.from("users")...` queries for register/login/getCurrentUser, and `backend/testSupabase.js` is a working standalone connectivity-check script (queries `users`, prints sample rows). This is **not** a stub; it's a genuine (if minimal) Supabase-backed auth system, assuming valid credentials are present in `.env`.

---

## 9. BACKEND — MODELS (`backend/src/models/**`)

**Empty directory** (`.gitkeep` only) — there is no ORM/model layer. The only schema definition is the raw SQL in `backend/src/database/schema.sql`:

### `users` table (from `schema.sql`)
| Field | Type | Notes |
|---|---|---|
| `id` | UUID, PK | `gen_random_uuid()` default |
| `email` | VARCHAR(255), UNIQUE, NOT NULL | |
| `password` | VARCHAR(255), NOT NULL | bcrypt hash stored here |
| `name` | VARCHAR(255), NOT NULL | |
| `role` | VARCHAR(50), NOT NULL | `CHECK (role IN ('student','academician','industry'))` — **note: `admin` is not a valid DB value**, reinforcing that admin accounts cannot exist (see §17) |
| `created_at` | TIMESTAMP | default now |
| `updated_at` | TIMESTAMP | default now, auto-updated by trigger |
| `last_login` | TIMESTAMP | nullable, set on login |
| `is_active` | BOOLEAN | default `true`, **never read or written anywhere in the controller** — dead column |

Indexes on `email` and `role`. A trigger function `update_updated_at_column()` auto-bumps `updated_at` on every `UPDATE`.

**No relationships** — this is the only table; there are no `courses`, `internships`, `applications`, `portfolios`, `skills`, `messages`, `notifications`, `pipeline`, `candidates`, or `company_profiles` tables anywhere in the schema, which matches the frontend's total reliance on mock/localStorage data for everything except auth.

**"Model defined but never used by a controller"**: N/A — there's exactly one table and it *is* used (by `authController.js`). Nothing is unused here; rather, everything the frontend needs *beyond* auth has no table at all.

---

## 10. BACKEND — ROUTES (`backend/src/routes/**`)

Only one route file: **`authRoutes.js`**, mounted at `/api/auth` in `index.js`.

| Method | Path (full) | Controller | Middleware |
|---|---|---|---|
| POST | `/api/auth/register` | `register` | none (public) |
| POST | `/api/auth/login` | `login` | none (public) |
| GET | `/api/auth/me` | `getCurrentUser` | `authMiddleware` (JWT required) |

Plus, defined directly in `index.js` (not a routes file): `GET /api/health` → inline handler.

That's the **entire** backend API surface — 4 endpoints total.

---

## 11. BACKEND — CONTROLLERS (`backend/src/controllers/**`)

Only **`authController.js`** exists, exporting 3 functions.

| Function | What it does | Model(s) touched | Returns | Error handling |
|---|---|---|---|---|
| `register(req,res)` | Validates input via `validateRegisterInput`; checks for existing email (`PGRST116` = "no rows" is the expected not-found case, correctly distinguished from a real DB error); bcrypt-hashes password (salt rounds 10); inserts into `users`; signs a 7-day JWT `{id,email,role}`; responds 201 with `{message,user,token}` | `users` (Supabase) | 201 on success; 400 (validation/duplicate email); 500 (DB error/insert failure/unexpected) | ✅ Has try/catch + explicit DB-error branches |
| `login(req,res)` | Validates input; looks up user by email; distinguishes `PGRST116` (no user → 401 generic "Invalid email or password", correctly avoiding user-enumeration) from a real DB error (500); `bcrypt.compare`; signs JWT; fire-and-forget updates `last_login` (result not awaited-checked, but awaited); responds 200 with `{message,user,token}` | `users` (Supabase) | 200 success; 400 validation; 401 invalid creds; 500 DB/unexpected error | ✅ Has try/catch + explicit DB-error branches |
| `getCurrentUser(req,res)` | Reads `req.user.id` (set by `authMiddleware`); selects safe fields (`id,email,name,role,created_at,last_login` — correctly excludes `password`) | `users` (Supabase) | 200 with `{user}`; 404 if not found; 500 unexpected | ✅ Has try/catch |

**Status: all 3 are fully implemented** (real DB reads/writes, not hardcoded/placeholder JSON) — no TODOs or stubs found in this file. **All 3 have error handling.**

**Notably absent from the controller layer:** no `logout` endpoint (client-only), no `updateProfile`/`changePassword`/`deleteAccount`, no `forgotPassword`/`resetPassword` (Login.jsx's "Forgot password?" link has nowhere to go even on the backend side), no email verification, no refresh-token endpoint — all called out as `⚠️ TODO` in `AUTH_SETUP_GUIDE.md` itself.

---

## 12. BACKEND — MIDDLEWARE (`backend/src/middleware/**`)

Only **`authMiddleware.js`**, exporting 2 functions.

| Function | What it does | Where applied |
|---|---|---|
| `authMiddleware(req,res,next)` | Extracts `Bearer <token>` from `Authorization` header; 401 if missing; `jwt.verify` against `JWT_SECRET`; sets `req.user = decoded`; distinguishes `TokenExpiredError` (401 "Token expired") from any other verify failure (401 "Invalid token") | `GET /api/auth/me` only |
| `roleMiddleware(allowedRoles)` | Higher-order middleware — 401 if no `req.user`, 403 if `req.user.role` not in `allowedRoles`, else `next()` | **Defined but never imported/used anywhere** — no route in the app currently restricts by role server-side (dead code; role restriction today exists only client-side in `ProtectedRoute.jsx`, which is trivially bypassable by calling APIs directly — though there's nothing role-sensitive to bypass yet since only 1 protected endpoint exists) |

No CORS/logging/validation-middleware files exist beyond what's inlined in `index.js` (`cors()`) and per-route validator function calls inside the controller itself (not middleware-ified).

---

## 13. BACKEND — SERVICES (`backend/src/services/**`)

**Empty directory** (`.gitkeep` only) — there is no service/business-logic layer on the backend at all. All logic (validation calls, hashing, JWT signing, Supabase queries) lives directly inline in `authController.js`. **There is no matching/scoring engine on the backend** — the matching/scoring logic that exists (`matchingEngine.js`'s `calculateMatch()`) lives entirely in the **frontend**, operating purely on mock/local data, and has no server-side equivalent or persistence.

---

## 14. BACKEND — VALIDATORS & UTILS

### `backend/src/validators/authValidator.js`
| Export | Validates |
|---|---|
| `validateEmail(email)` | Presence + `validator.isEmail()` |
| `validatePassword(password)` | Presence, length ≥ 8, ≥1 uppercase, ≥1 lowercase, ≥1 digit |
| `validateName(name)` | Presence, trimmed length 2–50 |
| `validateRegisterInput(email,password,name,role)` | Composes the above three + role must be one of `student`/`academician`/`industry` (case-insensitive) — **`admin` is rejected here too**, consistent with §9/§17 |
| `validateLoginInput(email,password)` | Email format + password presence (no complexity re-check on login, correctly) |

### `backend/src/utils/**`
**Empty directory** (`.gitkeep` only) — no shared backend utility functions exist outside the validator file.

---

## 15. CROSS-CHECK: FRONTEND ↔ BACKEND INTEGRATION

### 15.1 Every backend route — is it called by the frontend?

| Method | Endpoint | Called by frontend? |
|---|---|---|
| GET | `/api/health` | ❌ Never called from any frontend code (only used by `render.yaml`'s `healthCheckPath` for Render's own uptime probing) |
| POST | `/api/auth/register` | ✅ `api.js` → `authAPI.register` → `AuthContext.register` → `SignupRoleSelection.jsx` |
| POST | `/api/auth/login` | ✅ `api.js` → `authAPI.login` → `AuthContext.login` → `Login.jsx` |
| GET | `/api/auth/me` | ❌ **Never called anywhere in the frontend** — `authAPI.getCurrentUser` is exported but has zero call sites. Session restoration on app load reads stale `localStorage` data instead of re-validating against the server (see §4). |

### 15.2 Every frontend service call — does a matching backend route exist?

Covered exhaustively in §5.2: **all 18 non-auth service files (60+ exported functions) have no backend route at all.** They are self-contained against `localStorage`/in-memory mock data.

### 15.3 Features fully wired end-to-end (UI → service → API → controller → model → DB) vs. broken/mocked

**Fully wired, real DB-backed (2 features):**
- User registration (Login page → AuthContext → api.js → Express → Supabase `users` insert)
- User login (same chain, `users` select + bcrypt compare)

**Partially wired (backend exists, frontend doesn't use it):**
- "Get current user" / session re-validation (`GET /api/auth/me` exists server-side, fully implemented, but no frontend code calls it — session trust is purely client-side/localStorage)

**Not wired at all — 100% frontend-mock, no backend/DB involvement (everything else, ~19 feature areas):**
Courses & enrollment, internships/opportunities (student browse + industry post/manage), applications, skill assessment & skill profile, digital portfolio, proof-of-skill challenges, learning paths, career digital twin projection, employer trust layer, messages/conversations, notifications, applicant pipeline (Kanban), candidates list/detail + matching engine, company profile, notification preferences, admin analytics dashboard.

**Net picture:** the product's *entire* value proposition (skill matching, portfolios, opportunities, pipeline, messaging) is a convincing, internally-consistent **frontend prototype** running on `localStorage`. The real backend only proves out the auth slice. This isn't "broken" in the sense of mismatched contracts — the mock layer has no dangling references to a backend that should exist — but it means essentially none of the demoable functionality survives a page load in a different browser, a cleared cache, or a second device/user viewing "the same" posted opportunity/application.

---

## 16. ENVIRONMENT & SECURITY CHECK

- **`.env` files present:** `backend/.env` exists (real config, 5 non-empty keys: `PORT`, `NODE_ENV`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `JWT_SECRET` — values not reproduced here for safety, but confirmed non-empty via redacted inspection). `backend/.env.example` exists as a safe template with blank secret values. **Frontend has no `.env`/`.env.local` file present in the repo** (`FRONTEND_LOGIN_SETUP.md` references creating one with `VITE_API_URL`, but no such file currently exists on disk — meaning local dev currently relies on the `api.js` hardcoded fallback `http://localhost:5000/api`).
- **`.env` gitignored?** ✅ Yes — root `.gitignore` covers `.env`, `.env.local`, `.env.*.local`. `git status` at the time of this audit shows a clean working tree, consistent with `.env` never having been tracked.
- **Hardcoded secrets/credentials in code:** None found in `frontend/` or `backend/` source. All Supabase/JWT values are read from `process.env`.
- **Fallback JWT secret is a code smell, not a leak, but worth flagging:** both `authController.js` and `authMiddleware.js` independently define `const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"`. If `JWT_SECRET` is ever unset in a real deployment, the server **silently** falls back to this well-known, publicly-visible-in-source-code string rather than failing to start — meaning anyone could forge valid JWTs against a misconfigured deployment. Render's `render.yaml` does correctly set `generateValue: true` for `JWT_SECRET`, which mitigates this specifically for the documented Render deploy path, but the code itself has no safeguard if deployed elsewhere without that variable set.
- **Duplicated fallback string** (`authController.js` and `authMiddleware.js` each hardcode the same literal independently) — not a security leak by itself, but a maintenance smell: if one file's fallback were ever changed, the other would silently diverge.
- **Password handling:** bcrypt with salt rounds 10 — reasonable. Passwords are never logged or returned in any response (confirmed `getCurrentUser`'s `select()` explicitly excludes `password`).
- **Supabase key used:** anon key only (not service-role) — correct choice for a public-facing backend, though it means the schema's total absence of Row Level Security policies (schema.sql defines none) is worth flagging: with RLS off (Supabase's default when a table has no policies and RLS itself isn't enabled) and only an anon key, the `users` table's actual exposure depends entirely on whether RLS was enabled via the Supabase dashboard (not tracked in this repo) — the SQL file alone does not lock this down.
- **CORS:** explicit allow-list (`localhost:5173`, `localhost:5174`, `FRONTEND_URL`) rather than `*` — correctly scoped.
- **`is_active` column:** defined in schema, defaulted `true`, but never checked anywhere in `login`/`getCurrentUser` — a deactivated user (if that flag were ever set via direct DB access) could still log in; the feature is schema-only, not enforced in application logic.
- **localStorage use for JWT:** token + user object stored in plain `localStorage` (not an httpOnly cookie), which `FRONTEND_LOGIN_SETUP.md` itself flags under "Production Recommendations" as an XSS-exposure tradeoff already known to the project.
- **No rate limiting** on `/api/auth/login` or `/api/auth/register` — brute-force/credential-stuffing is unmitigated (also self-flagged as a TODO in `AUTH_SETUP_GUIDE.md`).

---

## 17. FINAL SUMMARY TABLES

### Table 1 — All Pages

| Page | Role | Status | Real Data or Hardcoded | Uses Hooks | Reachable via Routing |
|---|---|---|---|---|---|
| Landing.jsx | Public | UI shell (by design) | Hardcoded | `useScrollReveal` | ✅ `/` |
| Login.jsx | Public | Fully functional | Real (backend auth) | `useAuth` | ✅ `/login` |
| SignupRoleSelection.jsx | Public | Fully functional | Real (backend auth) | `useAuth` | ✅ `/signup` |
| PortalPending.jsx | Any authenticated (fallback) | Fully functional (stub page) | Real (`user` from auth) | `useAuth` | ✅ `/portal-pending` |
| AdminDashboard.jsx | admin | Fully functional | Mock/localStorage | none (direct service calls) | ✅ route exists, but **admin role is uncreatable** |
| StudentDashboard.jsx | student | Fully functional | Mock/localStorage | `useAuth` | ✅ `/dashboard` |
| CourseCatalog.jsx | student | Fully functional | Mock/localStorage | none | ✅ `/courses` |
| CourseDetail.jsx | student | Partially functional (dead PDF button) | Mock/localStorage | none | ✅ `/courses/:courseId` |
| DigitalPortfolio.jsx | student | Fully functional | Mock/localStorage | `useAuth` | ✅ `/portfolio` |
| DigitalPortfolioEdit.jsx | student | Partially functional (4 fields only) | Mock/localStorage | `useAuth` | ✅ `/portfolio/edit` |
| EmployerTrustLayer.jsx | student | Fully functional (read-only) | Mock/localStorage | `useAuth` | ✅ `/employer-trust` |
| ExplainableMatchBreakdown.jsx | student | Partially functional (dead Save button) | Mock/localStorage | none | ✅ `/match-breakdown/:jobId` |
| InternshipJobDetail.jsx | student | Fully functional | Mock/localStorage | none | ✅ `/internships/:jobId` |
| InternshipJobListings.jsx | student | Fully functional | Mock/localStorage (filter options hardcoded) | none | ✅ `/internships` |
| MessagesInbox.jsx | student | Partially functional (dead attach/search/overflow buttons) | Mock/localStorage | none | ✅ `/messages` |
| MyApplications.jsx | student | Fully functional | Mock/localStorage | none | ✅ `/applications` |
| Notifications.jsx | student | Fully functional | Mock/localStorage (static content) | none | ✅ `/notifications` |
| ProfileSettings.jsx | student | Partially functional (only prefs editable) | Mock/localStorage | `useAuth` | ✅ `/settings` |
| ProofOfSkillChallenge.jsx | student | UI shell (mocked code execution) | Mock scoring | none | ✅ `/proof-of-skill` |
| RecommendedLearningPaths.jsx | student | Fully functional | Mock/localStorage | none | ✅ `/learning-paths` |
| SkillAssessment.jsx | student | Fully functional | Mock/localStorage | none | ✅ `/skill-assessment` |
| SkillProfileGapReport.jsx | student | Fully functional | Mock/localStorage | none | ✅ `/skill-profile/gap-report` |
| SkillProfileGraph.jsx | student | Fully functional | Mock/localStorage | none | ✅ `/skill-profile/graph` |
| CareerDigitalTwin.jsx | student | Fully functional (labeled estimate) | Mock/localStorage | none | ✅ `/career-twin` |
| IndustryDashboard.jsx | industry | Fully functional | Mock/localStorage | `useAuth` | ✅ `/industry/dashboard` |
| CompanyProfile.jsx | industry | Fully functional | Mock/localStorage | none | ✅ `/industry/profile` |
| PostOpportunity.jsx | industry | Fully functional | Mock/localStorage | none | ✅ `/industry/opportunities/create` |
| ManageOpportunities.jsx | industry | Partially functional (no edit) | Mock/localStorage | none | ✅ `/industry/opportunities` |
| ApplicantPipeline.jsx | industry | Partially functional (forward-only) | Mock/localStorage | none | ✅ `/industry/applications` |
| CandidatesList.jsx | industry | Fully functional | Mock/localStorage | none | ✅ `/industry/candidates` |
| CandidateDetail.jsx | industry | Fully functional | Mock/localStorage | none | ✅ `/industry/candidates/:candidateId` |
| IndustrySettings.jsx | industry | UI shell only (no edit) | Real (`user` display only) | `useAuth` | ✅ `/industry/settings` |

### Table 2 — All Backend Routes

| Method | Endpoint | Controller | Status | Called by Frontend? |
|---|---|---|---|---|
| GET | `/api/health` | inline handler in `index.js` | Fully implemented | ❌ No (deploy platform only) |
| POST | `/api/auth/register` | `register` | Fully implemented | ✅ Yes |
| POST | `/api/auth/login` | `login` | Fully implemented | ✅ Yes |
| GET | `/api/auth/me` | `getCurrentUser` | Fully implemented | ❌ No (dead integration point) |

---

## GAPS & INCOMPLETE AREAS

**Architecture / integration**
- The backend implements **only authentication** (4 endpoints total). Every other feature — courses, internships/opportunities, applications, skill assessment, portfolio, proof-of-skill challenges, learning paths, career digital twin, employer trust layer, messages, notifications, pipeline, candidates/matching, company profile, admin analytics — runs entirely on frontend mock data persisted to `localStorage`, with **no real database table for any of it**.
- This means: nothing besides login/signup survives a different browser, incognito window, cleared site data, or a second person opening the "same" posted opportunity/application/message thread on their own machine. A live demo across two devices/browsers will not show shared state for anything but the user account itself.
- `GET /api/auth/me` is fully built server-side but **never called** by the frontend — session trust after refresh is based purely on trusting stale `localStorage`, with no server round-trip to confirm the token/user is still valid.
- `roleMiddleware` in `authMiddleware.js` is fully written but **never used** on any route — there is currently no server-side role enforcement anywhere (moot today since only 1 protected route exists, but will matter the moment any role-restricted backend route is added).

**Role model inconsistency**
- The signup role picker offers **student / industry / academician**; the backend validator also only accepts those three (`admin` is explicitly rejected). Yet `App.jsx` defines a full `/admin/dashboard` route restricted to role `admin`, and `AdminDashboard.jsx` is a complete, working page — **it can never be reached because no signup path, backend validator, or DB constraint permits an `admin`-role account to exist.**
- **`academician` is a valid signup role with zero product built for it** — no pages, no routes, no components (the `pages/academician/` and `components/academician/` folders are empty). Any academician who signs up is permanently routed to the generic `PortalPending` "coming soon" stub.

**Dead / non-functional UI elements**
- Login page "Forgot password?" link → `href="#"`, goes nowhere; no backend password-reset endpoint exists either.
- Signup page footer: Privacy Policy / Terms of Service / Contact Us / Help Center — all `href="#"`.
- `CourseDetail.jsx` "Download Syllabus PDF" button has no click handler.
- `ExplainableMatchBreakdown.jsx` "Save for Later" button just navigates back to the listing — doesn't actually save anything anywhere.
- `MessagesInbox.jsx` — attachment (paperclip), thread search, and overflow-menu buttons are all unwired.
- `ProfileSettings.jsx` — despite the page name, name/email/role are permanently disabled inputs; only 3 notification toggles are actually editable. The disabled name field even says "Update your name in Settings" while being *inside* Settings.
- `IndustrySettings.jsx` — entirely read-only; no editable fields or save action despite being a "Settings" page.
- `ManageOpportunities.jsx` — no edit action for a posted opportunity, only close.
- `ApplicantPipeline.jsx` — stage progression is forward-only (no reject/move-backward from the Kanban board itself).

**Backend hardening gaps** (several self-documented as TODOs in `AUTH_SETUP_GUIDE.md`)
- No rate limiting on login/register (brute-force exposure).
- No email verification.
- No password-reset flow (frontend link exists with nowhere to go).
- No 2FA.
- No refresh-token mechanism (JWT is a flat 7-day token with no revocation path — logout is client-only).
- JWT_SECRET has an insecure hardcoded fallback string duplicated in two files, used silently if the env var is ever missing in a non-Render deployment.
- `is_active` column exists in the schema but is never checked in login/auth logic — a "deactivated" user flag would currently have no effect.
- No rate limiting, no `helmet`, no request logging on the Express app.
- No RLS policies defined in `schema.sql` for the `users` table — table-level access control depends entirely on out-of-repo Supabase dashboard configuration.

**Testing & tooling**
- No test framework installed on either frontend or backend (no Jest/Vitest/RTL, no supertest). No `test` script in either `package.json`.
- No ESLint/Prettier config anywhere in the repo — no enforced code style or static analysis.
- No TypeScript — no compile-time type safety on either side.
- No CI configuration found in the repo (no `.github/workflows`, etc.) — builds/deploys appear to be manual via Vercel (frontend) and Render (backend).

**Frontend structural smells**
- `frontend/src/routes/` exists as an empty folder — all routing actually lives in `App.jsx`, which is a 300-line flat route list with no lazy-loading/code-splitting (every page is eagerly imported, so the initial JS bundle includes all 30+ pages regardless of role).
- `components/academician/`, `components/admin/`, `components/industry/`, `components/student/` are all empty — every page is self-contained with no shared page-specific sub-components extracted, even where there's visible duplication (e.g., nearly identical "loading/empty/list" scaffolding repeated across `MyApplications`, `Notifications`, `RecommendedLearningPaths`, `ManageOpportunities`, `CandidatesList`, etc.)
- No shared data-fetching hook (`useAsync`/`useFetch`) — the `useState(undefined) + useEffect` fetch-on-mount pattern is hand-duplicated in essentially every page (20+ occurrences) instead of being factored into a hook, despite `hooks/` already existing as a directory.
- `.material-symbols-outlined` CSS class defined in `styles/index.css` is dead — the project uses Phosphor icons exclusively.
- `@tailwindcss/container-queries` is installed and configured as a Tailwind plugin but no page visibly uses container-query utilities.
- `tailwind.config.js` carries two full, unrelated color systems (a Material-3-style token set and the actually-used "editorial minimalism" palette) — the Material-3 set appears to be leftover from an earlier design direction and is not visibly used by any current page.
- `darkMode: "class"` is configured but never toggled or exercised anywhere in the app — no dark theme actually exists despite the config implying one was planned.
- No production `VITE_API_URL` is set anywhere in the repo (no frontend `.env`/`.env.local` present); the code silently falls back to `http://localhost:5000/api`, which will break auth entirely on a deployed Vercel build unless the env var is configured out-of-band in the Vercel dashboard.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
