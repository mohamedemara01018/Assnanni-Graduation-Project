import React from "react";
import WeeklySchedule from "./WeeklySchedule";
import Appointments from "./Appointments";

interface Props {
  role: string;
}

const FirstDiv = ({ role }: Props) => {
  return (
    <div className="flex flex-col gap-6">
      <WeeklySchedule role={role} />
      <Appointments role={role} />
    </div>
  );
};

export default FirstDiv;
