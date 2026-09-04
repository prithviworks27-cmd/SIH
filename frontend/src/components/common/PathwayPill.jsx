import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";

// Same spring/rotation language as ui/images-badge.jsx, adapted for a
// click-to-toggle pill of icon tiles instead of a hover-to-preview stack of
// photos — there's nothing photographic to show for "Skill mapping" etc., so
// the step's own tinted icon square stands in for what would be an avatar.
const SPRING = { type: "spring", stiffness: 280, damping: 24 };
const REST_ROT = [-10, 0, 10];
const PX = 48;
const PEEK = 22;

export default function PathwayPill({ steps, expanded, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  const reduced = useReducedMotion();
  const spread = expanded || hovered;

  const collapsedW = PX + (steps.length - 1) * PEEK;
  const spreadW = steps.length * PX + (steps.length - 1) * 14;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={reduced ? undefined : { y: -2, scale: 1.015 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={SPRING}
      aria-expanded={expanded}
      className={cn(
        "inline-flex cursor-pointer select-none items-center rounded-full",
        "border border-hairline bg-white/90 backdrop-blur-sm",
        "h-[68px] pl-3 pr-7 gap-4 text-lg",
        "shadow-[0_2px_12px_rgba(0,0,0,.10)] transition-shadow duration-300",
        "hover:shadow-[0_6px_24px_rgba(0,0,0,.16)]",
      )}
    >
      <motion.div
        className="relative shrink-0"
        style={{ height: PX + 14 }}
        animate={{ width: reduced ? collapsedW : spread ? spreadW : collapsedW }}
        transition={SPRING}
      >
        {steps.map((step, i) => {
          const Icon = step.icon;
          const tx = spread ? i * (PX + 14) : i * PEEK;
          const rotate = reduced ? 0 : spread ? 0 : (REST_ROT[i] ?? 0);
          const zIdx = spread ? i + 1 : steps.length - i;

          return (
            <motion.span
              key={step.number}
              className={cn(
                "absolute top-0 left-0 flex items-center justify-center rounded-xl",
                "border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,.18)]",
                step.tint,
              )}
              style={{ width: PX, height: PX, zIndex: zIdx }}
              animate={{ x: reduced ? i * (PX + 14) : tx, rotate }}
              transition={SPRING}
            >
              <Icon size={22} weight="bold" />
            </motion.span>
          );
        })}
      </motion.div>

      <span className="font-medium text-ink/80">Pathway</span>

      <motion.span
        animate={{ rotate: expanded ? 180 : 0 }}
        transition={SPRING}
        className="text-muted text-base"
        aria-hidden="true"
      >
        ▾
      </motion.span>
    </motion.button>
  );
}
