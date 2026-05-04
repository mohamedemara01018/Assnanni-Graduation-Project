import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { IoArrowBack } from "react-icons/io5";
import { FiPlus, FiTrash2, FiFileText } from "react-icons/fi";
import { toast } from "react-toastify";

const AddMedicalHistoryRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    doctorName: "",
    date: new Date().toISOString().split("T")[0],
    type: "Consultation",
    description: "",
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.doctorName || !formData.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // In a real app, this would be an API call
    console.log("Saving medical record:", { ...formData, attachments });
    toast.success("Medical record added successfully!");
    navigate(`/doctor-patients/${id}/medical-history`);
  };

  return (
    <DashboardLayout pageTitle="Add Medical Record">
      <div className="p-8 bg-gray-50/50 min-h-screen">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 font-medium"
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
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    name="doctorName"
                    required
                    placeholder="e.g. Dr. Sarah Johnson"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                    value={formData.doctorName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Date of Record
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Record Type
                  </label>
                  <select
                    name="type"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all cursor-pointer"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option>Consultation</option>
                    <option>Lab Test</option>
                    <option>Scan</option>
                    <option>Surgery</option>
                    <option>Emergency</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Description / Notes
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  placeholder="Enter details about the diagnosis, symptoms, and prescribed treatments..."
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all resize-none"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* Attachments Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Attachments
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
                        className="text-blue-400 hover:text-red-500 transition-colors"
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
                  className="flex-1 py-4 text-gray-600 font-bold hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-95"
                >
                  Save Record
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
