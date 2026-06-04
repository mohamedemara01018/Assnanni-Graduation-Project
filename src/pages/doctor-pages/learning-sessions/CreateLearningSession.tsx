import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import axios from "axios";
import Cookies from "js-cookie";
import { ScaleLoader } from "react-spinners";
import { Calendar, Clock, BookOpen, FileText } from "lucide-react";

interface CreateSessionInputs {
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  notes: string;
}

const CreateLearningSession = () => {
  const navigate = useNavigate();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateSessionInputs>();

  const onSubmit = async (data: CreateSessionInputs) => {
    try {
      // Format time to HH:MM:SS as requested
      const formattedData = {
        ...data,
        startTime:
          data.startTime.length === 5 ? `${data.startTime}:00` : data.startTime,
        endTime:
          data.endTime.length === 5 ? `${data.endTime}:00` : data.endTime,
      };

      const response = await axios.post(
        `${backendUrl}StudentDoctor/createtrainsession`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.succeeded) {
        toast.success("Learning session created successfully");
        navigate("/doctor-learning-sessions");
      } else {
        toast.error(response.data.message || "Failed to create session");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <DashboardLayout pageTitle="Create Learning Session">
      <div className="-mt-6 rounded-2xl bg-(--color-bg) p-6 max-w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-(--color-text) tracking-tight">
            New Learning Session
          </h1>
          <p className="text-(--color-text-muted) mt-1">
            Schedule a new educational session for student doctors
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-8 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Topic Input */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-(--color-text)">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Session Topic
              </label>
              <input
                {...register("topic", { required: "Topic is required" })}
                placeholder="e.g. Advanced Implant Techniques"
                className={`w-full rounded-xl border ${
                  errors.topic ? "border-red-500" : "border-(--color-border)"
                } bg-(--color-bg) px-4 py-3 text-(--color-text) placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
              />
              {errors.topic && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.topic.message}
                </p>
              )}
            </div>

            {/* Date Input */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-(--color-text)">
                <Calendar className="w-4 h-4 text-blue-500" />
                Date
              </label>
              <input
                type="date"
                {...register("date", { required: "Date is required" })}
                className={`w-full rounded-xl border ${
                  errors.date ? "border-red-500" : "border-(--color-border)"
                } bg-(--color-bg) px-4 py-3 text-(--color-text) focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
              />
              {errors.date && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-(--color-text)">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Start Time
                </label>
                <input
                  type="time"
                  {...register("startTime", { required: "Required" })}
                  className={`w-full rounded-xl border ${
                    errors.startTime
                      ? "border-red-500"
                      : "border-(--color-border)"
                  } bg-(--color-bg) px-4 py-3 text-(--color-text) focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-(--color-text)">
                  <Clock className="w-4 h-4 text-blue-500" />
                  End Time
                </label>
                <input
                  type="time"
                  {...register("endTime", { required: "Required" })}
                  className={`w-full rounded-xl border ${
                    errors.endTime
                      ? "border-red-500"
                      : "border-(--color-border)"
                  } bg-(--color-bg) px-4 py-3 text-(--color-text) focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                />
              </div>
            </div>

            {/* Notes Input */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-(--color-text)">
                <FileText className="w-4 h-4 text-blue-500" />
                Notes
              </label>
              <textarea
                {...register("notes")}
                rows={4}
                placeholder="Add session details, goals, or requirements..."
                className="w-full resize-none rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-3 text-(--color-text) placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => navigate("/doctor-learning-sessions")}
              className="flex-1 px-6 py-3.5 rounded-xl border border-(--color-border) text-(--color-text) font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <ScaleLoader color="#fff" height={15} width={2} />
                  Creating Session...
                </>
              ) : (
                "Create Session"
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateLearningSession;
