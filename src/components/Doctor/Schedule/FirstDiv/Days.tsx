import { FaRegClock } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";

interface Props {
  day: string;
  time: string[];
}

const Days = ({ day, time }: Props) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <h3>{day}</h3>
      <div className="grid max-md:grid-cols-2 gap-4 md:grid-cols-3 max-sm:grid-cols-1">
        {time.length > 0 ? (
          time.map((item, index) => {
            return (
              <div
                key={index}
                className="flex justify-center items-center  gap-2 bg-blue-200/80 rounded-2xl p-2 cursor-pointer "
              >
                <FaRegClock className="text-xl text-blue-600 flex-1" />
                <span className="text-base text-blue-600 flex-2">{item}</span>
                <IoIosClose className="text-2xl text-blue-600 flex-1 " />
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-sm">No Available slots</p>
        )}
      </div>
    </div>
  );
};

export default Days;
