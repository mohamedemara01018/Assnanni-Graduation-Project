import { useMemo, useState } from "react";

// Types kept identical to DentalTriage state
export interface TriageState {
  has_pain: boolean;
  pain_location: string;
  pain_type: string;
  pain_intensity: number;
  pain_duration: string;
  pain_triggers: string[];
  has_swelling: boolean;
  swelling_severity: string;
  has_fever: boolean;
  difficulty_opening: boolean;
  has_trauma: boolean;
  has_broken_tooth: boolean;
  previous_root_canal: boolean;
  last_visit: string;
  recent_extraction: boolean;
}

type Key = keyof TriageState;

type Setter = <K extends Key>(key: K, val: TriageState[K]) => void;

type QuestionType =
  | { type: "yesno"; key: Key; yes: string; no: string }
  | { type: "text"; key: Key; placeholder: string }
  | {
      type: "select";
      key: Key;
      options: Array<{ label: string; value: any }>;
      placeholder?: string;
    }
  | { type: "range"; key: Key; min: number; max: number }
  | {
      type: "chips";
      key: Key;
      options: Array<{ label: string; value: string; icon?: string }>;
    }
  | {
      type: "multicheck";
      key: Key;
      options: Array<{ key: Key; label: string }>;
    };

type ChatQuestion = {
  id: string;
  botText: string;
  // optionally show additional clarification after main answer
  helpText?: string;
} & QuestionType;

const TRIGGERS = [
  { label: "Spontaneous", value: "spont", icon: "⊙" },
  { label: "Biting", value: "bite", icon: "⌇" },
  { label: "Hot", value: "hot", icon: "🔥" },
  { label: "Cold", value: "cold", icon: "❄" },
];

const HISTORY_FLAGS: Array<{ key: Key; label: string }> = [
  { key: "has_trauma", label: "Recent maxillofacial trauma" },
  { key: "has_broken_tooth", label: "Structural fracture / broken tooth" },
  { key: "previous_root_canal", label: "Prior root canal on treatment site" },
  { key: "recent_extraction", label: "Recent extraction socket area" },
];

const triageQuestions = (S: TriageState): ChatQuestion[] => {
  const has_pain = {
    id: "has_pain",
    botText: "Do you currently have dental pain or discomfort?",
    type: "yesno" as const,
    key: "has_pain" as const,
    yes: "Yes",
    no: "No",
  };

  const pain_location = {
    id: "pain_location",
    botText: "Where exactly is the pain located? (Which tooth/area)",
    type: "text" as const,
    key: "pain_location" as const,
    placeholder: "e.g. lower-left molar",
  };

  const pain_type = {
    id: "pain_type",
    botText: "What does the pain feel like?",
    type: "select" as const,
    key: "pain_type" as const,
    options: [
      { label: "Throbbing / pulsating", value: "throbbing" },
      { label: "Sharp / piercing", value: "sharp" },
      { label: "Temperature sensitivity", value: "sensitivity" },
      { label: "Dull ache", value: "dull" },
    ],
  };

  const pain_intensity = {
    id: "pain_intensity",
    botText: "How intense is it right now? (0–10)",
    type: "range" as const,
    key: "pain_intensity" as const,
    min: 0,
    max: 10,
  };

  const pain_duration = {
    id: "pain_duration",
    botText: "How long has this been going on?",
    type: "select" as const,
    key: "pain_duration" as const,
    options: [
      { label: "Started today", value: "today" },
      { label: "1–3 days", value: "1-3d" },
      { label: "3–7 days", value: "3-7d" },
      { label: "More than a week", value: "1w+" },
    ],
  };

  const pain_triggers = {
    id: "pain_triggers",
    botText: "What triggers or makes it worse? (Choose all that apply)",
    type: "chips" as const,
    key: "pain_triggers" as const,
    options: TRIGGERS,
  };

  const has_swelling = {
    id: "has_swelling",
    botText: "Do you notice any visible swelling (gum/face)?",
    type: "yesno" as const,
    key: "has_swelling" as const,
    yes: "Yes",
    no: "No",
  };

  const swelling_severity = {
    id: "swelling_severity",
    botText: "If yes, how would you describe the swelling?",
    type: "select" as const,
    key: "swelling_severity" as const,
    options: [
      { label: "Mild", value: "mild" },
      { label: "Moderate", value: "moderate" },
      { label: "Severe (asymmetrical face)", value: "severe" },
    ],
  };

  const systemic_flags = {
    id: "systemic_flags",
    botText: "Are there any of these signs?",
    type: "multicheck" as const,
    key: "has_fever" as const,
    options: [
      { key: "has_fever" as const, label: "Fever" },
      {
        key: "difficulty_opening" as const,
        label: "Difficulty opening mouth (trismus)",
      },
    ],
  };

  const history = {
    id: "history_flags",
    botText: "Any relevant dental history findings? (Choose all that apply)",
    type: "chips" as const,
    key: "has_trauma" as const,
    options: HISTORY_FLAGS.map((f) => ({
      label: f.label,
      value: String(f.key),
    })),
  };

  const last_visit = {
    id: "last_visit",
    botText: "When was your last dental clinic visit?",
    type: "select" as const,
    key: "last_visit" as const,
    options: [
      { label: "Less than 6 months ago", value: "<6mo" },
      { label: "6–12 months ago", value: "6-12mo" },
      { label: "Over 1 year ago", value: "1yr+" },
      { label: "Never", value: "never" },
    ],
  };

  // Build flow conditionally
  const flow: ChatQuestion[] = [
    has_pain,
    ...(S.has_pain
      ? [pain_location, pain_type, pain_intensity, pain_duration, pain_triggers]
      : []),
    has_swelling,
    ...(S.has_swelling ? [swelling_severity, systemic_flags] : []),
    history,
    last_visit,
  ];

  return flow;
};

function defaultState(): TriageState {
  return {
    has_pain: false,
    pain_location: "",
    pain_type: "",
    pain_intensity: 0,
    pain_duration: "",
    pain_triggers: [],
    has_swelling: false,
    swelling_severity: "",
    has_fever: false,
    difficulty_opening: false,
    has_trauma: false,
    has_broken_tooth: false,
    previous_root_canal: false,
    last_visit: "",
    recent_extraction: false,
  };
}

export default function DentalTriageChat({
  onComplete,
}: {
  onComplete: (data: TriageState) => void;
}) {
  const [S, setS] = useState<TriageState>(() => defaultState());
  const [idx, setIdx] = useState(0);

  const set: Setter = (key, val) => setS((prev) => ({ ...prev, [key]: val }));

  const questions = useMemo(() => triageQuestions(S), [S]);
  const current = questions[idx];

  const canBack = idx > 0;
  // const canNext = idx < questions.length - 1; // currently unused

  const toggleChip = (chipValue: string) => {
    if (!current) return;
    if (current.type !== "chips") return;

    // chips for triggers
    if (current.key === "pain_triggers") {
      const arr = S.pain_triggers;
      const next = arr.includes(chipValue)
        ? arr.filter((x) => x !== chipValue)
        : [...arr, chipValue];
      set("pain_triggers", next);
      return;
    }

    // chips for history flags: chipValue is the Key string
    if (
      current.key === "has_trauma" ||
      current.key === "has_broken_tooth" ||
      current.key === "previous_root_canal" ||
      current.key === "recent_extraction"
    ) {
      // we encode as stringified Key in options
      const k = chipValue as Key;
      if (typeof (S as any)[k] === "boolean") {
        set(k, !((S as any)[k] as boolean));
      }
    }
  };

  const handleAnswerYesNo = (yes: boolean) => {
    if (!current) return;
    if (current.type !== "yesno") return;
    set(current.key, yes as any);
    setIdx((i) => i + 1);
  };

  const handleAnswerText = (text: string) => {
    if (!current) return;
    if (current.type !== "text") return;
    set(current.key, text as any);
    setIdx((i) => i + 1);
  };

  const handleAnswerSelect = (value: any) => {
    if (!current) return;
    if (current.type !== "select") return;
    set(current.key, value);
    setIdx((i) => i + 1);
  };

  const handleAnswerRange = (value: number) => {
    if (!current) return;
    if (current.type !== "range") return;
    set(current.key, value as any);
    // don't auto-advance until user moves next explicitly? keep as instant
    setIdx((i) => i + 1);
  };

  const handleAnswerMulticheck = (optKey: Key, checked: boolean) => {
    if (!current) return;
    if (current.type !== "multicheck") return;
    set(optKey, checked as any);
  };

  const finish = () => {
    onComplete(S);
  };

  const isFinal = idx >= questions.length - 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 13, color: "#6b7280" }}>
        {idx + 1} / {questions.length}
      </div>

      {current && (
        <div style={{ background: "transparent" }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
            {current.botText}
          </div>

          {current.type === "yesno" && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => handleAnswerYesNo(true)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                {current.yes}
              </button>
              <button
                onClick={() => handleAnswerYesNo(false)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                {current.no}
              </button>
            </div>
          )}

          {current.type === "text" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  fontSize: 13,
                  outline: "none",
                }}
                placeholder={current.placeholder}
                value={S[current.key] as any}
                onChange={(e) => set(current.key, e.target.value as any)}
              />
              <button
                onClick={() => handleAnswerText(String(S[current.key] ?? ""))}
                style={{
                  padding: "9px 12px",
                  borderRadius: 12,
                  border: "none",
                  background: "#534AB7",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Continue
              </button>
            </div>
          )}

          {current.type === "select" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <select
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  fontSize: 13,
                  outline: "none",
                  background: "#fff",
                }}
                value={String(S[current.key] ?? "")}
                onChange={(e) => handleAnswerSelect(e.target.value)}
              >
                <option value="">Select…</option>
                {current.options.map((o) => (
                  <option key={o.label} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {current.type === "range" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input
                type="range"
                min={current.min}
                max={current.max}
                step={1}
                value={Number(S[current.key] ?? 0)}
                onChange={(e) =>
                  set(current.key, Number(e.target.value) as any)
                }
                style={{ width: "100%", accentColor: "#534AB7" }}
              />
              <div style={{ fontSize: 13, color: "#6b7280" }}>
                Value: {Number(S[current.key] ?? 0)}/10
              </div>
              <button
                onClick={() => handleAnswerRange(Number(S[current.key] ?? 0))}
                style={{
                  padding: "9px 12px",
                  borderRadius: 12,
                  border: "none",
                  background: "#534AB7",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Continue
              </button>
            </div>
          )}

          {current.type === "chips" && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {current.options.map((o) => {
                const active =
                  current.key === "pain_triggers"
                    ? S.pain_triggers.includes(o.value)
                    : Boolean((S as any)[o.value]);

                return (
                  <button
                    key={o.value}
                    onClick={() => toggleChip(o.value)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 12,
                      border: `1px solid ${active ? "#534AB7" : "#e5e7eb"}`,
                      background: active ? "#EEEDFE" : "#fff",
                      cursor: "pointer",
                      fontSize: 13,
                      color: active ? "#3C3489" : "#6b7280",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {o.icon ? <span>{o.icon}</span> : null}
                    <span>{o.label}</span>
                  </button>
                );
              })}

              {/* finish/next after chips selection */}
              <div
                style={{
                  width: "100%",
                  marginTop: 10,
                  display: "flex",
                  gap: 10,
                }}
              >
                {canBack && (
                  <button
                    onClick={() => setIdx((i) => Math.max(0, i - 1))}
                    style={{
                      padding: "9px 12px",
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => {
                    if (isFinal) finish();
                    else setIdx((i) => i + 1);
                  }}
                  style={{
                    marginLeft: "auto",
                    padding: "9px 12px",
                    borderRadius: 12,
                    border: "none",
                    background: "#534AB7",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {isFinal ? "Finish →" : "Continue →"}
                </button>
              </div>
            </div>
          )}

          {current.type === "multicheck" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {current.options.map((o) => {
                const checked = Boolean(S[o.key]);
                return (
                  <label
                    key={String(o.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      border: "1px solid #e5e7eb",
                      borderRadius: 12,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        handleAnswerMulticheck(o.key, e.target.checked)
                      }
                    />
                    <span style={{ fontSize: 13 }}>{o.label}</span>
                  </label>
                );
              })}

              <div
                style={{
                  width: "100%",
                  marginTop: 10,
                  display: "flex",
                  gap: 10,
                }}
              >
                {canBack && (
                  <button
                    onClick={() => setIdx((i) => Math.max(0, i - 1))}
                    style={{
                      padding: "9px 12px",
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => {
                    if (isFinal) finish();
                    else setIdx((i) => i + 1);
                  }}
                  style={{
                    marginLeft: "auto",
                    padding: "9px 12px",
                    borderRadius: 12,
                    border: "none",
                    background: "#534AB7",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {isFinal ? "Finish →" : "Continue →"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* generic back/next for question types that don't include their own */}
      {current && current.type !== "chips" && current.type !== "multicheck" && (
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          {canBack && (
            <button
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
              style={{
                padding: "9px 12px",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Back
            </button>
          )}
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            {isFinal ? (
              <button
                onClick={finish}
                style={{
                  padding: "9px 12px",
                  borderRadius: 12,
                  border: "none",
                  background: "#534AB7",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Finish →
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
