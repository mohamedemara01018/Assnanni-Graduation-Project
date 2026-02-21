import Overview from "./Overview";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";

const SecondDiv = () => {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <QuickActions />
      <div className="flex flex-col gap-3 bg-(--color-surface) p-6 rounded-xl">
        <h1 className="text-xl font-normal mb-2 text-(--color-text) border-b-2 border-gray-300 pb-2">
          Recent Activity
        </h1>
        <div className="flex flex-col gap-2">
          <RecentActivity title="Patient Registered" color="bg-green-500">
            <span>John Doe</span>
            <div className="w-1 h-1 bg-gray-500 self-center rounded-full -mr-2 translate-y-0.3"></div>
            <span>5 min ago</span>
          </RecentActivity>
          <RecentActivity title="Appointment scheduled" color="bg-blue-500">
            <span>Sarah J.</span>
            <div className="w-1 h-1 bg-gray-500 self-center rounded-full -mr-2 translate-y-0.3"></div>
            <span>12 min ago</span>
          </RecentActivity>
          <RecentActivity title="Patient checked in" color="bg-violet-500">
            <span>John Doe</span>
            <div className="w-1 h-1 bg-gray-500 self-center rounded-full -mr-2 translate-y-0.3"></div>
            <span>18 min ago</span>
          </RecentActivity>
          <RecentActivity title="Appointment updated" color="bg-orange-500">
            <span>John Doe</span>
            <div className="w-1 h-1 bg-gray-500 self-center rounded-full -mr-2 translate-y-0.3"></div>
            <span>25 min ago</span>
          </RecentActivity>
        </div>
      </div>
      <Overview />
    </div>
  );
};

export default SecondDiv;
