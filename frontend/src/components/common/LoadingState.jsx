import { ArrowClockwise } from "@phosphor-icons/react";

export default function LoadingState({ label = "Loading…", fullScreen = false }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 text-muted ${fullScreen ? "min-h-screen" : "py-16"}`}>
      <ArrowClockwise size={22} className="animate-spin text-ink" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
