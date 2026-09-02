export default function EmptyState({ icon = "inbox", title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-sm border border-outline-variant rounded-DEFAULT bg-surface-container-lowest p-xl py-24">
      <span className="material-symbols-outlined text-4xl text-on-surface-variant">{icon}</span>
      <h3 className="font-headline-sm text-headline-sm text-on-surface">{title}</h3>
      {description && (
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-md bg-primary-container text-on-primary font-label-md text-label-md px-md py-sm rounded-DEFAULT hover:bg-primary transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
