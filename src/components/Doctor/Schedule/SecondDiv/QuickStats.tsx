const QuickStats = () => {
  return (
    <div className="flex flex-col gap-3 bg-(--color-surface) p-6 rounded-xl m-4 ml-0">
      <h1 className="text-xl mb-2 text-(--color-text) border-b-2 border-gray-300 pb-2">
        Quick Stats
      </h1>
      <p className={"bg-blue-200 rounded-lg p-4"}>
        <h3 className="text-blue-800 font-semibold">Appointments Today</h3>
        <p className="text-sm font-normal text-blue-700">3</p>
      </p>
      <p className={"bg-green-200 rounded-lg p-4"}>
        <h3 className="text-green-800 font-semibold">This Week</h3>
        <p className="text-sm font-normal text-green-700">15</p>
      </p>
      <p className={"bg-violet-200 rounded-lg p-4"}>
        <h3 className="text-violet-800 font-semibold">Available Slots</h3>
        <p className="text-sm font-normal text-violet-700">24</p>
      </p>
    </div>
  );
};

export default QuickStats;
