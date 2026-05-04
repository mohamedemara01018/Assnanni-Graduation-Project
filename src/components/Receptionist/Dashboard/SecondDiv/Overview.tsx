const Overview = () => {
  const stats = [
    { label: "Check-ins", value: "12" },
    { label: "Scheduled Apps", value: "8" },
    { label: "Cancellations", value: "2" },
  ];

  return (
    <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm w-full">
      <h2 className="text-xl font-bold text-(--color-text) mb-8">Today's Overview</h2>
      <div className="flex flex-col gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex justify-between items-center group">
            <span className="text-sm font-medium text-(--color-text-light) group-hover:text-(--color-text) transition-colors">
              {stat.label}
            </span>
            <span className="text-lg font-bold text-(--color-text)">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
