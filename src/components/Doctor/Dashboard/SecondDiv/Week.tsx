const Week = () => {
  return (
    <div className="bg-gray-100 rounded-xl p-6 flex flex-col gap-4">
      <h1 className="text-2xl text-gray-700 ">This Week</h1>
      <div className=" flex flex-col gap-4">
        <div className="flex justify-between ">
          <p className="text-sm text-gray-500">Appointments</p>
          <span className="text-sm font-semibold text-gray-600">24/30</span>
        </div>
        <div className="bg-gray-200 h-2.5 rounded-3xl">
          <div className="bg-blue-600 h-2.5 rounded-3xl w-[calc(24/30*100%)]"></div>
        </div>
      </div>
      <div className=" flex flex-col gap-4">
        <div className="flex justify-between ">
          <p className="text-sm text-gray-500">Reviews Completed</p>
          <span className="text-sm font-semibold text-gray-600">15/18</span>
        </div>
        <div className="bg-gray-200 h-2.5 rounded-3xl">
          <div className="bg-green-600 h-2.5 rounded-3xl w-[calc(15/18*100%)]"></div>
        </div>
      </div>
    </div>
  );
};

export default Week;
