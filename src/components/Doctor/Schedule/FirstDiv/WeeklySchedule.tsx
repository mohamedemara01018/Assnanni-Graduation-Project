import Days from "./Days";

interface Day {
  day: string;
  time: string[];
}

const WeeklySchedule = () => {
  const days: Day[] = [
    {
      day: "Monday",
      time: [
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "12:00 PM",
        "01:00 PM",
        "02:00 PM",
        "03:00 PM",
      ],
    },
    { day: "TuesDay", time: ["09:00 AM"] },
    { day: "Wednesday", time: [] },
  ];

  return (
    <div className="bg-gray-100 m-4 rounded-2xl p-4">
      <div className="flex justify-between">
        <h3 className="text-gray-800 font-thin">Weekly Schedule</h3>
        <button className="bg-blue-500 text-white font-semibold rounded-2xl py-2 px-4 cursor-pointer hover:bg-blue-500/90 hover:shadow-2xl">
          + Add Time Slot
        </button>
      </div>
      <div>
        {days.map((day, index) => {
          return (
            <div key={index}>
              <Days day={day.day} time={day.time} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklySchedule;
