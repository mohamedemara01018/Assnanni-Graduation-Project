import { useRef, useState, useEffect } from "react";
import { LuUpload } from "react-icons/lu";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { ScanFormData } from "@/interfaces/doctorInterfaces";
import { useQuery, useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";

const ScanUpload = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScanFormData>({
    defaultValues: {
      scanType: "X-ray",
      priority: "Normal",
    },
  });
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<
    "idle" | "sending" | "analyzing"
  >("idle");
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Fetch recent patients
  const { data: recentPatientsData, isLoading: isLoadingPatients } = useQuery({
    queryKey: ["RecentPatients"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Doctors/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
  });

  const recentPatients = Array.isArray(recentPatientsData?.data.items)
    ? recentPatientsData?.data.items
    : [];

  // Post Scan Mutation
  const scanMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axios.post(`${backendUrl}Scans`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 0;
          if (!total) return;

          const percent = Math.min(
            100,
            Math.round((progressEvent.loaded / total) * 100),
          );
          setUploadProgress(percent);
          setUploadStage(percent < 10 ? "sending" : "analyzing");
        },
      });
    },
    onSuccess: () => {
      setSelectedFile(null);
      setPreviewUrl(null);
      setFormSubmitted(false);
      setUploadProgress(100);
      setUploadStage("idle");
      window.setTimeout(() => {
        setUploadProgress(0);
      }, 500);
      reset();
    },
    onError: (error: any) => {
      console.error("Upload error:", error);
      setUploadProgress(0);
      setUploadStage("idle");
      toast.error(
        error.response?.data?.message || "Failed to upload scan. Try again.",
      );
    },
  });

  const handleFile = (file: File) => {
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onSubmit = (data: ScanFormData) => {
    setFormSubmitted(true);
    if (!selectedFile) {
      toast.error("Please select a medical scan file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("File", selectedFile);
    formData.append("PatientId", data.patientId.toString());
    formData.append("ScanType", data.scanType);
    formData.append("Priority", data.priority);
    formData.append("Notes", data.notes || "");

    setUploadStage("sending");
    setUploadProgress(0);
    scanMutation.mutate(formData);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-(--color-text) mb-10 text-center">
        Upload Medical Scan
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl bg-(--color-surface) rounded-3xl border border-(--color-border) p-10 shadow-sm"
      >
        {/* Upload Area */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-(--color-text-light) mb-4">
            Upload Scan
          </label>

          <div
            className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer group ${
              dragActive
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                : !selectedFile && formSubmitted
                  ? "border-red-500 bg-red-50/10 dark:bg-red-900/10"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/10"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputFileRef.current?.click()}
          >
            {previewUrl ? (
              <div className="relative w-full max-w-sm aspect-square mb-6 rounded-xl overflow-hidden border border-(--color-border) shadow-inner bg-gray-50 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Scan Preview"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <p className="text-white font-bold text-sm bg-black/20 px-4 py-2 rounded-lg">
                    Click to change image
                  </p>
                </div>
              </div>
            ) : (
              <>
                <LuUpload
                  className={`text-6xl mb-5 transition-colors ${
                    dragActive ? "text-blue-500" : "text-gray-400"
                  }`}
                />

                <div className="text-center mb-8">
                  <h3 className="text-lg font-medium text-(--color-text) mb-2">
                    {selectedFile
                      ? selectedFile.name
                      : "Drag and drop or click to upload"}
                  </h3>
                  <p className="text-sm text-(--color-text-light)">
                    DICOM, JPG, PNG (MAX. 50MB)
                  </p>
                </div>
              </>
            )}

            <button
              type="button"
              className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20"
            >
              Choose File
            </button>

            <input
              type="file"
              className="hidden"
              ref={inputFileRef}
              onChange={handleFileChange}
              accept=".dicom,.jpg,.jpeg,.png,.pdf"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8 max-md:grid-cols-1">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-(--color-text-light) mb-3">
              Select Patient
            </label>
            <div className="relative">
              <select
                {...register("patientId", {
                  required: "Patient selection is required",
                })}
                className={`w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-800/30 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-(--color-text) appearance-none cursor-pointer font-medium disabled:opacity-50 ${
                  errors.patientId
                    ? "border-red-500"
                    : "border-(--color-border)"
                }`}
                disabled={isLoadingPatients}
              >
                <option value="">
                  {isLoadingPatients
                    ? "Loading patients..."
                    : "Choose a patient..."}
                </option>
                {recentPatients.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.id}
                  </option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.patientId && (
              <p className="text-red-500 text-xs mt-2 font-medium px-1">
                {errors.patientId.message}
              </p>
            )}
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-medium text-(--color-text-light) mb-3">
              Priority Level
            </label>
            <div className="relative">
              <select
                {...register("priority", {
                  required: "Priority is required",
                })}
                className={`w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-800/30 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-(--color-text) appearance-none cursor-pointer font-medium ${
                  errors.priority ? "border-red-500" : "border-(--color-border)"
                }`}
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Emergency">Emergency</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.priority && (
              <p className="text-red-500 text-xs mt-2 font-medium px-1">
                {errors.priority.message}
              </p>
            )}
          </div>
        </div>

        {/* Scan Type (Fixed as X-ray) */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-(--color-text-light) mb-3">
            Scan Type
          </label>
          <input
            type="text"
            {...register("scanType")}
            readOnly
            className="w-full px-5 py-4 bg-gray-100 dark:bg-gray-800/50 border border-(--color-border) rounded-2xl text-(--color-text) font-medium cursor-not-allowed opacity-80 focus:outline-none"
          />
          <p className="text-[10px] text-gray-400 mt-2 px-1">
            * The current system only supports X-ray analysis.
          </p>
        </div>

        {/* Additional Notes */}
        <div className="mb-10">
          <label className="block text-sm font-medium text-(--color-text-light) mb-3">
            Additional Notes
          </label>
          <textarea
            {...register("notes")}
            rows={4}
            className="w-full px-5 py-5 bg-gray-50/50 dark:bg-gray-800/30 border border-(--color-border) rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-(--color-text) resize-none placeholder:text-gray-400"
            placeholder="Any symptoms or relevant information..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={scanMutation.isPending}
          className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl transition-all shadow-lg shadow-blue-500/30 flex justify-center items-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {scanMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Uploading...</span>
            </>
          ) : (
            <span>Upload and Analyze</span>
          )}
        </button>

        {(scanMutation.isPending || uploadProgress > 0) && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm font-semibold text-(--color-text)">
              <span>
                {uploadStage === "sending"
                  ? "Sending to AI Model"
                  : "The AI analysing the X-Ray"}
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-200 ease-linear"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ScanUpload;
