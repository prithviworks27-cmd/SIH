import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../../services/notificationsService";
import { FileText, Sparkle, CheckCircle, ChatCircleText, CalendarBlank, GraduationCap, Bell } from "@phosphor-icons/react";

const ICONS = { FileText, Sparkle, CheckCircle, ChatCircleText, CalendarBlank, GraduationCap };

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(undefined);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  const handleClick = async (notif) => {
    if (notif.unread) {
      await markNotificationRead(notif.id);
      const refreshed = await getNotifications();
      setNotifications(refreshed);
    }
    if (notif.linkTo) navigate(notif.linkTo);
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      const refreshed = await getNotifications();
      setNotifications(refreshed);
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <DashboardLayout>
      <header className="mb-10 flex justify-between items-end border-b border-hairline pb-6">
        <div>
          <h2 className="font-geist text-3xl text-ink tracking-tight">Notifications</h2>
          <p className="text-muted mt-2">Your recent activity and updates.</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          disabled={markingAll}
          className="border border-hairline text-charcoal px-4 py-2 rounded-md hover:bg-bone transition-colors text-sm disabled:opacity-50"
        >
          {markingAll ? "Marking…" : "Mark all as read"}
        </button>
      </header>

      {notifications === undefined && <LoadingState label="Loading notifications…" />}

      {notifications && notifications.length === 0 && (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
      )}

      {notifications && notifications.length > 0 && (
        <div className="bg-white border border-hairline rounded-xl flex flex-col">
          {notifications.map((item, i) => {
            const Icon = ICONS[item.icon] || Bell;
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item)}
                className={`p-5 flex items-start gap-4 hover:bg-bone transition-colors cursor-pointer text-left ${
                  i < notifications.length - 1 ? "border-b border-hairline" : ""
                }`}
              >
                <Icon size={20} className={`mt-0.5 shrink-0 ${item.unread ? "text-ink" : "text-muted"}`} />
                <div className="flex-1">
                  <p className={`text-sm text-charcoal ${item.unread ? "font-medium" : ""}`}>{item.title}</p>
                  <p className="text-sm text-muted mt-1">{item.source}</p>
                </div>
                <span className="text-xs text-muted whitespace-nowrap">{item.time}</span>
              </button>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
