import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Standard shadcn/ui helper: merges conditional class names (clsx) and
// resolves conflicting Tailwind utility classes (twMerge) so later classes
// in a className string correctly win over earlier ones.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
