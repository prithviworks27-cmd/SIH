# Discussion Log

A running, day-by-day record of work done on AcademiaLink. Updated on request at the
end of each working day. Each entry lists what changed and links the PR(s) that shipped it.

---

## 2026-09-01

- Set up the project locally: Express backend + React (Vite) frontend boilerplate,
  `.env` scaffolding for both. ([#1](https://github.com/zoro7401/SIH/pull/1))
- Converted the Stitch-exported static HTML pages into React components on the existing
  stack (React Router, Tailwind), split into `pages/public` and `pages/student`.
  ([#2](https://github.com/zoro7401/SIH/pull/2))
- Wired up the remaining mobile menu / sidebar toggle hooks left stubbed out by the
  conversion. ([#3](https://github.com/zoro7401/SIH/pull/3))
- Login page: connected the form to the backend auth flow.
  ([#4](https://github.com/zoro7401/SIH/pull/4), [#5](https://github.com/zoro7401/SIH/pull/5))

## 2026-09-02

- Login page copy tweaks (button label, removed subhead, wording).
  ([#6](https://github.com/zoro7401/SIH/pull/6))
- First minimalist-ui pass: redesigned Landing and Login pages with the editorial
  minimalism system (warm monochrome palette, Newsreader serif headings, Phosphor icons).
  ([#7](https://github.com/zoro7401/SIH/pull/7))
- Foundation work: route protection (`ProtectedRoute`, role-based redirect after login),
  shared `DashboardLayout`/`Sidebar`, common components (`StatCard`, `SkillProgress`,
  `ApplicationStatus`, `LoadingState`, `EmptyState`), and a mock data/service layer for
  courses, internships, applications, and skills.
  ([#8](https://github.com/zoro7401/SIH/pull/8))
- Second minimalist-ui pass: extended the editorial design system to every student page,
  not just Landing/Login. ([#9](https://github.com/zoro7401/SIH/pull/9))
- Fixed an asymmetric-margin bug in `DashboardLayout` (`ml-*` and `mx-auto` combined on
  the same element made all leftover width collapse onto the right side) — fixed
  portal-wide since every student page shares the layout. Audited all pages for the
  same pattern. ([#10](https://github.com/zoro7401/SIH/pull/10))
- Made the Course Catalog filters actually functional (staged "Apply" flow instead of
  decorative checkboxes); removed the dead "View demo" button from Landing.
  ([#11](https://github.com/zoro7401/SIH/pull/11))
- Removed dead links from Landing: footer legal links and the top nav (mostly
  `href="#"` placeholders), which also let the mobile hamburger menu go.
  ([#12](https://github.com/zoro7401/SIH/pull/12))
- Redesigned the Dashboard's Skill Gap Analysis panel as a vertical bar chart
  (percentage inside the fill, label below), matching a reference layout while staying
  on the existing pastel token palette. ([#13](https://github.com/zoro7401/SIH/pull/13))
