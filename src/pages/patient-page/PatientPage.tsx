import CardComp from "@/components/card-comp/CardComp";
import { AiOutlineSchedule } from "react-icons/ai";
import { Link, NavLink } from "react-router";
import { FiLogOut } from "react-icons/fi";
import SideBar from "@/components/sidebar/PatientSideBar";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { MdOutlineStar } from "react-icons/md";
const appointments = [
  {
    id: 1,
    doctorName: "dr. sarah johnson",
    specialty: "cardiology",
    date: "2025-12-15",
    time: "10:00",
    status: "confirmed",
  },
  {
    id: 2,
    doctorName: "dr. emily rodriguez",
    specialty: "pediatrics",
    date: "2025-12-18",
    time: "14:00",
    status: "pending",
  },
];

function PatientPage() {
  return (
    <DashboardLayout pageTitle={"Patient dashboard"}>
      <>
        <div>
          <h1 className="text-3xl text-(--color-text)">Welcome Back, John</h1>
          <p className=" text-(--color-text-light)">
            Here's your health dashboard overview
          </p>
        </div>

        <div className="flex gap-8 max-lg:flex-col">
          <div className="flex flex-col gap-6 flex-1 lg:flex-5 ">
            <CardComp>
              <div className="flex items-center justify-between gap-4 w-full">
                <h2 className="text-xl">Upcoming Appointments</h2>
                <Link
                  to={"/"}
                  className="text-(--color-primary) hover:text-(--color-primary-light) transition duration-200"
                >
                  Book New
                </Link>
              </div>
              <div className=" flex flex-col gap-3 w-full">
                <Link
                  to={"/"}
                  className="flex items-center justify-between gap-4 p-4 bg-(--color-bg-link)  hover:bg-(--color-bg-link-hover) rounded-md transition duration-150"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex items-center justify-center bg-(--color-bg-blue) text-(--color-text-blue) w-15 h-15 rounded-full max-sm:hidden">
                      <AiOutlineSchedule className="text-3xl " />
                    </div>
                    <div>
                      <h3 className="text-(--color-text)">mohamed gamal</h3>
                      <p className="text-(--color-text-light) text-sm">
                        software engineer
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-(--color-text-light) ">
                          2025-10-1
                        </span>
                        <span className="bg-(--color-text-light) w-1 h-1 rounded-full"></span>
                        <span className="text-(--color-text-light)">2 pm </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-green-500 bg-green-500/20 px-3 pb-1 rounded-2xl text-sm flex items-center">
                    pending
                  </div>
                </Link>

                <Link
                  to={"/"}
                  className="flex items-center justify-between gap-4 p-4 bg-(--color-bg-link)  hover:bg-(--color-bg-link-hover) rounded-md transition duration-150"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex items-center justify-center bg-(--color-bg-blue) text-(--color-text-blue) w-15 h-15 rounded-full max-sm:hidden">
                      <AiOutlineSchedule className=" text-3xl " />
                    </div>
                    <div>
                      <h3 className="text-(--color-text)">mohamed gamal</h3>
                      <p className="text-(--color-text-light) text-sm">
                        software engineer
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-(--color-text-light) ">
                          2025-10-1
                        </span>
                        <span className="bg-(--color-text-light) w-1 h-1 rounded-full"></span>
                        <span className="text-(--color-text-light)">2 pm </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-green-500 bg-green-500/20 px-3 pb-1 rounded-2xl text-sm flex items-center">
                    pending
                  </div>
                </Link>

                <Link
                  to={"/"}
                  className="flex items-center justify-between gap-4 p-4 bg-(--color-bg-link)  hover:bg-(--color-bg-link-hover) rounded-md transition duration-150"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex items-center justify-center bg-(--color-bg-blue) text-(--color-text-blue) w-15 h-15 rounded-full max-sm:hidden">
                      <AiOutlineSchedule className=" text-3xl " />
                    </div>
                    <div>
                      <h3 className="text-(--color-text)">mohamed gamal</h3>
                      <p className="text-(--color-text-light) text-sm">
                        software engineer
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-(--color-text-light) ">
                          2025-10-1
                        </span>
                        <span className="bg-(--color-text-light) w-1 h-1 rounded-full"></span>
                        <span className="text-(--color-text-light)">2 pm </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-green-500 bg-green-500/20 px-3 pb-1 rounded-2xl text-sm flex items-center">
                    pending
                  </div>
                </Link>
              </div>
            </CardComp>
            <CardComp>
              <div className="flex items-center justify-between gap-4 w-full">
                <h2 className="text-xl">Available Doctors</h2>
                <Link
                  to={"/"}
                  className="text-(--color-primary) hover:text-(--color-primary-light) transition duration-200"
                >
                  View All
                </Link>
              </div>
              <div className=" flex flex-col gap-3 w-full">
                <Link
                  to={"/"}
                  className="flex items-center justify-between gap-4 p-4 bg-(--color-bg-link)  hover:bg-(--color-bg-link-hover) rounded-md transition duration-150"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex items-center justify-center bg-(--color-bg-blue) text-(--color-text-blue) w-15 h-15 rounded-full max-sm:hidden overflow-hidden">
                      <img
                        src="https://images.pexels.com/photos/7598696/pexels-photo-7598696.jpeg"
                        className="object-cover w-full h-full"
                        alt="D"
                      />
                    </div>
                    <div>
                      <h3 className="text-(--color-text)">mohamed gamal</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-(--color-text-light) flex items-center gap-1  ">
                          <MdOutlineStar /> 4.1
                        </span>
                        <span className="bg-(--color-text-light) w-1 h-1 rounded-full"></span>
                        <span className="text-(--color-text-light)">
                          12 exp{" "}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-green-500 bg-green-500/20 px-3 pb-1 rounded-2xl text-sm flex items-center">
                    available
                  </div>
                </Link>
                <Link
                  to={"/"}
                  className="flex items-center justify-between gap-4 p-4 bg-(--color-bg-link)  hover:bg-(--color-bg-link-hover) rounded-md transition duration-150"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex items-center justify-center bg-(--color-bg-blue) text-(--color-text-blue) w-15 h-15 rounded-full max-sm:hidden overflow-hidden">
                      <img
                        src="https://images.pexels.com/photos/7598696/pexels-photo-7598696.jpeg"
                        className="object-cover w-full h-full"
                        alt="D"
                      />
                    </div>
                    <div>
                      <h3 className="text-(--color-text)">mohamed gamal</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-(--color-text-light) flex items-center gap-1">
                          <MdOutlineStar /> 4.1
                        </span>
                        <span className="bg-(--color-text-light) w-1 h-1 rounded-full"></span>
                        <span className="text-(--color-text-light)">
                          12 exp{" "}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-green-500 bg-green-500/20 px-3 pb-1 rounded-2xl text-sm flex items-center">
                    available
                  </div>
                </Link>{" "}
                <Link
                  to={"/"}
                  className="flex items-center justify-between gap-4 p-4 bg-(--color-bg-link)  hover:bg-(--color-bg-link-hover) rounded-md transition duration-150"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex items-center justify-center bg-(--color-bg-blue) text-(--color-text-blue) w-15 h-15 rounded-full max-sm:hidden overflow-hidden">
                      <img
                        src="https://images.pexels.com/photos/7598696/pexels-photo-7598696.jpeg"
                        className="object-cover w-full h-full"
                        alt="D"
                      />
                    </div>
                    <div>
                      <h3 className="text-(--color-text)">mohamed gamal</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-(--color-text-light) flex items-center gap-1  ">
                          <MdOutlineStar /> 4.1
                        </span>
                        <span className="bg-(--color-text-light) w-1 h-1 rounded-full"></span>
                        <span className="text-(--color-text-light)">
                          12 exp{" "}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-green-500 bg-green-500/20 px-3 pb-1 rounded-2xl text-sm flex items-center">
                    available
                  </div>
                </Link>
              </div>
            </CardComp>
          </div>

          <div className="flex flex-1 max-md:flex-wrap lg:flex-2 lg:flex-col gap-4 ">
            <CardComp>
              <h2 className="text-(--color-text) text-xl">Quich Actions</h2>
              <div className="flex flex-col gap-3 items-center w-full">
                <Link
                  to={"/doctors"}
                  className="flex flex-col  items-start justify-between py-1.5 px-3 rounded-lg text-(--color-text-blue) bg-(--color-bg-blue) w-full hover:shadow-sm"
                >
                  <h3 className="">Find a Doctor</h3>
                  <span className="text-[12px] text-(--color-text-light)">
                    Search and book
                  </span>
                </Link>
                <Link
                  to={"/doctors"}
                  className="flex flex-col  items-start justify-between py-1.5 px-3 rounded-lg text-(--color-text-blue) bg-(--color-bg-blue) w-full hover:shadow-sm"
                >
                  <h3 className="">Upload Scan</h3>
                  <span className="text-[12px] text-(--color-text-light)">
                    AI-assisted analysis
                  </span>
                </Link>
                <Link
                  to={"/doctors"}
                  className="flex flex-col  items-start justify-between py-1.5 px-3 rounded-lg text-(--color-text-blue) bg-(--color-bg-blue) w-full hover:shadow-sm"
                >
                  <h3 className="">My Prescriptions</h3>
                  <span className="text-[12px] text-(--color-text-light)">
                    View medications
                  </span>
                </Link>
              </div>
            </CardComp>

            <CardComp>
              <h2 className="text-(--color-text) text-xl">Recent Activity</h2>
              <div className="flex flex-col gap-3 items-center w-full">
                <div className="flex gap-3 items-center justify-between text-(--color-text-light) w-full">
                  <h3 className="">Total Appointments</h3>
                  <span>12</span>
                </div>
                <div className="flex gap-3 items-center justify-between text-(--color-text-light) w-full">
                  <h3 className="">Total Appointments</h3>
                  <span>12</span>
                </div>
                <div className="flex gap-3 items-center justify-between text-(--color-text-light) w-full">
                  <h3 className="">Total Appointments</h3>
                  <span>12</span>
                </div>
              </div>
            </CardComp>
            <div className="flex flex-col items-start gap-2 p-6  w-full bg-linear-to-br from-blue-600 to-blue-800 rounded-xl text-white shadow">
              <h3 className="text-lg">Health Tip of the Day</h3>
              <p className="text-sm text-blue-100">
                Stay hydrated! Aim to drink at least 8 glasses of water daily
                for optimal health.
              </p>
            </div>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}

export default PatientPage;
