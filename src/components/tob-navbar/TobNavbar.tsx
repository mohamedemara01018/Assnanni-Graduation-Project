import SearchInput from "../search-input/SearchInput";
import { Link } from "react-router";
import ThemeToggle from "../theme-toggle/ThemeToggle";
import UserComp from "../user-comp/UserComp";
import { Bell, Heart, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface TobNavbarProb {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  pageTitle: string;
}

function TobNavbar({ collapsed, setCollapsed, pageTitle }: TobNavbarProb) {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const { data: unreadCountData } = useQuery({
    queryKey: ["unread-count"],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}Notification/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
    enabled: !!token && !!backendUrl,
    refetchInterval: 60000, // Refetch every minute to keep the indicator updated
  });

  const unreadCount = unreadCountData?.data || 0;

  return (
    <div className="wrapper flex items-center justify-between gap-2 ">
      <div className="flex justify-center items-center gap-4 text-xl text-(--color-text)  font-semibold max-sm:gap-2">
        {collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="cursor-pointer p-2 hover:bg-(--color-bg-link-hover) rounded-xl transition duration-150 max-sm:text-sm"
          >
            <List className="max-sm:text-sm" />
          </button>
        )}
        <h1 className="max-sm:text-[20px]">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-2 font-extrabold">
        <div className="max-lg:hidden ">
          <SearchInput />
        </div>
        <ThemeToggle />
        <Link
          to={"/favorites"}
          className="relative p-2  hover:bg-(--color-bg-link-hover) rounded-lg text-2xl cursor-pointer"
        >
          <Heart />
          {unreadCount > 0 && (
            <span className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-2"></span>
          )}
        </Link>
        <Link
          to={"/notification"}
          className="relative p-2  hover:bg-(--color-bg-link-hover) rounded-lg text-2xl cursor-pointer"
        >
          <Bell className="text-(--color-text)" />
          {unreadCount > 0 && (
            <span className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-2"></span>
          )}
        </Link>
        <UserComp />
      </div>
    </div>
  );
}

export default TobNavbar;
