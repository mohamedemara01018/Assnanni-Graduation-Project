import { useState } from "react";
import DentalTriage from "./DentalTriage";
import DashboardLayout from "../dashboard-layout/DashboardLayout";
import {
  CheckCircle,
  AlertTriangle,
  Activity,
  Home,
  ChevronRight,
} from "lucide-react";

const BACKEND_URL = "https://0xker-multimodal-chatbot.hf.space";

type SymptomsResponse = {
  risk_emoji?: string;
  risk_level?: string;
  score?: number | string;
  recommendation?: string;
  factors?: Array<[string, number]>;
  home_care?: string[];
};

type XrayResponse = unknown;

type Report =
  | { type: "symptoms"; data: SymptomsResponse }
  | { type: "xray"; data: XrayResponse }
  | null;

// ─── Risk badge ───────────────────────────────────────────────────────────────

function RiskBadge({ level }: { level: string }) {
  const l = level.toLowerCase();
  const styles =
    l === "critical" || l === "high"
      ? { bg: "rgba(220,38,38,0.08)", color: "#dc2626", border: "rgba(220,38,38,0.2)" }
      : l === "moderate" || l === "medium"
      ? { bg: "rgba(234,179,8,0.08)", color: "#ca8a04", border: "rgba(234,179,8,0.2)" }
      : { bg: "rgba(22,163,74,0.08)", color: "var(--color-success)", border: "rgba(22,163,74,0.2)" };

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide border"
      style={{ backgroundColor: styles.bg, color: styles.color, borderColor: styles.border }}
    >
      {level}
    </span>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({ report }: { report: SymptomsResponse }) {
  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-4">

      {/* Header */}
      <div
        className="rounded-2xl border p-5"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: "var(--color-bg-blue)" }}
            >
              {report.risk_emoji || "🦷"}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest mb-0.5" style={{ color: "var(--color-text-light)" }}>
                Triage result
              </p>
              <div className="flex items-center gap-2">
                {report.risk_level && <RiskBadge level={report.risk_level} />}
                {report.score !== undefined && (
                  <span className="text-xs" style={{ color: "var(--color-text-light)" }}>
                    Score: <span className="font-semibold" style={{ color: "var(--color-text)" }}>{report.score}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--color-success)" }} />
        </div>

        {report.recommendation && (
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
            {report.recommendation}
          </p>
        )}
      </div>

      {/* Score breakdown */}
      {report.factors && report.factors.length > 0 && (
        <div
          className="rounded-2xl border p-5"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow)",
          }}
        >
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--color-text)" }}>
            <Activity className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
            Score breakdown
          </h3>
          <div className="space-y-2">
            {report.factors.map((f, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2" style={{ color: "var(--color-text)" }}>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-text-light)" }} />
                  {f[0]}
                </div>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: "var(--color-bg-blue)", color: "var(--color-text-blue)" }}
                >
                  +{f[1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Home care */}
      {report.home_care && report.home_care.length > 0 && (
        <div
          className="rounded-2xl border p-5"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow)",
          }}
        >
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--color-text)" }}>
            <Home className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
            Home care guidelines
          </h3>
          <div className="space-y-2.5">
            {report.home_care.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span
                  className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: "var(--color-bg-blue)", color: "var(--color-text-blue)" }}
                >
                  {i + 1}
                </span>
                <p className="leading-relaxed" style={{ color: "var(--color-text)" }}>
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChatPot() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleSymptomAnalysis = async (payload: any) => {
    setLoading(true);
    setReport(null);
    setFetchError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/analyze-symptoms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: SymptomsResponse = await response.json();
      setReport({ type: "symptoms", data });
    } catch (err) {
      setFetchError("Analysis failed. Please try again.");
      console.error("Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleXrayUpload = async (files: File[]) => {
    setLoading(true);
    setReport(null);
    setFetchError(null);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append("images", files[i]);
    try {
      const response = await fetch(`${BACKEND_URL}/api/detect-xray`, {
        method: "POST",
        body: formData,
      });
      const data: XrayResponse = await response.json();
      setReport({ type: "xray", data });
    } catch (err) {
      setFetchError("X-Ray inference failed. Please try again.");
      console.error("X-Ray inference failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Assnani Dental Intelligence">
      <div className="space-y-6 flex flex-col items-center ">
        {/* Header */}
        <div className="w-full">
          <h1 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
            Dental Intelligence Diagnostic Desk
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-light)" }}>
            AI-assisted dental triage and symptom analysis
          </p>
        </div>

        {/* Triage form */}
        <div
          className="rounded-2xl border p-6 w-fit"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow)",
          }}
        >
          <DentalTriage
            onSubmit={handleSymptomAnalysis}
            onFileUpload={handleXrayUpload}
            loading={loading}
          />
        </div>

        {/* Error */}
        {fetchError && (
          <div
            className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm"
            style={{
              backgroundColor: "rgba(220,38,38,0.06)",
              border: "1px solid rgba(220,38,38,0.2)",
              color: "#dc2626",
            }}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            {fetchError}
          </div>
        )}

        {/* Results */}
        {report?.type === "symptoms" && <ResultCard report={report.data} />}
      </div>
    </DashboardLayout>
  );
}
