import React from "react";
import { useNavigate } from "react-router";

const GenerateReport = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm flex justify-between items-center">
      <div>
        <h3 className="text-gray-900 font-bold text-lg mb-1">
          Generate New Report
        </h3>
        <p className="text-gray-500 text-sm">Create a new comprehensive medical or system report</p>
      </div>
      <button
        onClick={() => navigate("/doctor-reports/generate-new-report")}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl transition-all duration-200 shadow-lg shadow-blue-200 active:scale-95"
      >
        Generate Report
      </button>
    </div>
  );
};

export default GenerateReport;
