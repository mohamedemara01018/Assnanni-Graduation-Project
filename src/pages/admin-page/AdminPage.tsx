import CardComp from "@/components/card-comp/CardComp";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import StatCard from "@/components/statical-card/StaticalCard";
import {
  AlertCircle,
  Calendars,
  CheckCircle,
  FileText,
  ShieldCheck,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAdminSummary,
  selectSummary,
  type SummaryState,
} from "@/store/slices/admin-slice/summary-slice/SummarySlice";
import { useEffect } from "react";
import type { AppDispatch } from "@/store/store";
import { ScaleLoader } from "react-spinners";
import Error from "@/components/error/Error";
import { fetchPendingDoctor, selectPendingDoctor, type pendingDoctorInterface } from "@/store/slices/admin-slice/pending-doctor-slice/pendingDoctorSlice";
import { toast } from "react-toastify";
import { getTimeAgo } from "@/lib/utils";


function AdminPage() {
  const dispatch: AppDispatch = useDispatch();
  const { data, loading, error } =
    useSelector(selectSummary) as SummaryState;

  const { pendingDoctor } =
    useSelector(selectPendingDoctor) as pendingDoctorInterface;

  console.log("pending doctor", pendingDoctor);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchAdminSummary()),
          dispatch(fetchPendingDoctor()),
        ]);
      } catch (error: any) {
        console.error(error);

        const errorMessage =
          (typeof error === "string"
            ? error
            : error.message) ||
          "Failed to fetch summary & pending doctors";

        toast.error(errorMessage);
      }
    };

    fetchData();
  }, [dispatch]);

  const totalUser = data
    ? data.totalDoctors +
    data.totalPatients +
    data.totalReceptionists +
    data.totalStudents
    : 0;

  // const now = new Date().;

  // console.log(now);



  return (
    <DashboardLayout pageTitle="Admin page">
      <>
        <div>
          <div className="flex gap-3 items-end">
            <h1 className="text-3xl text-(--color-text)">Welcome Back, John</h1>
            <div className="flex gap-1 bg-red-100 px-3 py-0.5 text-red-400  rounded-full">
              <ShieldCheck className="w-5" />
              <span className="text-sm">Admin</span>
            </div>
          </div>
          <p className=" text-(--color-text-light)">
            Here's your health dashboard overview
          </p>
        </div>
        {loading ? (
          <div className="w-full  flex items-center justify-center">
            <ScaleLoader color="#6d61ff" />{" "}
          </div>
        ) : error ? (
          <Error message={error} />
        ) : (
          <div className="grid max-sm:grid-cols-2 grid-cols-4 gap-4">
            <StatCard
              Icon={Users}
              TrendIcon={TrendingUp}
              trendValue="5"
              label="Total User"
              value={totalUser}
              colorClass="text-blue-500 bg-blue-200"
            />
            <StatCard
              Icon={ShieldCheck}
              TrendIcon={TrendingUp}
              trendValue="5"
              label="Active Doctors"
              value={Number(data?.totalVerified)}
              colorClass="text-green-500 bg-green-200"
            />
            <StatCard
              Icon={Calendars}
              TrendIcon={TrendingUp}
              trendValue="5"
              label="Appointments Today"
              value={Number(data?.appointmentsToday)}
              colorClass="text-purple-500 bg-purple-200"
            />
            <StatCard
              Icon={FileText}
              TrendIcon={TrendingUp}
              trendValue="5"
              label="Total Scans"
              value={1234}
              colorClass="text-orange-500 bg-orange-200"
            />
          </div>
        )}

        <div className="flex max-md:flex-col gap-6">
          <CardComp classProbs="flex-2">
            <div className="flex justify-between w-full">
              <h2 className="text-lg">Pending Doctor Verifications</h2>
              <Link
                to={"/verify-doctors"}
                className="text-(--color-text-blue) hover:scale-110 transition duration-150"
              >
                View all
              </Link>
            </div>
            <hr className="w-full" />

            {
              loading ?
                <div className="w-full  flex items-center justify-center">
                  <ScaleLoader color="#6d61ff" />{" "}
                </div>
                : error ? <Error message={error} /> :
                  (<div className="w-full space-y-4">

                    {
                      pendingDoctor && pendingDoctor.length == 0 ? <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">No verifications found</p>
                      </div> :
                        pendingDoctor && pendingDoctor.map((doctor) => {
                          return <div key={doctor.id} className="flex justify-between items-center bg-(--color-bg-link) hover:bg-(--color-bg-link-hover) p-4 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="w-15 h-15 rounded-full overflow-hidden flex justify-center items-center bg-(--color-primary) text-white">
                                {
                                  doctor.imageUrl ?
                                    <img
                                      src={doctor.imageUrl}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    /> : <span className="text-3xl font-bold">{doctor.fullName.charAt(0).toUpperCase()}</span>
                                }
                              </div>
                              <div>
                                <h1 className="text-lg font-medium">{doctor.fullName}</h1>
                                <span className="block text-sm -mt-1">{doctor.specialization}</span>
                                <span className=" text-xs">
                                  {`1 documents . Submitted ${getTimeAgo(doctor.createdAt)}`}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Link to={'/verify-doctors'} className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                                <CheckCircle className="w-4 h-4" />
                              </Link>
                              <Link to={'/verify-doctors'} className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                                <XCircle className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        })
                    }


                  </div>)
            }

          </CardComp>

          <div className="space-y-4 flex-1">
            <CardComp>
              <h2>Quick Actions</h2>
              <div className="w-full space-y-4">
                <QuickActionComps
                  title="Verify Doctors"
                  subTitle={`${pendingDoctor.length} pending`}
                  classProbs="blue"
                  path="/verify-doctors"
                />
                <QuickActionComps
                  title="System Analtics"
                  subTitle="Analytics & insights"
                  classProbs="green"
                  path="/analytics"
                />
                {/* <QuickActionComps title="Verify Doctors" subTitle="3 pending" classProbs="red" path="/" /> */}
                <QuickActionComps
                  title="AI Models"
                  subTitle="Manage models"
                  classProbs="orange"
                  path="/ai-models"
                />
              </div>
            </CardComp>
            <CardComp>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Patients
                </span>
                <span className="text-sm text-gray-900 dark:text-white font-medium">
                  1,147
                </span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Active Sessions
                </span>
                <span className="text-sm text-gray-900 dark:text-white font-medium">
                  234
                </span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  API Calls Today
                </span>
                <span className="text-sm text-gray-900 dark:text-white font-medium">
                  45.2K
                </span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Storage Used
                </span>
                <span className="text-sm text-gray-900 dark:text-white font-medium">
                  756 GB
                </span>
              </div>
            </CardComp>
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}

export default AdminPage;

interface QuickActionCompsProbs {
  title: string;
  subTitle: string;
  classProbs: "blue" | "green" | "red" | "orange";
  path?: string;
}

const colorVariants = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30",
    title: "text-blue-900 dark:text-blue-300",
    sub: "text-blue-700 dark:text-blue-400",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30",
    title: "text-green-900 dark:text-green-300",
    sub: "text-green-700 dark:text-green-400",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30",
    title: "text-red-900 dark:text-red-300",
    sub: "text-red-700 dark:text-red-400",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30",
    title: "text-orange-900 dark:text-orange-300",
    sub: "text-orange-700 dark:text-orange-400",
  },
};

const QuickActionComps = ({
  title,
  subTitle,
  classProbs,
  path = "/",
}: QuickActionCompsProbs) => {
  const colors = colorVariants[classProbs];

  return (
    <Link
      to={path}
      className={`block p-3 rounded-lg transition-colors ${colors.bg}`}
    >
      <p className={`text-sm font-medium ${colors.title}`}>{title}</p>
      <p className={`text-xs mt-1 ${colors.sub}`}>{subTitle}</p>
    </Link>
  );
};
