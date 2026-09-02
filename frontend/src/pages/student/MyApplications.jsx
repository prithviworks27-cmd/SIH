import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import ApplicationStatus from "../../components/common/ApplicationStatus";
import { getApplications } from "../../services/applicationsService";
import { FileText } from "@phosphor-icons/react";

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

const STATUS_FILTERS = ["All", "Applied", "Under Review", "Shortlisted", "Interview", "Selected", "Rejected", "Closed"];

export default function MyApplications() {
  const [applications, setApplications] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    getApplications().then(setApplications);
  }, []);

  const filteredApplications = useMemo(() => {
    if (!applications) return applications;
    if (statusFilter === "All") return applications;
    return applications.filter((a) => a.status === statusFilter);
  }, [applications, statusFilter]);

  return (
    <DashboardLayout>
      {/*Header*/}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <h2 className="font-editorial text-3xl text-ink tracking-tight">Application History</h2>
          <p className="text-muted mt-1.5">Review and track the status of your submitted applications.</p>
        </div>
        <div className="w-full md:w-56">
          <label className="sr-only" htmlFor="status-filter">
            Filter by status
          </label>
          <select
            id="status-filter"
            className="w-full border border-hairline bg-white text-charcoal rounded-md py-2 px-3 focus:border-ink focus:ring-0 text-sm h-10"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Statuses" : s}
              </option>
            ))}
          </select>
        </div>
      </header>

      {applications === undefined && <LoadingState label="Loading applications…" />}

      {applications && applications.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="Applications you submit to internships and jobs will show up here."
          actionLabel="Browse Opportunities"
          onAction={() => (window.location.href = "/internships")}
        />
      )}

      {filteredApplications && applications.length > 0 && filteredApplications.length === 0 && (
        <EmptyState icon={FileText} title={`No applications with status "${statusFilter}"`} description="Try a different filter." />
      )}

      {filteredApplications && filteredApplications.length > 0 && (
        <div className="bg-white border border-hairline rounded-xl">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bone border-b border-hairline text-xs uppercase tracking-wide text-muted">
                  <th className="p-4 font-medium">Company / Institution</th>
                  <th className="p-4 font-medium">Role / Program</th>
                  <th className="p-4 font-medium">Date Applied</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-charcoal divide-y divide-hairline">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-bone transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-ink">{app.companyName}</div>
                      <div className="text-muted text-xs mt-0.5">{app.department}</div>
                    </td>
                    <td className="p-4">
                      <div>{app.role}</div>
                      <div className="text-muted text-xs mt-0.5">{app.roleSubtext}</div>
                    </td>
                    <td className="p-4 text-muted">{formatDate(app.dateApplied)}</td>
                    <td className="p-4">
                      <ApplicationStatus status={app.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-4 border-t border-hairline text-xs text-muted">
            <div>
              Showing 1 to {filteredApplications.length} of {applications.length} entries
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
