import QuickAccess from "./QuickAccess";
import RecentActivity from "./RecentActivity";

const PatientDashboard = () => {
  return (
    <div className="bg-blue-200 rounded-r-md">
      <h1 className="text-4xl text-gray-800 font-bold p-6 font-sans py-8">
        Welcome back, John Doe.
      </h1>
      <div className="bg-gray-200 rounded-tr-2xl py-10 px-6 flex flex-col gap-6">
        <QuickAccess />
        <RecentActivity />
      </div>
    </div>
  );
};

export default PatientDashboard;
