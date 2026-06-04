import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  Calendar,
  Clock,
  FileText,
  User,
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  BookOpen,
  ClipboardCheck,
  Star,
} from "lucide-react";

interface AssignedStudent {
  studentDoctorId: number;
  studentName: string;
  university: string;
  yearsOfStudy: number;
  attendance: string;
  score: number;
}

interface SessionDetailsData {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  notes: string;
  status: string;
  assignedStudents: AssignedStudent[];
}

const SessionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<AssignedStudent | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<
    "Attended" | "Absent"
  >("Attended");
  const [evaluationScore, setEvaluationScore] = useState<number>(0);

  const {
    data: session,
    isLoading,
    isError,
  } = useQuery<SessionDetailsData>({
    queryKey: ["session-details", id],
    queryFn: async () => {
      const mockSession: SessionDetailsData = {
        id: Number(id),
        date: "2026-05-13",
        startTime: "10:00:00",
        endTime: "11:30:00",
        topic: "Advanced Implant Techniques",
        notes:
          "This session covers the latest advancements in dental implantology, focusing on minimally invasive procedures and digital planning.",
        status: "started",
        assignedStudents: [
          {
            studentDoctorId: 1,
            studentName: "Mohamed Amer",
            university: "Cairo University",
            yearsOfStudy: 4,
            attendance: "Present",
            score: 92,
          },
          {
            studentDoctorId: 2,
            studentName: "Ahmed Hassan",
            university: "Alexandria University",
            yearsOfStudy: 4,
            attendance: "Present",
            score: 88,
          },
          {
            studentDoctorId: 3,
            studentName: "Sara Ali",
            university: "Ain Shams University",
            yearsOfStudy: 5,
            attendance: "Absent",
            score: 0,
          },
        ],
      };

      try {
        const response = await axios.get(
          `${backendUrl}StudentDoctor/learning-sessions/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        return response.data.data;
      } catch (error) {
        console.error(
          "Failed to fetch session details, using mock data",
          error,
        );
        return mockSession;
      }
    },
    enabled: !!id && !!backendUrl && !!token,
  });

  const attendanceMutation = useMutation({
    mutationFn: async () => {
      if (!selectedStudent || !id) return;
      await axios.post(
        `${backendUrl}StudentDoctor/single/${id}?status=${attendanceStatus}`,
        {
          sessionId: parseInt(id),
          studentDoctorId: selectedStudent.studentDoctorId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      toast.success("Attendance marked successfully");
      setIsAttendanceModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["session-details", id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to mark attendance");
    },
  });

  const evaluationMutation = useMutation({
    mutationFn: async () => {
      if (!selectedStudent || !id) return;
      await axios.post(
        `${backendUrl}StudentDoctor/${id}/evaluate`,
        {
          sessionId: parseInt(id),
          studentDoctorId: selectedStudent.studentDoctorId,
          score: evaluationScore,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      toast.success("Student evaluated successfully");
      setIsEvaluationModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["session-details", id] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to evaluate student",
      );
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Session Details">
        <div className="flex justify-center items-center h-screen">
          <ScaleLoader color="#3B82F6" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !session) {
    return (
      <DashboardLayout pageTitle="Session Details">
        <div className="p-8 text-center">
          <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-(--color-text)">
            Failed to load session details
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 hover:underline flex items-center gap-2 justify-center mx-auto"
          >
            <ChevronLeft size={20} /> Back to Sessions
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Session Details">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/doctor-learning-sessions")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-(--color-text-muted)"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-(--color-text) tracking-tight">
                {session.topic}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${
                    session.status === "completed"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : session.status === "started"
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-amber-100 text-amber-700 border-amber-200"
                  }`}
                >
                  {session.status.charAt(0).toUpperCase() +
                    session.status.slice(1)}
                </span>
                <span className="text-sm text-(--color-text-muted) flex items-center gap-1.5">
                  <Calendar size={14} /> {session.date}
                </span>
                <span className="text-sm text-(--color-text-muted) flex items-center gap-1.5">
                  <Clock size={14} /> {session.startTime} - {session.endTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Session Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-(--color-surface) rounded-2xl p-6 border border-(--color-border) shadow-sm">
              <h3 className="text-lg font-bold text-(--color-text) mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-blue-500" />
                Session Overview
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-(--color-text-muted) uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText size={14} /> Notes
                  </p>
                  <p className="text-sm text-(--color-text) leading-relaxed italic">
                    "{session.notes || "No notes available for this session."}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                    <p className="text-2xl font-bold text-blue-600">
                      {session.assignedStudents.length}
                    </p>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
                      Assigned
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/10 rounded-xl">
                    <p className="text-2xl font-bold text-green-600">
                      {
                        session.assignedStudents.filter(
                          (s) =>
                            s.attendance === "Present" ||
                            s.attendance === "Attended",
                        ).length
                      }
                    </p>
                    <p className="text-[10px] font-bold text-green-400 uppercase tracking-tighter">
                      Present
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Students List */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-(--color-text) flex items-center gap-2 px-2">
              <User size={22} className="text-blue-500" />
              Assigned Student Doctors
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {session.assignedStudents.map((student) => (
                <div
                  key={student.studentDoctorId}
                  className="bg-(--color-surface) rounded-2xl p-5 border border-(--color-border) shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                >
                  {/* Status Indicator */}
                  <div
                    className={`absolute top-0 right-0 w-1.5 h-full ${
                      student.attendance === "Present" ||
                      student.attendance === "Attended"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <User size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-(--color-text) group-hover:text-blue-600 transition-colors line-clamp-1">
                          {student.studentName}
                        </h4>
                        <p className="text-xs text-(--color-text-muted) flex items-center gap-1 mt-0.5">
                          <GraduationCap size={12} /> {student.university}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                        Attendance
                      </p>
                      <div className="flex items-center gap-1.5">
                        {student.attendance === "Present" ||
                        student.attendance === "Attended" ? (
                          <CheckCircle2 size={14} className="text-green-500" />
                        ) : (
                          <XCircle size={14} className="text-red-500" />
                        )}
                        <span
                          className={`text-sm font-bold ${
                            student.attendance === "Present" ||
                            student.attendance === "Attended"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {student.attendance}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                        Session Score
                      </p>
                      <div className="flex items-center gap-1.5">
                        <Award size={14} className="text-blue-500" />
                        <span className="text-sm font-bold text-(--color-text)">
                          {student.score > 0 ? `${student.score}/100` : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      disabled={
                        session.status.toLocaleLowerCase() !== "started"
                      }
                      title={
                        session.status.toLocaleLowerCase() === "not started"
                          ? "Attendance can only be taken once the session has started."
                          : session.status.toLocaleLowerCase() === "completed"
                            ? "Attendance cannot be changed after the session is completed."
                            : session.status.toLowerCase() === "canceled"
                              ? "Attendance cannot be taken for a canceled session."
                              : ""
                      }
                      onClick={() => {
                        setSelectedStudent(student);
                        setAttendanceStatus(
                          student.attendance === "Absent"
                            ? "Attended"
                            : "Attended",
                        );
                        setIsAttendanceModalOpen(true);
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        session.status.toLowerCase() === "started"
                          ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <ClipboardCheck size={14} />
                      Attendance
                    </button>
                    <button
                      disabled={
                        session.status.toLocaleLowerCase() !== "completed"
                      }
                      title={
                        session.status.toLocaleLowerCase() !== "completed"
                          ? "Evaluation is only available after the session is completed."
                          : ""
                      }
                      onClick={() => {
                        setSelectedStudent(student);
                        setEvaluationScore(student.score);
                        setIsEvaluationModalOpen(true);
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        session.status.toLocaleLowerCase() === "completed"
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <Star size={14} />
                      Evaluate
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-(--color-border) flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase">
                    <span>Year {student.yearsOfStudy} Student</span>
                    <span className="text-gray-300">
                      ID: #{student.studentDoctorId}
                    </span>
                  </div>
                </div>
              ))}

              {session.assignedStudents.length === 0 && (
                <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-gray-900/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                  <User className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-(--color-text-muted)">
                    No students assigned to this session yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Modal */}
      {isAttendanceModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-(--color-surface) w-full max-w-sm rounded-2xl shadow-2xl border border-(--color-border) overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-(--color-border) flex justify-between items-center">
              <h3 className="text-lg font-bold text-(--color-text)">
                Mark Attendance
              </h3>
              <button onClick={() => setIsAttendanceModalOpen(false)}>
                <XCircle className="text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-(--color-text-muted)">
                Setting attendance for{" "}
                <span className="font-bold text-(--color-text)">
                  {selectedStudent.studentName}
                </span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAttendanceStatus("Attended")}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    attendanceStatus === "Attended"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-100 dark:border-gray-800"
                  }`}
                >
                  <CheckCircle2
                    className={
                      attendanceStatus === "Attended"
                        ? "text-green-500"
                        : "text-gray-300"
                    }
                  />
                  <span className="text-sm font-bold">Attended</span>
                </button>
                <button
                  onClick={() => setAttendanceStatus("Absent")}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    attendanceStatus === "Absent"
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-100 dark:border-gray-800"
                  }`}
                >
                  <XCircle
                    className={
                      attendanceStatus === "Absent"
                        ? "text-red-500"
                        : "text-gray-300"
                    }
                  />
                  <span className="text-sm font-bold">Absent</span>
                </button>
              </div>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900/30 flex gap-3">
              <button
                onClick={() => setIsAttendanceModalOpen(false)}
                className="flex-1 py-2 text-sm font-bold text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => attendanceMutation.mutate()}
                disabled={attendanceMutation.isPending}
                className="flex-[2] py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {attendanceMutation.isPending ? "Saving..." : "Save Status"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation Modal */}
      {isEvaluationModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-(--color-surface) w-full max-w-sm rounded-2xl shadow-2xl border border-(--color-border) overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-(--color-border) flex justify-between items-center">
              <h3 className="text-lg font-bold text-(--color-text)">
                Evaluate Student
              </h3>
              <button onClick={() => setIsEvaluationModalOpen(false)}>
                <XCircle className="text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-(--color-text-muted)">
                Assign score for{" "}
                <span className="font-bold text-(--color-text)">
                  {selectedStudent.studentName}
                </span>
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Score</span>
                  <span className="text-blue-600 font-bold">
                    {evaluationScore}/100
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={evaluationScore}
                  onChange={(e) => setEvaluationScore(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1">
                  <span>Poor</span>
                  <span>Average</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900/30 flex gap-3">
              <button
                onClick={() => setIsEvaluationModalOpen(false)}
                className="flex-1 py-2 text-sm font-bold text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => evaluationMutation.mutate()}
                disabled={evaluationMutation.isPending}
                className="flex-[2] py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {evaluationMutation.isPending
                  ? "Submitting..."
                  : "Submit Score"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SessionDetails;
