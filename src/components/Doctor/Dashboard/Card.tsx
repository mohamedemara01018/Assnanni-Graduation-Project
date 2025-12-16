import { GoPulse } from "react-icons/go";
import { LuFileSpreadsheet } from "react-icons/lu";
import { MdPeople } from "react-icons/md";
import { SlCalender } from "react-icons/sl";

const Card = () => {
  return (
    <>
      <div className="flex bg-gray-100 w-full p-6 rounded-2xl justify-between">
        <div className="flex flex-col gap-2">
          <div className="bg-blue-200 w-fit p-2 rounded-md ">
            <SlCalender className="fill-blue-700 text-xl " />
          </div>
          <p className="text-2xl font-semibold">3</p>
          <p className="text-gray-500 text-sm">Appointments</p>
        </div>
        <div className="bg-blue-200 h-fit p-0.5 px-1 rounded-lg">
          <span className="text-sm  text-blue-700">Today</span>
        </div>
      </div>
      <div className="flex bg-gray-100 w-full p-6 rounded-2xl justify-between">
        <div className="flex flex-col gap-2">
          <div className="bg-green-200 w-fit p-2 rounded-md ">
            <MdPeople className="fill-green-700 text-2xl " />
          </div>
          <p className="text-2xl font-semibold">128</p>
          <p className="text-gray-500 text-sm">Total Patients</p>
        </div>
        <div className="bg-green-200 h-fit p-0.5 px-1 rounded-lg">
          <span className="text-sm  text-green-700">+12%</span>
        </div>
      </div>
      <div className="flex bg-gray-100 w-full p-6 rounded-2xl justify-between">
        <div className="flex flex-col gap-2">
          <div className="bg-yellow-200 w-fit p-2 rounded-md ">
            <LuFileSpreadsheet className="text-yellow-700 text-2xl " />
          </div>
          <p className="text-2xl font-semibold">1</p>
          <p className="text-gray-500 text-sm">Scan Reviews</p>
        </div>
        <div className="bg-yellow-200 h-fit p-0.5 px-1 rounded-lg">
          <span className="text-sm  text-yellow-700">Pending</span>
        </div>
      </div>
      <div className="flex bg-gray-100 w-full p-6 rounded-2xl justify-between">
        <div className="flex flex-col gap-2">
          <div className="bg-violet-200 w-fit p-2 rounded-md ">
            <GoPulse className="text-violet-700 text-2xl " />
          </div>
          <p className="text-2xl font-semibold">95% </p>
          <p className="text-gray-500 text-sm">Satisfaction</p>
        </div>
        <div className="bg-violet-200 h-fit p-0.5 px-1 rounded-lg">
          <span className="text-sm  text-violet-700">95%</span>
        </div>
      </div>
    </>
  );
};

export default Card;
