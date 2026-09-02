export default function LoadingState({ label = "Loading…", fullScreen = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-sm text-on-surface-variant ${
        fullScreen ? "min-h-screen" : "py-xl"
      }`}
    >
      <span className="material-symbols-outlined animate-spin text-primary-container text-3xl">sync</span>
      <span className="font-label-md text-label-md">{label}</span>
    </div>
  );
}
