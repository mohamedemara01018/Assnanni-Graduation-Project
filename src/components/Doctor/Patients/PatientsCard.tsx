import { IoEyeOutline } from "react-icons/io5";
import { BsFileMedical } from "react-icons/bs";
import { MdOutlineMessage } from "react-icons/md";

interface Props {
  title: string;
  phone: string;
  age: number;
  gender: "Male" | "Female";
  status: "Active" | "InActive" | "Pending";
  lastVisit: string;
  doctor: string;
}

const PatientsCard = ({
  title,
  phone,
  age,
  gender,
  status,
  lastVisit,
  doctor,
}: Props) => {
  const firstChar = title.charAt(0);
  return (
    <div className="flex flex-col bg-(--color-surface) rounded-2xl p-6 px-10 gap-4 md:p-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="from-green-500 to-blue-500 bg-linear-90 p-3 rounded-full px-5.5 text-xl font-semibold text-white ">
            <span>{firstChar}</span>
          </div>
          <div>
            <h3 className="text-base text-(--color-text) font-medium">
              {title}
            </h3>
            <p className="text-xs font-thin text-(--color-text-light)">
              {phone}
            </p>
          </div>
        </div>
        <p
          className={`p-4 py-1 rounded-2xl ${
            status === "Pending"
              ? "bg-orange-100 text-orange-600 "
              : status === "Active"
              ? "bg-green-100 text-green-600 "
              : "bg-gray-100 text-gray-600 "
          }`}
        >
          <span>{status}</span>
        </p>
      </div>
      <div className="flex justify-between items-center pr-3">
        <p className="text-(--color-text-light)">Age:</p>
        <p className="text-(--color-text)">{age} years</p>
      </div>
      <div className="flex justify-between items-center pr-3">
        <p className="text-(--color-text-light)">Gender:</p>
        <p className="text-(--color-text)">{gender}</p>
      </div>
      <div className="flex justify-between items-center pr-3">
        <p className="text-(--color-text-light)">lastVisit:</p>
        <p className="text-(--color-text)">{lastVisit}</p>
      </div>
      <div className="flex justify-between items-center pr-3">
        <p className="text-(--color-text-light)">Assigned Doctor:</p>
        <p className="text-(--color-text)">{doctor}</p>
      </div>
      <div className="flex  justify-around gap-2   items-center mt-10 max-sm:grid max-sm:grid-col-2">
        <div className="flex gap-2 items-center text-blue-500 bg-blue-100 md:px-4 md:gap-1 px-8 py-2 rounded-2xl">
          <IoEyeOutline className="text-xl   cursor-pointer" />
          <span>View</span>
        </div>
        <div className="flex gap-2 items-center text-green-500 bg-green-100 md:px-4 md:gap-1 px-8 py-2 rounded-2xl">
          <BsFileMedical className="text-xl   cursor-pointer" />
          <span>History</span>
        </div>
        <div className="flex gap-2 items-center text-violet-500 bg-violet-100 md:px-4 md:gap-1 px-8 py-2 rounded-2xl">
          <MdOutlineMessage className="text-xl   cursor-pointer" />
          <span>Chat</span>
        </div>
      </div>
    </div>
  );
};

export default PatientsCard;
