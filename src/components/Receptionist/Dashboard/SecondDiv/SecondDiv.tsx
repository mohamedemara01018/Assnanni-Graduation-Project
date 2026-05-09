import Overview from "./Overview";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";

const SecondDiv = () => {
  return (
    <div className="flex-1 flex flex-col gap-8 w-full">
      <QuickActions />
      <RecentActivity />
      <Overview />
    </div>
  );
};

export default SecondDiv;
