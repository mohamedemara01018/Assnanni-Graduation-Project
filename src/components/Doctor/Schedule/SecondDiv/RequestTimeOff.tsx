import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { X, Clock } from "lucide-react";

interface TimeOffForm {
  durationInMinutes: number;
  note?: string;
}

const RequestTimeOff = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [remainingTimeText, setRemainingTimeText] = useState("");

  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  useEffect(() => {
    const checkDisabled = () => {
      const disabledUntil = localStorage.getItem("timeOffDisabledUntil");
      if (disabledUntil) {
        const remainingMs = parseInt(disabledUntil) - Date.now();
        if (remainingMs > 0) {
          setIsDisabled(true);
          const minutes = Math.floor(remainingMs / 60000);
          const seconds = Math.floor((remainingMs % 60000) / 1000);
          setRemainingTimeText(`${minutes}m ${seconds}s`);
        } else {
          setIsDisabled(false);
          localStorage.removeItem("timeOffDisabledUntil");
          setRemainingTimeText("");
        }
      }
    };

    checkDisabled();
    const interval = setInterval(checkDisabled, 1000);
    return () => clearInterval(interval);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimeOffForm>();

  const mutation = useMutation({
    mutationFn: async (data: TimeOffForm) => {
      const now = new Date();
      const startTime = new Date(now.getTime() + 1 * 60 * 1000);
      const payload = {
        startTime: startTime.toISOString(),
        durationInMinutes: Number(data.durationInMinutes),
        note: data.note || " ",
      };
      console.log(payload);
      await axios.post(`${backendUrl}Doctors/time-request-off`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (_, variables) => {
      const duration = Number(variables.durationInMinutes);
      toast.success(
        `You will take the break after 5 minutes for ${duration} minutes`,
      );

      const disableDurationMs = (duration + 5) * 60 * 1000;
      const until = Date.now() + disableDurationMs;
      localStorage.setItem("timeOffDisabledUntil", until.toString());
      setIsDisabled(true);

      setIsOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to submit time off request",
      );
    },
  });

  const onSubmit = (data: TimeOffForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col gap-4 bg-(--color-surface) p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <h3 className="text-lg font-medium text-(--color-text)">
        Time Off Requests
      </h3>
      <button
        onClick={() => !isDisabled && setIsOpen(true)}
        disabled={isDisabled}
        className={`w-full border rounded-xl py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
          isDisabled
            ? "bg-gray-50 dark:bg-gray-800/40 text-gray-400 border-gray-100 cursor-not-allowed"
            : "border-gray-200 dark:border-gray-700 text-(--color-text) hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
        }`}
      >
        {isDisabled ? (
          <>
            <Clock size={16} />
            Break Active ({remainingTimeText})
          </>
        ) : (
          "Request Time Off"
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-(--color-surface) w-full max-w-md rounded-2xl shadow-2xl border border-(--color-border) overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-(--color-border)">
              <h2 className="text-xl font-bold text-(--color-text)">
                Request Time Off
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} className="text-(--color-text-light)" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-(--color-text-light)">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  {...register("durationInMinutes", {
                    required: "Duration is required",
                    min: { value: 1, message: "Minimum 1 minute" },
                  })}
                  placeholder="e.g. 60"
                  className="w-full bg-gray-50/50 dark:bg-gray-800/20 border border-(--color-border) rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-(--color-text)"
                />
                {errors.durationInMinutes && (
                  <p className="text-xs text-red-500">
                    {errors.durationInMinutes.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-(--color-text-light)">
                  Note
                </label>
                <textarea
                  {...register("note")}
                  placeholder="Reason for time off (optional)..."
                  rows={4}
                  className="w-full bg-gray-50/50 dark:bg-gray-800/20 border border-(--color-border) rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-(--color-text) resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 border border-(--color-border) rounded-xl text-sm font-medium text-(--color-text) hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {mutation.isPending ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestTimeOff;
