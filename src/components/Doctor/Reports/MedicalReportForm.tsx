import React, { useState } from "react";
import { FiPlus, FiTrash2, FiAlertCircle, FiActivity, FiClock, FiPhone, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";

const MedicalReportForm = () => {
  const navigate = useNavigate();
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState("");

  const [history, setHistory] = useState<{ condition: string; date: string; status: string }[]>([]);
  const [newCondition, setNewCondition] = useState({ condition: "", date: "", status: "Ongoing" });

  const [prescriptions, setPrescriptions] = useState<{ medication: string; prescribedBy: string; date: string; frequency: string }[]>([]);
  const [newPrescription, setNewPrescription] = useState({ medication: "", prescribedBy: "", date: "", frequency: "" });

  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    relationship: "",
    phone: "",
  });

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const addCondition = () => {
    if (newCondition.condition && newCondition.date) {
      setHistory([...history, newCondition]);
      setNewCondition({ condition: "", date: "", status: "Ongoing" });
    }
  };

  const addPrescription = () => {
    if (newPrescription.medication && newPrescription.prescribedBy) {
      setPrescriptions([...prescriptions, newPrescription]);
      setNewPrescription({ medication: "", prescribedBy: "", date: "", frequency: "" });
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
              <h2 className="text-2xl font-bold text-gray-900">Medical Report Details</h2>
              <p className="text-gray-500 text-sm mt-1">Fill in the fields below to generate a comprehensive medical report.</p>
            </div>

            <div className="p-8 space-y-12">
              {/* Allergies Section */}
              <section>
                <div className="flex items-center gap-2 mb-6 text-red-600">
                  <FiAlertCircle className="text-xl" />
                  <h3 className="font-bold text-lg">Allergies</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {allergies.length === 0 && <p className="text-gray-400 text-sm italic">No allergies added yet.</p>}
                  {allergies.map((allergy, index) => (
                    <span key={index} className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                      {allergy}
                      <button onClick={() => removeAllergy(index)} className="hover:text-red-800">
                        <FiPlus className="rotate-45" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add new allergy (e.g. Penicillin)..."
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none flex-1 transition-all"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addAllergy()}
                  />
                  <button onClick={addAllergy} className="bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100">
                    Add
                  </button>
                </div>
              </section>

              {/* Medical History Section */}
              <section>
                <div className="flex items-center gap-2 mb-6 text-blue-600">
                  <FiActivity className="text-xl" />
                  <h3 className="font-bold text-lg">Medical History</h3>
                </div>
                <div className="space-y-4 mb-6">
                  {history.map((item, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex justify-between items-center group animate-in slide-in-from-left duration-200">
                      <div>
                        <h4 className="font-bold text-gray-900">{item.condition}</h4>
                        <p className="text-xs text-gray-500 mt-1 font-medium italic">Diagnosed: {item.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="bg-yellow-50 text-yellow-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          {item.status}
                        </span>
                        <button 
                          onClick={() => setHistory(history.filter((_, i) => i !== index))}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-dashed border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Condition name..."
                      className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-400"
                      value={newCondition.condition}
                      onChange={(e) => setNewCondition({...newCondition, condition: e.target.value})}
                    />
                    <input
                      type="date"
                      className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-400"
                      value={newCondition.date}
                      onChange={(e) => setNewCondition({...newCondition, date: e.target.value})}
                    />
                    <button 
                      onClick={addCondition}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                    >
                      Add Condition
                    </button>
                  </div>
                </div>
              </section>

              {/* Prescriptions Section */}
              <section>
                <div className="flex items-center gap-2 mb-6 text-green-600">
                  <FiClock className="text-xl" />
                  <h3 className="font-bold text-lg">Current Prescriptions</h3>
                </div>
                <div className="space-y-4 mb-6">
                  {prescriptions.map((p, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex justify-between items-center group animate-in slide-in-from-right duration-200">
                      <div>
                        <h4 className="font-bold text-gray-900">{p.medication}</h4>
                        <p className="text-xs text-gray-500 mt-1 font-medium">
                          Prescribed by <span className="text-blue-600 font-bold">{p.prescribedBy}</span> on {p.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500 text-xs font-bold">{p.frequency}</span>
                        <button 
                          onClick={() => setPrescriptions(prescriptions.filter((_, i) => i !== index))}
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
                      value={newPrescription.medication}
                      onChange={(e) => setNewPrescription({...newPrescription, medication: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Prescribed by..."
                      className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-400"
                      value={newPrescription.prescribedBy}
                      onChange={(e) => setNewPrescription({...newPrescription, prescribedBy: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="date"
                      className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-400"
                      value={newPrescription.date}
                      onChange={(e) => setNewPrescription({...newPrescription, date: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Frequency (e.g. Twice daily)..."
                      className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-400"
                      value={newPrescription.frequency}
                      onChange={(e) => setNewPrescription({...newPrescription, frequency: e.target.value})}
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
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="bg-transparent border-b border-gray-200 py-2 font-bold text-gray-900 outline-none focus:border-purple-400 transition-colors"
                        value={emergencyContact.name}
                        onChange={(e) => setEmergencyContact({...emergencyContact, name: e.target.value})}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Relationship</label>
                      <input
                        type="text"
                        placeholder="Spouse"
                        className="bg-transparent border-b border-gray-200 py-2 font-bold text-gray-900 outline-none focus:border-purple-400 transition-colors"
                        value={emergencyContact.relationship}
                        onChange={(e) => setEmergencyContact({...emergencyContact, relationship: e.target.value})}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                      <input
                        type="text"
                        placeholder="+1 (555) 000-0000"
                        className="bg-transparent border-b border-gray-200 py-2 font-bold text-gray-900 outline-none focus:border-purple-400 transition-colors"
                        value={emergencyContact.phone}
                        onChange={(e) => setEmergencyContact({...emergencyContact, phone: e.target.value})}
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
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-95 text-lg">
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
