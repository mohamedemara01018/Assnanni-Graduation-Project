import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegClock } from "react-icons/fa6";
import { GrLocation } from "react-icons/gr";
import { IoVideocamOutline } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { NavLink } from "react-router";

interface Props {
  name: string;
  desc: string;
  date: string;
  time: string;
  meeting: "In-Person" | "View Call";
  address?: string;
  status: "Upcoming" | "Completed" | "Canceled";
}

function AppointmentsCard({
  name,
  desc,
  date,
  time,
  meeting,
  status,
  address,
}: Props) {
  const nameString: string[] = name.split(" ");
  const char: string =
    nameString[0][0].toUpperCase() + nameString[1][0].toUpperCase();

  return (
    <div className="bg-(--color-border) rounded-2xl p-4 flex gap-8">
      <div className="p-6 bg-linear-90 from-blue-500 to-green-500 w-14 h-14 flex justify-center items-center text-xl font-semibold text-(--color-text) rounded-full ">
        <div>{char}</div>
      </div>
      <div className="flex flex-col gap-4 w-full pr-4">
        <div className="flex justify-between">
          <div className="flex flex-col ">
            <h3 className="text-lg font-normal text-(--color-text)">{name}</h3>
            <p className="text-sm font-light text-(--color-text-light) -mt-1.5">
              {desc}
            </p>
          </div>
          <div className="flex gap-2 items-center justify-center">
            <div className="bg-blue-100 p-2 py-0.5 rounded-2xl text-blue-600  flex items-center gap-1 text-sm font-normal ">
              <FaRegClock />
              {status}
            </div>
            <BsThreeDotsVertical className="text-(--color-text-light) cursor-pointer" />
          </div>
        </div>
        <div className="flex gap-4 max-sm:grid max-sm:grid-cols-2">
          <div className="flex items-center gap-1 text-(--color-text-light) text-sm font-normal">
            <SlCalender />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1 text-(--color-text-light) text-sm font-normal">
            <FaRegClock />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1 text-(--color-text-light) text-sm font-normal">
            {meeting === "In-Person" ? <GrLocation /> : <IoVideocamOutline />}
            <span>{meeting}</span>
          </div>
          {meeting === "In-Person" && (
            <div className="flex items-center gap-1 text-(--color-text-light) text-sm font-normal">
              <GrLocation />
              <span>{address}</span>
            </div>
          )}
        </div>
        <div className="flex gap-4 text-sm">
          <NavLink
            to={"/"}
            className={
              "text-blue-500 hover:border-b border-blue-500 font-light hover:text-blue-500/90"
            }
          >
            View Details
          </NavLink>
          {status === "Upcoming" && (
            <div className="flex gap-4">
              {meeting === "View Call" && (
                <button className="text-green-500 hover:border-b border-green-500 font-light hover:text-green-500/90 cursor-pointer">
                  Join Video Call
                </button>
              )}
              <button className="text-(--color-text-light) font-light hover:border-b border-(--color-text-light) cursor-pointer">
                Reschedule
              </button>
              <button className="text-red-500 font-light hover:border-b border-red-500 cursor-pointer">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentsCard;
