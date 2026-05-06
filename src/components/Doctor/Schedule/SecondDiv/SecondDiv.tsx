import QuickStats from "./QuickStats";
import RequestTimeOff from "./RequestTimeOff";
import type { WeeklyScheduleStats } from "@/interfaces/doctorInterfaces";

interface Props {
  role: string;
  stats: WeeklyScheduleStats;
}

const SecondDiv = ({ role, stats }: Props) => {
  return (
    <div className="flex flex-col gap-6">
      {role !== "studentDoctor" && (
        <>
          <QuickStats stats={stats} />
          <RequestTimeOff />
        </>
      )}
    </div>
  );
};

export default SecondDiv;
