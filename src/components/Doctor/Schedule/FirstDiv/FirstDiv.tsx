import React from "react";
import WeeklySchedule from "./WeeklySchedule";
import Appointments from "./Appointments";

const FirstDiv = () => {
  return (
    <div className="flex flex-col gap-6">
      <WeeklySchedule />
      <Appointments />
    </div>
  );
};

export default FirstDiv;
