import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Card from "../../../components/Student Doctor/appointments/Card";
import InComingAppointments from "../../../components/Student Doctor/appointments/IncomingAppointments";
import AppointmentsCard from "../../../components/Student Doctor/appointments/AppointmentsCard";
import { FaRegClock } from "react-icons/fa6";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import { FaRegCheckCircle } from "react-icons/fa";

const StudentAppointments = () => {
  return (
    <DashboardLayout pageTitle="Appointments">
      <div className="bg-(--color-bg) -mt-6 p-4  rounded-2xl">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-2xl text-(--color-text)">Appointments</h1>
          <p className="text-sm text-(--color-text-light)">
            Manage and view all your appointments
          </p>
        </div>
        <div className="grid max-lg:grid-col-2 max-md:grid-cols-2 max-sm:grid-cols-1 grid-cols-4 gap-4">
          <Card
            title="Total Appointments"
            color="blue"
            logo={<SlCalender />}
            num={5}
          />
          <Card title="Upcoming" color="violet" logo={<FaRegClock />} num={3} />
          <Card
            title="Completed"
            color="green"
            logo={<FaRegCheckCircle />}
            num={1}
          />
          <Card
            title="Cancelled"
            color="red"
            logo={<IoMdCloseCircleOutline />}
            num={1}
          />
        </div>
        <div className="">
          <InComingAppointments />
        </div>
        <div className="mt-6 mb-8 flex flex-col gap-4 p-4 bg-(--color-surface) rounded-2xl">
          <AppointmentsCard
            name="Sarah Johnson"
            desc="Annual Checkup"
            date="Feb 5,2025"
            time="10:00 Am"
            meeting="In-Person"
            address="Room 302, Medical Center"
            status="Upcoming"
          />
          <AppointmentsCard
            name="Sarah Johnson"
            desc="Annual Checkup"
            date="Feb 5,2025"
            time="10:00 Am"
            meeting="View Call"
            status="Upcoming"
          />
          <AppointmentsCard
            name="Sarah Johnson"
            desc="Annual Checkup"
            date="Feb 5,2025"
            time="10:00 Am"
            meeting="In-Person"
            address="Room 302, Medical Center"
            status="Completed"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAppointments;
