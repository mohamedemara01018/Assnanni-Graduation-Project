import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useParams, useNavigate } from "react-router";
import { IoArrowBack } from "react-icons/io5";
import {
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineDownload,
} from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface MedicalHistoryItem {
  title: string;
  doctorName: string;
  date: string;
  type: string;
  description: string;
  attachments: string[];
}

const fallbackHistory: MedicalHistoryItem[] = [
  {
    title: "Hypertension",
    doctorName: "Dr. Sarah Johnson",
    date: "2025-12-08",
    type: "Consultation",
    description: "Blood pressure elevated. Prescribed medication.",
    attachments: ["blood-test-results.pdf"],
  },
  {
    title: "Annual Checkup",
    doctorName: "Dr. Emily Rodriguez",
    date: "2025-11-20",
    type: "Lab Test",
    description: "All tests within normal range.",
    attachments: ["lab-results.pdf", "x-ray.jpg"],
  },
  {
    title: "Chest X-Ray",
    doctorName: "Dr. Robert Anderson",
    date: "2025-10-15",
    type: "Scan",
    description: "No abnormalities detected.",
    attachments: ["chest-xray.jpg"],
  },
];

const MedicalHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);

  const {
    data: history = fallbackHistory,
    isError,
    isLoading,
  } = useQuery<MedicalHistoryItem[]>({
    queryKey: ["PatientMedicalHistory", id],
    queryFn: async () => {
      if (!id) return fallbackHistory;
      try {
        const response = await axios.get(
          `${backendUrl}Doctors/patient-medical-history/${id}`,
        );
        const data = response.data?.value || response.data;

        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
        return fallbackHistory;
      } catch (err) {
        console.error("Error fetching medical history:", err);
        return fallbackHistory;
      }
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load medical history. Showing default data.");
    }
  }, [isError]);

  const handleDownload = (item: MedicalHistoryItem) => {
    // Simulate downloading the record as a text file
    const content = `Medical Record: ${item.title}\nDoctor: ${item.doctorName}\nDate: ${item.date}\nType: ${item.type}\n\nDescription:\n${item.description}\n\nAttachments: ${item.attachments.join(", ")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.title.replace(/\s+/g, "_")}_Record.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloading ${item.title} record...`);
  };

  const handleDownloadAttachment = (fileName: string) => {
    toast.info(`Downloading attachment: ${fileName}`);
    // In a real app, this would be a link to the actual file
  };

  return (
    <DashboardLayout pageTitle="Medical History">
      <div className="-mt-6 p-8 bg-(--color-bg) min-h-[60vh] rounded-2xl">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-(--color-text-light) hover:text-(--color-text) transition-colors mb-6 cursor-pointer font-medium"
            >
              <IoArrowBack />
              <span>Back</span>
            </button>
            <h1 className="text-3xl text-(--color-text) font-semibold tracking-tight">
              Medical History
            </h1>
          </div>
          <button
            onClick={() =>
              navigate(`/doctor-patients/${id}/medical-history/add`)
            }
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100 active:scale-95 mt-10"
          >
            <FiPlus className="text-xl" />
            <span>Add New Record</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="w-full space-y-6">
            {history.map((item, index) => (
              <div
                key={index}
                className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-8 shadow-sm hover:shadow-md transition-all duration-300 w-full"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-5">
                    {/* Blue Icon Circle */}
                    <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <HiOutlineDocumentText className="text-2xl" />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-(--color-text) mb-1">
                        {item.title}
                      </h2>
                      <p className="text-sm text-(--color-text-light) font-medium mb-3">
                        {item.doctorName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-(--color-text-light) font-medium">
                        <HiOutlineCalendar className="text-base" />
                        <span>{item.date}</span>
                        <span className="mx-1 font-bold">•</span>
                        <span>{item.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(item)}
                    className="p-2 text-(--color-text-light) hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all cursor-pointer"
                    title="Download Record"
                  >
                    <HiOutlineDownload className="text-2xl" />
                  </button>
                </div>

                <div className="mt-6">
                  <p className="text-base text-(--color-text) leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.attachments && item.attachments.length > 0 && (
                  <div className="mt-8">
                    <p className="text-sm font-medium text-(--color-text-light) mb-4">
                      Attachments:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {item.attachments.map((file, i) => (
                        <button
                          key={i}
                          onClick={() => handleDownloadAttachment(file)}
                          className="px-5 py-2 bg-gray-50 dark:bg-gray-800/40 border border-(--color-border) rounded-2xl text-sm font-medium text-(--color-text) hover:border-blue-500/50 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center gap-2"
                        >
                          <span className="truncate max-w-[250px]">{file}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {history.length === 0 && !isLoading && (
              <div className="text-center py-24 bg-(--color-surface) rounded-2xl border border-(--color-border) shadow-sm">
                <HiOutlineDocumentText className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-(--color-text-light) font-medium">
                  No medical history records found.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MedicalHistory;
