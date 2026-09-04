import { cn } from "@/lib/utils";

/**
 * Soft ambient background wash built from the site's own wordmark gradient
 * colors (teal/purple/orange) — three large blurred blooms anchored near
 * the top of the page, fading into the existing white background. Static,
 * no dark backdrop, no grain — purely a light compositional accent, so
 * whatever renders inside `children` keeps its existing text/colors
 * completely unchanged.
 *
 * Shared across Landing/Login/Signup so all three public pages read as one
 * consistent design language rather than three separate treatments.
 */
export default function AmbientBrandGlow({ children, className, contentClassName }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full opacity-25 blur-[110px]"
          style={{ background: "#4fadb0" }}
        />
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full opacity-20 blur-[120px]"
          style={{ background: "#7a6fe0" }}
        />
        <div
          className="absolute -top-16 -right-24 w-[34rem] h-[34rem] rounded-full opacity-20 blur-[110px]"
          style={{ background: "#e4895c" }}
        />
      </div>

      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </div>
  );
}
