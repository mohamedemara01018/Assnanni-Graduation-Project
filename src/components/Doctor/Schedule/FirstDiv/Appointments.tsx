import { FaRegClock } from "react-icons/fa";
import Card from "../../Dashboard/FirstDiv/Card";
import { GrFormSchedule } from "react-icons/gr";

const Appointments = () => {
  return (
    <div className="bg-(--color-surface) p-4 rounded-2xl m-4">
      <div className="flex items-center mb-4 border-b-2 border-gray-300 pb-2">
        <GrFormSchedule className="text-4xl text-blue-500 " />
        <p className="text-(--color-text) font-normal text-xl">
          Today's Appointments
        </p>
      </div>
      <div>
        <Card
          title="Patient: Dr. Sarah Johnson"
          status="confirmed"
          color="blue"
          logo={<FaRegClock />}
        >
          <p>Cardiology</p>
          <p>10:00 PM</p>
        </Card>
      </div>
    </div>
  );
};

export default Appointments;
