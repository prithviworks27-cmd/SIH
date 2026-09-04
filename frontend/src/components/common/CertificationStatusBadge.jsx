// Reflects portfolio_certifications.verification_status — replaces the old
// blanket "Self-reported, uploaded to portfolio" text (inaccurate, since
// nothing was ever actually uploaded before this). green = an admin
// approved the uploaded file; yellow = uploaded, awaiting review; gray =
// plain self-report with no file attached at all.
const STATUS = {
  verified: { label: "Verified", tone: "bg-pastel-green text-pastel-green-ink" },
  pending: { label: "Pending Review", tone: "bg-pastel-yellow text-pastel-yellow-ink" },
  rejected: { label: "Rejected", tone: "bg-pastel-red text-pastel-red-ink" },
  unverified: { label: "Self-Reported", tone: "bg-bone text-muted" },
};

export default function CertificationStatusBadge({ status, className = "" }) {
  const config = STATUS[status] || STATUS.unverified;
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap ${config.tone} ${className}`}>
      {config.label}
    </span>
  );
}
