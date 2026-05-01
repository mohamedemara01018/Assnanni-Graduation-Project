import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useRef, useState, useEffect } from "react";
import { LuUpload } from "react-icons/lu";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

interface ScanFormData {
  patientId: number;
  notes: string;
}

const fallbackPatients = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Sarah Johnson" },
  { id: 3, name: "Michael Brown" },
  { id: 4, name: "Emma Davis" },
  { id: 5, name: "David Wilson" },
  { id: 6, name: "Lisa Anderson" },
];

const Scan = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScanFormData>();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [patients, setPatients] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${backendUrl}Doctors/patients`);
        const data = response.data?.value || response.data;
        if (Array.isArray(data) && data.length > 0) {
          setPatients(data);
        } else {
          setPatients(fallbackPatients);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatients(fallbackPatients);
      }
    };
    fetchPatients();
  }, [backendUrl]);

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

  const onSubmit = async (data: ScanFormData) => {
    if (!selectedFile) {
      toast.error("Please select a medical scan file to upload");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("File", selectedFile);
    formData.append("PatientId", data.patientId.toString());
    formData.append("Notes", data.notes || "");

    try {
      await axios.post(`${backendUrl}Scans`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Medical scan uploaded and analysis initiated!");
      setSelectedFile(null);
      setPreviewUrl(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to upload scan. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout pageTitle={"Upload Medical Scan"}>
      <div className="-mt-6 bg-(--color-bg) min-h-[85vh] rounded-2xl p-8 flex flex-col items-center">
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
                    className={`text-6xl mb-5 transition-colors ${dragActive ? "text-blue-500" : "text-gray-400"}`}
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

          {/* Patient Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-(--color-text-light) mb-3">
              Select Patient
            </label>
            <div className="relative">
              <select
                {...register("patientId", {
                  required: "Patient selection is required",
                })}
                className="w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-800/30 border border-(--color-border) rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-(--color-text) appearance-none cursor-pointer font-medium"
              >
                <option value="">Choose a patient...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (ID: {p.id})
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
            disabled={isSubmitting}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl transition-all shadow-lg shadow-blue-500/30 flex justify-center items-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <span>Upload and Analyze</span>
            )}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Scan;
