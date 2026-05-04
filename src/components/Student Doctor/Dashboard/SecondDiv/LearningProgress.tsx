const LearningProgress = () => {
  return (
    <div className="bg-(--color-surface) rounded-2xl p-6 flex flex-col gap-6 shadow-sm border border-(--color-border)">
      <h1 className="text-xl text-(--color-text) font-medium border-b border-(--color-border) pb-3">
        Learning Progress
      </h1>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-(--color-text)">Observations</p>
          <span className="text-xs font-bold text-(--color-text-light)">
            18/20
          </span>
        </div>
        <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: "90%" }}
          ></div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-(--color-text)">Case Studies</p>
          <span className="text-xs font-bold text-(--color-text-light)">
            12/15
          </span>
        </div>
        <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: "80%" }}
          ></div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-(--color-text)">Assessments</p>
          <span className="text-xs font-bold text-(--color-text-light)">
            8/10
          </span>
        </div>
        <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-violet-600 h-full rounded-full transition-all duration-500"
            style={{ width: "80%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LearningProgress;
