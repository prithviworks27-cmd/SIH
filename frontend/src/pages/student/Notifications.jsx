import DashboardLayout from "../../components/layout/DashboardLayout";

const NOTIFICATIONS = [
  {
    icon: "description",
    unread: true,
    title: 'Your application for "Optimization of Semi-Transparent Photovoltaics" has been received.',
    source: "Zurich Institute of Technology",
    time: "10m ago",
  },
  {
    icon: "science",
    unread: true,
    title: "New grant opportunity matches your research profile: Advanced Materials Synthesis.",
    source: "National Science Foundation",
    time: "2h ago",
  },
  {
    icon: "check_circle",
    unread: false,
    title: "Your profile review is complete. You are now verified as a Doctoral Candidate.",
    source: "System Administrator",
    time: "1d ago",
  },
  {
    icon: "forum",
    unread: false,
    title: 'Dr. Emily Chen commented on your portfolio artifact "Neural Network Optimization".',
    source: '"Excellent methodology in section 3. Consider expanding on the..."',
    time: "2d ago",
  },
  {
    icon: "event",
    unread: false,
    title: "Reminder: The deadline for the Global Innovation Fellowship is approaching.",
    source: "Due in 5 days",
    time: "3d ago",
  },
  {
    icon: "group_add",
    unread: false,
    title: 'You were added to the working group "Sustainable Urban Infrastructure".',
    source: "By Prof. James Sterling",
    time: "1w ago",
  },
];

export default function Notifications() {
  return (
    <DashboardLayout>
      <header className="mb-xl flex justify-between items-end border-b border-outline-variant pb-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Notifications</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Your recent activity and updates.</p>
        </div>
        <button className="bg-surface-container-lowest border border-outline-variant text-on-background px-md py-sm rounded hover:bg-surface-container transition-colors font-label-md text-label-md">
          Mark all as read
        </button>
      </header>
      <div className="bg-surface-container-lowest border border-outline-variant rounded flex flex-col">
        {NOTIFICATIONS.map((item, i) => (
          <div
            key={i}
            className={`p-md flex items-start gap-md hover:bg-surface-container-low transition-colors cursor-pointer ${
              i < NOTIFICATIONS.length - 1 ? "border-b border-outline-variant" : ""
            }`}
          >
            <span className={`material-symbols-outlined mt-1 ${item.unread ? "text-primary" : "text-on-surface-variant"}`}>{item.icon}</span>
            <div className="flex-1">
              <p className={`font-body-md text-body-md text-on-background ${item.unread ? "font-semibold" : ""}`}>{item.title}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">{item.source}</p>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">{item.time}</span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
