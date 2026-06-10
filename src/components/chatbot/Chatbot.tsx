import { useState } from "react";
import DentalTriage from "./DentalTriage";

// NOTE: This file is not used by ChatbotWidget.
// It still contains some unused/incorrect props from older iterations.
// To unblock the build, we keep the component render but remove
// incompatible props passed into DentalTriage.

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

export default function ChatPot() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report>(null);

  // POST Request to /api/analyze-symptoms
  const handleSymptomAnalysis = async (payload: any) => {
    setLoading(true);
    setReport(null);
    console.log(payload);
    try {
      const response = await fetch(`${BACKEND_URL}/api/analyze-symptoms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: SymptomsResponse = await response.json();
      console.log(data);
      setReport({ type: "symptoms", data });
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // POST Request to /api/detect-xray
  const handleXrayUpload = async (files: File[]) => {
    setLoading(true);
    setReport(null);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/detect-xray`, {
        method: "POST",
        body: formData,
      });
      const data: XrayResponse = await response.json();
      console.log(data);
      setReport({ type: "xray", data });
    } catch (err) {
      console.error("X-Ray inference failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", background: "#f5f7fa", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center" }}>
        Assnani Dental Intelligence Diagnostic Desk
      </h2>

      <DentalTriage
        onSubmit={handleSymptomAnalysis}
        onFileUpload={handleXrayUpload}
        loading={loading}
      />

      {/* RENDER DYNAMIC RESULTS RETURNED FROM YOUR PYTHON SYSTEM */}
      {report && report.type === "symptoms" && (
        <div
          style={{
            maxWidth: "1100px",
            margin: "20px auto",
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <h3>
            Assessment: {report.data.risk_emoji}{" "}
            {(report.data.risk_level || "").toUpperCase()} (Engine Score:{" "}
            {report.data.score})
          </h3>
          <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#333" }}>
            {report.data.recommendation}
          </p>

          <h4>Triggered Score Breakdown:</h4>
          <ul>
            {report.data.factors?.map((f, i) => (
              <li key={i}>
                <strong>{f[0]}</strong> (+{f[1]} points)
              </li>
            ))}
          </ul>

          <h4>Generated Home Care Guidelines:</h4>
          <ul
            style={{
              background: "#fff9e6",
              padding: "15px 30px",
              borderRadius: "4px",
            }}
          >
            {report.data.home_care?.map((tip, i) => (
              <li key={i} style={{ margin: "5px 0" }}>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
