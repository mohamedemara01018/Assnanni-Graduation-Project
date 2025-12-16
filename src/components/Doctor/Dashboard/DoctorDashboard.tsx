import Card from "./Card";
import FirstDiv from "./FirstDiv/FirstDiv";
import SecondDiv from "./SecondDiv/SecondDiv";

const DoctorDashboard = () => {
  return (
    <div className="bg-gray-200 rounded-r-md pb-6">
      <h1 className="text-2xl text-gray-800 font-bold p-6 font-sans pt-7 pb-2 ">
        Welcome, Dr. John Doe!
      </h1>
      <p className="p-6 pt-0 text-gray-600 font-medium text-sm text-shadow-2xs">
        Here's your practice overview for today
      </p>
      <div className="bg-gray-200 rounded-tr-2xl py-2 px-6 flex flex-col gap-6">
        <div className="grid grid-rows-1 grid-cols-4 max-lg:grid-rows-2 max-lg:grid-cols-2 gap-4">
          <Card />
        </div>
        <div className="flex gap-6 max-md:flex-col">
          <FirstDiv />
          <SecondDiv />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
