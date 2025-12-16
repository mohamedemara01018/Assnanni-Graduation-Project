import QuickActions from "./QuickActions";
import Verification from "./Verification ";
import Week from "./Week";

const SecondDiv = () => {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <QuickActions />
      <Verification />
      <Week />
    </div>
  );
};

export default SecondDiv;
