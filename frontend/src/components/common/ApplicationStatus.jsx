const STATUS_STYLES = {
  Applied: "bg-bone text-charcoal",
  "Under Review": "bg-bone text-charcoal",
  Screening: "bg-bone text-charcoal",
  Shortlisted: "bg-pastel-blue text-pastel-blue-ink",
  Assessment: "bg-pastel-blue text-pastel-blue-ink",
  Interview: "bg-pastel-yellow text-pastel-yellow-ink",
  Selected: "bg-pastel-green text-pastel-green-ink",
  Rejected: "bg-pastel-red text-pastel-red-ink",
  Closed: "bg-bone text-muted",
};

export default function ApplicationStatus({ status }) {
  const styles = STATUS_STYLES[status] || "bg-bone text-charcoal";
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs uppercase tracking-wide ${styles}`}>{status}</span>
  );
}
