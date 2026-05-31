import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  BsArrowLeft,
  BsCalendar3,
  BsClock,
  BsPersonBadge,
  BsJournalText,
  BsCheckCircleFill,
  BsXCircleFill,
  BsAwardFill,
  BsInfoCircleFill,
  BsSearch,
} from "react-icons/bs";
import { ScaleLoader } from "react-spinners";

interface TrainingSession {
  trainingSessionId: number;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  notes: string;
  doctorName: string;
  attendanceStatus: number; // 0 = Absent, 1 = Present, etc.
  evaluationScore: number | null;
  status: string; // e.g. "Cancelled", "Completed", "Scheduled"
}

const TrainingSessions = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: responseBody,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["student-training-sessions"],
    queryFn: async () => {
      // Axios request to: backendUrl + "student-doctor/training-sessions"
      const response = await axios.get(
        `${backendUrl}StudentDoctor/student-doctor/training-sessions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    enabled: !!token && !!backendUrl,
    retry: 1,
  });

  // Handle toast notifications on mount / API response changes
  useEffect(() => {
    if (isSuccess && responseBody) {
      toast.success(
        responseBody.message || "Training sessions loaded successfully",
      );
    }
  }, [isSuccess, responseBody]);

  useEffect(() => {
    if (isError && error) {
      const err = error as any;
      toast.error(
        err.response?.data?.message ||
          "Failed to fetch training sessions from server. Using offline data.",
      );
    }
  }, [isError, error]);

  // Determine active dataset (API data or Fallback Data)
  const sessionsList: TrainingSession[] =
    responseBody?.data || (isError ? fallbackSessions : []);

  // Filter sessions based on search & filter state
  const filteredSessions = sessionsList.filter((session) => {
    const matchesSearch =
      session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (session.notes &&
        session.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      session.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalSessions = sessionsList.length;
  const cancelledCount = sessionsList.filter(
    (s) => s.status.toLowerCase() === "cancelled",
  ).length;
  const completedCount = sessionsList.filter(
    (s) => s.status.toLowerCase() === "completed",
  ).length;
  const attendedCount = sessionsList.filter(
    (s) => s.attendanceStatus === 1,
  ).length;

  const getStatusBadgeStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "cancelled":
        return "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border-rose-200 dark:border-rose-900/30";
      case "completed":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30";
      case "scheduled":
      case "active":
        return "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200 dark:border-blue-900/30";
      default:
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200 dark:border-amber-900/30";
    }
  };

  return (
    <DashboardLayout pageTitle="Training Sessions">
      <div className="-mt-6 p-6 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-(--color-text-light) hover:text-(--color-text) transition-colors mb-6 cursor-pointer group"
        >
          <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-(--color-text) tracking-tight">
              My Training Sessions
            </h1>
            <p className="text-sm text-(--color-text-light) mt-1">
              View and track all your student training records, supervisor
              evaluations, and attendance
            </p>
          </div>
          {isError && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-xl border border-amber-200 dark:border-amber-900/30">
              <BsInfoCircleFill />
              <span>Offline / Demo Data Mode</span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-(--color-surface) border border-(--color-border) p-5 rounded-2xl flex flex-col shadow-sm">
            <span className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
              Total Sessions
            </span>
            <span className="text-2xl font-bold text-(--color-text) mt-2">
              {totalSessions}
            </span>
          </div>
          <div className="bg-(--color-surface) border border-(--color-border) p-5 rounded-2xl flex flex-col shadow-sm">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Completed
            </span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              {completedCount}
            </span>
          </div>
          <div className="bg-(--color-surface) border border-(--color-border) p-5 rounded-2xl flex flex-col shadow-sm">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Cancelled
            </span>
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">
              {cancelledCount}
            </span>
          </div>
          <div className="bg-(--color-surface) border border-(--color-border) p-5 rounded-2xl flex flex-col shadow-sm">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Attended
            </span>
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
              {attendedCount}
            </span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-text-light)" />
            <input
              type="text"
              placeholder="Search by topic, doctor or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-(--color-surface) text-(--color-text) placeholder-gray-400 border border-(--color-border) rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-(--color-surface) text-(--color-text) border border-(--color-border) rounded-xl outline-none focus:border-indigo-500 transition-all text-sm cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
          </select>
        </div>

        {/* List of Sessions */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <ScaleLoader color="#4F46E5" />
            <p className="text-sm text-(--color-text-light) font-medium animate-pulse">
              Retrieving training sessions...
            </p>
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSessions.map((session) => (
              <div
                key={session.trainingSessionId}
                className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group flex flex-col h-full"
              >
                {/* Header Row */}
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div>
                    <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-lg">
                      Session ID: {session.trainingSessionId}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadgeStyles(
                      session.status,
                    )}`}
                  >
                    {session.status}
                  </span>
                </div>

                {/* Topic Title */}
                <h3 className="text-xl font-bold text-(--color-text) mb-3 group-hover:text-indigo-600 transition-colors">
                  {session.topic}
                </h3>

                {/* Main Details */}
                <div className="space-y-3 flex-grow mb-6">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                      <BsPersonBadge size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tight">
                        Supervising Doctor
                      </span>
                      <p className="text-sm text-(--color-text) font-semibold">
                        {session.doctorName}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 text-(--color-text-light) rounded-lg">
                        <BsCalendar3 size={15} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-(--color-text-light) uppercase tracking-tight">
                          Date
                        </span>
                        <p className="text-xs text-(--color-text) font-medium">
                          {session.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 text-(--color-text-light) rounded-lg">
                        <BsClock size={15} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-(--color-text-light) uppercase tracking-tight">
                          Duration
                        </span>
                        <p className="text-xs text-(--color-text) font-medium">
                          {session.startTime.substring(0, 5)} -{" "}
                          {session.endTime.substring(0, 5)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notes Area */}
                  {session.notes && (
                    <div className="flex flex-col gap-1.5 p-3.5 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-850 mt-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <BsJournalText /> Notes
                      </span>
                      <p className="text-xs text-(--color-text-light) leading-relaxed">
                        {session.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Evaluation & Attendance row */}
                <div className="border-t border-(--color-border) pt-4 mt-auto flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {session.attendanceStatus === 1 ? (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                        <BsCheckCircleFill className="text-emerald-500" />
                        Attended
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-rose-600 font-bold">
                        <BsXCircleFill className="text-rose-500" />
                        Absent / Unverified
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {session.evaluationScore !== null ? (
                      <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-900/30 text-xs font-bold">
                        <BsAwardFill className="text-amber-500" />
                        <span>Score: {session.evaluationScore}/10</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-(--color-text-light) font-medium italic">
                        Not evaluated yet
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-(--color-surface) rounded-3xl border-2 border-dashed border-(--color-border) p-16 flex flex-col items-center text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
              <BsJournalText
                size={40}
                className="text-(--color-text-light) opacity-25"
              />
            </div>
            <h2 className="text-xl font-bold text-(--color-text) mb-2">
              No Sessions Matches Your Criteria
            </h2>
            <p className="text-sm text-(--color-text-light) max-w-sm leading-relaxed">
              We couldn't find any training sessions matching your search or
              selected filters. Try updating your filters above.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TrainingSessions;
