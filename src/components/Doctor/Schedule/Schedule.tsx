import FirstDiv from "./FirstDiv/FirstDiv";
import SecondDiv from "./SecondDiv/SecondDiv";

const Schedule = () => {
  return (
    <div className="flex max-md:flex-col bg-gray-200">
      <div className="flex-2">
        <FirstDiv />
      </div>
      <div className="flex-1">
        <SecondDiv />
      </div>
    </div>
  );
};

export default Schedule;
