import CardComp from "@/components/card-comp/CardComp";
import { Link } from "react-router";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { MdOutlineStar } from "react-icons/md";
import { Activity, Calendar, FileText, Pill, TrendingUp } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux'
import { fetchPatientDashboard, patientDashboardState, type DashboardState } from "@/store/slices/patient-slice/patient-dashboard-slice/patientDashboardSlice";
import type { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import Error from "@/components/error/Error";
import Loading from "@/components/loading/Loading";
import StatCard from "@/components/statical-card/StaticalCard";
import { NotFound } from "@/components/notfound/NotFound";

function PatientPage() {
  const dispatch: AppDispatch = useDispatch();
  const { data, loading, error }: DashboardState = useSelector(patientDashboardState)

  useEffect(() => {
    dispatch(fetchPatientDashboard());
  }, [dispatch])


  if (loading) {
    return <Loading />
  }
  if (error) {
    return < Error message={error} />
  }
  return (
    <DashboardLayout pageTitle={"Patient dashboard"}>
      <>
        <div>
          <h1 className="text-3xl text-(--color-text)">Welcome Back, John</h1>
          <p className=" text-(--color-text-light)">
            Here's your health dashboard overview
          </p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            Icon={Calendar}
            TrendIcon={TrendingUp}
            trendValue="+5"
            label="Upcoming"
            value={data.stats.upcomingAppointments}
            colorClass="text-green-500 bg-green-200"
          />

          <StatCard
            Icon={Pill}
            TrendIcon={TrendingUp}
            trendValue="+5"
            label="Prescriptions"
            value={data.stats.prescriptions}
            colorClass="text-green-500 bg-green-200"
          />
          <StatCard
            Icon={FileText}
            TrendIcon={TrendingUp}
            trendValue="+5"
            label="Records"
            value={data.stats.medicalRecords}
            colorClass="text-purple-500 bg-purple-200"
          />

          <StatCard
            Icon={Activity}
            TrendIcon={TrendingUp}
            trendValue="+5"
            label="Lab Results"
            value={data.stats.labResults}
            colorClass="text-orange-500 bg-orange-200"
          />
        </div>
        <div className="flex gap-8 max-lg:flex-col">
          <div className="flex flex-col gap-6 flex-1 lg:flex-5 ">
            <CardComp>
              <div className="flex items-center justify-between gap-4 w-full">
                <h2 className="text-xl">Upcoming Appointments</h2>
                <Link
                  to={"/doctors-list"}
                  className="text-(--color-primary) hover:text-(--color-primary-light) transition duration-200"
                >
                  Book New
                </Link>
              </div>
              <div className=" flex flex-col gap-3 w-full">

                {

                  data && data.upcomingAppointments.length <= 0 ? <NotFound subMessage={'there is not upcoming appointment'} />
                    : data.upcomingAppointments.map((appointment) => {
                      return (
                        <Link
                          to={`/appointments/${appointment.id}`}
                          className="flex items-center justify-between gap-4 p-4 bg-(--color-bg-link)  hover:bg-(--color-bg-link-hover) rounded-md transition duration-150"
                        >
                          <div className="flex items-center gap-4 w-full">
                            <div className="flex items-center justify-center bg-(--color-bg-blue) text-(--color-text-blue) w-15 h-15 rounded-full overflow-hidden max-sm:hidden">
                              <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="" />
                            </div>
                            <div>
                              <h3 className="text-(--color-text)">{appointment.doctorName}</h3>
                              <p className="text-(--color-text-light) text-sm">
                                {appointment.specialization}
                              </p>
                              <div className="flex items-center gap-4 mt-1 text-sm">
                                <span className="text-(--color-text-light) ">
                                  {appointment.date}
                                </span>
                                <span className="bg-(--color-text-light) w-1 h-1 rounded-full"></span>
                                <span className="text-(--color-text-light)">{appointment.startTime}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-green-500 bg-green-500/20 px-3 pb-1 rounded-2xl text-sm flex items-center">
                            {appointment.status}
                          </div>
                        </Link>
                      )
                    })
                }
              </div>
            </CardComp>
            <CardComp>
              <div className="flex items-center justify-between gap-4 w-full">
                <h2 className="text-xl">Available Doctors</h2>
                <Link
                  to={"/doctors-list"}
                  className="text-(--color-primary) hover:text-(--color-primary-light) transition duration-200"
                >
                  View All
                </Link>
              </div>
              <div className=" flex flex-col gap-3 w-full">
                {
                  data && data.availableDoctors.length <= 0 ? <NotFound subMessage={'There is no Available Doctors'} />
                    : data.availableDoctors.slice(0, 3).map((doctor) => {
                      return (
                        <Link
                          to={`/doctors-list/${doctor.id}`}
                          className="flex items-center justify-between gap-4 p-4 bg-(--color-bg-link)  hover:bg-(--color-bg-link-hover) rounded-md transition duration-150"
                        >
                          <div className="flex items-center gap-4 w-full">
                            <div className="flex items-center justify-center bg-(--color-bg-blue) text-(--color-text-blue) w-15 h-15 rounded-full max-sm:hidden overflow-hidden">
                              <img
                                src={`${doctor.imageUrl ? doctor.imageUrl : 'https://images.pexels.com/photos/7598696/pexels-photo-7598696.jpeg'}`}
                                className="object-cover w-full h-full"
                                alt="doctor image"
                              />
                            </div>
                            <div>
                              <h3 className="text-(--color-text)">{doctor.name}</h3>
                              <div className="flex items-center gap-4 mt-1 text-sm">
                                <span className="text-(--color-text-light) flex items-center gap-1  ">
                                  <MdOutlineStar /> {doctor.rating}
                                </span>
                                <span className="bg-(--color-text-light) w-1 h-1 rounded-full"></span>
                                <span className="text-(--color-text-light)">
                                  ${doctor.experienceYears} exp{" "}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-green-500 bg-green-500/20 px-3 pb-1 rounded-2xl text-sm flex items-center">
                            {doctor.status}
                          </div>
                        </Link>
                      )
                    })
                }
              </div>
            </CardComp>
          </div>

          <div className="flex flex-1 max-md:flex-wrap lg:flex-2 lg:flex-col gap-4 ">
            {/* Quick Actions */}
            <div className="bg-(--color-surface) rounded-xl border p-6">
              <h3 className="text-lg text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/doctors-list"
                  className="block p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <p className="text-sm text-blue-900 dark:text-blue-300 font-medium">Find a Doctor</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">Search and book</p>
                </Link>
                <Link
                  to="/scan/upload"
                  className="block p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <p className="text-sm text-green-900 dark:text-green-300 font-medium">Upload Scan</p>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">AI-assisted analysis</p>
                </Link>
                <Link
                  to="/Prescriptions"
                  className="block p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <p className="text-sm text-purple-900 dark:text-purple-300 font-medium">My Prescriptions</p>
                  <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">View medications</p>
                </Link>
                <Link
                  to="/payment-methods"
                  className="block p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <p className="text-sm text-orange-900 dark:text-orange-300 font-medium">Payment Methods</p>
                  <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">Manage cards</p>
                </Link>
              </div>
            </div>

            <CardComp>
              <h3 className="text-lg text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">Appointment confirmed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">Lab results uploaded</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">New prescription added</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">3 days ago</p>
                  </div>
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

