import { reports } from "@/constants/doctorConstants";
import Card from "./Card";

const RecentReports = () => {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-900 font-bold text-lg">Recent Reports</h3>
        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors">
          View All
        </button>
      </div>
      <div className="space-y-1">
        {reports.map((report, index) => (
          <Card key={index} {...report} />
        ))}
      </div>
    </div>
  );
};

export default RecentReports;
