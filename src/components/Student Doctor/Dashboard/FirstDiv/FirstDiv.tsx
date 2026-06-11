import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";
import { FaRegClock } from "react-icons/fa6";
import { LuFileSpreadsheet } from "react-icons/lu";
import { NavLink } from "react-router";
import Patient from "./Patient";
import { CiLock } from "react-icons/ci";
import Card from "./Card";
import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";

const FirstDiv = () => {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const [selectedScanUrl, setSelectedScanUrl] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const markAsViewedMutation = useMutation({
    mutationFn: async (caseStudyId: number) => {
      await axios.post(
        `${backendUrl}StudentDoctor/mark-as-viewed`,
        { caseStudyId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      toast.success("Case marked as viewed");
      queryClient.invalidateQueries({ queryKey: ["student-learning"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to mark as viewed");
    },
  });

  const {
    data: todayData,
    isLoading: isTodayLoading,
    isError: todayError,
  } = useQuery({
    queryKey: ["student-today"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}StudentDoctor/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
    enabled: !!token && !!backendUrl,
  });

  useEffect(() => {
    if (todayError) {
      toast.error("Failed to load today's observations");
    }
  }, [todayError]);

  const {
    data: learningData,
    isLoading: isLearningLoading,
    isError: isLearningError,
  } = useQuery({
    queryKey: ["student-learning"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}StudentDoctor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
    enabled: !!token && !!backendUrl,
  });

  useEffect(() => {
    if (isLearningError) {
      toast.error("Failed to load learning scans");
    }
  }, [isLearningError]);

  const {
    data: casesData,
    isLoading: isCasesLoading,
    isError: isCasesError,
  } = useQuery({
    queryKey: ["student-cases"],
    queryFn: async () => {
      const response = await axios.get(
        `${backendUrl}StudentDoctor/my-patient-cases`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data.data;
    },
    enabled: !!token && !!backendUrl,
  });

  useEffect(() => {
    if (isCasesError) {
      toast.error("Failed to load patient cases");
    }
  }, [isCasesError]);

  return (
    <div className="flex-2">
      <div className="bg-(--color-surface) p-6 rounded-xl shadow-sm border border-(--color-border)">
        <div className="flex justify-between mb-6 pb-3 border-b border-(--color-border) items-center">
          <h1 className="text-xl flex items-center gap-2 text-(--color-text) font-medium">
            Today's Observations
            <span className="text-xs font-normal text-(--color-text-light) max-sm:hidden">
              {" "}
              (Supervised)
            </span>
          </h1>
        </div>
        <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-1">
          {isTodayLoading ? (
            <div className="py-10 flex justify-center">
              <ScaleLoader color="#00AFE5" height={20} />
            </div>
          ) : todayData?.length > 0 ? (
            todayData.map((obs: any, i: number) => (
              <Card
                key={obs.id || `obs-${i}`}
                title={`Observer: ${obs.doctorFullName || obs.doctorName}`}
                status={obs.status}
                color="blue"
                logo={<FaRegClock />}
              >
                <p>{obs.specialty}</p>
                <p>
                  {obs.time} • Supervisor:{" "}
                  {obs.supervisorName || obs.supervisor}
                </p>
              </Card>
            ))
          ) : (
            <p className="text-sm text-(--color-text-light) py-4 text-center">
              No observations scheduled for today.
            </p>
          )}
        </div>
      </div>

      <div className="bg-(--color-surface) p-6 rounded-xl mt-6 shadow-sm border border-(--color-border)">
        <div className="flex justify-between mb-6 pb-3 border-b border-(--color-border) items-center">
          <h1 className="text-xl text-(--color-text) font-medium">
            Scans for Learning
            <span className="text-xs ml-2 font-normal text-(--color-text-light) max-sm:hidden">
              (Educational Access)
            </span>
          </h1>
        </div>
        <div className="flex flex-col gap-4 max-h-60 overflow-y-auto pr-1">
          {isLearningLoading ? (
            <div className="py-10 flex justify-center">
              <ScaleLoader color="#8B5CF6" height={20} />
            </div>
          ) : learningData?.length > 0 ? (
            learningData.map((scan: any, i: number) => (
              <Card
                key={scan.id || `scan-${i}`}
                title={scan.title}
                status={scan.isViewed ? "Completed" : "New Case"}
                color="violet"
                logo={<LuFileSpreadsheet />}
                onMarkViewed={() => markAsViewedMutation.mutate(scan.id)}
                isMarkingViewed={markAsViewedMutation.isPending}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-violet-500 uppercase">
                    Supervisor: {scan.doctorName || "Assigned Doctor"}
                  </p>
                  <p className="line-clamp-2 text-sm max-sm:max-w-20 max-sm:overflow-x-clip text-(--color-text-light)">
                    {scan.description}
                  </p>
                  {scan.scanUrl && (
                    <button
                      onClick={() => setSelectedScanUrl(`${scan.scanUrl}`)}
                      className="text-[10px] w-fit font-bold text-blue-600 hover:text-blue-700 underline uppercase cursor-pointer mt-1"
                    >
                      View Diagnostic Scan
                    </button>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <p className="text-sm text-(--color-text-light) py-4 text-center">
              No scans available for learning at the moment.
            </p>
          )}
        </div>
      </div>

      <div className="bg-(--color-surface) p-6 rounded-xl mt-6 shadow-sm border border-(--color-border)">
        <div className="flex justify-between mb-6 pb-3 border-b border-(--color-border) items-center">
          <h1 className="text-xl text-(--color-text) font-medium flex gap-2 items-center">
            Patient Cases <CiLock className="text-(--color-text-light) " />
          </h1>
          <NavLink
            to={"#"}
            className={"text-sm text-(--color-text-light) cursor-text"}
          >
            View Only
          </NavLink>
        </div>
        <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-1">
          {isCasesLoading ? (
            <div className="py-10 flex justify-center">
              <ScaleLoader color="#3B82F6" height={20} />
            </div>
          ) : casesData?.length > 0 ? (
            casesData.map((patient: any, i: number) => (
              <Patient
                key={patient.patientId || `patient-${i}`}
                id={patient.patientId}
                appointmentId={patient.appointmentId}
                name={patient.patientName}
                doctorName={patient.doctorName}
                imageUrl={patient.imageUrl}
                lastInteractionDate={patient.lastInteractionDate}
              />
            ))
          ) : (
            <p className="text-sm text-(--color-text-light) py-4 text-center">
              No patient cases assigned to you.
            </p>
          )}
        </div>
        <p className="bg-blue-50 text-blue-600 text-[10px] px-4 py-2 mt-6 rounded-lg border border-blue-100 flex items-center gap-2">
          <span>🔒</span> Full patient records require supervisor authorization
        </p>
      </div>

      {/* Scan Viewer Modal */}
      {selectedScanUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedScanUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors cursor-pointer"
            >
              <XCircle size={24} />
            </button>
            <div className="p-2">
              <img
                src={selectedScanUrl}
                alt="Diagnostic Scan"
                className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
              />
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 text-center">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Educational Case Study Scan
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstDiv;
