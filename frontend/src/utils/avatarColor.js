// Deterministic per-contact avatar color, built from the app's own brand
// palette (wordmark teal/purple/orange plus the existing pastel-ink accents)
// instead of arbitrary hues — so every avatar in the messaging surfaces
// feels like it belongs to SkillBridge rather than a generic identicon set.
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #4fadb0, #3d8a8d)", // teal
  "linear-gradient(135deg, #7a6fe0, #5f52c4)", // purple
  "linear-gradient(135deg, #e4895c, #c96f42)", // orange
  "linear-gradient(135deg, #1f6c9f, #17557d)", // blue
  "linear-gradient(135deg, #346538, #274d2a)", // green
  "linear-gradient(135deg, #9f2f2d, #7d2422)", // red
];

export function initialsOf(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
}

export function avatarGradientFor(name) {
  if (!name) return AVATAR_GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}
