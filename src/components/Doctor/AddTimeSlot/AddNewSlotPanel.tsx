import { useState } from "react";
import type { ReactNode } from "react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIMES = [
  "12:00 AM", "12:30 AM",
  "01:00 AM", "01:30 AM",
  "02:00 AM", "02:30 AM",
  "03:00 AM", "03:30 AM",
  "04:00 AM", "04:30 AM",
  "05:00 AM", "05:30 AM",
  "06:00 AM", "06:30 AM",
  "07:00 AM", "07:30 AM",
  "08:00 AM", "08:30 AM",
  "09:00 AM", "09:30 AM",
  "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM",
  "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM",
  "07:00 PM", "07:30 PM",
  "08:00 PM", "08:30 PM",
  "09:00 PM", "09:30 PM",
  "10:00 PM", "10:30 PM",
  "11:00 PM", "11:30 PM",
];

const DURATIONS = [
  "15 minutes",
  "30 minutes",
  "45 minutes",
  "60 minutes",
  "90 minutes",
];

// ── Icons ─────────────────────────────────────────────────────────────────────

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TimerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3M7.05 4.05A7 7 0 0119 12H5a7 7 0 012.05-7.95z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6M12 1v2" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-(--color-text-light)" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

// ── Sub-components ─────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}

const Field = ({ label, icon, children }: FieldProps) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-1.5 text-sm font-medium text-(--color-text)">
      <span className="text-(--color-primary)">{icon}</span>
      {label}
    </label>
    {children}
  </div>
);

interface SelectFieldProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}

const SelectField = ({ value, onChange, options }: SelectFieldProps) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none border border-(--color-border) bg-(--color-bg) text-(--color-text) rounded-xl px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-(--color-primary)/25 focus:border-(--color-primary) transition-all duration-150 cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <ChevronDown />
    </div>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────

const AddNewSlotPanel = () => {
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("09:30 AM");
  const [duration, setDuration] = useState("30 minutes");
  const [status, setStatus] = useState<"available" | "unavailable">("available");

  return (
    <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="px-5 py-4 border-b border-(--color-border) flex items-center gap-2">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-(--color-primary)">
          <PlusIcon />
        </span>
        <h2 className="text-base font-semibold text-(--color-text)">Add New Slot</h2>
      </div>

      {/* ── Form body ── */}
      <div className="p-5 flex flex-col gap-5">

        {/* Day of Week */}
        <Field label="Day of Week" icon={<CalendarIcon />}>
          <SelectField value={day} onChange={setDay} options={DAYS} />
        </Field>

        {/* Divider */}
        <div className="h-px bg-(--color-border)" />

        {/* Start / End time row */}
        <div className="flex flex-col gap-4">
          <Field label="Start Time" icon={<ClockIcon />}>
            <SelectField value={startTime} onChange={setStartTime} options={TIMES} />
          </Field>
          <Field label="End Time" icon={<ClockIcon />}>
            <SelectField value={endTime} onChange={setEndTime} options={TIMES} />
          </Field>
        </div>

        {/* Divider */}
        <div className="h-px bg-(--color-border)" />

        {/* Slot Duration */}
        <Field label="Slot Duration" icon={<TimerIcon />}>
          <SelectField value={duration} onChange={setDuration} options={DURATIONS} />
        </Field>

        {/* Divider */}
        <div className="h-px bg-(--color-border)" />

        {/* Availability Status */}
        <Field label="Availability Status" icon={<CheckCircleIcon />}>
          <div className="flex gap-3 mt-0.5">
            {(["available", "unavailable"] as const).map((opt) => {
              const isSelected = status === opt;
              const isAvailable = opt === "available";
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setStatus(opt)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? isAvailable
                        ? "bg-green-50 border-green-400 text-green-700"
                        : "bg-red-50 border-red-400 text-red-600"
                      : "border-(--color-border) text-(--color-text-light) hover:border-(--color-primary)/40"
                  }`}
                >
                  {/* Dot indicator */}
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected
                        ? isAvailable
                          ? "bg-green-500"
                          : "bg-red-500"
                        : "bg-gray-300"
                    }`}
                  />
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              );
            })}
          </div>
        </Field>

        {/* ── Slot preview pill ── */}
        <div className="flex items-center gap-3 bg-(--color-bg) border border-(--color-border) rounded-xl px-4 py-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-green-100 text-green-600 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-(--color-text) truncate">
              {startTime} – {endTime}
            </span>
            <span className="text-xs text-(--color-text-light)">
              {duration} &bull; {status}
            </span>
          </div>
          <span className="ml-auto shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-(--color-primary) border border-(--color-primary)/20">
            {day}
          </span>
        </div>

        {/* ── Add Slot button ── */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-(--color-primary) hover:bg-(--color-primary-dark) active:scale-[0.98] text-white font-semibold text-sm py-3 rounded-xl transition-all duration-150 cursor-pointer shadow-sm"
        >
          <PlusIcon />
          Add Slot
        </button>
      </div>
    </div>
  );
};

export default AddNewSlotPanel;
