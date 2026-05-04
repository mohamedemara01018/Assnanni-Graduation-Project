import Overview from "./Overview";
import QuickActions from "./QuickActions";
import ReminderCard from "./ReminderCard";
const SecondDiv = () => {
  return (
    <div className="flex-1 flex flex-col gap-8 w-full">
      <QuickActions />
      <ReminderCard />
      <Overview />
    </div>
  );
};

export default SecondDiv;
