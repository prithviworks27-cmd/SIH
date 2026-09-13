import { cn } from "@/lib/utils";

/**
 * Soft ambient background wash built from the site's own wordmark gradient
 * colors (teal/purple/orange in light mode, olive/secondary/accent green in
 * dark mode, via the --glow-* CSS custom properties) — three large blurred
 * blooms anchored near the top of the page, fading into the page background.
 * Static, no grain — purely a compositional accent, so whatever renders
 * inside `children` keeps its existing text/colors completely unchanged.
 *
 * Sets its own bg-bone so every page using this component gets a
 * guaranteed light canvas — without it, a page with no other opaque
 * wrapper (e.g. Signup, whose content floats directly on the glow with no
 * card) falls through to a transparent background.
 *
 * Shared across Landing/Login/Signup, and the DashboardLayout/ConversationInbox
 * shells every portal renders inside, so the whole site reads as one
 * consistent design language rather than separate treatments.
 *
 * The bloom layer is `fixed` (not `absolute` inside an `overflow-hidden`
 * wrapper) so it clips itself to the viewport without making the outer
 * wrapper `overflow-hidden` — that would break `position: sticky` on any
 * descendant (e.g. the mobile Sidebar header), since an `overflow: hidden`
 * ancestor that never actually scrolls becomes sticky's containing block
 * and the element just scrolls away instead of sticking.
 */
export default function AmbientBrandGlow({ children, className, contentClassName }) {
  return (
    <div className={cn("relative bg-bone", className)}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full opacity-25 blur-[110px]"
          style={{ background: "var(--glow-1)" }}
        />
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full opacity-20 blur-[120px]"
          style={{ background: "var(--glow-2)" }}
        />
        <div
          className="absolute -top-16 -right-24 w-[34rem] h-[34rem] rounded-full opacity-20 blur-[110px]"
          style={{ background: "var(--glow-3)" }}
        />
      </div>

      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </div>
  );
}
