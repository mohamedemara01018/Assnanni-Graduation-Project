import { NavLink } from "react-router";
import { IoMdPersonAdd } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import { LuCircleCheckBig } from "react-icons/lu";
import { SlCreditCard } from "react-icons/sl";

const QuickActions = () => {
  return (
    <div className="flex flex-col gap-3 bg-(--color-surface) p-6 rounded-xl ">
      <h1 className="text-xl font-normal mb-2 text-(--color-text) border-b-2 border-gray-300 pb-2">
        Quick Actions
      </h1>
      <NavLink
        to={"#"}
        className={"bg-blue-100 rounded-lg p-4 flex gap-2  items-center"}
      >
        <div className="bg-blue-600 text-white text-2xl flex justify-center items-center w-12 h-12 rounded-2xl">
          <IoMdPersonAdd />
        </div>
        <div>
          <h3 className="text-blue-800 font-normal">Register New Patient</h3>
          <p className="text-xs font-light text-blue-700">Add to system</p>
        </div>
      </NavLink>
      <NavLink
        to={"#"}
        className={"bg-green-100 rounded-lg p-4 flex gap-2 items-center"}
      >
        <div className="bg-green-600 text-white text-2xl flex justify-center items-center w-12 h-12 rounded-2xl">
          <SlCalender />
        </div>
        <div>
          <h3 className="text-green-800 font-normal">Schedule Appointments</h3>
          <p className="text-xs font-light text-green-700">Book for patient</p>
        </div>
      </NavLink>
      <NavLink
        to={"#"}
        className={"bg-violet-100 rounded-lg p-4 flex gap-2 items-center"}
      >
        <div className="bg-violet-600 text-white text-2xl flex justify-center items-center w-12 h-12 rounded-2xl">
          <LuCircleCheckBig />
        </div>
        <div>
          <h3 className="text-violet-800 font-normal">Check-In Patient</h3>
          <p className="text-xs font-light text-violet-700">Mark as arrived</p>
        </div>
      </NavLink>
      <NavLink
        to={"#"}
        className={"bg-orange-100 rounded-lg p-4 flex gap-2 items-center"}
      >
        <div className="bg-orange-600 text-white text-2xl flex justify-center items-center w-12 h-12 rounded-2xl">
          <SlCreditCard />
        </div>
        <div>
          <h3 className="text-orange-800 font-normal">Payment Methods</h3>
          <p className="text-xs font-light text-orange-700">
            Manage Patient payments
          </p>
        </div>
      </NavLink>
    </div>
  );
};

export default QuickActions;
