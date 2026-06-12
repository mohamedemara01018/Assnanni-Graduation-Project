import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { setToken } from "../../store/slices/auth/authSlice";
import {
  User, Stethoscope, Building2, MapPin, Globe,
  Phone, Mail, Clock, DollarSign, Languages,
  GraduationCap, FileText, Upload, ChevronRight,
  X, AlertCircle,
} from "lucide-react";

interface Inputs {
  MedicalLicenseNumber: string;
  About: string;
  Country: string;
  City: string;
  Education: string;
  NationalId: string;
  SpecializationId: number;
  YearsOfExperience: number;
  ClinicName: string;
  ClinicAddress: string;
  ClinicPhone: string;
  ClinicEmail: string;
  ClinicWebsite: string;
  ClinicHours: string;
  Governments: string;
  ConsultationPrice: number;
  Languages: string;
  Gender: string;
  Certificate: FileList;
  Email: string;
  YearsOfStudy: number;
  University: string;
  SupervisingNumber: string;
  CertificateFile: FileList;
  Image: FileList;
}

const splitListValues = (value: string) =>
  value.split(",").map((item) => item.trim()).filter(Boolean);

// ── Reusable field wrapper ────────────────────────────────────────────────────

function FieldGroup({ label, icon: Icon, children, error, hint }: {
  label: string;
  icon?: any;
  children: React.ReactNode;
  error?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest"
        style={{ color: "var(--color-text-light)" }}>
        {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[11px]" style={{ color: "var(--color-text-light)" }}>{hint}</p>
      )}
      {error && (
        <p className="text-[11px] text-red-500 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────

function Section({ title, icon: Icon, children }: {
  title: string; icon: any; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow)" }}>
      <div className="flex items-center gap-2.5 px-5 py-4 border-b"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "var(--color-bg-blue)" }}>
          <Icon className="w-3.5 h-3.5" style={{ color: "var(--color-primary)" }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function VerifyDoctorPage() {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const authId = useSelector((state: RootState) => state.auth.id);
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { state } = useLocation();

  const isStudentDoctor = Boolean(
    (state as { isStudentDoctor?: boolean } | null)?.isStudentDoctor,
  );
  const stateDoctorId = (state as { doctorId?: string } | null)?.doctorId;
  const doctorIdSource = stateDoctorId || authId;
  const resolvedDoctorId = doctorIdSource ? Number(doctorIdSource) : Number.NaN;
  const verificationEndpoint = isStudentDoctor
    ? `${backendUrl}StudentDoctor/complete-profile`
    : `${backendUrl}Authentications/Submit-Doctor-Verification`;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [certificatePreviewUrl, setCertificatePreviewUrl] = useState<string | null>(null);
  const [certificateName, setCertificateName] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherLanguageText, setOtherLanguageText] = useState("");

  const { data: specializations = [] } = useQuery<{ id: number; name: string }[]>({
    queryKey: ["specializations", backendUrl],
    enabled: Boolean(backendUrl),
    queryFn: async () => {
      const token = Cookies.get("jwtToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await axios.get(
        `${backendUrl}Specializations/GetAllSpecializations`, { headers },
      );
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Inputs>({
    defaultValues: { Gender: "Male" },
  });

  // ── Language handlers (unchanged) ────────────────────────────────────────

  const handleSelectLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === "Other") {
      setShowOtherInput(true);
    } else if (selected && !selectedLanguages.includes(selected)) {
      const updated = [...selectedLanguages, selected];
      setSelectedLanguages(updated);
      setValue("Languages", updated.join(", "), { shouldValidate: true });
    }
    e.target.value = "";
  };

  const handleAddOtherLanguage = () => {
    const trimmed = otherLanguageText.trim();
    if (trimmed && !selectedLanguages.includes(trimmed)) {
      const updated = [...selectedLanguages, trimmed];
      setSelectedLanguages(updated);
      setValue("Languages", updated.join(", "), { shouldValidate: true });
    }
    setOtherLanguageText("");
    setShowOtherInput(false);
  };

  const handleRemoveLanguage = (lang: string) => {
    const updated = selectedLanguages.filter((l) => l !== lang);
    setSelectedLanguages(updated);
    setValue("Languages", updated.join(", "), { shouldValidate: true });
  };

  const profileImageFile = watch("Image");
  const certificateFile = watch(isStudentDoctor ? "CertificateFile" : "Certificate");

  useEffect(() => {
    const selectedImage = profileImageFile?.[0];
    if (!selectedImage) { setProfileImagePreview(null); return; }
    const imageUrl = URL.createObjectURL(selectedImage);
    setProfileImagePreview(imageUrl);
    return () => URL.revokeObjectURL(imageUrl);
  }, [profileImageFile]);

  useEffect(() => {
    const selectedCertificate = certificateFile?.[0];
    if (!selectedCertificate) { setCertificatePreviewUrl(null); setCertificateName(""); return; }
    setCertificateName(selectedCertificate.name);
    if (selectedCertificate.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedCertificate);
      setCertificatePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setCertificatePreviewUrl(null);
  }, [certificateFile]);

  // ── Payload builders (unchanged) ─────────────────────────────────────────

  const appendText = (formData: FormData, key: string, value?: string) =>
    formData.append(key, (value ?? "").trim());
  const appendNumber = (formData: FormData, key: string, value?: number) =>
    formData.append(key, Number.isFinite(value ?? NaN) ? String(value) : "0");
  const appendFiles = (formData: FormData, key: string, fileList?: FileList) => {
    const file = fileList?.[0];
    if (file) formData.append(key, file);
  };

  const buildDoctorPayload = (data: Inputs) => {
    const formData = new FormData();
    if (!Number.isInteger(resolvedDoctorId)) throw new Error("Doctor id is missing.");
    formData.append("DoctorId", String(resolvedDoctorId));
    appendText(formData, "MedicalLicenseNumber", data.MedicalLicenseNumber);
    appendText(formData, "About", data.About);
    appendText(formData, "Country", data.Country);
    appendText(formData, "City", data.City);
    appendText(formData, "Education", data.Education);
    appendText(formData, "NationalId", data.NationalId);
    appendNumber(formData, "SpecializationId", data.SpecializationId);
    appendNumber(formData, "YearsOfExperience", data.YearsOfExperience);
    appendText(formData, "ClinicName", data.ClinicName);
    appendText(formData, "ClinicAddress", data.ClinicAddress);
    appendText(formData, "ClinicPhone", data.ClinicPhone);
    appendText(formData, "ClinicEmail", data.ClinicEmail);
    appendText(formData, "ClinicWebsite", data.ClinicWebsite);
    appendText(formData, "ClinicHours", data.ClinicHours);
    appendNumber(formData, "ConsultationPrice", data.ConsultationPrice);
    appendText(formData, "Gender", data.Gender);
    const governments = splitListValues(data.Governments);
    if (governments.length === 0) formData.append("Governments", "");
    else governments.forEach((g) => formData.append("Governments", g));
    const languages = splitListValues(data.Languages);
    if (languages.length === 0) formData.append("Languages", "");
    else languages.forEach((l) => formData.append("Languages", l));
    appendFiles(formData, "Certificate", data.Certificate);
    return formData;
  };

  // const role = useSelector((state: RootState) => state.auth.role);

  const buildStudentDoctorPayload = (data: Inputs) => {
    const formData = new FormData();
    appendText(formData, "Email", data.Email);
    appendText(formData, "NationalId", data.NationalId);
    appendNumber(formData, "YearsOfStudy", data.YearsOfStudy);
    appendText(formData, "University", data.University);
    appendText(formData, "SupervisingNumber", data.SupervisingNumber);
    appendFiles(formData, "CertificateFile", data.CertificateFile);
    appendFiles(formData, "Image", data.Image);
    return formData;
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = isStudentDoctor ? buildStudentDoctorPayload(data) : buildDoctorPayload(data);
      const response = await axios.post(verificationEndpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const token = response.data?.data?.token || response.data?.token;
      if (token) dispatch(setToken(token));
      const successMessage =
        response.data?.data?.message || response.data?.message ||
        (isStudentDoctor ? "Student doctor verification submitted." : "Doctor verification submitted.");
      toast.success(successMessage);
      if (!isStudentDoctor) navigator("/waiting");
      else navigator("/");
    } catch (error: any) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.response?.data || error.message || "Verification failed"
        : error instanceof Error ? error.message : "Verification failed";
      toast.error(typeof errorMessage === "string" ? errorMessage : "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Input style helpers ───────────────────────────────────────────────────

  const inputBase = "w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all duration-150";
  const inputStyle = {
    backgroundColor: "var(--color-bg)",
    border: "1.5px solid var(--color-border)",
    color: "var(--color-text)",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = "var(--color-primary)");
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = "var(--color-border)");

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex justify-center px-4 py-10 sm:px-8">
      <div className="w-full max-w-4xl space-y-5">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="rounded-2xl border p-7 text-center"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow)" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "var(--color-bg-blue)" }}>
            <FileText className="w-7 h-7" style={{ color: "var(--color-primary)" }} />
          </div>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: "var(--color-text)" }}>
            {isStudentDoctor ? "Student Doctor Verification" : "Doctor Verification"}
          </h1>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: "var(--color-text-light)" }}>
            {isStudentDoctor
              ? "Complete your academic details, upload your proof, and submit for review."
              : "Complete your professional details and upload your certificate to request verification."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {!isStudentDoctor ? (
            <>
              {/* ── Professional info ──────────────────────────────────────── */}
              <Section title="Professional Information" icon={Stethoscope}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldGroup label="Medical License Number" icon={FileText} error={errors.MedicalLicenseNumber?.message}>
                    <input type="text" placeholder="12345678910111"
                      className={inputBase} style={inputStyle} onFocus={onFocus}
                      {...register("MedicalLicenseNumber", {
                        required: "Medical license number is required",
                        onBlur: onBlur
                      })} />
                  </FieldGroup>

                  <FieldGroup label="National ID" icon={User} error={errors.NationalId?.message}>
                    <input type="text" placeholder="National ID"
                      className={inputBase} style={inputStyle} onFocus={onFocus}
                      {...register("NationalId", {
                        required: "National ID is required",
                        onBlur: onBlur
                      })} />
                  </FieldGroup>

                  <FieldGroup label="Specialization" icon={Stethoscope} error={errors.SpecializationId?.message}>
                    <select className={inputBase} style={inputStyle} onFocus={onFocus}
                      {...register("SpecializationId", {
                        required: "Specialization is required",
                        setValueAs: (v) => v === "" ? 0 : Number(v),
                        onBlur: onBlur
                      })}>
                      <option value="">Select Specialization</option>
                      {specializations.map((spec) => (
                        <option key={spec.id} value={spec.id}>{spec.name}</option>
                      ))}
                    </select>
                  </FieldGroup>

                  <FieldGroup label="Years of Experience" icon={GraduationCap} error={errors.YearsOfExperience?.message}>
                    <input type="number" placeholder="5"
                      className={inputBase} style={inputStyle} onFocus={onFocus}
                      {...register("YearsOfExperience", {
                        required: "Years of experience is required",
                        setValueAs: (v) => v === "" ? 0 : Number(v),
                        onBlur: onBlur
                      })} />
                  </FieldGroup>

                  <FieldGroup label="Education" icon={GraduationCap}>
                    <input type="text" placeholder="Cairo University — Faculty of Medicine"
                      className={inputBase} style={inputStyle} onFocus={onFocus}
                      {...register("Education", { onBlur: onBlur })} />
                  </FieldGroup>

                  <FieldGroup label="Gender" icon={User} error={errors.Gender?.message}>
                    <select className={inputBase} style={inputStyle} onFocus={onFocus}
                      {...register("Gender", {
                        required: "Gender is required",
                        onBlur: onBlur
                      })}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </FieldGroup>

                  <FieldGroup label="Consultation Price ($)" icon={DollarSign} error={errors.ConsultationPrice?.message}>
                    <input type="number" step="0.01" placeholder="0"
                      className={inputBase} style={inputStyle} onFocus={onFocus}
                      {...register("ConsultationPrice", {
                        required: "Consultation price is required",
                        setValueAs: (v) => v === "" ? 0 : Number(v),
                        onBlur: onBlur
                      })} />
                  </FieldGroup>

                  <FieldGroup label="Governments" icon={MapPin}
                    hint="Separate multiple values with commas — e.g. Cairo, Giza">
                    <input type="text" placeholder="Cairo, Giza"
                      className={inputBase} style={inputStyle} onFocus={onFocus}
                      {...register("Governments", { onBlur: onBlur })} />
                  </FieldGroup>

                  <div className="sm:col-span-2">
                    <FieldGroup label="About" icon={User}>
                      <textarea rows={3} placeholder="Write a short professional bio…"
                        className={inputBase + " resize-none"} style={inputStyle}
                        onFocus={onFocus}
                        {...register("About", { onBlur: onBlur })} />
                    </FieldGroup>
                  </div>
                </div>
              </Section>

              {/* ── Clinic info ─────────────────────────────────────────────── */}
              <Section title="Clinic Information" icon={Building2}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldGroup label="Clinic Name" icon={Building2} error={errors.ClinicName?.message}>
                    <input type="text" placeholder="Clinic name"
                      className={inputBase} style={inputStyle} onFocus={onFocus}
                      {...register("ClinicName", {
                        required: "Clinic name is required",
                        onBlur: onBlur
                      })} />
                  </FieldGroup>

                  <FieldGroup label="Clinic Phone" icon={Phone} error={errors.ClinicPhone?.message}>
                    <input type="text" placeholder="01003010"
                      className={inputBase} style={inputStyle} onFocus={onFocus}
                      {...register("ClinicPhone", {
                        required: "Clinic phone is required",
                        onBlur: onBlur
                      })} />
                  </FieldGroup>

                  <FieldGroup label="Clinic Address" icon={MapPin} error={errors.ClinicAddress?.message}>
                    <input type="text" placeholder="Street, city, area"
                      className={inputBase} style={inputStyle} onFocus={onFocus}
                      {...register("ClinicAddress", {
                        required: "Clinic address is required",
                        onBlur: onBlur
                      })} />
                  </FieldGroup>

                  <FieldGroup label="Clinic Email" icon={Mail}>
                    <input type="email" placeholder="clinic@example.com"
                      className={inputBase} style={inputStyle} onFocus={onFocus}
                      {...register("ClinicEmail", { onBlur: onBlur })} />
                  </FieldGroup>

                  <FieldGroup label="Clinic Website" icon={Globe}>
                    <input type="text" placeholder="https://clinic.example.com"
                      className={inputBase} style={inputStyle} onFocus={onFocus}
                      {...register("ClinicWebsite", { onBlur: onBlur })} />
                  </FieldGroup>

                  <FieldGroup label="Clinic Hours" icon={Clock}>
                    <input type="text" placeholder="Sat-Thu 09:00 - 17:00"
                      className={inputBase} style={inputStyle} onFocus={onFocus}
                      {...register("ClinicHours", { onBlur: onBlur })} />
                  </FieldGroup>

                  <FieldGroup label="Country" icon={Globe}>
                    <input type="text" placeholder="Country"
                      className={inputBase} style={inputStyle} onFocus={onFocus}
                      {...register("Country", { onBlur: onBlur })} />
                  </FieldGroup>

                  <FieldGroup label="City" icon={MapPin}>
                    <input type="text" placeholder="City"
                      className={inputBase} style={inputStyle} onFocus={onFocus}
                      {...register("City", { onBlur: onBlur })} />
                  </FieldGroup>
                </div>
              </Section>

              {/* ── Languages ───────────────────────────────────────────────── */}
              <Section title="Languages" icon={Languages}>
                <div className="space-y-3">
                  {/* Badge display */}
                  <div className="flex flex-wrap gap-2 min-h-11 p-3 rounded-xl border"
                    style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}>
                    {selectedLanguages.length === 0 ? (
                      <span className="text-xs italic" style={{ color: "var(--color-text-light)" }}>
                        No languages selected yet
                      </span>
                    ) : (
                      selectedLanguages.map((lang) => (
                        <span key={lang}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium"
                          style={{ backgroundColor: "var(--color-bg-blue)", color: "var(--color-primary)", border: "1px solid var(--color-primary-lighter)" }}>
                          {lang}
                          <button type="button" onClick={() => handleRemoveLanguage(lang)}
                            className="w-3.5 h-3.5 rounded flex items-center justify-center hover:opacity-70 cursor-pointer">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  <select className={inputBase} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                    onChange={handleSelectLanguage} defaultValue="">
                    <option value="" disabled>Select a language…</option>
                    {["Arabic", "English", "French", "German", "Spanish", "Italian", "Russian", "Chinese", "Japanese", "Turkish"].map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                    <option value="Other">Other…</option>
                  </select>

                  {showOtherInput && (
                    <div className="flex gap-2">
                      <input type="text" placeholder="Type language and press Add…"
                        className={inputBase + " flex-1"} style={inputStyle}
                        onFocus={onFocus} onBlur={onBlur}
                        value={otherLanguageText}
                        onChange={(e) => setOtherLanguageText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddOtherLanguage(); } }} />
                      <button type="button" onClick={handleAddOtherLanguage}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-85 cursor-pointer"
                        style={{ backgroundColor: "var(--color-primary)" }}>
                        Add
                      </button>
                      <button type="button" onClick={() => { setShowOtherInput(false); setOtherLanguageText(""); }}
                        className="px-4 py-2.5 rounded-xl text-sm border transition-opacity hover:opacity-80 cursor-pointer"
                        style={{ borderColor: "var(--color-border)", color: "var(--color-text-light)" }}>
                        Cancel
                      </button>
                    </div>
                  )}

                  <input type="hidden" {...register("Languages", { required: "At least one language is required" })} />
                  {errors.Languages && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                      {errors.Languages.message}
                    </p>
                  )}
                </div>
              </Section>
            </>
          ) : (
            /* ── Student doctor fields ────────────────────────────────────── */
            <Section title="Student Information" icon={GraduationCap}>
              {/* Profile image */}
              <div className="flex flex-col items-center gap-3 mb-6 pb-6 border-b"
                style={{ borderColor: "var(--color-border)" }}>
                <label htmlFor="studentImage" className="cursor-pointer group">
                  {profileImagePreview ? (
                    <img src={profileImagePreview} alt="Profile preview"
                      className="w-24 h-24 rounded-2xl object-cover ring-2 ring-primary/40" />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl flex items-center justify-center transition-colors group-hover:opacity-80"
                      style={{ backgroundColor: "var(--color-bg-blue)", border: "2px dashed var(--color-primary)" }}>
                      <User className="w-10 h-10" style={{ color: "var(--color-primary)" }} />
                    </div>
                  )}
                </label>
                <input id="studentImage" type="file" accept="image/*" className="hidden"
                  {...register("Image", { required: "Profile image is required" })} />
                <label htmlFor="studentImage"
                  className="cursor-pointer px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-85"
                  style={{ backgroundColor: "var(--color-primary)" }}>
                  {profileImagePreview ? "Change photo" : "Upload photo"}
                </label>
                {errors.Image && (
                  <p className="text-[11px] text-red-500">{errors.Image.message as string}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldGroup label="Email" icon={Mail} error={errors.Email?.message}>
                  <input type="email" placeholder="john@example.com"
                    className={inputBase} style={inputStyle} onFocus={onFocus}
                    {...register("Email", {
                      required: "Email is required",
                      onBlur: onBlur
                    })} />
                </FieldGroup>

                <FieldGroup label="National ID" icon={User} error={errors.NationalId?.message}>
                  <input type="text" placeholder="12345678901234"
                    className={inputBase} style={inputStyle} onFocus={onFocus}
                    {...register("NationalId", {
                      required: "National ID is required",
                      onBlur: onBlur
                    })} />
                </FieldGroup>

                <FieldGroup label="Years of Study" icon={GraduationCap} error={errors.YearsOfStudy?.message}>
                  <input type="number" placeholder="4"
                    className={inputBase} style={inputStyle} onFocus={onFocus}
                    {...register("YearsOfStudy", {
                      required: "Years of study is required",
                      setValueAs: (v) => v === "" ? 0 : Number(v),
                      onBlur: onBlur
                    })} />
                </FieldGroup>

                <FieldGroup label="University" icon={Building2} error={errors.University?.message}>
                  <input type="text" placeholder="Cairo University"
                    className={inputBase} style={inputStyle} onFocus={onFocus}
                    {...register("University", {
                      required: "University is required",
                      onBlur: onBlur
                    })} />
                </FieldGroup>

                <div className="sm:col-span-2">
                  <FieldGroup label="Supervising Number" icon={FileText} error={errors.SupervisingNumber?.message}>
                    <input type="text" placeholder="SUP-12345"
                      className={inputBase} style={inputStyle} onFocus={onFocus}
                      {...register("SupervisingNumber", {
                        required: "Supervising number is required",
                        onBlur: onBlur
                      })} />
                  </FieldGroup>
                </div>
              </div>
            </Section>
          )}

          {/* ── Certificate upload ─────────────────────────────────────────── */}
          <Section title={isStudentDoctor ? "Dental University Proof" : "Medical Certificate"} icon={Upload}>
            <input type="file" id="file" accept="image/*,.pdf" className="hidden"
              {...register(isStudentDoctor ? "CertificateFile" : "Certificate", {
                required: isStudentDoctor ? "University proof is required" : "Certificate is required",
              })} />

            {!certificatePreviewUrl && !certificateName && (
              <label htmlFor="file"
                className="flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-colors hover:opacity-80"
                style={{ borderColor: "var(--color-primary)", backgroundColor: "var(--color-bg-blue)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-primary-lighter)" }}>
                  <Upload className="w-7 h-7" style={{ color: "var(--color-primary)" }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                    {isStudentDoctor ? "Upload dental university proof" : "Upload medical certificate"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-text-light)" }}>PDF, JPG or PNG</p>
                </div>
                <span className="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                  style={{ backgroundColor: "var(--color-primary)" }}>
                  Choose File
                </span>
              </label>
            )}

            {certificatePreviewUrl && (
              <div className="flex flex-col items-center gap-4">
                <img src={certificatePreviewUrl} alt="Preview"
                  className="max-h-72 w-full rounded-xl object-contain p-2 border"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }} />
                {certificateName && (
                  <p className="text-xs px-3 py-1.5 rounded-lg border"
                    style={{ color: "var(--color-text-light)", borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}>
                    {certificateName}
                  </p>
                )}
                <label htmlFor="file"
                  className="cursor-pointer px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-85"
                  style={{ backgroundColor: "var(--color-primary)" }}>
                  Choose another file
                </label>
              </div>
            )}

            {!certificatePreviewUrl && certificateName && (
              <div className="flex items-center justify-between gap-4 rounded-xl border p-4"
                style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>Selected file</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-light)" }}>{certificateName}</p>
                </div>
                <label htmlFor="file"
                  className="cursor-pointer px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-85"
                  style={{ backgroundColor: "var(--color-primary)" }}>
                  Change
                </label>
              </div>
            )}

            {(errors.Certificate || errors.CertificateFile) && (
              <p className="mt-2 text-[11px] text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                {errors.Certificate?.message || errors.CertificateFile?.message}
              </p>
            )}
          </Section>

          {/* ── Note ──────────────────────────────────────────────────────── */}
          <div className="flex items-start gap-3 rounded-2xl border px-4 py-4"
            style={{ backgroundColor: "rgba(234,179,8,0.06)", borderColor: "rgba(234,179,8,0.25)" }}>
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-300">
              <strong>Note:</strong> All information will be verified by our admin team.
              Please ensure all details are accurate and documents are clear and valid.
            </p>
          </div>

          {/* ── Submit ────────────────────────────────────────────────────── */}
          <button type="submit" disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: "var(--color-primary)" }}
            onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = "var(--color-primary-dark)"; }}
            onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = "var(--color-primary)"; }}>
            {isSubmitting ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting…</>
            ) : (
              <>Submit for Verification <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyDoctorPage;
