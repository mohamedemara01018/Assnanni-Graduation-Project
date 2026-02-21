import PatientQueueCard from "./PatientQueueCard";
import { NavLink } from "react-router";
import Patient from "./Patient";
import Card from "@/components/Doctor/Dashboard/FirstDiv/Card";
import { FaRegClock } from "react-icons/fa";
const FirstDiv = () => {
  return (
    <div className="flex-2">
      <div className="bg-(--color-surface) p-6 rounded-xl">
        <div className="flex justify-between mb-6 pb-3 border-b-2 border-gray-300 items-center">
          <h1 className="text-xl font-normal text-(--color-text)">
            Patient Queue
          </h1>
          <p className={"text-sm text-(--color-text-light) "}>2 waiting</p>
        </div>
        <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
          <PatientQueueCard title="Sarah Johnson" status="Waiting">
            <p className="text-base mt-1 mb-0.5">Dr. Williams</p>
            <p>Arrived: 09:15 AM</p>
          </PatientQueueCard>
          <PatientQueueCard title="Emily Rodriguez" status="In Progress">
            <p className="text-base mt-1 mb-0.5">Dr. Chen</p>
            <p>Arrived: 09:30 AM</p>
          </PatientQueueCard>
          <PatientQueueCard title="Michael Chen" status="Checked In">
            <p className="text-base mt-1 mb-0.5">Dr. Chen</p>
            <p>Arrived: 09:00 AM</p>
          </PatientQueueCard>
        </div>
      </div>
      <div className="bg-(--color-surface) p-6 rounded-xl mt-6">
        <div className="flex justify-between mb-6 pb-3 border-b-2 border-gray-300 items-center">
          <h1 className="text-xl font-normal text-(--color-text)">
            Today's Schedule
          </h1>
          <NavLink
            to={"#"}
            className={
              "text-sm text-(--color-primary) hover:text-(--color-primary-light)"
            }
          >
            View Calender
          </NavLink>
        </div>
        <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
          <Card
            title="Dr. Sarah Johnson"
            status="confirmed"
            color="blue"
            logo={<FaRegClock />}
          >
            <p>Cardiology</p>
            <p>10:00</p>
          </Card>
          <Card
            title="Dr. Emily Rodriguez"
            status="pending"
            color="blue"
            logo={<FaRegClock />}
          >
            <p>Pediatrics</p>
            <p>14:00</p>
          </Card>
          <Card
            title="Dr. Michael Chen"
            status="confirmed"
            color="blue"
            logo={<FaRegClock />}
          >
            <p>Neurology</p>
            <p>09:00</p>
          </Card>
        </div>
      </div>
      <div className="bg-(--color-surface) p-6 rounded-xl mt-6">
        <div className="flex justify-between mb-6 pb-3 border-b-2 border-gray-300 items-center">
          <h1 className="text-xl font-normal text-(--color-text)">
            Available Doctors
          </h1>
          <NavLink
            to={"#"}
            className={"text-sm text-blue-500 hover:text-blue-400"}
          >
            View All
          </NavLink>
        </div>
        <div className="flex flex-col gap-4 max-h-60 overflow-y-auto ">
          <Patient name="John Doe" status="busy" />
          <Patient name="Mary Smith" status="available" />
          <Patient name="Robert Brown" status="offline" />
        </div>
      </div>
    </div>
  );
};

export default FirstDiv;
