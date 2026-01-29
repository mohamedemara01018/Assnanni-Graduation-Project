const Week = () => {
  return (
    <div className="bg-(--color-surface) rounded-xl p-6 flex flex-col gap-4">
      <h1 className="text-xl font-normal border-b-2 border-gray-300 pb-2 mb-2 text-(--color-text) ">
        This Week
      </h1>
      <div className=" flex flex-col gap-4">
        <div className="flex justify-between ">
          <p className="text-sm text-(--color-text-light)">Appointments</p>
          <span className="text-sm font-semibold text-(--color-text)">
            24/30
          </span>
        </div>
        <div className="bg-gray-200 h-2.5 rounded-3xl">
          <div className="bg-blue-600 h-2.5 rounded-3xl w-[calc(24/30*100%)]"></div>
        </div>
      </div>
      <div className=" flex flex-col gap-4">
        <div className="flex justify-between ">
          <p className="text-sm text-(--color-text-light)">Reviews Completed</p>
          <span className="text-sm font-semibold text-(--color-text)">
            15/18
          </span>
        </div>
        <div className="bg-gray-200 h-2.5 rounded-3xl">
          <div className="bg-green-600 h-2.5 rounded-3xl w-[calc(15/18*100%)]"></div>
        </div>
      </div>
    </div>
  );
};

export default Week;
