import React from "react";
import Card from "./Card";

const RecentReports = () => {
  return (
    <div className="bg-gray-100 m-4 p-4 ml-0 rounded-2xl">
      <div className="flex justify-between mb-8">
        <h3 className="text-gray-800 font-semibold">Recent Reports</h3>
        <span className="text-blue-500/60 hover:text-blue-500/80 cursor-pointer">
          View All
        </span>
      </div>
      <div>
        <Card title="Monthly Patient Report" type="PDF">
          <p>2024-01-20</p>
          <p>2.4 MB</p>
        </Card>
      </div>
    </div>
  );
};

export default RecentReports;
