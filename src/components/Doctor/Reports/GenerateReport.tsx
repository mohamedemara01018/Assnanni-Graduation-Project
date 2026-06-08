import { useNavigate } from "react-router";

const GenerateReport = ({
  patientId,
  appointmentId,
  medicalRecordId,
}: {
  patientId?: number;
  appointmentId?: number;
  medicalRecordId?: number;
}) => {
  const navigate = useNavigate();
  const queryParts = new URLSearchParams();
  queryParts.set("patientId", String(patientId || 0));

  if (medicalRecordId) {
    queryParts.set("medicalRecordId", String(medicalRecordId));
  } else {
    queryParts.set("appointmentId", String(appointmentId || 0));
  }

  return (
    <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm flex justify-between items-center">
      <div>
        <h3 className="text-gray-900 font-bold text-lg mb-1">
          Generate New Report
        </h3>
        <p className="text-gray-500 text-sm">
          Create a new comprehensive medical or system report
        </p>
      </div>
      <button
        onClick={() =>
          navigate(`/doctor-reports/generate-new-report?${queryParts.toString()}`)
        }
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl transition-all duration-200 shadow-lg shadow-blue-200 active:scale-95 cursor-pointer"
      >
        Generate Report
      </button>
    </div>
  );
};

export default GenerateReport;
