import { GoPulse } from "react-icons/go";
import { LuFileSpreadsheet } from "react-icons/lu";
import { MdPeople } from "react-icons/md";
import { SlCalender } from "react-icons/sl";

const Card = () => {
  return (
    <>
      <div className="flex bg-(--color-surface)   w-full p-6 rounded-2xl justify-between">
        <div className="flex flex-col gap-2">
          <div className="bg-(--color-primary-lighter) w-fit p-2 rounded-md ">
            <SlCalender className="text-(--color-primary) text-xl " />
          </div>
          <p className="text-2xl text-(--color-text) font-semibold">3</p>
          <p className="text-(--color-text-light) text-xs">Appointments</p>
        </div>
        <div className="bg-(--color-primary-lighter) h-fit p-0.5 px-1 rounded-lg">
          <span className="text-xs  text-(--color-primary)">Today</span>
        </div>
      </div>
      <div className="flex bg-(--color-surface) w-full p-6 rounded-2xl justify-between">
        <div className="flex flex-col gap-2">
          <div className="bg-green-100 w-fit p-2 rounded-md ">
            <MdPeople className="fill-green-700 text-2xl " />
          </div>
          <p className="text-2xl text-(--color-text) font-semibold">128</p>
          <p className="text-(--color-text-light) text-xs ">Total Patients</p>
        </div>
        <div className="bg-green-100 h-fit p-0.5 px-1 rounded-lg">
          <span className="text-xs  text-green-700">+12%</span>
        </div>
      </div>
      <div className="flex bg-(--color-surface) w-full p-6 rounded-2xl justify-between">
        <div className="flex flex-col gap-2">
          <div className="bg-yellow-100 w-fit p-2 rounded-md ">
            <LuFileSpreadsheet className="text-yellow-700 text-2xl " />
          </div>
          <p className="text-2xl text-(--color-text) font-semibold">1</p>
          <p className="text-(--color-text-light) text-xs">Scan Reviews</p>
        </div>
        <div className="bg-yellow-100 h-fit p-0.5 px-1 rounded-lg">
          <span className="text-xs  text-yellow-700">Pending</span>
        </div>
      </div>
      <div className="flex bg-(--color-surface) w-full p-6 rounded-2xl justify-between">
        <div className="flex flex-col gap-2">
          <div className="bg-violet-100 w-fit p-2 rounded-md ">
            <GoPulse className="text-violet-700 text-2xl " />
          </div>
          <p className="text-2xl text-(--color-text) font-semibold">95% </p>
          <p className="text-(--color-text-light) text-xs">Satisfaction</p>
        </div>
        <div className="bg-violet-100 h-fit p-0.5 px-1 rounded-lg">
          <span className="text-xs  text-violet-700">95%</span>
        </div>
      </div>
    </>
  );
};

export default Card;
