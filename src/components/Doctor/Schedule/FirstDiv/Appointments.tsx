import { FaRegClock } from "react-icons/fa";
import Card from "../../Dashboard/FirstDiv/Card";
import { GrFormSchedule } from "react-icons/gr";

const Appointments = () => {
  return (
    <div className="bg-gray-100 p-4 rounded-2xl m-4">
      <div className="flex items-center mb-4">
        <GrFormSchedule className="text-4xl text-blue-500" />
        <p className="text-gray-900 font-thin text-lg">Today's Appointments</p>
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
