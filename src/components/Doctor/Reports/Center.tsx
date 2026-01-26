import PatientGrowth from "./PatientGrowth";
import RecentReports from "./RecentReports";

const Center = () => {
  return (
    <div className="flex max-md:flex-col">
      <div className="flex-2">
        <PatientGrowth />
      </div>
      <div className="flex-1">
        <RecentReports />
      </div>
    </div>
  );
};

export default Center;
