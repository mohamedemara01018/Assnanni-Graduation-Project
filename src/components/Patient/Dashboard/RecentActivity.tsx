import { FaRegCalendarCheck } from "react-icons/fa";
import { MdChat } from "react-icons/md";
import { BsRobot } from "react-icons/bs";

const RecentActivity = () => {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 py-4 mt-4 flex flex-col gap-6">
      <h3 className="text-2xl font-semibold text-gray-800">Recent Activity</h3>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <div className="p-3 w-fit bg-linear-30 from-blue-600 to-cyan-300 rounded-2xl">
            <FaRegCalendarCheck className="text-3xl fill-gray-50" />
          </div>
          <p className="text-[1.1rem] text-gray-800 font-[400]">
            Appointment with Dr. Sarah Lee Completed - Dec 4
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="p-3 w-fit bg-linear-30 from-blue-600 to-cyan-300 rounded-2xl">
            <MdChat className="text-3xl fill-gray-50" />
          </div>
          <p className="text-[1.1rem] text-gray-800 font-[400]">
            Feedback given for visit - Dec 4
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="p-3 w-fit bg-linear-30 from-blue-600 to-cyan-300 rounded-2xl">
            <BsRobot className="text-3xl fill-gray-50" />
          </div>
          <p className="text-[1.1rem] text-gray-800 font-[400]">
            Ai Report Generated - Dec 3
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
