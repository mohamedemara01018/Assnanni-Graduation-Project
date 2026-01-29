import { useEffect, useState, type ReactNode } from "react";
import PatientSideBar from "../sidebar/PatientSideBar";
import PatientBottomBar from "../bottom-bar/PatientBottomBar";
import TobNavbar from "../tob-navbar/TobNavbar";
import DoctorSideBar from "../sidebar/DoctorSideBar";
import DoctorBottomBar from "../bottom-bar/DoctorBottomBar";
import StudentDoctorSideBar from "../sidebar/StudentDoctorSideBar";
import StudentDoctorBottomBar from "../bottom-bar/StudentDoctorBottomBar";

interface DashboardLayoutProp {
  children: ReactNode;
  pageTitle: string;
}

function DashboardLayout({ children, pageTitle }: DashboardLayoutProp) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toggled, setToggle] = useState(false);
  const role: string = "doctor";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width:768px)");
    console.log(matchMedia);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (e: any) => {
      setSidebarCollapsed(e.matches);
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSidebarCollapsed(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  function handleToggle() {
    setToggle(!toggled);
  }
  return (
    <div>
      <div>
        <div className="relative flex dark">
          {!sidebarCollapsed ? (
            <div
              className={`flex flex-col justify-between bg-(--color-surface) border border-(--color-border)  fixed bottom-0 top-0 left-0 h-screen  ${
                sidebarCollapsed ? "hidden" : `${toggled ? "w-20" : "w-60"}`
              }`}
            >
              {role === "patient" ? (
                <PatientSideBar
                  collapsed={sidebarCollapsed}
                  toggled={toggled}
                  onToggle={handleToggle}
                />
              ) : role === "doctor" ? (
                <DoctorSideBar
                  collapsed={sidebarCollapsed}
                  toggled={toggled}
                  onToggle={handleToggle}
                />
              ) : role === "studentDoctor" ? (
                <StudentDoctorSideBar
                  collapsed={sidebarCollapsed}
                  toggled={toggled}
                  onToggle={handleToggle}
                />
              ) : (
                ""
              )}
            </div>
          ) : role === "patient" ? (
            <PatientBottomBar />
          ) : role === "doctor" ? (
            <DoctorBottomBar />
          ) : role === "studentDoctor" ? (
            <StudentDoctorBottomBar />
          ) : (
            ""
          )}

          <div
            className={`w-full ${
              sidebarCollapsed ? "" : `${toggled ? "ml-20" : "ml-60"}`
            } max-sm:m-auto`}
          >
            <div className="flex items-center justify-center h-16 border-b border-(--color-border) bg-(--color-surface)">
              <TobNavbar pageTitle={pageTitle} />
            </div>
            <div
              className={`py-6 wrapper flex  flex-col gap-8 ${
                sidebarCollapsed ? "mb-20" : ""
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
