import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Center from "./Center";
import Insights from "./Insights";

const Reports = () => {
  return (
    <DashboardLayout pageTitle={"Doctor Reports"}>
      <div className="p-4 -ml-6 -mt-6">
        <h1 className="text-2xl text-gray-700 font-semibold mb-2">
          Reports & Analytics
        </h1>
        <h3 className="text-gray-700 mb-8">
          View system insights and generate reports
        </h3>
        <Insights />
        <Center />
      </div>
    </DashboardLayout>
  );
};

export default Reports;
