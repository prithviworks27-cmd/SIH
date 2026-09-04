import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Static full-bleed page background: a soft radial spotlight glow anchored
 * toward the upper-right (pale center, fading through a mid green into a
 * near-black base) with a uniform film-grain overlay. No motion — a
 * compositional wash, not an animated effect.
 *
 * Renders `children` in a relatively-positioned layer above the background.
 * Deliberately does NOT touch typography/text color — pair it with an
 * opaque content surface (e.g. a white card) so existing text/colors on the
 * page are never rendered directly against the dark background.
 */
export default function SpotlightGrainBackground({
  children,
  className,
  contentClassName,
  baseColor = "#070a08",
  glowCenter = "#eaf6cf",
  glowMid = "#5fb84a",
  glowDeep = "#0d3018",
  grainOpacity = 0.12,
}) {
  const filterId = useId();

  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0 z-0" style={{ background: baseColor }} aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 75% 65% at 78% 12%, ${glowCenter} 0%, ${glowMid} 26%, ${glowDeep} 52%, ${baseColor} 78%)`,
          }}
        />

        {/* Grain — static SVG filter (feTurbulence -> feColorMatrix to
            desaturate), applied to a flat overlay via mix-blend-mode. One
            paint, not re-run per frame. */}
        <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
          <filter id={`${filterId}-grain`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0" />
          </filter>
        </svg>
        <div
          className="absolute inset-0"
          style={{ filter: `url(#${filterId}-grain)`, opacity: grainOpacity, mixBlendMode: "overlay" }}
        />
      </div>

      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </div>
  );
}
