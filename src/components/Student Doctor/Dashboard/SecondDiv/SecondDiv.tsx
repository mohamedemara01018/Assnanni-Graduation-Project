import QuickActions from "./QuickActions";
import LearningProgress from "./LearningProgress";
import Patient from "../FirstDiv/Patient";
import { FaGraduationCap } from "react-icons/fa6";
// import { NavLink } from "react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";
import { FiX, FiSend } from "react-icons/fi";

const SecondDiv = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ subject: "", message: "" });

  const {
    data: progress,
    isLoading: isProgressLoading,
    isError: isProgressError,
  } = useQuery({
    queryKey: ["student-progress"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}StudentDoctor/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
    enabled: !!token && !!backendUrl,
  });

  useEffect(() => {
    if (isProgressError) {
      toast.error("Failed to load progress data");
    }
  }, [isProgressError]);

  const {
    data: supervisor,
    isLoading: isSupervisorLoading,
    isError: isSupervisorError,
  } = useQuery({
    queryKey: ["assigned-supervisor"],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}StudentDoctor/assigned-supervisor`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data.data;
    },
    enabled: !!token && !!backendUrl,
  });

  useEffect(() => {
    if (isSupervisorError) {
      toast.error("Failed to load supervisor details");
    }
  }, [isSupervisorError]);

  const contactMutation = useMutation({
    mutationFn: async (data: { subject: string; message: string }) => {
      await axios.post(`${backendUrl}StudentDoctor/contact-supervisor`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success("Message sent to supervisor");
      setIsModalOpen(false);
      setFormData({ subject: "", message: "" });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to send message");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };
  return (
    <div className="flex-1 flex flex-col-reverse gap-8">
      <LearningProgress data={progress} isLoading={isProgressLoading} />

      <div className="bg-(--color-surface) p-6 rounded-2xl shadow-sm border border-(--color-border) flex flex-col gap-6">
        <h1 className="text-xl font-medium text-(--color-text) pb-3 border-b border-(--color-border)">
          Assigned Supervisor
        </h1>
        {isSupervisorLoading ? (
          <div className="py-6 flex justify-center">
            <ScaleLoader color="#00AFE5" height={20} />
          </div>
        ) : supervisor ? (
          <>
            <Patient
              name={supervisor.fullName || supervisor.name}
              imageUrl={supervisor.profileImageUrl || supervisor.imageUrl}
            >
              <p className="text-xs">
                {supervisor.specialty || "Dental Supervisor"}
              </p>
            </Patient>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white text-center font-bold text-sm py-3 rounded-xl w-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 active:scale-95 transition-all"
            >
              Contact Supervisor
            </button>
          </>
        ) : (
          <p className="text-sm text-(--color-text-light) py-4 text-center">
            No supervisor assigned yet.
          </p>
        )}
      </div>
      <div className="flex bg-violet-50 px-6 py-4 items-center gap-4 text-violet-500 border border-violet-100 rounded-2xl shadow-sm">
        <div className="bg-violet-100 p-2 rounded-lg">
          <FaGraduationCap size={24} className="text-violet-600" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-violet-700">
            Student Mode Active
          </h3>
          <p className="text-[10px] text-violet-500 font-medium">
            Complete your training program to unlock full doctor permissions
          </p>
        </div>
      </div>
      {/* Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-(--color-surface) rounded-3xl w-full max-w-md shadow-2xl border border-(--color-border) animate-in zoom-in duration-200">
            <div className="p-6 border-b border-(--color-border) flex justify-between items-center">
              <h2 className="text-xl font-bold text-(--color-text)">
                Message Supervisor
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
              >
                <FiX className="text-xl text-(--color-text-light)" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="Inquiry about..."
                  className="bg-gray-50 dark:bg-gray-800/30 border border-(--color-border) rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-(--color-text)"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your message here..."
                  className="bg-gray-50 dark:bg-gray-800/30 border border-(--color-border) rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-(--color-text) resize-none"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                {contactMutation.isPending ? (
                  "Sending..."
                ) : (
                  <>
                    <FiSend /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <QuickActions />
    </div>
  );
};

export default SecondDiv;
