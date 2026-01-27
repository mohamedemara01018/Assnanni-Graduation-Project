import Center from "./Center";
import Insights from "./Insights";

const Reports = () => {
  return (
    <div className="p-4 bg-gray-200">
      <h1 className="text-2xl text-gray-700 font-semibold mb-2">
        Reports & Analytics
      </h1>
      <h3 className="text-gray-700 mb-8">
        View system insights and generate reports
      </h3>
      <Insights />
      <Center />
    </div>
  );
};

export default Reports;
