import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { IoArrowBack } from "react-icons/io5";
import { FiPlus, FiTrash2, FiFileText } from "react-icons/fi";
import { toast } from "react-toastify";
import { useMyProfile } from "@/hooks/useMyProfile";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";

const AddMedicalHistoryRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const { data: profileData } = useMyProfile();

  const [formData, setFormData] = useState({
    title: "",
    diagnosis: "",
    notes: "",
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      // 1. Create the Medical Record
      const response = await axios.post(
        `${backendUrl}MedicalRecords`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const medicalRecordId = response.data?.data || response.data;

      // 2. Upload attachments if they exist
      if (attachments.length > 0 && medicalRecordId) {
        const uploadPromises = attachments.map((file) => {
          const formData = new FormData();
          formData.append("file", file);

          return axios.post(
            `${backendUrl}MedicalRecords/${medicalRecordId}/attachments`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            },
          );
        });

        await Promise.all(uploadPromises);
      }
    },
    onSuccess: () => {
      navigate(`/doctor-patients/${id}/medical-history`);
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message ||
          "Failed to add medical record or attachments",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.diagnosis) {
      toast.error("Please fill in the required fields (Title and Diagnosis).");
      return;
    }

    if (!appointmentId) {
      toast.error(
        "No valid appointment ID found. Please go back and try again.",
      );
      return;
    }

    const payload = {
      appointmentId: Number(appointmentId),
      title: formData.title,
      diagnosis: formData.diagnosis,
      notes: formData.notes,
    };

    mutation.mutate(payload);
  };

  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <DashboardLayout pageTitle="Add Medical Record">
      <div className="p-8 bg-gray-50/50 min-h-screen">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 font-medium cursor-pointer"
          >
            <IoArrowBack />
            <span>Back to Medical History</span>
          </button>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900">
                Add New Medical Record
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Enter the details of the patient's medical condition or
                consultation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Basic Info Grid (Read-only) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={profileData?.fullName || "Loading..."}
                    className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm cursor-not-allowed text-gray-500 font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Date of Record
                  </label>
                  <input
                    type="date"
                    disabled
                    value={currentDate}
                    className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm cursor-not-allowed text-gray-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 opacity-80">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Record Type
                </label>
                <input
                  type="text"
                  disabled
                  value="Consultation"
                  className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm cursor-not-allowed text-gray-500 font-medium w-full md:w-1/2"
                />
              </div>

              <hr className="border-gray-100" />

              {/* Editable Fields */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Condition Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Hypertension"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Diagnosis
                </label>
                <textarea
                  name="diagnosis"
                  required
                  rows={3}
                  placeholder="Enter the primary diagnosis..."
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all resize-none"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Enter symptoms, observations, or specific notes..."
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all resize-none"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>

              {/* Attachments Section - UI Kept but currently not in payload as per request */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Attachments (Optional)
                </label>
                <div className="flex flex-wrap gap-3">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl flex items-center gap-3 animate-in zoom-in duration-200"
                    >
                      <FiFileText className="text-blue-600" />
                      <span className="text-sm font-bold text-blue-700 truncate max-w-[150px]">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-blue-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                  <label className="border-2 border-dashed border-gray-200 rounded-xl px-6 py-2 flex items-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer">
                    <FiPlus />
                    <span className="text-sm font-bold">Add File</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 py-4 text-gray-600 font-bold hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-95 cursor-pointer"
                >
                  {mutation.isPending ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddMedicalHistoryRecord;
