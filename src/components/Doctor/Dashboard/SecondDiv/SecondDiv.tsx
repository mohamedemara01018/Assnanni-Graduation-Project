import QuickActions from "./QuickActions";
import Verification from "./Verification ";
import Week from "./Week";
import { GrAlert } from "react-icons/gr";

const SecondDiv = () => {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <QuickActions />
      <Verification />
      <Week />
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 items-start">
        <GrAlert className="text-yellow-600 text-xl mt-0.5" />
        <div>
          <h3 className="text-yellow-800 font-semibold text-sm">Urgent Review</h3>
          <p className="text-yellow-700 text-xs mt-1">2 critical scans need immediate attention</p>
        </div>
      </div>
    </div>
  );
};

export default SecondDiv;
