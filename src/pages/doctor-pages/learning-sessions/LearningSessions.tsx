import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Calendar,
  Clock,
  BookOpen,
  FileText,
  CheckCircle2,
  CircleDot,
  Clock4,
  XCircle,
  Plus,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";

interface LearningSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  notes: string;
  status: "not started" | "started" | "completed" | "canceled";
}

const LearningSessions = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

  // Fetch sessions
  const {
    data: sessions = [],
    isLoading,
    isError,
  } = useQuery<LearningSession[]>({
    queryKey: ["learning-sessions"],
    queryFn: async () => {
      const singleTempSession: LearningSession[] = [];

      try {
        const response = await axios.get(
          `${backendUrl}StudentDoctor/doctor-learning-sessions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const apiData = response.data.data || [];
        // If API returns data, use it; otherwise, use the demo session
        return apiData.length > 0 ? apiData : singleTempSession;
      } catch (error) {
        console.error("Failed to fetch sessions, using demo data:", error);
        return singleTempSession;
      }
    },
    enabled: !!token && !!backendUrl,
  });

  // Fetch supervised students
  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ["my-students"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Doctors/my-students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data || [];
    },
    enabled: isModalOpen,
  });

  // Action Mutations
  const assignStudentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedSessionId || selectedStudentIds.length === 0) return;
      await axios.post(
        `${backendUrl}StudentDoctor/assign`,
        {
          sessionId: parseInt(selectedSessionId),
          studentDoctorIds: selectedStudentIds,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      toast.success("Students assigned successfully");
      setIsModalOpen(false);
      setSelectedStudentIds([]);
      queryClient.invalidateQueries({ queryKey: ["learning-sessions"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to assign students");
    },
  });

  const startMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.post(
        `${backendUrl}StudentDoctor/starttrainsession?sessionId=${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      toast.success("Session started");
      queryClient.invalidateQueries({ queryKey: ["learning-sessions"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to start session");
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.post(
        `${backendUrl}StudentDoctor/completetrainsession/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-sessions"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to complete session",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.put(
        `${backendUrl}StudentDoctor/canceltrainsession/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-sessions"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel session");
    },
  });

  const toggleStudentSelection = (id: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id],
    );
  };

  const getStatusStyles = (status: LearningSession["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "started":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "not started":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "canceled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";
    }
  };

  const getCardBorderStyles = (status: LearningSession["status"]) => {
    switch (status) {
      case "completed":
        return "border-green-200 dark:border-green-900/50 shadow-sm shadow-green-500/5";
      case "started":
        return "border-blue-200 dark:border-blue-900/50 shadow-sm shadow-blue-500/5";
      case "not started":
        return "border-amber-200 dark:border-amber-900/50 shadow-sm shadow-amber-500/5";
      case "canceled":
        return "border-red-200 dark:border-red-900/50 shadow-sm shadow-red-500/5";
      default:
        return "border-gray-200 dark:border-gray-800";
    }
  };

  const getStatusIcon = (status: LearningSession["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "started":
        return <CircleDot className="w-4 h-4" />;
      case "not started":
        return <Clock4 className="w-4 h-4" />;
      case "canceled":
        return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout pageTitle="Learning Sessions">
      <div className="p-6 lg:p-8 w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-(--color-text) tracking-tight">
              Learning Sessions
            </h1>
            <p className="text-(--color-text-muted) mt-1">
              Manage and track your educational sessions
            </p>
          </div>
          <button
            onClick={() => navigate("/doctor-learning-sessions/create")}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 font-medium"
          >
            <Plus className="w-5 h-5" />
            Create New Session
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <ScaleLoader color="#3B82F6" />
          </div>
        ) : isError ? (
          <div className="text-center py-20 bg-(--color-surface) rounded-2xl border border-red-200 dark:border-red-900/30">
            <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-(--color-text)">
              Failed to load sessions
            </h3>
            <p className="text-(--color-text-muted) mt-2 text-sm">
              Please try again later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group bg-(--color-surface) border-2 ${getCardBorderStyles(session.status)} rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none hover:-translate-y-1`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(session.status)}`}
                      >
                        {getStatusIcon(session.status)}
                        {session.status.charAt(0).toUpperCase() +
                          session.status.slice(1)}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-(--color-text-muted) bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                        <Calendar className="w-4 h-4" />
                        {session.date}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-(--color-text) group-hover:text-blue-600 transition-colors">
                        {session.topic}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-(--color-text-muted)">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {session.startTime} - {session.endTime}
                        </div>
                      </div>
                    </div>

                    {session.notes && (
                      <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                        <FileText className="w-4 h-4 mt-1 text-gray-400" />
                        <p className="text-sm text-(--color-text-muted) leading-relaxed">
                          {session.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex lg:flex-col gap-2 shrink-0">
                    <button
                      onClick={() =>
                        navigate(`/doctor-learning-sessions/${session.id}`)
                      }
                      className="flex-1 lg:w-32 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      View Details
                    </button>

                    {session.status !== "completed" &&
                      session.status !== "canceled" && (
                        <>
                          {session.status === "not started" && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedSessionId(session.id);
                                  setIsModalOpen(true);
                                }}
                                className="flex-1 lg:w-32 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                              >
                                Assign Student
                              </button>
                              <button
                                disabled={startMutation.isPending}
                                onClick={() => startMutation.mutate(session.id)}
                                className="flex-1 lg:w-32 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                              >
                                {startMutation.isPending
                                  ? "Starting..."
                                  : "Start"}
                              </button>
                            </>
                          )}

                          {session.status === "started" && (
                            <button
                              disabled={completeMutation.isPending}
                              onClick={() =>
                                completeMutation.mutate(session.id)
                              }
                              className="flex-1 lg:w-32 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                            >
                              {completeMutation.isPending
                                ? "Completing..."
                                : "Complete"}
                            </button>
                          )}

                          <button
                            disabled={cancelMutation.isPending}
                            onClick={() => cancelMutation.mutate(session.id)}
                            className="flex-1 lg:w-32 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          >
                            {cancelMutation.isPending
                              ? "Canceling..."
                              : "Cancel"}
                          </button>
                        </>
                      )}
                  </div>
                </div>
              </div>
            ))}

            {sessions.length === 0 && (
              <div className="text-center py-20 bg-(--color-surface) rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-(--color-text)">
                  No learning sessions yet
                </h3>
                <p className="text-(--color-text-muted) mt-2">
                  Create your first session to start tracking your progress
                </p>
                <button
                  onClick={() => navigate("/doctor-learning-sessions/create")}
                  className="mt-6 inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  Create your first session
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Student Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-(--color-surface) w-full max-w-md rounded-2xl shadow-2xl border border-(--color-border) overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-(--color-border)">
              <div>
                <h2 className="text-xl font-bold text-(--color-text)">
                  Assign Students
                </h2>
                <p className="text-xs text-(--color-text-light) mt-1">
                  Select student doctors for this session
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedStudentIds([]);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                <XCircle size={20} className="text-(--color-text-light)" />
              </button>
            </div>

            <div className="p-6 max-h-[50vh] overflow-y-auto space-y-3">
              {studentsLoading ? (
                <div className="py-10 flex justify-center">
                  <ScaleLoader color="#3B82F6" height={20} />
                </div>
              ) : (studentsData || []).length > 0 ? (
                (studentsData || []).map((student: any) => {
                  const isSelected = selectedStudentIds.includes(
                    student.studentDoctorId,
                  );
                  return (
                    <button
                      key={student.studentDoctorId}
                      onClick={() =>
                        toggleStudentSelection(student.studentDoctorId)
                      }
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-(--color-border) hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                      }`}
                    >
                      <div className="flex-1">
                        <p
                          className={`font-semibold ${isSelected ? "text-blue-600" : "text-(--color-text)"}`}
                        >
                          {student.studentName}
                        </p>
                        <p className="text-xs text-(--color-text-light)">
                          {student.university} • Year {student.yearsOfStudy}
                        </p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-gray-300 group-hover:border-blue-400"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-6 text-(--color-text-light)">
                  No supervised students found.
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-900/30 flex gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedStudentIds([]);
                }}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-(--color-text-light) border border-(--color-border) rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={
                  selectedStudentIds.length === 0 ||
                  assignStudentMutation.isPending
                }
                onClick={() => assignStudentMutation.mutate()}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                {assignStudentMutation.isPending ? (
                  <>
                    <ScaleLoader color="#fff" height={10} width={2} />
                    Assigning...
                  </>
                ) : (
                  `Assign ${selectedStudentIds.length} Student${selectedStudentIds.length !== 1 ? "s" : ""}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LearningSessions;
