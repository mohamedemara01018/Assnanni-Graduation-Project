import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import ScanUpload from "./ScanUpload";
import ScanList from "./ScanList";
import { BsCloudUpload, BsFolderSymlink } from "react-icons/bs";

const Scan = () => {
  const [activeTab, setActiveTab] = useState<"upload" | "list">("upload");

  return (
    <DashboardLayout pageTitle={activeTab === "upload" ? "Upload Medical Scan" : "Scans Archive"}>
      <div className="-mt-6 bg-(--color-bg) min-h-[85vh] rounded-2xl p-6 md:p-8 flex flex-col items-center">
        
        {/* Modern Pills Selector */}
        <div className="w-full max-w-md bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl flex gap-1.5 mb-10 shadow-sm">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "upload"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-md"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <BsCloudUpload size={16} />
            Upload New Scan
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "list"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-md"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <BsFolderSymlink size={16} />
            Get All Scans
          </button>
        </div>

        {/* Dynamic Views */}
        <div className="w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === "upload" ? <ScanUpload /> : <ScanList />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Scan;
