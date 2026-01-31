import Card from "./Card";
import { FaRegClock } from "react-icons/fa6";
import { LuFileSpreadsheet } from "react-icons/lu";
import { NavLink } from "react-router";
import Patient from "./Patient";
import { CiLock } from "react-icons/ci";

const FirstDiv = () => {
  return (
    <div className="flex-2">
      <div className="bg-(--color-surface) p-6 rounded-xl">
        <div className="flex justify-between mb-6 pb-3 border-b-2 border-gray-300 items-center">
          <h1 className="text-xl flex items-center gap-2 text-(--color-text) ">
            Today's Observations
            <span className="text-xs max-sm:hidden"> (Supervised)</span>
          </h1>
          <NavLink
            to={"#"}
            className={"text-sm text-blue-500 hover:text-blue-400"}
          >
            View Calender
          </NavLink>
        </div>
        <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
          <Card
            title="Patient: Dr. Sarah Johnson"
            status="Observe Only"
            color="blue"
            logo={<FaRegClock />}
          >
            <p>Cardiology</p>
            <p>10:00</p>
          </Card>
          <Card
            title="Patient: Dr. Emily Rodriguez"
            status="Observe Only"
            color="blue"
            logo={<FaRegClock />}
          >
            <p>Pediatrics</p>
            <p>14:00</p>
          </Card>
          <Card
            title="Patient: Dr. Michael Chen"
            status="Observe Only"
            color="blue"
            logo={<FaRegClock />}
          >
            <p>Neurology</p>
            <p>09:00</p>
          </Card>
        </div>
      </div>
      <div className="bg-(--color-surface) p-6 rounded-xl mt-6">
        <div className="flex justify-between mb-6 pb-3 border-b-2 border-gray-300 items-center">
          <h1 className="text-xl text-(--color-text)">
            Scans for Learning
            <span className="text-xs ml-2 text-(--color-text-light) max-sm:hidden">
              (Educational Access)
            </span>
          </h1>
          <NavLink
            to={"#"}
            className={"text-sm text-blue-500 hover:text-blue-400"}
          >
            View All
          </NavLink>
        </div>
        <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
          <Card
            title="CT Scan"
            status="View & Learn"
            color="violet"
            logo={<LuFileSpreadsheet />}
          >
            <p>Patient ID:5235299259</p>
            <p>Uploaded</p>
          </Card>
        </div>
      </div>
      <div className="bg-(--color-surface) p-6 rounded-xl mt-6">
        <div className="flex justify-between mb-6 pb-3 border-b-2 border-gray-300 items-center">
          <h1 className="text-xl text-(--color-text) flex gap-2 items-center">
            Patient Cases <CiLock className="text-(--color-text-light) " />
          </h1>
          <NavLink
            to={"#"}
            className={"text-sm text-(--color-text-light) cursor-text"}
          >
            View Only
          </NavLink>
        </div>
        <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
          <Patient name="John Doe" />
          <Patient name="Mary Smith" />
          <Patient name="Robert Brown" />
        </div>
        <p className="bg-yellow-100 text-yellow-700 text-xs px-4 py-3 m-2 mt-6 rounded-2xl">
          🔒 Full patient records require supervisor authorization
        </p>
      </div>
    </div>
  );
};

export default FirstDiv;
