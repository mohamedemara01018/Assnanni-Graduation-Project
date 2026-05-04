import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Center from "../../../components/Doctor/Reports/Center";
import Insights from "../../../components/Doctor/Reports/Insights";
import GenerateReport from "../../../components/Doctor/Reports/GenerateReport";

const Reports = () => {
  return (
    <DashboardLayout pageTitle={"Doctor Reports"}>
      <div className="p-8 bg-gray-50/50 min-h-screen">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reports & Analytics
          </h1>
          <p className="text-gray-500 font-medium">
            View system insights and generate reports
          </p>
        </div>
        
        <Insights />
        <Center />
        <GenerateReport />
      </div>
    </DashboardLayout>
  );
};

export default Reports;
