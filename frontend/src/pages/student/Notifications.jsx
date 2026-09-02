import DashboardLayout from "../../components/layout/DashboardLayout";
import { FileText, Flask, CheckCircle, ChatCircleText, CalendarBlank, UsersFour } from "@phosphor-icons/react";

const NOTIFICATIONS = [
  {
    icon: FileText,
    unread: true,
    title: 'Your application for "Optimization of Semi-Transparent Photovoltaics" has been received.',
    source: "Zurich Institute of Technology",
    time: "10m ago",
  },
  {
    icon: Flask,
    unread: true,
    title: "New grant opportunity matches your research profile: Advanced Materials Synthesis.",
    source: "National Science Foundation",
    time: "2h ago",
  },
  {
    icon: CheckCircle,
    unread: false,
    title: "Your profile review is complete. You are now verified as a Doctoral Candidate.",
    source: "System Administrator",
    time: "1d ago",
  },
  {
    icon: ChatCircleText,
    unread: false,
    title: 'Dr. Emily Chen commented on your portfolio artifact "Neural Network Optimization".',
    source: '"Excellent methodology in section 3. Consider expanding on the..."',
    time: "2d ago",
  },
  {
    icon: CalendarBlank,
    unread: false,
    title: "Reminder: The deadline for the Global Innovation Fellowship is approaching.",
    source: "Due in 5 days",
    time: "3d ago",
  },
  {
    icon: UsersFour,
    unread: false,
    title: 'You were added to the working group "Sustainable Urban Infrastructure".',
    source: "By Prof. James Sterling",
    time: "1w ago",
  },
];

export default function Notifications() {
  return (
    <DashboardLayout>
      <header className="mb-10 flex justify-between items-end border-b border-hairline pb-6">
        <div>
          <h2 className="font-editorial text-3xl text-ink tracking-tight">Notifications</h2>
          <p className="text-muted mt-2">Your recent activity and updates.</p>
        </div>
        <button className="border border-hairline text-charcoal px-4 py-2 rounded-md hover:bg-bone transition-colors text-sm">
          Mark all as read
        </button>
      </header>
      <div className="bg-white border border-hairline rounded-xl flex flex-col">
        {NOTIFICATIONS.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className={`p-5 flex items-start gap-4 hover:bg-bone transition-colors cursor-pointer ${
                i < NOTIFICATIONS.length - 1 ? "border-b border-hairline" : ""
              }`}
            >
              <Icon size={20} className={`mt-0.5 ${item.unread ? "text-ink" : "text-muted"}`} />
              <div className="flex-1">
                <p className={`text-sm text-charcoal ${item.unread ? "font-medium" : ""}`}>{item.title}</p>
                <p className="text-sm text-muted mt-1">{item.source}</p>
              </div>
              <span className="text-xs text-muted whitespace-nowrap">{item.time}</span>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
