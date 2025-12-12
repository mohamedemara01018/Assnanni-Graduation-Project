import { FaStar } from "react-icons/fa";

type Props = {
  name: string;
  rate: number;
  img: string;
};

const Doctors = ({ name, rate, img }: Props) => {
  return (
    <div className="bg-gray-50 w-fit flex flex-col  rounded-xl cursor-pointer hover:scale-105 hover:shadow-md shadow-gray-600">
      <div className="  my-2">
        <img src={img} alt="doctor Image" className="rounded-t-xl w-full " />
      </div>
      <div className="flex gap-2 py-2 px-4 flex-col">
        <p className="text-lg font-semibold ">Dr. {name}</p>

        <p className="flex gap-1 text-lg font-semibold">
          <FaStar className="translate-y-0.5 fill-yellow-400 text-xl" />
          {rate.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default Doctors;
