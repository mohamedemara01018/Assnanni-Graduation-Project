import Doctors from "./Doctors";
import doctorImage from "./../../assets/doctor.jpg";
const FeaturedDoctors = () => {
  return (
    <div className="bg-gray-300 p-4 mt-6 rounded-xl">
      <h1 className="text-3xl font-semibold text-gray-700 mt-8 mb-6">
        Featured Doctors
      </h1>
      <div className="grid grid-cols-5 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2 gap-5">
        <Doctors name={"Mohamed Amer"} rate={5} img={doctorImage} />
        <Doctors name={"Mohamed Amer"} rate={4.5} img={doctorImage} />
        <Doctors name={"Mohamed Amer"} rate={4} img={doctorImage} />
        <Doctors name={"Mohamed Amer"} rate={3.5} img={doctorImage} />
        <Doctors name={"Mohamed Amer"} rate={3} img={doctorImage} />
        <Doctors name={"Mohamed Amer"} rate={2.5} img={doctorImage} />
        <Doctors name={"Mohamed Amer"} rate={2} img={doctorImage} />
        <Doctors name={"Mohamed Amer"} rate={1.5} img={doctorImage} />
        <Doctors name={"Mohamed Amer"} rate={1} img={doctorImage} />
      </div>
    </div>
  );
};

export default FeaturedDoctors;
