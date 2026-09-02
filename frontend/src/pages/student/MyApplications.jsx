import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import ApplicationStatus from "../../components/common/ApplicationStatus";
import { getApplications } from "../../services/applicationsService";

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export default function MyApplications() {
  const [applications, setApplications] = useState(undefined);

  useEffect(() => {
    getApplications().then(setApplications);
  }, []);

  return (
    <DashboardLayout>
      {/*Header*/}
      <header className="mb-xl flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-outline-variant pb-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Application History</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
            Review and track the status of your submitted applications.
          </p>
        </div>
        <div className="flex gap-md">
          <button className="px-md py-sm bg-surface-container-lowest border border-outline-variant rounded font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-sm">
            <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
          </button>
        </div>
      </header>

      {applications === undefined && <LoadingState label="Loading applications…" />}

      {applications && applications.length === 0 && (
        <EmptyState
          icon="description"
          title="No applications yet"
          description="Applications you submit to internships and jobs will show up here."
          actionLabel="Browse Opportunities"
          onAction={() => (window.location.href = "/internships")}
        />
      )}

      {applications && applications.length > 0 && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-outline-variant font-label-sm text-label-sm text-on-surface-variant">
                  <th className="p-md font-medium">Company / Institution</th>
                  <th className="p-md font-medium">Role / Program</th>
                  <th className="p-md font-medium">Date Applied</th>
                  <th className="p-md font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-outline-variant">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="p-md">
                      <div className="font-medium text-primary">{app.companyName}</div>
                      <div className="text-on-surface-variant text-xs mt-0.5">{app.department}</div>
                    </td>
                    <td className="p-md">
                      <div>{app.role}</div>
                      <div className="text-on-surface-variant text-xs mt-0.5">{app.roleSubtext}</div>
                    </td>
                    <td className="p-md text-on-surface-variant">{formatDate(app.dateApplied)}</td>
                    <td className="p-md">
                      <ApplicationStatus status={app.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-md border-t border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface-variant">
            <div>
              Showing 1 to {applications.length} of {applications.length} entries
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
