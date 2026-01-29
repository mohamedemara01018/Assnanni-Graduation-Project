import { LuFileSpreadsheet } from "react-icons/lu";
import { MdPeople } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { FaGraduationCap } from "react-icons/fa6";

const Card = () => {
  return (
    <>
      <div className="flex bg-(--color-surface) w-full p-6 rounded-2xl justify-between">
        <div className="flex flex-col gap-2">
          <div className="bg-blue-200 w-fit p-2 rounded-md ">
            <SlCalender className="fill-blue-700 text-xl " />
          </div>
          <p className="text-2xl text-(--color-text) font-normal">3</p>
          <p className="text-(--color-text-light) text-xs">Observations</p>
        </div>
        <div className="bg-blue-100 h-fit p-1 px-3 rounded-sm">
          <span className="text-xs font-normal  text-blue-700">Today</span>
        </div>
      </div>
      <div className="flex bg-(--color-surface) w-full p-6 rounded-2xl justify-between">
        <div className="flex flex-col gap-2">
          <div className="bg-green-200 w-fit p-2 rounded-md ">
            <MdPeople className="fill-green-700 text-2xl " />
          </div>
          <p className="text-2xl text-(--color-text) font-normal">128</p>
          <p className="text-(--color-text-light) text-xs">
            Patients (View Only)
          </p>
        </div>
        <div className="bg-green-200 h-fit p-1 px-3 rounded-sm">
          <span className="text-xs font-normal  text-green-700">+12%</span>
        </div>
      </div>
      <div className="flex bg-(--color-surface) w-full p-6 rounded-2xl justify-between">
        <div className="flex flex-col gap-2">
          <div className="bg-yellow-200 w-fit p-2 rounded-md ">
            <LuFileSpreadsheet className="text-yellow-700 text-2xl " />
          </div>
          <p className="text-2xl text-(--color-text) font-normal">1</p>
          <p className="text-(--color-text-light) text-xs">Scans to Study</p>
        </div>
        <div className="bg-yellow-200 h-fit p-1 px-3 rounded-sm">
          <span className="text-xs  text-yellow-700 font-normal">Pending</span>
        </div>
      </div>
      <div className="flex bg-(--color-surface) w-full p-6 rounded-2xl justify-between">
        <div className="flex flex-col gap-2">
          <div className="bg-violet-200 w-fit p-2 rounded-md ">
            <FaGraduationCap className="text-violet-700 text-2xl " />
          </div>
          <p className="text-2xl text-(--color-text) font-normal">95% </p>
          <p className="text-(--color-text-light) text-xs">Completion Rate</p>
        </div>
        <div className="bg-violet-200 h-fit p-1 px-3 rounded-sm">
          <span className="text-xs font-normal  text-violet-700">95%</span>
        </div>
      </div>
    </>
  );
};

export default Card;
