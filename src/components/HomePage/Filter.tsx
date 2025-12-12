import Governorates from "@/libs/Governorates";

const Filter = () => {
  return (
    <div className="filter">
      <div className=" flex flex-col  w-11/12 m-auto ">
        <h1 className="text-4xl text-white font-semibold mb-6  max-[1050px]:text-3xl max-sm:text-2xl">
          Welcome to dental clinic
        </h1>
        <div className=" bg-gray-300/40   px-10 max-w-full   py-7 rounded-sm flex items-center max-lg:px-6">
          <form className="flex justify-between px-6 max-[1050px]:flex-col max-[1050px]:gap-3 w-full max-lg:px-4">
            <input
              type="text"
              placeholder="Doctor Name"
              className="bg-gray-50 rounded-xl px-4 py-2  focus:outline-3 focus:shadow-lg shadow-gray-700 outline-gray-500 outline-offset-1"
            />
            <Governorates />
            <input
              type="text"
              placeholder="Location"
              className="bg-gray-50 rounded-xl px-4 py-2 focus:outline-3 focus:shadow-lg shadow-gray-700 outline-gray-500 outline-offset-1"
            />
            <button className="text-lg bg-blue-500/80 hover:bg-blue-500 px-6 py-2 rounded-lg font-semibold text-white  cursor-pointer">
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Filter;
