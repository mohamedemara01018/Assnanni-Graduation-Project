import { useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiAlertCircle,
  // FiActivity,
  FiClock,
  FiPhone,
  FiArrowLeft,
} from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
// import { BeatLoader } from "react-spinners";
import AllergyForm from "./AllergyForm";

const MedicalReportForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");
  const [isAllergyFormOpen, setIsAllergyFormOpen] = useState(false);

  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const [prescriptions, setPrescriptions] = useState<
    {
      medicationName: string;
      dosage: string;
      frequency: string;
      durationInDays: number;
    }[]
  >([]);
  const [newPrescription, setNewPrescription] = useState({
    medicationName: "",
    dosage: "",
    frequency: "",
    durationInDays: 0,
  });

  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    relationship: "",
    phone: "",
  });

  // const addCondition = () => {
  //   if (newCondition.condition && newCondition.date) {
  //     setHistory([...history, newCondition]);
  //     setNewCondition({ condition: "", date: "", status: "Ongoing" });
  //   }
  // };

  const addPrescription = () => {
    if (newPrescription.medicationName && newPrescription.dosage) {
      setPrescriptions([...prescriptions, newPrescription]);
      setNewPrescription({
        medicationName: "",
        dosage: "",
        frequency: "",
        durationInDays: 0,
      });
    }
  };

  const handleGenerateReport = async () => {
    try {
      if (!patientId) {
        toast.error("Patient ID is missing");
        return;
      }

      if (prescriptions.length === 0) {
        toast.warning("Please add at least one prescription");
        return;
      }

      const requestBody = {
        patientId: Number(patientId),
        items: prescriptions,
      };

      const response = await axios.post(
        `${backendUrl}Prescriptions`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.succeeded) {
        toast.success(
          "Medical report and prescriptions generated successfully",
        );
        navigate(-1);
      } else {
        toast.error(
          response.data.message || "Failed to generate prescriptions",
        );
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(
        (error as any)?.response?.data?.message || "Failed to generate report",
      );
    }
  };

  return (
    <DashboardLayout pageTitle={"Generate Medical Report"}>
      <div className="p-8 bg-gray-50/50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 font-medium"
          >
            <FiArrowLeft /> Back to Reports
          </button>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">
                Medical Report Details
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Fill in the fields below to generate a comprehensive medical
                report.
              </p>
            </div>

            <div className="p-8 space-y-12">
              {/* Allergies Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-red-600">
                    <FiAlertCircle className="text-xl" />
                    <h3 className="font-bold text-lg">Allergies</h3>
                  </div>
                  <button
                    onClick={() => setIsAllergyFormOpen(!isAllergyFormOpen)}
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                  >
                    <FiPlus className={isAllergyFormOpen ? "rotate-45" : ""} />
                    {isAllergyFormOpen ? "Close Form" : "Add Allergy"}
                  </button>
                </div>
                {isAllergyFormOpen && patientId && (
                  <div className="animate-in fade-in slide-in-from-top duration-300">
                    <AllergyForm patientId={patientId} />
                  </div>
                )}
              </section>

              {/* Prescriptions Section */}
              <section>
                <div className="flex items-center gap-2 mb-6 text-green-600">
                  <FiClock className="text-xl" />
                  <h3 className="font-bold text-lg">Current Prescriptions</h3>
                </div>
                <div className="space-y-4 mb-6">
                  {prescriptions.map((p, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex justify-between items-center group animate-in slide-in-from-right duration-200"
                    >
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {p.medicationName}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 font-medium">
                          Dosage:{" "}
                          <span className="text-blue-600 font-bold">
                            {p.dosage}
                          </span>{" "}
                          • Duration: {p.durationInDays} days
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500 text-xs font-bold">
                          {p.frequency}
                        </span>
                        <button
                          onClick={() =>
                            setPrescriptions(
                              prescriptions.filter((_, i) => i !== index),
                            )
                          }
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-dashed border-gray-200 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Medication name..."
                      className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-400"
                      value={newPrescription.medicationName}
                      onChange={(e) =>
                        setNewPrescription({
                          ...newPrescription,
                          medicationName: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Dosage (e.g. 500mg)..."
                      className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-400"
                      value={newPrescription.dosage}
                      onChange={(e) =>
                        setNewPrescription({
                          ...newPrescription,
                          dosage: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Duration in days..."
                      className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-400"
                      value={newPrescription.durationInDays || ""}
                      onChange={(e) =>
                        setNewPrescription({
                          ...newPrescription,
                          durationInDays: Number(e.target.value),
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Frequency (e.g. Twice daily)..."
                      className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-400"
                      value={newPrescription.frequency}
                      onChange={(e) =>
                        setNewPrescription({
                          ...newPrescription,
                          frequency: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button
                    onClick={addPrescription}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-green-700 transition-colors"
                  >
                    Add Prescription
                  </button>
                </div>
              </section>

              {/* Emergency Contact Section */}
              <section>
                <div className="flex items-center gap-2 mb-6 text-purple-600">
                  <FiPhone className="text-xl" />
                  <h3 className="font-bold text-lg">Emergency Contact</h3>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-8 rounded-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="bg-transparent border-b border-gray-200 py-2 font-bold text-gray-900 outline-none focus:border-purple-400 transition-colors"
                        value={emergencyContact.name}
                        onChange={(e) =>
                          setEmergencyContact({
                            ...emergencyContact,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Relationship
                      </label>
                      <input
                        type="text"
                        placeholder="Spouse"
                        className="bg-transparent border-b border-gray-200 py-2 font-bold text-gray-900 outline-none focus:border-purple-400 transition-colors"
                        value={emergencyContact.relationship}
                        onChange={(e) =>
                          setEmergencyContact({
                            ...emergencyContact,
                            relationship: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="+1 (555) 000-0000"
                        className="bg-transparent border-b border-gray-200 py-2 font-bold text-gray-900 outline-none focus:border-purple-400 transition-colors"
                        value={emergencyContact.phone}
                        onChange={(e) =>
                          setEmergencyContact({
                            ...emergencyContact,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="p-8 bg-gray-50 flex gap-4 justify-end">
              <button
                onClick={() => navigate(-1)}
                className="px-8 py-4 text-gray-600 font-bold hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-95 text-lg"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MedicalReportForm;
