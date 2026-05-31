import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";
import {
  BsSearch,
  BsEye,
  BsFileEarmarkMedical,
  BsExclamationCircleFill,
  BsCheckCircleFill,
  BsClockHistory,
  BsImage,
} from "react-icons/bs";

interface MedicalScan {
  scanId: number;
  patientId: number;
  patientName: string;
  scanType: string;
  priority: string;
  status: string;
  aiStatus: string;
  uploadedAt: string;
  annotatedImageUrl: string;
}

const ScanList = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const { data: responseBody, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["MyScans"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}Scans/my-scans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!token && !!backendUrl,
  });

  // Handle toast notifications on query fetch
  useEffect(() => {
    if (isSuccess && responseBody) {
      toast.success(responseBody.message || "Medical scans loaded successfully");
    }
  }, [isSuccess, responseBody]);

  useEffect(() => {
    if (isError && error) {
      const err = error as any;
      toast.error(
        err.response?.data?.message || err.message || "Failed to load medical scans"
      );
    }
  }, [isError, error]);

  const scans: MedicalScan[] = responseBody?.data || [];

  // Filter logic
  const filteredScans = scans.filter((scan) => {
    const matchesSearch =
      scan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.scanType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.scanId.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" ||
      scan.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesPriority =
      priorityFilter === "all" ||
      scan.priority.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === "complete") {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
          <BsCheckCircleFill size={10} />
          Complete
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
          <BsExclamationCircleFill size={10} />
          Rejected
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
        <BsClockHistory size={10} />
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const p = priority.toLowerCase();
    if (p === "urgent" || p === "emergency") {
      return (
        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400">
          {priority}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        {priority}
      </span>
    );
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-(--color-text) tracking-tight">
            Scans Archive
          </h1>
          <p className="text-sm text-(--color-text-light) mt-1">
            Browse, search and inspect patient radiography files
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-5 mb-8 shadow-sm flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Patient Name or Scan Type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text) placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
          />
        </div>

        {/* Filter Status */}
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-semibold cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Complete">Complete</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Filter Priority */}
        <div className="w-full md:w-48">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-semibold cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Main List Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <ScaleLoader color="#3B82F6" />
          <p className="text-sm text-(--color-text-light) font-medium animate-pulse">
            Retrieving medical scan documents...
          </p>
        </div>
      ) : filteredScans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScans.map((scan) => (
            <div
              key={scan.scanId}
              className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-colors shadow-sm shrink-0">
                  <BsFileEarmarkMedical size={22} />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  {getStatusBadge(scan.status)}
                  {getPriorityBadge(scan.priority)}
                </div>
              </div>

              {/* Body */}
              <div className="space-y-3 flex-grow mb-6">
                <div>
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase">
                    Scan ID: #{scan.scanId}
                  </span>
                  <h3 className="text-lg font-extrabold text-(--color-text) group-hover:text-blue-600 transition-colors mt-0.5">
                    {scan.scanType}
                  </h3>
                </div>

                <div className="pt-2 border-t border-(--color-border) space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-(--color-text-light)">Patient:</span>
                    <span className="text-(--color-text)">
                      {scan.patientName} (ID: {scan.patientId})
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-(--color-text-light)">AI Status:</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {scan.aiStatus}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-(--color-text-light)">Uploaded:</span>
                    <span className="text-(--color-text-light)">
                      {new Date(scan.uploadedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-auto pt-4 border-t border-(--color-border)">
                {scan.annotatedImageUrl && (
                  <a
                    href={scan.annotatedImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-(--color-border) text-(--color-text) text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <BsImage size={13} />
                    View Image
                  </a>
                )}
                <a
                  href={`/scan/analysis/${scan.scanId}`}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 text-center"
                >
                  <BsEye size={13} />
                  Analyze
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-(--color-surface) rounded-3xl border-2 border-dashed border-(--color-border) p-16 flex flex-col items-center text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
            <BsFileEarmarkMedical size={40} className="text-(--color-text-light) opacity-25" />
          </div>
          <h2 className="text-xl font-bold text-(--color-text) mb-2">
            No Scans Found
          </h2>
          <p className="text-sm text-(--color-text-light) max-w-sm leading-relaxed">
            There are no scan documents matching your query. Click upload to register a new one!
          </p>
        </div>
      )}
    </div>
  );
};

export default ScanList;
