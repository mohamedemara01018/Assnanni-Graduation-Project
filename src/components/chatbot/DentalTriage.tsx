import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TriageState {
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

interface DentalTriageProps {
  onSubmit?: (data: TriageState) => Promise<void> | void;
  // Kept for compatibility with Chatbot.tsx; current triage UI does not use them.
  onFileUpload?: (files: File[]) => Promise<void> | void;
  loading?: boolean;
}

type Setter = <K extends keyof TriageState>(
  key: K,
  val: TriageState[K],
) => void;

interface StepProps {
  S: TriageState;
  set: Setter;
  toggleTrigger: (k: string) => void;
}

interface StepMeta {
  ey: string;
  h: string;
  d: string;
  pct: number;
}

interface TriggerOption {
  l: string;
  k: string;
  icon: string;
}

interface HistoryOption {
  k: keyof TriageState;
  l: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const purple = "#534AB7";
const purpleLight = "#EEEDFE";
const purpleDark = "#3C3489";

// (legacy) urgencyConfig kept for potential future use.
// Kept commented to avoid TS6133 (unused local) build failure.
// const urgencyConfig = {
//   ok: { label: "Routine", bg: "#EAF3DE", color: "#27500A" },
//   mod: { label: "Moderate", bg: "#FAEEDA", color: "#633806" },
//   crit: { label: "Critical", bg: "#FCEBEB", color: "#791F1F" },
// } as const;

// type UrgencyKey = keyof typeof urgencyConfig;

const STEP_META: StepMeta[] = [
  {
    ey: "Step 1 of 4",
    h: "Pain assessment",
    d: "Is the patient currently experiencing any pain or discomfort?",
    pct: 25,
  },
  {
    ey: "Step 2 of 4",
    h: "Swelling & severity",
    d: "Document any visible swelling and associated systemic signs.",
    pct: 50,
  },
  {
    ey: "Step 3 of 4",
    h: "Dental history",
    d: "Record relevant prior dental events and structural findings.",
    pct: 75,
  },
  {
    ey: "Step 4 of 4",
    h: "Visit ",
    d: "Confirm appointment context and preferred payment method.",
    pct: 100,
  },
];

const TRIGGERS: TriggerOption[] = [
  { l: "Spontaneous", k: "spont", icon: "⊙" },
  { l: "Biting", k: "bite", icon: "⌇" },
  { l: "Hot", k: "hot", icon: "🔥" },
  { l: "Cold", k: "cold", icon: "❄" },
];

const HISTORY: HistoryOption[] = [
  { k: "has_trauma", l: "Recent maxillofacial trauma" },
  { k: "has_broken_tooth", l: "Structural fracture / broken tooth" },
  { k: "previous_root_canal", l: "Prior root canal on treatment site" },
  { k: "recent_extraction", l: "Recent extraction socket area" },
];

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  fontSize: 13,
  border: "0.5px solid #e5e7eb",
  borderRadius: 8,
  background: "#fff",
  color: "#111",
  outline: "none",
  boxSizing: "border-box",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "0.5px solid #e5e7eb",
  borderRadius: 12,
  overflow: "hidden",
};

const subPanelStyle: React.CSSProperties = {
  borderTop: "0.5px solid #e5e7eb",
  padding: "1rem 1.1rem",
  background: "#f9fafb",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.9rem 1.1rem",
};

// ─── Primitives ───────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 38,
        height: 21,
        borderRadius: 11,
        background: checked ? purple : "#d1d5db",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 15,
          height: 15,
          background: "#fff",
          borderRadius: "50%",
          top: 3,
          left: checked ? 20 : 3,
          transition: "left 0.2s",
        }}
      />
    </div>
  );
}

function IconBox({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        fontSize: 16,
        background: active ? purpleLight : "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "0.9rem" }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 500,
          color: "#9ca3af",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Step components (defined at module level — stable identity) ──────────────

function PainStep({ S, set, toggleTrigger }: StepProps) {
  return (
    <div style={cardStyle}>
      <div style={rowStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <IconBox active={S.has_pain}>⚠</IconBox>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>
              Patient experiencing pain
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>
              Tap to toggle
            </div>
          </div>
        </div>
        <Toggle
          checked={S.has_pain}
          onChange={() => set("has_pain", !S.has_pain)}
        />
      </div>

      {S.has_pain && (
        <div style={subPanelStyle}>
          <Field label="Location">
            <input
              style={inputStyle}
              placeholder="e.g. lower-left molar"
              value={S.pain_location}
              onChange={(e) => set("pain_location", e.target.value)}
            />
          </Field>
          <Field label="Pain type">
            <select
              style={inputStyle}
              value={S.pain_type}
              onChange={(e) => set("pain_type", e.target.value)}
            >
              <option value="">Select…</option>
              <option value="throbbing">Throbbing / pulsating</option>
              <option value="sharp">Sharp / piercing</option>
              <option value="sensitivity">Temperature sensitivity</option>
              <option value="dull">Dull ache</option>
            </select>
          </Field>
          <Field label={`Intensity — ${S.pain_intensity}/10`}>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={S.pain_intensity}
              onChange={(e) => set("pain_intensity", +e.target.value)}
              style={{ width: "100%", accentColor: purple }}
            />
          </Field>
          <Field label="Duration">
            <select
              style={inputStyle}
              value={S.pain_duration}
              onChange={(e) => set("pain_duration", e.target.value)}
            >
              <option value="">Select…</option>
              <option value="today">Started today</option>
              <option value="1-3d">1–3 days</option>
              <option value="3-7d">3–7 days</option>
              <option value="1w+">More than a week</option>
            </select>
          </Field>
          <Field label="Triggers">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
              }}
            >
              {TRIGGERS.map((t) => {
                const on = S.pain_triggers.includes(t.k);
                return (
                  <div
                    key={t.k}
                    onClick={() => toggleTrigger(t.k)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "0.45rem 0.65rem",
                      fontSize: 12,
                      border: `0.5px solid ${on ? purple : "#e5e7eb"}`,
                      borderRadius: 8,
                      cursor: "pointer",
                      background: on ? purpleLight : "#fff",
                      color: on ? purpleDark : "#6b7280",
                      transition: "all 0.12s",
                      userSelect: "none",
                    }}
                  >
                    <span>{t.icon}</span>
                    {t.l}
                  </div>
                );
              })}
            </div>
          </Field>
        </div>
      )}
    </div>
  );
}

function SwellingStep({ S, set }: StepProps) {
  return (
    <div style={cardStyle}>
      <div style={rowStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <IconBox active={S.has_swelling}>◎</IconBox>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>
              Visible swelling present
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>
              Tap to toggle
            </div>
          </div>
        </div>
        <Toggle
          checked={S.has_swelling}
          onChange={() => set("has_swelling", !S.has_swelling)}
        />
      </div>

      {S.has_swelling && (
        <div style={subPanelStyle}>
          <Field label="Severity">
            <select
              style={inputStyle}
              value={S.swelling_severity}
              onChange={(e) => set("swelling_severity", e.target.value)}
            >
              <option value="">Select…</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe (asymmetrical face)</option>
            </select>
          </Field>
          {(
            [
              { k: "has_fever", label: "Accompanied by fever" },
              {
                k: "difficulty_opening",
                label: "Difficulty opening mouth (trismus)",
              },
            ] as const
          ).map((item, i) => (
            <label
              key={item.k}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                padding: "0.6rem 0.1rem",
                fontSize: 13,
                color: "#111",
                cursor: "pointer",
                borderTop: i === 0 ? "none" : "0.5px solid #e5e7eb",
              }}
            >
              {item.label}
              <input
                type="checkbox"
                checked={S[item.k]}
                onChange={() => set(item.k, !S[item.k])}
                style={{
                  marginLeft: "auto",
                  width: 15,
                  height: 15,
                  accentColor: purple,
                  cursor: "pointer",
                }}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function HistoryStep({ S, set }: StepProps) {
  return (
    <div style={cardStyle}>
      {HISTORY.map((r, i) => (
        <div
          key={r.k}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.9rem 1.1rem",
            gap: "1rem",
            borderTop: i === 0 ? "none" : "0.5px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <IconBox active={S[r.k] as boolean}>✦</IconBox>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>
              {r.l}
            </div>
          </div>
          <Toggle
            checked={S[r.k] as boolean}
            onChange={() => set(r.k, !S[r.k] as TriageState[typeof r.k])}
          />
        </div>
      ))}
    </div>
  );
}

function VisitStep({ S, set }: StepProps) {
  return (
    <div style={cardStyle}>
      <div style={{ padding: "0.9rem 1.1rem" }}>
        <Field label="Last clinic visit">
          <select
            style={inputStyle}
            value={S.last_visit}
            onChange={(e) => set("last_visit", e.target.value)}
          >
            <option value="">Select range…</option>
            <option value="<6mo">Less than 6 months ago</option>
            <option value="6-12mo">6–12 months ago</option>
            <option value="1yr+">Over 1 year ago</option>
            <option value="never">Never</option>
          </select>
        </Field>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DentalTriage({ onSubmit }: DentalTriageProps) {
  const [step, setStep] = useState<number>(0);

  const [S, setS] = useState<TriageState>({
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
  });

  const set: Setter = (key, val) => setS((prev) => ({ ...prev, [key]: val }));

  const toggleTrigger = (k: string) =>
    setS((prev) => ({
      ...prev,
      pain_triggers: prev.pain_triggers.includes(k)
        ? prev.pain_triggers.filter((x) => x !== k)
        : [...prev.pain_triggers, k],
    }));

  const stepProps: StepProps = { S, set, toggleTrigger };

  const currentStep = () => {
    switch (step) {
      case 0:
        return <PainStep {...stepProps} />;
      case 1:
        return <SwellingStep {...stepProps} />;
      case 2:
        return <HistoryStep {...stepProps} />;
      case 3:
        return <VisitStep {...stepProps} />;

      default:
        return null;
    }
  };

  const { ey, h, d, pct } = STEP_META[step];

  return (
    <div
      style={{
        maxWidth: 460,
        margin: "2rem auto",
        padding: "0 1rem 3rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          height: 3,
          background: "#e5e7eb",
          borderRadius: 2,
          marginBottom: "2rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: purple,
            borderRadius: 2,
            width: `${pct}%`,
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.06em",
            color: purple,
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          {ey}
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "#111",
            marginBottom: 4,
          }}
        >
          {h}
        </div>
        <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>
          {d}
        </div>
      </div>

      {currentStep()}

      <div style={{ display: "flex", gap: 8, marginTop: "1.5rem" }}>
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{
              padding: "0.65rem 1rem",
              fontSize: 13,
              border: "0.5px solid #e5e7eb",
              borderRadius: 8,
              background: "transparent",
              color: "#6b7280",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        )}
        <button
          onClick={() => (step < 3 ? setStep((s) => s + 1) : onSubmit?.(S))}
          style={{
            flex: 1,
            padding: "0.7rem",
            fontSize: 14,
            fontWeight: 500,
            border: "none",
            borderRadius: 8,
            background: purple,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {step === 3 ? "Submit findings →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
