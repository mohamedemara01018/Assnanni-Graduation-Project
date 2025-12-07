import { NavLink } from "react-router";
import logo from "../../assets/logo.png";
import { BsArchive } from "react-icons/bs";
import { CiBellOn } from "react-icons/ci";
import { IoPersonCircleSharp } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";

const MainNavBar = () => {
  const registered: boolean = true;
  const notification: boolean = true;
  return (
    <div className="flex justify-between bg-white rounded-b-2xl px-4 py-1 items-center max-sm:py-3 shadow-2xl shadow-lime-900">
      <div>
        <NavLink to={"/"} className="flex cursor-pointer">
          <img
            src={logo}
            alt="logo"
            className="w-15 h-15 max-sm:w-10 max-sm:h-10"
          />
          <h1 className="text-3xl max-sm:text-xl font-semibold bg-linear-120 from-[#059d79] to-[#00ABEA] bg-clip-text text-transparent translate-2 max-sm:translate-1">
            Assnanii
          </h1>
        </NavLink>
      </div>
      {!registered && (
        <div className="flex gap-2">
          <NavLink to={"#"}>
            <button className="font-semibold hover:bg-gray-200 cursor-pointer py-2 px-4 rounded-full">
              Login
            </button>
          </NavLink>
          <NavLink to={"/registration"}>
            <button className="bg-blue-500 cursor-pointer py-2 px-4 rounded-lg hover:bg-blue-400 text-white font-semibold">
              Get Started
            </button>
          </NavLink>
        </div>
      )}
      {registered && (
        <div className="flex gap-4 max-sm:text-2xl text-3xl justify-around">
          <BsArchive className="text-blue-950 cursor-pointer" />
          <div className="flex relative cursor-pointer">
            <CiBellOn className="text-blue-950  stroke-1"></CiBellOn>
            {notification && (
              <div className="absolute w-2.5 h-2.5 rounded full right-1 top-0.5 bg-red-500"></div>
            )}
          </div>
          <div className="flex -translate-y-1 cursor-pointer">
            <IoPersonCircleSharp className="fill-blue-300 stroke-green-200 text-4xl max-sm:text-3xl" />
            <MdKeyboardArrowDown className="text-blue-950 translate-y-1 -translate-x-1" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainNavBar;
