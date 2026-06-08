import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import type { RootState } from "@/store/store";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";

type AppointmentDetailsResponse = {
  succeeded: boolean;
  message: string;
  data: {
    appointmentId: number;
    patientId: number;
    patientName: string;
    patientImage: string | null;
    gender: string;
    age: number;
    address: string;
    appointmentStatus: string;
    appointmentType: string;
    bookingType: string;
    paymentMethod: string;
    paymentStatus: string;
    date: string;
    startTime: string;
    endTime: string;
    reason: string | null;
    notes: string;
    statusDetails: {
      cancellationReason: string;
    };
  };
  meta: any;
};

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <p className="w-40 text-sm font-medium text-(--color-text-light)">
        {label}
      </p>
      <p className="text-sm font-semibold text-(--color-text)">
        {value ?? "—"}
      </p>
    </div>
  );
}

const FALLBACK_AVATAR =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><rect width='100%25' height='100%25' fill='%23e5e7eb'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='40' fill='%236b7280'>?</text></svg>";

export default function AppointmentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const appointmentId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  }, [id]);

  const { data, isLoading } = useQuery<AppointmentDetailsResponse>({
    queryKey: ["doctor-appointment-details", appointmentId],
    enabled: !!appointmentId,
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${backendUrl}Doctors/appointments/${appointmentId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          },
        );
        return res.data;
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load appointment details",
        );
        throw err;
      }
    },
    refetchOnWindowFocus: false,
  });

  const appt = data?.data;

  return (
    <DashboardLayout pageTitle="Appointment Details">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-sm transition-colors hover:opacity-80"
          style={{ color: "var(--color-text-light)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Appointments
        </button>

        {isLoading || !appt ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div
                className="rounded-2xl border border-(--color-border) p-6"
                style={{ backgroundColor: "var(--color-surface)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={appt.patientImage ?? FALLBACK_AVATAR}
                      alt={appt.patientName}
                      className="w-14 h-14 rounded-full object-cover bg-gray-100"
                    />
                    <div>
                      <h1 className="text-xl font-bold text-(--color-text)">
                        {appt.patientName}
                      </h1>
                      <p className="text-sm text-(--color-text-light)">
                        {appt.gender} • {appt.age} yrs
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border bg-gray-50 text-gray-700 border-gray-200">
                    {appt.appointmentStatus}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <FieldRow label="Address" value={appt.address} />
                  <FieldRow
                    label="Appointment Type"
                    value={appt.appointmentType}
                  />
                  <FieldRow label="Booking Type" value={appt.bookingType} />
                  <FieldRow label="Payment Method" value={appt.paymentMethod} />
                  <FieldRow label="Payment Status" value={appt.paymentStatus} />
                </div>
              </div>

              <div
                className="rounded-2xl border border-(--color-border) p-6"
                style={{ backgroundColor: "var(--color-surface)" }}
              >
                <h2 className="text-lg font-semibold mb-4 text-(--color-text)">
                  Appointment
                </h2>
                <div className="space-y-3">
                  <FieldRow
                    label="Appointment ID"
                    value={`#${appt.appointmentId}`}
                  />
                  <FieldRow label="Date" value={appt.date} />
                  <FieldRow
                    label="Start Time"
                    value={appt.startTime?.slice(0, 5) ?? appt.startTime}
                  />
                  <FieldRow
                    label="End Time"
                    value={appt.endTime?.slice(0, 5) ?? appt.endTime}
                  />
                  <FieldRow
                    label="Reason"
                    value={
                      appt.reason ??
                      appt.statusDetails?.cancellationReason ??
                      "—"
                    }
                  />
                  <FieldRow label="Notes" value={appt.notes || "—"} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div
                className="rounded-2xl border border-(--color-border) p-6"
                style={{ backgroundColor: "var(--color-surface)" }}
              >
                <h2 className="text-lg font-semibold mb-4 text-(--color-text)">
                  Summary
                </h2>
                <div className="space-y-3">
                  <FieldRow label="Patient ID" value={`#${appt.patientId}`} />
                  <FieldRow label="Type" value={appt.appointmentType} />
                  <FieldRow label="Status" value={appt.appointmentStatus} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
