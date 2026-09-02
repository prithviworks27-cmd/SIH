const STATUS_STYLES = {
  Applied: "bg-surface-container-high text-on-surface",
  "Under Review": "bg-surface-container-high text-on-surface",
  Screening: "bg-surface-container-high text-on-surface",
  Shortlisted: "bg-primary-fixed text-on-primary-fixed",
  Assessment: "bg-primary-fixed text-on-primary-fixed",
  Interview: "bg-primary-container text-white",
  Selected: "bg-primary-container text-white",
  Rejected: "bg-error-container text-on-error-container",
  Closed: "bg-surface-variant text-on-surface-variant",
};

export default function ApplicationStatus({ status }) {
  const styles = STATUS_STYLES[status] || "bg-surface-container-high text-on-surface";
  return (
    <span className={`inline-block px-sm py-xs rounded-DEFAULT font-label-md text-label-md ${styles}`}>
      {status}
    </span>
  );
}
