export interface PatientInQueue {
  id: string | number;
  name: string;
  doctorName: string;
  arrivalTime: string;
  status: "Waiting" | "InProgress" | "CheckedIn";
}

interface Props {
  patient: PatientInQueue;
  onStart: (id: string | number) => void;
  isStarting: boolean;
  onComplete: (id: string | number) => void;
  isCompleting: boolean;
}

const PatientQueueCard = ({
  patient,
  onStart,
  isStarting,
  onComplete,
  isCompleting,
}: Props) => {
  const { id, name, doctorName, arrivalTime, status } = patient;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const statusStyles = {
    Waiting: "bg-yellow-50 text-yellow-600 border-yellow-100",
    InProgress: "bg-blue-50 text-blue-600 border-blue-100",
    CheckedIn: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div className="flex bg-gray-50/50 dark:bg-gray-800/20 items-center justify-between p-4 rounded-2xl border border-(--color-border) hover:bg-gray-50 transition-colors group">
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 flex items-center justify-center bg-linear-to-br from-blue-500 to-emerald-500 rounded-full text-white font-bold shadow-sm">
          {initials}
        </div>
        <div>
          <h3 className="text-sm font-bold text-(--color-text)">{name}</h3>
          <p className="text-xs text-(--color-text-light) font-medium">
            {doctorName}
          </p>
          <p className="text-[10px] text-(--color-text-light) font-medium mt-0.5">
            Arrived: {arrivalTime}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div
          className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusStyles[status]}`}
        >
          {status}
        </div>
        {status === "InProgress" ? (
          <button
            onClick={() => onComplete(id)}
            disabled={isCompleting}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-md shadow-emerald-100 transition-all active:scale-95 cursor-pointer"
          >
            {isCompleting ? "Completing..." : "Complete"}
          </button>
        ) : (
          <button
            onClick={() => onStart(id)}
            disabled={isStarting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-md shadow-blue-100 transition-all active:scale-95 cursor-pointer"
          >
            {isStarting ? "Starting..." : "Start"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientQueueCard;
