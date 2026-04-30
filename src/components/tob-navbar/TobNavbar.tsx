import { IoIosNotificationsOutline } from "react-icons/io";
import SearchInput from "../search-input/SearchInput";
import { Link } from "react-router";
import ThemeToggle from "../theme-toggle/ThemeToggle";
import UserComp from "../user-comp/UserComp";
import { List } from "lucide-react";

interface TobNavbarProb {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  pageTitle: string;
}

function TobNavbar({ collapsed, setCollapsed, pageTitle }: TobNavbarProb) {
  return (
    <div className="wrapper flex items-center justify-between gap-2">
      <div className="flex justify-center items-center gap-4 text-xl text-(--color-text)  font-semibold">
        {collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="cursor-pointer p-2 hover:bg-(--color-bg-link-hover) rounded-xl transition duration-150"
          >
            <List />
          </button>
        )}
        <h1>{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-2 font-extrabold">
        <div className="max-lg:hidden ">
          <SearchInput />
        </div>
        <ThemeToggle />
        <Link
          to={"/notification"}
          className="relative p-2  hover:bg-(--color-bg-link-hover) rounded-lg text-2xl cursor-pointer"
        >
          <IoIosNotificationsOutline className="text-(--color-text)" />
          <span className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-2"></span>
        </Link>
        <UserComp />
      </div>
    </div>
  );
}

export default TobNavbar;
