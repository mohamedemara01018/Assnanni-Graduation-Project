import { useState, type ReactNode } from "react";
import TobNavbar from "../tob-navbar/TobNavbar";
import BottomBar from "../bottom-bar/BottomBar";
import SideBar from "../sidebar/SideBar";
import useMediaQuery from "@/hooks/useMediaQuery ";

interface DashboardLayoutProp {
  children: ReactNode;
  pageTitle: string;
}

function DashboardLayout({ children, pageTitle }: DashboardLayoutProp) {

  const [toggled, setToggle] = useState(false);
  const sidebarCollapsed = useMediaQuery("(max-width:768px)")

  function handleToggle() {
    setToggle(!toggled);
  }

  return (
    <div>
      <div>
        <div className="relative flex">
          {!sidebarCollapsed ? (
            <div
              className={`flex flex-col justify-between bg-(--color-surface) border border-(--color-border)  fixed bottom-0 top-0 left-0 h-screen  ${sidebarCollapsed ? "hidden" : `${toggled ? "w-20" : "w-60"}`
                }`}
            >
              <SideBar
                collapsed={sidebarCollapsed}
                toggled={toggled}
                onToggle={handleToggle}
              />
            </div>
          ) : (
            <BottomBar />
          )}

          <div
            className={`w-full ${sidebarCollapsed ? "" : `${toggled ? "ml-20" : "ml-60"}`
              } max-sm:m-auto `}
          >
            <div className="flex items-center justify-center h-16 border-b border-(--color-border) bg-(--color-surface)">
              <TobNavbar pageTitle={pageTitle} />
            </div>
            <main
              className={`py-8  wrapper  flex  flex-col gap-8 max-sm:pb-2 px-1 ${sidebarCollapsed ? "mb-20 max-sm:mb-11" : ""
                }`}
            >
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
