import { useState } from "react";
import { NavLink } from "react-router";
import { BsCalendar3, BsSearch, BsCash, BsCreditCard } from "react-icons/bs";
import { LuUser } from "react-icons/lu";
import { HiOutlineClock } from "react-icons/hi2";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { appointmentFormData } from "@/constants/receptionistConstants";
import type { AppointmentFormData } from "@/interfaces/receptionistInterfaces";

const ScheduleAppointment = () => {
  const [formData, setFormData] =
    useState<AppointmentFormData>(appointmentFormData);

  const handlePaymentChange = (method: "cash" | "online") => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  return (
    <DashboardLayout pageTitle="Schedule Appointment">
      <div className="-mt-6 bg-(--color-bg) rounded-2xl min-h-screen p-8">
        {/* Breadcrumbs */}
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

        {/* Title Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-(--color-text) mb-2">
            Schedule Appointment
          </h1>
          <p className="text-(--color-text-light) font-medium">
            Book an appointment for a patient
          </p>
        </div>

        <div className="flex flex-col gap-8 max-w-5xl">
          {/* Select Patient Section */}
          <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm">
            <h2 className="text-lg font-bold text-(--color-text) mb-6">
              Select Patient
            </h2>
            <div className="relative">
              <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name or ID..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/20 border border-(--color-border) rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Appointment Details Section */}
          <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm">
            <h2 className="text-lg font-bold text-(--color-text) mb-8">
              Appointment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Select Doctor */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-(--color-text) mb-2">
                  Select Doctor <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LuUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select className="w-full pl-12 pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/20 border border-(--color-border) rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium appearance-none">
                    <option value="">Select a doctor</option>
                    <option value="1">Dr. Michael Chen</option>
                    <option value="2">Dr. Sarah Johnson</option>
                  </select>
                </div>
              </div>

              {/* Appointment Date */}
              <div>
                <label className="block text-sm font-bold text-(--color-text) mb-2">
                  Appointment Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BsCalendar3 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/20 border border-(--color-border) rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Appointment Time */}
              <div>
                <label className="block text-sm font-bold text-(--color-text) mb-2">
                  Appointment Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <HiOutlineClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <select className="w-full pl-12 pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/20 border border-(--color-border) rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium appearance-none">
                    <option value="">Select time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                  </select>
                </div>
              </div>

              {/* Reason for Visit */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-(--color-text) mb-2">
                  Reason for Visit
                </label>
                <textarea
                  placeholder="Describe symptoms or reason for consultation..."
                  rows={4}
                  className="w-full p-4 bg-gray-50/50 dark:bg-gray-800/20 border border-(--color-border) rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-(--color-surface) p-8 rounded-2xl border border-(--color-border) shadow-sm">
            <h2 className="text-lg font-bold text-(--color-text) mb-6">
              Payment Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => handlePaymentChange("cash")}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                  formData.paymentMethod === "cash"
                    ? "border-blue-500 bg-blue-50/30 text-blue-600 shadow-md"
                    : "border-(--color-border) hover:border-gray-300 bg-gray-50/30"
                }`}
              >
                <BsCash className="text-2xl mb-2" />
                <span className="font-bold">Cash</span>
              </button>
              <button
                onClick={() => handlePaymentChange("online")}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                  formData.paymentMethod === "online"
                    ? "border-blue-500 bg-blue-50/30 text-blue-600 shadow-md"
                    : "border-(--color-border) hover:border-gray-300 bg-gray-50/30"
                }`}
              >
                <BsCreditCard className="text-2xl mb-2" />
                <span className="font-bold">Online Payment</span>
              </button>
            </div>
            {formData.paymentMethod === "cash" && (
              <p className="mt-4 text-sm text-(--color-text-light) font-medium">
                Payment will be collected at the clinic
              </p>
            )}
          </div>

          {/* Appointment Summary Section */}
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
                  Sarah Johnson
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700/70 dark:text-blue-400/70">
                  Doctor:
                </span>
                <span className="font-bold text-blue-900 dark:text-blue-300">
                  Dr. Michael Chen
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700/70 dark:text-blue-400/70">
                  Date:
                </span>
                <span className="font-bold text-blue-900 dark:text-blue-300">
                  2027-02-02
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700/70 dark:text-blue-400/70">
                  Time:
                </span>
                <span className="font-bold text-blue-900 dark:text-blue-300">
                  03:00 PM
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700/70 dark:text-blue-400/70">
                  Payment Method:
                </span>
                <span className="font-bold text-blue-900 dark:text-blue-300">
                  {formData.paymentMethod === "cash"
                    ? "Cash"
                    : "Online Payment"}
                </span>
              </div>
              <div className="pt-3 mt-3 border-t border-blue-200 dark:border-blue-800 flex justify-between text-sm">
                <span className="text-blue-700 dark:text-blue-400 font-bold">
                  Consultation Fee:
                </span>
                <span className="font-bold text-blue-900 dark:text-blue-300">
                  $180
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-20">
            <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
              Confirm Appointment
            </button>
            <NavLink
              to="/receptionist"
              className="flex-1 py-4 bg-white dark:bg-gray-800 border border-(--color-border) text-(--color-text) rounded-xl font-bold text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </NavLink>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ScheduleAppointment;
