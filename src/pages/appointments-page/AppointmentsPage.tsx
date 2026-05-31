import CardComp from "@/components/card-comp/CardComp";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import SearchInput from "@/components/search-input/SearchInput";
import { useEffect, useState } from "react";
import { CiClock2, CiFilter } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router";
import LazyImage from "@/components/ui/LazyImage";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux'
import type { AppDispatch } from "@/store/store";
import { allAppointmentsState, fetchAllAppointments, type AppointmentStatus } from "@/store/slices/patient-slice/all-appointments-slice/allAppointmentsSlice";
import MiniLoading from "@/components/mini-loading/MiniLoading";
import Error from "@/components/error/Error";
import { NotFound } from "@/components/notfound/NotFound";



function AppointmentsPage() {
  const [onFilter, setFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState('')

  const dispatch: AppDispatch = useDispatch()
  const { data, loading, error } = useSelector(allAppointmentsState);
  useEffect(() => {
    dispatch(fetchAllAppointments({ search: search, AppointmentStatus: appointmentStatus, BookingType: '' }))
  }, [dispatch, search, appointmentStatus])

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'confirmed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    }
  };
  return (
    <DashboardLayout pageTitle="Patient">
      <div className="space-y-6">
        {/* first */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Appointments</h1>
            <p className="text-sm">Manage and view all your appointments</p>
          </div>
          <Link
            to={"/doctors-list"}
            className="flex items-center gap-2 bg-(--color-primary) hover:bg-(--color-primary-light) duration-150 p-2 rounded-sm text-white"
          >
            <FaPlus />
            <span>Book Appointment</span>
          </Link>
        </div>
        {/* second */}
        <CardComp>
          <div className="w-full">
            <div className=" flex items-center justify-between gap-4">
              <SearchInput style="w-full" setSearch={setSearch} />
              <button
                onClick={() => setFilter(!onFilter)}
                className={`flex items-center gap-2 border-2 border-(--color-border) py-2 px-4 hover:bg-(--color-bg)  rounded-lg cursor-pointer ${onFilter
                  ? "bg-(--color-bg-blue) text-(--color-text-blue)"
                  : ""
                  } `}
              >
                <CiFilter />
                Filters
              </button>
            </div>
            {onFilter && (
              <div>
                <hr className="my-4" />
                <div className="flex flex-col gap-2 items-start ">
                  <label htmlFor="status">Status</label>
                  <select
                    onChange={(e) => setAppointmentStatus(e.target.value)}
                    name="status"
                    id="status"
                    className="w-full p-2 border-2 border-(--color-border) rounded-lg"
                  >
                    <option value="allstatus">All Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </CardComp>
        {/* third */}
        <div className="space-y-3">
          <CardComp>
            {
              loading ? <MiniLoading />
                : error ? <Error message={error} />
                  : data.appointments.length <= 0 ? <NotFound subMessage={'there are not Appointments'} />
                    : data.appointments.map((appointment) => {
                      return (
                        <div className="flex items-start justify-between w-full">
                          <div className="flex items-start gap-2">
                            <LazyImage
                              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjtHioeP3798yMa6QIJsA3piLZlDdOMuA17Q&s"
                              alt="doctor img"
                              className="w-14 h-14 rounded-full"
                            />
                            <div className="space-y-2">
                              <div>
                                {appointment.doctorName && <h3 className="text-xl font-semibold">{appointment.doctorName}</h3>}
                                {appointment.specialty && <p className="text-sm">{appointment.specialty}</p>}
                              </div>
                              <div className="flex items-center gap-4 flex-wrap">
                                {appointment.date && <div className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4" />
                                  {appointment.date}
                                </div>}
                                {appointment.time && <div className="flex items-center gap-1.5">
                                  <Clock className="w-4 h-4" />
                                  {appointment.time}
                                </div>}
                                {appointment.type && <div className="flex items-center gap-1.5">
                                  <MapPin className="w-4 h-4" />
                                  {appointment.type}
                                </div>}

                                {/* <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {appointment}
                              </div> */}
                              </div>


                              <div className="flex items-center gap-4">
                                <Link
                                  to={`/appointments/${appointment.id}`}
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  View Details
                                </Link>
                                <Link
                                  to={`/appointment/reschedule/${appointment.id}`}
                                  className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                                >
                                  Reschedule
                                </Link>
                                <button className="text-sm text-red-600 dark:text-red-400 hover:underline">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className={`py-1 px-3 flex items-center gap-2  border  rounded-lg ${getStatusColor(appointment.status)}`}>
                            <CiClock2 />
                            <span>{appointment.status}</span>
                          </div>
                        </div>
                      )
                    })
            }

          </CardComp>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AppointmentsPage;
