import PatientGrowth from "./PatientGrowth";
import RecentReports from "./RecentReports";

const Center = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
      <div className="xl:col-span-2">
        <PatientGrowth />
      </div>
      <div className="xl:col-span-1">
        <RecentReports />
      </div>
    </div>
  );
};

export default Center;
