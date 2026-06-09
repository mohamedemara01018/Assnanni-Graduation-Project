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
import { useRef, useState } from "react";
import type { MedicalHistoryItem } from "@/interfaces/doctorInterfaces";
import { HiOutlinePaperClip } from "react-icons/hi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { NotFound } from "@/components/notfound/NotFound";

const MedicalHistoryInDoctorDashboard = () => {
  const role = useSelector((state: RootState) => state.auth.role);
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeRecordId, setActiveRecordId] = useState<number | null>(null);

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["PatientMedicalHistory", id, role],
    queryFn: async () => {
      const endpoint =
        role === "receptionist"
          ? `Receptionist/${id}/medical-history`
          : `Doctors/patient-medical-history/${id}`;

      const response = await axios.get(`${backendUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!id && !!token,
  });

  const uploadAttachmentMutation = useMutation({
    mutationFn: async ({
      recordId,
      file,
    }: {
      recordId: number;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(
        `${backendUrl}MedicalRecords/${recordId}/attachments`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
    },
    onSuccess: () => {
      toast.success("Attachment uploaded successfully");
      queryClient.invalidateQueries({
        queryKey: ["PatientMedicalHistory", id],
      });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to upload attachment");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeRecordId) {
      uploadAttachmentMutation.mutate({ recordId: activeRecordId, file });
    }
  };

  const triggerUpload = (recordId: number) => {
    setActiveRecordId(recordId);
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (isSuccess && data?.succeeded) {
      toast.success(data?.message || "Medical history loaded successfully");
    }
    if (isError) {
      console.error("Error fetching medical history:", error);
      toast.error(
        (error as any)?.response?.data?.message ||
        "Failed to load medical history",
      );
    }
  }, [isSuccess, isError, error, data]);

  const history: MedicalHistoryItem[] = data?.data || [];
  const latestMedicalRecordId = history.reduce<number | null>((latest, item) => {
    if (latest === null) return item.id;

    const latestRecord = history.find((record) => record.id === latest);
    if (!latestRecord) return item.id;

    return new Date(item.date).getTime() > new Date(latestRecord.date).getTime()
      ? item.id
      : latest;
  }, null);

  const handleDownload = (item: MedicalHistoryItem) => {
    // Simulate downloading the record as a text file
    const content = `Medical Record: ${item.title}\nDoctor: ${item.doctorName
      }\nDate: ${item.date}\nType: ${item.type}\n\nDescription:\n${item.description
      }\n\nAttachments: ${item.attachments.map((a) => a.fileName).join(", ")}`;
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

  const handleDownloadAttachment = async (file: {
    fileName: string;
    url: string;
  }) => {
    toast.info(`Downloading attachment: ${file.fileName}`);

    let fullUrl = file.url;
    if (!file.url.startsWith("http")) {
      const cleanBackendUrl = backendUrl.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;
      const cleanFileUrl = file.url.startsWith("/") ? file.url : `/${file.url}`;

      if (cleanFileUrl.startsWith(cleanBackendUrl)) {
        fullUrl = cleanFileUrl;
      } else {
        fullUrl = `${cleanBackendUrl}${cleanFileUrl}`;
      }
    }

    // Extract extension from URL
    const urlParts = file.url.split(".");
    const extension = urlParts.length > 1 ? `.${urlParts.pop()}` : "";

    // Ensure filename has the extension
    let downloadName = file.fileName;
    if (
      extension &&
      !downloadName.toLowerCase().endsWith(extension.toLowerCase())
    ) {
      downloadName += extension;
    }

    try {
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      const link = document.createElement("a");
      link.href = fullUrl;
      link.download = downloadName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DashboardLayout pageTitle="Medical History">
      <div className="-mt-6 p-8 bg-(--color-bg) min-h-[60vh] rounded-2xl">
        {/* Hidden File Input */}
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

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
          </div>
          {role === "doctor" && (
            <button
              onClick={() =>
                navigate(
                  `/doctor-reports/generate-new-report?patientId=${id || 0}&medicalRecordId=${latestMedicalRecordId || 0}`,
                )
              }
              disabled={!latestMedicalRecordId}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100 active:scale-95 mt-10 cursor-pointer"
            >
              <FiPlus className="text-xl" />
              <span>Add Prescription</span>
            </button>
          )}
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
                    <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
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

                  <div className="flex items-center gap-2">
                    {/* Add Attachment Button */}
                    {role === "doctor" && (
                      <button
                        onClick={() => triggerUpload(item.id)}
                        disabled={
                          uploadAttachmentMutation.isPending &&
                          activeRecordId === item.id
                        }
                        className="p-2 text-(--color-text-light) hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                        title="Add Attachment"
                      >
                        {uploadAttachmentMutation.isPending &&
                          activeRecordId === item.id ? (
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <HiOutlinePaperClip className="text-2xl" />
                        )}
                      </button>
                    )}

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(item)}
                      className="p-2 text-(--color-text-light) hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all cursor-pointer"
                      title="Download Record"
                    >
                      <HiOutlineDownload className="text-2xl" />
                    </button>
                  </div>
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
                      {item.attachments.map((file, i) => {
                        const extension =
                          file.url.split(".").pop()?.toUpperCase() || "FILE";
                        return (
                          <button
                            key={i}
                            onClick={() => handleDownloadAttachment(file)}
                            className="px-4 py-2 bg-gray-50 dark:bg-gray-800/40 border border-(--color-border) rounded-2xl text-sm font-medium text-(--color-text) hover:border-blue-500/50 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center gap-3 group"
                          >
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-md">
                              {extension}
                            </span>
                            <span className="truncate max-w-[200px]">
                              {file.fileName}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {history.length === 0 && !isLoading && (
              <div className="text-center py-24 bg-(--color-surface) rounded-2xl border border-(--color-border) shadow-sm">
                <NotFound subMessage=" No medical history records found." />
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};


export default MedicalHistoryInDoctorDashboard