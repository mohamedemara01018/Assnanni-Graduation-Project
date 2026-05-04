export interface DoctorStatus {
  id: string | number;
  name: string;
  specialty?: string;
  status: "available" | "busy" | "offline";
  imageUrl?: string;
}

interface Props {
  doctor: DoctorStatus;
}

const DoctorStatusCard = ({ doctor }: Props) => {
  const { name, status, imageUrl } = doctor;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const statusStyles = {
    available: "bg-emerald-50 text-emerald-600 border-emerald-100",
    busy: "bg-gray-100 text-gray-600 border-gray-200",
    offline: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <div className="flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20 p-3 px-4 rounded-2xl border border-(--color-border) hover:bg-gray-50 transition-colors">
      <div className="flex gap-4 items-center">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden border-2 border-white">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-(--color-text)">Dr. {name}</h3>
        </div>
      </div>
      <div
        className={`px-3 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusStyles[status]}`}
      >
        {status}
      </div>
    </div>
  );
};

export default DoctorStatusCard;
