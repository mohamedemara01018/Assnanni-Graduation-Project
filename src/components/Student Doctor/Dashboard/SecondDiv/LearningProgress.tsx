const LearningProgress = () => {
  return (
    <div className="bg-gray-100 rounded-xl p-6 flex flex-col gap-6">
      <h1 className="text-xl text-gray-700 ">Learning Progress</h1>
      <div className=" flex flex-col gap-2">
        <div className="flex justify-between ">
          <p className="text-sm text-gray-500">Observations</p>
          <span className="text-sm font-normal text-gray-600">18/20</span>
        </div>
        <div className="bg-gray-200 h-2.5 rounded-3xl">
          <div className="bg-blue-600 h-2.5 rounded-3xl w-[calc(18/20*100%)]"></div>
        </div>
      </div>
      <div className=" flex flex-col gap-2">
        <div className="flex justify-between ">
          <p className="text-sm text-gray-500">Case Studies</p>
          <span className="text-sm font-normal text-gray-600">12/15</span>
        </div>
        <div className="bg-gray-200 h-2.5 rounded-3xl">
          <div className="bg-green-600 h-2.5 rounded-3xl w-[calc(12/15*100%)]"></div>
        </div>
      </div>
      <div className=" flex flex-col gap-2">
        <div className="flex justify-between ">
          <p className="text-sm text-gray-500">Assessments</p>
          <span className="text-sm font-normal text-gray-600">8/10</span>
        </div>
        <div className="bg-gray-200 h-2.5 rounded-3xl">
          <div className="bg-violet-600 h-2.5 rounded-3xl w-[calc(8/10*100%)]"></div>
        </div>
      </div>
    </div>
  );
};

export default LearningProgress;
