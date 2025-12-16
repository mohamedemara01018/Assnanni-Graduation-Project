import Card from "./Card";
import { FaRegClock } from "react-icons/fa6";
import { LuFileSpreadsheet } from "react-icons/lu";
import { NavLink } from "react-router";
import Patient from "./Patient";
const FirstDiv = () => {
  return (
    <div className="flex-2">
      <div className="bg-gray-100 p-6 rounded-xl">
        <div className="flex justify-between mb-6 pb-3 border-b-2 border-gray-300 items-center">
          <h1 className="text-2xl text-gray-800">Today's Schedule</h1>
          <NavLink
            to={"#"}
            className={"text-sm text-blue-500 hover:text-blue-400"}
          >
            View Calender
          </NavLink>
        </div>
        <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
          <Card
            title="Patient: Dr. Sarah Johnson"
            status="confirmed"
            color="blue"
            logo={<FaRegClock />}
          >
            <p>Cardiology</p>
            <p>10:00</p>
          </Card>
          <Card
            title="Patient: Dr. Emily Rodriguez"
            status="pending"
            color="blue"
            logo={<FaRegClock />}
          >
            <p>Pediatrics</p>
            <p>14:00</p>
          </Card>
          <Card
            title="Patient: Dr. Michael Chen"
            status="confirmed"
            color="blue"
            logo={<FaRegClock />}
          >
            <p>Neurology</p>
            <p>09:00</p>
          </Card>
        </div>
      </div>
      <div className="bg-gray-100 p-6 rounded-xl mt-6">
        <div className="flex justify-between mb-6 pb-3 border-b-2 border-gray-300 items-center">
          <h1 className="text-2xl text-gray-800">Scans Awaiting Review</h1>
          <NavLink
            to={"#"}
            className={"text-sm text-blue-500 hover:text-blue-400"}
          >
            View All
          </NavLink>
        </div>
        <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
          <Card
            title="CT Scan"
            status="pending"
            color="violet"
            logo={<LuFileSpreadsheet />}
          >
            <p>Patient ID:5235299259</p>
            <p>Uploaded</p>
          </Card>
        </div>
      </div>
      <div className="bg-gray-100 p-6 rounded-xl mt-6">
        <div className="flex justify-between mb-6 pb-3 border-b-2 border-gray-300 items-center">
          <h1 className="text-2xl text-gray-800">Recent Patients</h1>
          <NavLink
            to={"#"}
            className={"text-sm text-blue-500 hover:text-blue-400"}
          >
            View All
          </NavLink>
        </div>
        <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
          <Patient name="John Doe" />
          <Patient name="Mary Smith" />
          <Patient name="Robert Brown" />
        </div>
      </div>
    </div>
  );
};

export default FirstDiv;
