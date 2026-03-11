const Overview = () => {
  return (
    <div className="flex flex-col gap-3 bg-(--color-surface) p-6 rounded-xl">
      <h1 className="text-xl font-normal  text-(--color-text) border-b-2 border-gray-300 pb-2">
        Today's Overview
      </h1>
      <div className="flex flex-col">
        <div className="flex justify-between m-2">
          <p className="text-sm font-light">Check-in</p>
          <span className="font-semibold">12</span>
        </div>
        <div className="flex justify-between m-2">
          <p className="text-sm font-light">New Registrations</p>
          <span className="font-semibold">5</span>
        </div>
        <div className="flex justify-between m-2">
          <p className="text-sm font-light">Scheduled Appointments</p>
          <span className="font-semibold">8</span>
        </div>
        <div className="flex justify-between m-2">
          <p className="text-sm font-light">Cancellations</p>
          <span className="font-semibold">2</span>
        </div>
      </div>
    </div>
  );
};

export default Overview;
