import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Center from "../../../components/Doctor/Reports/Center";
import Insights from "../../../components/Doctor/Reports/Insights";

const Reports = () => {
  return (
    <DashboardLayout pageTitle={"Doctor Reports"}>
      <div className="p-4  -mt-6 bg-(--color-bg) rounded-2xl">
        <h1 className="text-2xl text-(--color-text) font-semibold mb-2">
          Reports & Analytics
        </h1>
        <h3 className="text-(--color-text-light) font-light text-sm mb-8">
          View system insights and generate reports
        </h3>
        <Insights />
        <Center />
      </div>
    </DashboardLayout>
  );
};

export default Reports;
