import { ScaleLoader } from "react-spinners";

interface LearningProgressProps {
  data: {
    observationsCompleted: number;
    observationsTotal: number;
    caseStudiesCompleted: number;
    caseStudiesTotal: number;
  };
  isLoading: boolean;
}

const LearningProgress = ({ data, isLoading }: LearningProgressProps) => {
  const calculatePercentage = (completed: number, total: number) => {
    if (!total || total === 0) return 0;
    return Math.min(Math.round((completed / total) * 100), 100);
  };

  const observationsPercent = calculatePercentage(
    data?.observationsCompleted || 0,
    data?.observationsTotal || 0,
  );
  const casesPercent = calculatePercentage(
    data?.caseStudiesCompleted || 0,
    data?.caseStudiesTotal || 0,
  );

  return (
    <div className="bg-(--color-surface) rounded-2xl p-6 flex flex-col gap-6 shadow-sm border border-(--color-border)">
      <h1 className="text-xl text-(--color-text) font-medium border-b border-(--color-border) pb-3">
        Learning Progress
      </h1>

      {isLoading ? (
        <div className="py-10 flex flex-col items-center justify-center gap-4">
          <ScaleLoader color="#00AFE5" height={20} />
          <p className="text-xs text-(--color-text-light)">
            Calculating progress...
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-(--color-text)">
                Observations
              </p>
              <span className="text-xs font-bold text-(--color-text-light)">
                {data?.observationsCompleted || 0}/
                {data?.observationsTotal || 0}
              </span>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                style={{ width: `${observationsPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-(--color-text)">
                Case Studies
              </p>
              <span className="text-xs font-bold text-(--color-text-light)">
                {data?.caseStudiesCompleted || 0}/{data?.caseStudiesTotal || 0}
              </span>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${casesPercent}%` }}
              ></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LearningProgress;
