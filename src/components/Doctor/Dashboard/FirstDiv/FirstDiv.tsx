import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Card from "./Card";
import { FaRegClock } from "react-icons/fa6";
import { LuFileSpreadsheet } from "react-icons/lu";
import { NavLink } from "react-router";
import Patient from "./Patient";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  dummySchedules,
  dummyScans,
  dummyPatients,
} from "@/constants/doctorConstants";
import type {
  Schedule,
  Scan,
  RecentPatient,
} from "@/interfaces/doctorInterfaces";

const FirstDiv = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data, isSuccess, isError, error } = useQuery({
    queryKey: ["DoctorDashboardDetails"],
    queryFn: async () => {
      const [todayRes, scansRes, patientsRes] = await Promise.all([
        axios
          .get(`${backendUrl}Doctors/today`, config)
          .catch(() => ({ data: [] })),
        axios
          .get(`${backendUrl}Doctors/pending-scans`, config)
          .catch(() => ({ data: [] })),
        axios
          .get(`${backendUrl}Doctors/recent-patients`, config)
          .catch(() => ({ data: [] })),
      ]);

      return {
        schedules: todayRes.data?.value || todayRes.data || [],
        pendingScans: scansRes.data?.value || scansRes.data || [],
        recentPatients: patientsRes.data?.value || patientsRes.data || [],
      };
    },
  });

  const schedules = data?.schedules.length ? data.schedules : dummySchedules;
  const pendingScans = data?.pendingScans.length
    ? data.pendingScans
    : dummyScans;
  const recentPatients = data?.recentPatients.length
    ? data.recentPatients
    : dummyPatients;

  useEffect(() => {
    if (isSuccess && data) {
      toast.success("Dashboard details loaded");
    }
    if (isError) {
      console.error("Error fetching data for FirstDiv:", error);
      toast.error(error.message || "Failed to load dashboard details");
    }
  }, [isSuccess, isError, error, data]);

  return (
    <div className="flex-2">
      <div className="bg-(--color-surface) p-6 rounded-xl">
        <div className="flex justify-between mb-6 pb-3 border-b-2 border-gray-300 items-center">
          <h1 className="text-xl font-normal text-(--color-text)">
            Today's Schedule
          </h1>
          <NavLink
            to={"/doctor-schedule"}
            className={
              "text-sm text-(--color-primary) hover:text-(--color-primary-light)"
            }
          >
            View Calendar
          </NavLink>
        </div>
        <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
          {schedules.length > 0 ? (
            schedules.map((schedule: Schedule) => (
              <Card
                key={schedule.appointmentId}
                title={`Patient: ${schedule.patientName}`}
                status={schedule.status}
                color="blue"
                logo={<FaRegClock />}
              >
                <p className="text-(--color-text-light) text-sm">
                  {schedule.specialty}
                </p>
                <p className="text-(--color-text-light) text-sm">
                  {schedule.time}
                </p>
              </Card>
            ))
          ) : (
            <p className="text-(--color-text-light)">No appointments today.</p>
          )}
        </div>
      </div>

      <div className="bg-(--color-surface) p-6 rounded-xl mt-6">
        <div className="flex justify-between mb-6 pb-3 border-b-2 border-gray-300 items-center">
          <h1 className="text-xl font-normal text-(--color-text)">
            Scans Awaiting Review
          </h1>
          <NavLink
            to={"/scan/upload"}
            className={"text-sm text-blue-500 hover:text-blue-400"}
          >
            View All
          </NavLink>
        </div>
        <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
          {pendingScans.length > 0 ? (
            pendingScans.map((scan: Scan) => (
              <Card
                key={scan.id}
                title={scan.scanType}
                status="Pending"
                color="violet"
                logo={<LuFileSpreadsheet />}
              >
                <p className="text-(--color-text-light) text-sm">
                  Patient: {scan.patientName}
                </p>
                <p className="text-(--color-text-light) text-sm">
                  Uploaded: {new Date(scan.uploadedAt).toLocaleDateString()}
                </p>
              </Card>
            ))
          ) : (
            <p className="text-(--color-text-light)">No pending scans.</p>
          )}
        </div>
      </div>

      <div className="bg-(--color-surface) p-6 rounded-xl mt-6">
        <div className="flex justify-between mb-6 pb-3 border-b-2 border-gray-300 items-center">
          <h1 className="text-xl font-normal text-(--color-text)">
            Recent Patients
          </h1>
          <NavLink
            to={"/doctor-patients"}
            className={"text-sm text-blue-500 hover:text-blue-400"}
          >
            View All
          </NavLink>
        </div>
        <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
          {recentPatients.length > 0 ? (
            recentPatients.map((patient: RecentPatient) => (
              <Patient
                key={patient.id}
                id={patient.id}
                name={patient.name}
                imageUrl={patient.imageUrl}
                lastInteractionDate={patient.lastInteractionDate}
              />
            ))
          ) : (
            <p className="text-(--color-text-light)">No recent patients.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirstDiv;
