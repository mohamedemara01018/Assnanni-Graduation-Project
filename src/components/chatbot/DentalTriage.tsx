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
  onFileUpload?: (files: File[]) => Promise<void> | void;
  loading?: boolean;
}

type Setter = <K extends keyof TriageState>(key: K, val: TriageState[K]) => void;

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

const STEP_META: StepMeta[] = [
  { ey: "Step 1 of 4", h: "Pain assessment", d: "Is the patient currently experiencing any pain or discomfort?", pct: 25 },
  { ey: "Step 2 of 4", h: "Swelling & severity", d: "Document any visible swelling and associated systemic signs.", pct: 50 },
  { ey: "Step 3 of 4", h: "Dental history", d: "Record relevant prior dental events and structural findings.", pct: 75 },
  { ey: "Step 4 of 4", h: "Visit", d: "Confirm appointment context and last visit date.", pct: 100 },
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

// ─── Primitives ───────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      className="relative cursor-pointer shrink-0 rounded-full transition-colors duration-200"
      style={{
        width: 38, height: 21,
        backgroundColor: checked ? "var(--color-primary)" : "var(--color-border)",
      }}
    >
      <div
        className="absolute top-[3px] w-[15px] h-[15px] rounded-full bg-white transition-all duration-200"
        style={{ left: checked ? 20 : 3 }}
      />
    </div>
  );
}

function IconBox({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      className="w-8 h-8 rounded-lg text-base flex items-center justify-center shrink-0"
      style={{
        backgroundColor: active ? "var(--color-bg-blue)" : "var(--color-bg)",
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5">
      <label
        className="block text-[11px] font-medium uppercase tracking-wider mb-1"
        style={{ color: "var(--color-text-light)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function StyledInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 text-[13px] rounded-lg border outline-none transition-colors"
      style={{
        backgroundColor: "var(--color-bg)",
        borderColor: "var(--color-border)",
        color: "var(--color-text)",
        ...props.style,
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-primary)"; props.onFocus?.(e); }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; props.onBlur?.(e); }}
    />
  );
}

function StyledSelect({ ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2 text-[13px] rounded-lg border outline-none transition-colors cursor-pointer"
      style={{
        backgroundColor: "var(--color-bg)",
        borderColor: "var(--color-border)",
        color: "var(--color-text)",
        ...props.style,
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-primary)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
    />
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      {children}
    </div>
  );
}

function SubPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-4 py-4 border-t"
      style={{ backgroundColor: "var(--color-bg)", borderColor: "var(--color-border)" }}
    >
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      {children}
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function PainStep({ S, set, toggleTrigger }: StepProps) {
  return (
    <Card>
      <Row>
        <div className="flex items-center gap-3">
          <IconBox active={S.has_pain}>⚠</IconBox>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
              Patient experiencing pain
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-light)" }}>
              Tap to toggle
            </p>
          </div>
        </div>
        <Toggle checked={S.has_pain} onChange={() => set("has_pain", !S.has_pain)} />
      </Row>

      {S.has_pain && (
        <SubPanel>
          <Field label="Location">
            <StyledInput
              placeholder="e.g. lower-left molar"
              value={S.pain_location}
              onChange={(e) => set("pain_location", e.target.value)}
            />
          </Field>

          <Field label="Pain type">
            <StyledSelect value={S.pain_type} onChange={(e) => set("pain_type", e.target.value)}>
              <option value="">Select…</option>
              <option value="throbbing">Throbbing / pulsating</option>
              <option value="sharp">Sharp / piercing</option>
              <option value="sensitivity">Temperature sensitivity</option>
              <option value="dull">Dull ache</option>
            </StyledSelect>
          </Field>

          <Field label={`Intensity — ${S.pain_intensity}/10`}>
            <input
              type="range" min={0} max={10} step={1}
              value={S.pain_intensity}
              onChange={(e) => set("pain_intensity", +e.target.value)}
              className="w-full accent-(--color-primary)"
              style={{ accentColor: "var(--color-primary)" }}
            />
          </Field>

          <Field label="Duration">
            <StyledSelect value={S.pain_duration} onChange={(e) => set("pain_duration", e.target.value)}>
              <option value="">Select…</option>
              <option value="today">Started today</option>
              <option value="1-3d">1–3 days</option>
              <option value="3-7d">3–7 days</option>
              <option value="1w+">More than a week</option>
            </StyledSelect>
          </Field>

          <Field label="Triggers">
            <div className="grid grid-cols-2 gap-1.5">
              {TRIGGERS.map((t) => {
                const on = S.pain_triggers.includes(t.k);
                return (
                  <button
                    key={t.k}
                    type="button"
                    onClick={() => toggleTrigger(t.k)}
                    className="flex items-center gap-1.5 px-3 py-2 text-[12px] rounded-lg border transition-all duration-150 cursor-pointer"
                    style={{
                      borderColor: on ? "var(--color-primary)" : "var(--color-border)",
                      backgroundColor: on ? "var(--color-bg-blue)" : "var(--color-bg)",
                      color: on ? "var(--color-text-blue)" : "var(--color-text-light)",
                    }}
                  >
                    <span>{t.icon}</span>
                    {t.l}
                  </button>
                );
              })}
            </div>
          </Field>
        </SubPanel>
      )}
    </Card>
  );
}

function SwellingStep({ S, set }: StepProps) {
  return (
    <Card>
      <Row>
        <div className="flex items-center gap-3">
          <IconBox active={S.has_swelling}>◎</IconBox>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
              Visible swelling present
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-light)" }}>
              Tap to toggle
            </p>
          </div>
        </div>
        <Toggle checked={S.has_swelling} onChange={() => set("has_swelling", !S.has_swelling)} />
      </Row>

      {S.has_swelling && (
        <SubPanel>
          <Field label="Severity">
            <StyledSelect value={S.swelling_severity} onChange={(e) => set("swelling_severity", e.target.value)}>
              <option value="">Select…</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe (asymmetrical face)</option>
            </StyledSelect>
          </Field>

          {([
            { k: "has_fever", label: "Accompanied by fever" },
            { k: "difficulty_opening", label: "Difficulty opening mouth (trismus)" },
          ] as const).map((item, i) => (
            <label
              key={item.k}
              className="flex items-center gap-3 py-2.5 cursor-pointer text-sm border-t"
              style={{
                color: "var(--color-text)",
                borderColor: i === 0 ? "transparent" : "var(--color-border)",
              }}
            >
              {item.label}
              <input
                type="checkbox"
                checked={S[item.k]}
                onChange={() => set(item.k, !S[item.k])}
                className="ml-auto w-4 h-4 cursor-pointer"
                style={{ accentColor: "var(--color-primary)" }}
              />
            </label>
          ))}
        </SubPanel>
      )}
    </Card>
  );
}

function HistoryStep({ S, set }: StepProps) {
  return (
    <Card>
      {HISTORY.map((r, i) => (
        <div
          key={r.k}
          className="flex items-center justify-between px-4 py-3.5 gap-4 border-t"
          style={{ borderColor: i === 0 ? "transparent" : "var(--color-border)" }}
        >
          <div className="flex items-center gap-3">
            <IconBox active={S[r.k] as boolean}>✦</IconBox>
            <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
              {r.l}
            </p>
          </div>
          <Toggle
            checked={S[r.k] as boolean}
            onChange={() => set(r.k, !S[r.k] as TriageState[typeof r.k])}
          />
        </div>
      ))}
    </Card>
  );
}

function VisitStep({ S, set }: StepProps) {
  return (
    <Card>
      <div className="px-4 py-4">
        <Field label="Last clinic visit">
          <StyledSelect value={S.last_visit} onChange={(e) => set("last_visit", e.target.value)}>
            <option value="">Select range…</option>
            <option value="<6mo">Less than 6 months ago</option>
            <option value="6-12mo">6–12 months ago</option>
            <option value="1yr+">Over 1 year ago</option>
            <option value="never">Never</option>
          </StyledSelect>
        </Field>
      </div>
    </Card>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function DentalTriage({ onSubmit, loading }: DentalTriageProps) {
  const [step, setStep] = useState(0);

  const [S, setS] = useState<TriageState>({
    has_pain: false, pain_location: "", pain_type: "", pain_intensity: 0,
    pain_duration: "", pain_triggers: [], has_swelling: false,
    swelling_severity: "", has_fever: false, difficulty_opening: false,
    has_trauma: false, has_broken_tooth: false, previous_root_canal: false,
    last_visit: "", recent_extraction: false,
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
      case 0: return <PainStep {...stepProps} />;
      case 1: return <SwellingStep {...stepProps} />;
      case 2: return <HistoryStep {...stepProps} />;
      case 3: return <VisitStep {...stepProps} />;
      default: return null;
    }
  };

  const { ey, h, d, pct } = STEP_META[step];

  return (
    <div className="max-w-[460px] mx-auto pb-12 font-sans">
      {/* Progress bar */}
      <div
        className="h-1 rounded-full mb-8 overflow-hidden"
        style={{ backgroundColor: "var(--color-border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: "var(--color-primary)" }}
        />
      </div>

      {/* Step header */}
      <div className="mb-6">
        <p
          className="text-[11px] font-semibold uppercase tracking-widest mb-1"
          style={{ color: "var(--color-primary)" }}
        >
          {ey}
        </p>
        <h2 className="text-[18px] font-semibold mb-1" style={{ color: "var(--color-text)" }}>
          {h}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-light)" }}>
          {d}
        </p>
      </div>

      {currentStep()}

      {/* Navigation */}
      <div className="flex gap-2 mt-6">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="px-4 py-2.5 text-sm rounded-xl border transition-colors hover:opacity-80"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-light)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            ← Back
          </button>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={() => (step < 3 ? setStep((s) => s + 1) : onSubmit?.(S))}
          className="flex-1 py-2.5 text-sm font-medium rounded-xl text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {loading
            ? "Analysing…"
            : step === 3
              ? "Submit findings →"
              : "Continue →"}
        </button>
      </div>
    </div>
  );
}
