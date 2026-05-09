import { NavLink, useNavigate } from "react-router";
import { BsCalendar3, BsCash, BsCreditCard } from "react-icons/bs";
import { LuUser } from "react-icons/lu";
import { HiOutlineClock } from "react-icons/hi2";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { appointmentFormData } from "@/constants/receptionistConstants";
import type { AppointmentFormData } from "@/interfaces/receptionistInterfaces";
import { useForm, type SubmitHandler } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import type { Patient } from "@/interfaces/doctorInterfaces";

const inputClass = (hasError?: boolean, hasIcon = false) =>
  `w-full ${
    hasIcon ? "pl-12" : "px-4"
  } pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/20 border ${
    hasError
      ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
      : "border-(--color-border) focus:ring-blue-500/20 focus:border-blue-500"
  } rounded-xl focus:ring-2 outline-none transition-all text-sm font-medium`;

const errorClass = "text-xs text-red-500 font-medium mt-2";

const ScheduleAppointment = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>({
    defaultValues: appointmentFormData,
  });

  const formValues = watch();

  const { data: patientsData, isLoading: isLoadingPatients } = useQuery({
    queryKey: ["ReceptionistPatients"],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}Receptionist/doctor-patients`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
  });

  const patients: Patient[] = patientsData?.data?.items || [];

  const { data: slotsData, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["AvailableSlots", formValues.date],
    queryFn: async () => {
      if (!formValues.date) return null;
      const [year, month, day] = formValues.date.split("-");
      const formattedDate = `${month}/${day}/${year}`;
      const response = await axios.get(
        `${backendUrl}Receptionist/available-slots?date=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
    enabled: !!formValues.date,
  });

  const slots = slotsData?.data || [];

  const handlePaymentChange = (method: "cash" | "online") => {
    setValue("paymentMethod", method, { shouldDirty: true });
  };

  const onSubmit: SubmitHandler<AppointmentFormData> = async (data) => {
    try {
      const payload = {
        patientId: Number(data.patientId),
        date: data.date,
        slotId: Number(data.slotId),
        reason: data.reason || "No reason",
        paymentMethod:
          data.paymentMethod.charAt(0).toUpperCase() +
          data.paymentMethod.slice(1),
        bookingType: data.bookingType,
      };
      console.log(payload);

      await axios.post(
        `${backendUrl}Receptionist/schedule-appointment?appointmentType=${data.appointmentType}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Appointment scheduled successfully");
      reset(appointmentFormData);
      navigate("/");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to schedule appointment"
        : "Failed to schedule appointment";

      toast.error(message);
    }
  };

  return (
    <DashboardLayout pageTitle="Schedule Appointment">
      <div className="-mt-6 bg-(--color-bg) rounded-2xl min-h-screen p-8">
        <div className="flex items-center gap-2 text-sm text-(--color-text-light) mb-8 font-medium">
          <NavLink to="/receptionist" className="hover:text-blue-600">
            Dashboard
          </NavLink>
          <span>/</span>
          <NavLink to="/doctor-appointments" className="hover:text-blue-600">
            Appointments
          </NavLink>
          <span>/</span>
          <span className="text-(--color-text)">Schedule Appointment</span>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-(--color-text) mb-2">
            Schedule Appointment
          </h1>
          <p className="text-(--color-text-light) font-medium">
            Book an appointment for a patient
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8 max-w-5xl"
        >
          <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm">
            <h2 className="text-lg font-bold text-(--color-text) mb-6">
              Select Patient
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-(--color-text) mb-2">
                  Patient <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LuUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    {...register("patientId", {
                      required: "Patient is required",
                    })}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const patient = patients.find(
                        (p) => p.id.toString() === selectedId,
                      );
                      setValue("patientId", selectedId);
                      setValue("patientName", patient?.name || "");
                    }}
                    disabled={isLoadingPatients}
                    className={`${inputClass(
                      !!errors.patientId,
                      true,
                    )} appearance-none`}
                  >
                    <option value="">
                      {isLoadingPatients
                        ? "Loading patients..."
                        : "Select a patient"}
                    </option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} (ID: {patient.id})
                      </option>
                    ))}
                  </select>
                  <input type="hidden" {...register("patientName")} />
                </div>
                {errors.patientId && (
                  <p className={errorClass}>{errors.patientId.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm">
            <h2 className="text-lg font-bold text-(--color-text) mb-8">
              Appointment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-(--color-text) mb-2">
                  Appointment Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LuUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    {...register("appointmentType", {
                      required: "Appointment type is required",
                    })}
                    className={`${inputClass(
                      !!errors.appointmentType,
                      true,
                    )} appearance-none`}
                  >
                    <option value="">Select type</option>
                    <option value="Consultation">Consultation</option>
                    <option value="FollowUp">FollowUp</option>
                    <option value="Checkup">Checkup</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                {errors.appointmentType && (
                  <p className={errorClass}>{errors.appointmentType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-(--color-text) mb-2">
                  Appointment Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BsCalendar3 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register("date", {
                      required: "Appointment date is required",
                    })}
                    type="date"
                    className={inputClass(!!errors.date, true)}
                  />
                </div>
                {errors.date && (
                  <p className={errorClass}>{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-(--color-text) mb-2">
                  Appointment Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <HiOutlineClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <select
                    {...register("slotId", {
                      required: "Appointment time is required",
                    })}
                    disabled={!formValues.date || isLoadingSlots}
                    className={`${inputClass(
                      !!errors.slotId,
                      true,
                    )} appearance-none`}
                  >
                    <option value="">
                      {!formValues.date
                        ? "Choose a date first"
                        : isLoadingSlots
                          ? "Loading slots..."
                          : slots.length === 0
                            ? "No slots available"
                            : "Select time"}
                    </option>
                    {slots.map((slot: any) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.startTime} - {slot.endTime}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.slotId && (
                  <p className={errorClass}>{errors.slotId.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-(--color-text) mb-2">
                  Reason for Visit
                </label>
                <textarea
                  {...register("reason")}
                  placeholder="Describe symptoms or reason for consultation (optional)..."
                  rows={4}
                  className={`${inputClass(!!errors.reason)} resize-none`}
                />
              </div>
            </div>
          </div>

          <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm">
            <h2 className="text-lg font-bold text-(--color-text) mb-6">
              Payment Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                type="button"
                onClick={() => handlePaymentChange("cash")}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all  cursor-pointer ${
                  formValues.paymentMethod === "cash"
                    ? "border-blue-500 bg-blue-50/30 text-blue-600 shadow-md"
                    : "border-(--color-border) hover:border-gray-300 bg-gray-50/30"
                }`}
              >
                <BsCash className="text-2xl mb-2" />
                <span className="font-bold">Cash</span>
              </button>
              <button
                type="button"
                onClick={() => handlePaymentChange("online")}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all  cursor-pointer ${
                  formValues.paymentMethod === "online"
                    ? "border-blue-500 bg-blue-50/30 text-blue-600 shadow-md"
                    : "border-(--color-border) hover:border-gray-300 bg-gray-50/30"
                }`}
              >
                <BsCreditCard className="text-2xl mb-2 " />
                <span className="font-bold">Online Payment</span>
              </button>
            </div>
            <input
              type="hidden"
              {...register("paymentMethod", {
                required: "Payment method is required",
              })}
            />
            {formValues.paymentMethod === "cash" && (
              <p className="mt-4 text-sm text-(--color-text-light) font-medium">
                Payment will be collected at the clinic
              </p>
            )}
          </div>

          <div className="bg-blue-50/50 dark:bg-blue-900/10 p-8 rounded-2xl border border-blue-100 dark:border-blue-900/30">
            <h2 className="text-blue-800 dark:text-blue-400 font-bold mb-6">
              Appointment Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-blue-700/70 dark:text-blue-400/70">
                  Patient:
                </span>
                <span className="font-bold text-blue-900 dark:text-blue-300">
                  {formValues.patientName || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700/70 dark:text-blue-400/70">
                  Type:
                </span>
                <span className="font-bold text-blue-900 dark:text-blue-300">
                  {formValues.appointmentType || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700/70 dark:text-blue-400/70">
                  Date:
                </span>
                <span className="font-bold text-blue-900 dark:text-blue-300">
                  {formValues.date || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700/70 dark:text-blue-400/70">
                  Time Slot:
                </span>
                <span className="font-bold text-blue-900 dark:text-blue-300">
                  {formValues.slotId
                    ? slots.find(
                        (s: any) =>
                          s.id.toString() === formValues.slotId.toString(),
                      )
                      ? `${
                          slots.find(
                            (s: any) =>
                              s.id.toString() === formValues.slotId.toString(),
                          ).startTime
                        } - ${
                          slots.find(
                            (s: any) =>
                              s.id.toString() === formValues.slotId.toString(),
                          ).endTime
                        }`
                      : "-"
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700/70 dark:text-blue-400/70">
                  Payment Method:
                </span>
                <span className="font-bold text-blue-900 dark:text-blue-300 ">
                  {formValues.paymentMethod === "cash"
                    ? "Cash"
                    : "Online Payment"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-20">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              {isSubmitting ? "Scheduling..." : "Confirm Appointment"}
            </button>
            <NavLink
              to="/receptionist"
              className="flex-1 py-4 bg-white dark:bg-gray-800 border border-(--color-border) text-(--color-text) rounded-xl font-bold text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </NavLink>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ScheduleAppointment;
