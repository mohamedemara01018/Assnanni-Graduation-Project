import { IoEyeOutline } from "react-icons/io5";
import { BsFileMedical } from "react-icons/bs";
import { MdOutlineMessage } from "react-icons/md";

interface Props {
  title: string;
  phone: string;
  age: number;
  gender: "Male" | "Female";
  status: "Active" | "Inactive" | "Pending";
  lastVisit: string;
  doctor: string;
}

const PatientsTable = ({
  title,
  phone,
  age,
  gender,
  status,
  lastVisit,
  doctor,
}: Props) => {
  return (
    <>
      <tr className="px-4 py-4 bg-(--color-surface) border-b border-gray-300">
        <td className="px-4 pl-8 py-6 text-left">
          <div>
            <h3 className="text-base text-(--color-text) font-semibold    ">
              {title}
            </h3>
            <p className="text-xs font-thin text-(--color-text-light)">
              {phone}
            </p>
          </div>
        </td>

        <td className="text-left px-4  py-6">
          <div>
            <h3 className="text-base text-(--color-text) font-medium">
              {age} yrs
            </h3>
            <p className="text-sm text-(--color-text-light) font-thin ">
              {gender}
            </p>
          </div>
        </td>

        <td className="text-left px-4  py-6">
          <div
            className={`  text-sm text-thin w-fit rounded-2xl px-4 py-1 ${
              status === "Active"
                ? "bg-green-100 text-green-600"
                : status === "Pending"
                ? "bg-orange-100 text-orange-600"
                : "bg-gray-100 text-(--color-text-light)"
            }`}
          >
            <span>{status}</span>
          </div>
        </td>

        <td className="text-left px-4  py-6 font-medium text-base text-(--color-text)">
          {lastVisit}
        </td>

        <td className="text-left px-4  py-6 text-base font-medium text-(--color-text)">
          {doctor}
        </td>

        <td className="text-left px-4  py-6">
          <div className="flex  justify-around gap-2   items-center">
            <IoEyeOutline className="text-xl  text-blue-500 cursor-pointer" />
            <BsFileMedical className="text-xl  text-green-500 cursor-pointer" />
            <MdOutlineMessage className="text-xl  text-violet-500 cursor-pointer" />
          </div>
        </td>
      </tr>
    </>
  );
};

export default PatientsTable;
