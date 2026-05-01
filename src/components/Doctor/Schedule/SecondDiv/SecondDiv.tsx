import QuickStats from "./QuickStats";
import RequestTimeOff from "./RequestTimeOff";

const SecondDiv = () => {
  return (
    <div className="flex flex-col gap-6">
      <QuickStats />
      <RequestTimeOff />
    </div>
  );
};

export default SecondDiv;
