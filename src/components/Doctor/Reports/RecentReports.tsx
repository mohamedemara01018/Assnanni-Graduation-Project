import React from "react";
import Card from "./Card";

const reports = [
  {
    title: "Raw Data Export",
    date: "2024-05-02",
    size: "12.4 MB",
    type: "File" as const,
    fileUrl: "/report.pdf",
  },

  {
    title: "Patient Satisfaction Survey",
    date: "2024-01-10",
    size: "0.8 MB",
    type: "PDF" as const,
  },
  {
    title: "Quarterly Inventory Audit",
    date: "2024-01-05",
    size: "4.1 MB",
    type: "Excel" as const,
  },
  {
    title: "Staff Performance Review",
    date: "2024-01-02",
    size: "2.2 MB",
    type: "PDF" as const,
  },
];

const RecentReports = () => {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-900 font-bold text-lg">Recent Reports</h3>
        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors">
          View All
        </button>
      </div>
      <div className="space-y-1">
        {reports.map((report, index) => (
          <Card key={index} {...report} />
        ))}
      </div>
    </div>
  );
};

export default RecentReports;
