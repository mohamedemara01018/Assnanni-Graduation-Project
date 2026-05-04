interface Activity {
  id: number | string;
  title: string;
  user: string;
  time: string;
  color: string;
}

const RecentActivity = () => {
  const activities: Activity[] = [
    { id: 1, title: "Patient registered", user: "John Doe", time: "5 min ago", color: "bg-emerald-500" },
    { id: 2, title: "Appointment scheduled", user: "Sarah J.", time: "12 min ago", color: "bg-blue-500" },
    { id: 3, title: "Patient checked in", user: "Mike B.", time: "18 min ago", color: "bg-purple-500" },
    { id: 4, title: "Appointment updated", user: "Emma D.", time: "25 min ago", color: "bg-orange-500" },
  ];

  return (
    <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm w-full">
      <h2 className="text-xl font-bold text-(--color-text) mb-8">Recent Activity</h2>
      <div className="flex flex-col gap-6 relative before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100 dark:before:bg-gray-800">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 items-start relative">
            <div className={`w-[11px] h-[11px] rounded-full ${activity.color} ring-4 ring-white dark:ring-gray-900 shrink-0 mt-1.5`} />
            <div>
              <h3 className="text-sm font-bold text-(--color-text)">{activity.title}</h3>
              <p className="text-xs text-(--color-text-light) font-medium mt-0.5">
                {activity.user} • {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
