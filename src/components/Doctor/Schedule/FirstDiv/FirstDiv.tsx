import WeeklySchedule from "./WeeklySchedule";
import Appointments from "./Appointments";
import type { WeeklyScheduleDay } from "@/interfaces/doctorInterfaces";
import type { Schedule } from "@/interfaces/doctorInterfaces";

interface Props {
  role: string;
  days: WeeklyScheduleDay[];
  appointments: Schedule[];
}

const FirstDiv = ({ role, days, appointments }: Props) => {
  return (
    <div className="flex flex-col gap-6">
      <WeeklySchedule role={role} days={days} />
      <Appointments role={role} appointments={appointments} />
    </div>
  );
};

export default FirstDiv;
