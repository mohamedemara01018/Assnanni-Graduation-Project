import { FaRegCalendarCheck } from "react-icons/fa";
import doctorAvatar from "../../../assets/doctorAvatar.jfif";
import { IoIosArrowForward } from "react-icons/io";
import { LiaFileMedicalAltSolid } from "react-icons/lia";
import { BsRobot } from "react-icons/bs";
import { VscBellDot } from "react-icons/vsc";

import { NavLink } from "react-router";

const QuickAccess = () => {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Quick access
      </h3>
      <div className=" grid grid-cols-3 gap-6 grid-rows-2 max-h-[35rem] min-h-[25rem]">
        <div className="icon">
          <div>
            <FaRegCalendarCheck />
          </div>
          <h4>
            <NavLink to="#">Book Appointment</NavLink>
          </h4>
        </div>
        <div className="col-span-2 p-4 bg-gray-50 rounded-2xl">
          <h4 className="text-xl mb-4 font-semibold max-sm:text-lg">
            Upcoming Appointments
          </h4>
          <div className="flex gap-4 max-sm:gap-2">
            <div className="rounded-full p-4 ">
              <img
                src={doctorAvatar}
                alt="doctor avatar"
                className="w-15 h-15 rounded-full "
              />
            </div>
            <div className="flex justify-between w-full flex-1 translate-y-5 h-fit items-center ">
              <div>
                <p className="font-semibold text-lg max-sm:text-base">
                  Dr. Sarah lee
                </p>
                <p className="-translate-y-1 max-sm:text-sm">Dec 5, 10:00 AM</p>
              </div>
              <IoIosArrowForward className=" cursor-pointer self-center" />
            </div>
          </div>
        </div>
        <div className="icon">
          <div>
            <LiaFileMedicalAltSolid />
          </div>
          <h4>Medical History</h4>
          <NavLink to="#">View Records</NavLink>
        </div>
        <div className="icon">
          <div>
            <BsRobot />
          </div>
          <h4>AI Reports</h4>
          <NavLink to="#">new Analysis</NavLink>
        </div>
        <div className="icon">
          <div>
            <VscBellDot />
          </div>
          <h4>Notifications</h4>
          <NavLink to="#">3 Unread</NavLink>
        </div>
      </div>
    </div>
  );
};

export default QuickAccess;
