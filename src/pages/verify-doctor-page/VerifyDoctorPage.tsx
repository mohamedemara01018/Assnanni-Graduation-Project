import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FiFileText } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { IoPersonCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { setToken } from "../../store/slices/auth/authSlice";

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
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

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
  const [certificatePreviewUrl, setCertificatePreviewUrl] = useState<
    string | null
  >(null);
  const [certificateName, setCertificateName] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null,
  );
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
        `${backendUrl}Specializations/GetAllSpecializations`,
        { headers },
      );
      return Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      Gender: "Male",
    },
  });

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
  const certificateFile = watch(
    isStudentDoctor ? "CertificateFile" : "Certificate",
  );

  useEffect(() => {
    const selectedImage = profileImageFile?.[0];

    if (!selectedImage) {
      setProfileImagePreview(null);
      return;
    }

    const imageUrl = URL.createObjectURL(selectedImage);
    setProfileImagePreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [profileImageFile]);

  useEffect(() => {
    const selectedCertificate = certificateFile?.[0];

    if (!selectedCertificate) {
      setCertificatePreviewUrl(null);
      setCertificateName("");
      return;
    }

    setCertificateName(selectedCertificate.name);

    if (selectedCertificate.type.startsWith("image/")) {
      const certificateUrl = URL.createObjectURL(selectedCertificate);
      setCertificatePreviewUrl(certificateUrl);

      return () => URL.revokeObjectURL(certificateUrl);
    }

    setCertificatePreviewUrl(null);
  }, [certificateFile]);

  const labelClass =
    "mb-1 inline-block text-sm font-medium text-(--color-text)";
  const inputClass =
    "w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-3 text-(--color-text) placeholder:text-gray-500 placeholder:text-sm transition focus:border-[#00AFE5] focus:outline-none focus:ring-2 focus:ring-[#00AFE5]/25";
  const errorClass = "ml-1 mt-1 text-xs font-light text-red-600";

  const appendText = (formData: FormData, key: string, value?: string) => {
    formData.append(key, (value ?? "").trim());
  };

  const appendNumber = (formData: FormData, key: string, value?: number) => {
    formData.append(key, Number.isFinite(value ?? NaN) ? String(value) : "0");
  };

  const appendFiles = (
    formData: FormData,
    key: string,
    fileList?: FileList,
  ) => {
    const file = fileList?.[0];
    if (file) {
      formData.append(key, file);
    }
  };

  const buildDoctorPayload = (data: Inputs) => {
    const formData = new FormData();

    if (!Number.isInteger(resolvedDoctorId)) {
      throw new Error("Doctor id is missing. Please reload and try again.");
    }

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
    if (governments.length === 0) {
      formData.append("Governments", "");
    } else {
      governments.forEach((government) => {
        formData.append("Governments", government);
      });
    }

    const languages = splitListValues(data.Languages);
    if (languages.length === 0) {
      formData.append("Languages", "");
    } else {
      languages.forEach((language) => {
        formData.append("Languages", language);
      });
    }

    appendFiles(formData, "Certificate", data.Certificate);

    return formData;
  };

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

      const formData = isStudentDoctor
        ? buildStudentDoctorPayload(data)
        : buildDoctorPayload(data);

      const response = await axios.post(verificationEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const token = response.data?.data?.token || response.data?.token;
      if (token) {
        dispatch(setToken(token));
      }

      const successMessage =
        response.data?.data?.message ||
        response.data?.message ||
        (isStudentDoctor
          ? "Student doctor verification submitted successfully."
          : "Doctor verification submitted successfully.");

      toast.success(successMessage);
      navigator("/");
    } catch (error: any) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Verification failed"
        : error instanceof Error
          ? error.message
          : "Verification failed";

      toast.error(
        typeof errorMessage === "string" ? errorMessage : "Verification failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-10 sm:px-8">
      <div className="w-full max-w-5xl rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-xl sm:p-8">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00AFE5]/15">
            <FiFileText className="text-3xl text-[#00AFE5]" />
          </div>
          <h1 className="text-2xl font-semibold text-(--color-text) sm:text-3xl">
            {isStudentDoctor
              ? "Student Doctor Verification"
              : "Doctor Verification"}
          </h1>
          <p className="max-w-2xl text-sm text-(--color-text-light) sm:text-base">
            {isStudentDoctor
              ? "Complete your academic details, upload your proof, and submit the profile for review."
              : "Complete your professional details and upload your certificate to request verification."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-5"
        >
          {!isStudentDoctor ? (
            <>
              <div className="rounded-2xl border border-[#00AFE5]/15 bg-[#00AFE5]/5 p-4 hidden">
                <p className="text-sm font-medium text-(--color-text)">
                  Doctor ID
                </p>
                <p className="mt-1 text-sm text-(--color-text-light)">
                  {Number.isInteger(resolvedDoctorId)
                    ? resolvedDoctorId
                    : "Missing"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="medicalLicenseNumber" className={labelClass}>
                    Medical License Number
                  </label>
                  <input
                    id="medicalLicenseNumber"
                    type="text"
                    placeholder="12345678910111"
                    className={`${inputClass} ${
                      errors.MedicalLicenseNumber && "border-red-500"
                    }`}
                    {...register("MedicalLicenseNumber", {
                      required: "You must provide your medical license number",
                    })}
                  />
                  {errors.MedicalLicenseNumber && (
                    <p className={errorClass}>
                      {errors.MedicalLicenseNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="nationalId" className={labelClass}>
                    National ID
                  </label>
                  <input
                    id="nationalId"
                    type="text"
                    placeholder="National ID"
                    className={`${inputClass} ${
                      errors.NationalId && "border-red-500"
                    }`}
                    {...register("NationalId", {
                      required: "You must provide your national ID",
                    })}
                  />
                  {errors.NationalId && (
                    <p className={errorClass}>{errors.NationalId.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="specializationId" className={labelClass}>
                    Specialization
                  </label>
                  <select
                    id="specializationId"
                    className={`${inputClass} ${
                      errors.SpecializationId && "border-red-500"
                    }`}
                    {...register("SpecializationId", {
                      required: "You must select your specialization",
                      setValueAs: (value) => (value === "" ? 0 : Number(value)),
                    })}
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map((spec) => (
                      <option key={spec.id} value={spec.id}>
                        {spec.name}
                      </option>
                    ))}
                  </select>
                  {errors.SpecializationId && (
                    <p className={errorClass}>
                      {errors.SpecializationId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="yearsOfExperience" className={labelClass}>
                    Years of Experience
                  </label>
                  <input
                    id="yearsOfExperience"
                    type="number"
                    placeholder="5"
                    className={`${inputClass} ${
                      errors.YearsOfExperience && "border-red-500"
                    }`}
                    {...register("YearsOfExperience", {
                      required: "You must provide your years of experience",
                      setValueAs: (value) => (value === "" ? 0 : Number(value)),
                    })}
                  />
                  {errors.YearsOfExperience && (
                    <p className={errorClass}>
                      {errors.YearsOfExperience.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="clinicName" className={labelClass}>
                    Clinic Name
                  </label>
                  <input
                    id="clinicName"
                    type="text"
                    placeholder="Clinic name"
                    className={`${inputClass} ${
                      errors.ClinicName && "border-red-500"
                    }`}
                    {...register("ClinicName", {
                      required: "You must provide your clinic name",
                    })}
                  />
                  {errors.ClinicName && (
                    <p className={errorClass}>{errors.ClinicName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="clinicPhone" className={labelClass}>
                    Clinic Phone
                  </label>
                  <input
                    id="clinicPhone"
                    type="text"
                    placeholder="01003010"
                    className={`${inputClass} ${
                      errors.ClinicPhone && "border-red-500"
                    }`}
                    {...register("ClinicPhone", {
                      required: "You must provide your clinic phone",
                    })}
                  />
                  {errors.ClinicPhone && (
                    <p className={errorClass}>{errors.ClinicPhone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="clinicAddress" className={labelClass}>
                    Clinic Address
                  </label>
                  <input
                    id="clinicAddress"
                    type="text"
                    placeholder="Street, city, area"
                    className={`${inputClass} ${
                      errors.ClinicAddress && "border-red-500"
                    }`}
                    {...register("ClinicAddress", {
                      required: "You must provide your clinic address",
                    })}
                  />
                  {errors.ClinicAddress && (
                    <p className={errorClass}>{errors.ClinicAddress.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="clinicEmail" className={labelClass}>
                    Clinic Email
                  </label>
                  <input
                    id="clinicEmail"
                    type="email"
                    placeholder="clinic@example.com"
                    className={inputClass}
                    {...register("ClinicEmail")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="clinicWebsite" className={labelClass}>
                    Clinic Website
                  </label>
                  <input
                    id="clinicWebsite"
                    type="text"
                    placeholder="https://clinic.example.com"
                    className={inputClass}
                    {...register("ClinicWebsite")}
                  />
                </div>

                <div>
                  <label htmlFor="clinicHours" className={labelClass}>
                    Clinic Hours
                  </label>
                  <input
                    id="clinicHours"
                    type="text"
                    placeholder="Sat-Thu 09:00 - 17:00"
                    className={inputClass}
                    {...register("ClinicHours")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="country" className={labelClass}>
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    placeholder="Country"
                    className={inputClass}
                    {...register("Country")}
                  />
                </div>

                <div>
                  <label htmlFor="city" className={labelClass}>
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="City"
                    className={inputClass}
                    {...register("City")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="education" className={labelClass}>
                    Education
                  </label>
                  <input
                    id="education"
                    type="text"
                    placeholder="Education"
                    className={inputClass}
                    {...register("Education")}
                  />
                </div>

                <div>
                  <label htmlFor="gender" className={labelClass}>
                    Gender
                  </label>
                  <select
                    id="gender"
                    className={`${inputClass} ${
                      errors.Gender && "border-red-500"
                    }`}
                    {...register("Gender", {
                      required: "You must provide your gender",
                    })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.Gender && (
                    <p className={errorClass}>{errors.Gender.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="about" className={labelClass}>
                    About
                  </label>
                  <textarea
                    id="about"
                    rows={4}
                    placeholder="Write a short bio"
                    className={inputClass}
                    {...register("About")}
                  />
                </div>

                <div>
                  <label htmlFor="governments" className={labelClass}>
                    Governments
                  </label>
                  <input
                    id="governments"
                    type="text"
                    placeholder="Cairo, Giza"
                    className={inputClass}
                    {...register("Governments")}
                  />
                  <p className="mt-2 text-xs text-(--color-text-light)">
                    Use commas to separate multiple values.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="consultationPrice" className={labelClass}>
                    Consultation Price
                  </label>
                  <input
                    id="consultationPrice"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    className={`${inputClass} ${
                      errors.ConsultationPrice && "border-red-500"
                    }`}
                    {...register("ConsultationPrice", {
                      required: "You must provide your consultation price",
                      setValueAs: (value) => (value === "" ? 0 : Number(value)),
                    })}
                  />
                  {errors.ConsultationPrice && (
                    <p className={errorClass}>
                      {errors.ConsultationPrice.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="languages" className={labelClass}>
                    Languages
                  </label>
                  
                  {/* Selected languages displayed as ovals/badges above the input */}
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[42px] p-2 rounded-xl border border-dashed border-(--color-border) bg-linear-to-br from-[#00AFE5]/5 to-transparent items-center">
                    {selectedLanguages.length === 0 ? (
                      <span className="text-xs text-gray-400 italic px-2">No languages selected yet.</span>
                    ) : (
                      selectedLanguages.map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#00AFE5]/10 px-3 py-1 text-sm font-semibold text-[#00AFE5]"
                        >
                          {lang}
                          <button
                            type="button"
                            onClick={() => handleRemoveLanguage(lang)}
                            className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-[#00AFE5]/20 text-xs font-bold transition-colors"
                          >
                            &times;
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  <select
                    id="languages"
                    className={`${inputClass} ${
                      errors.Languages && "border-red-500"
                    }`}
                    onChange={handleSelectLanguage}
                    defaultValue=""
                  >
                    <option value="" disabled>Select a language...</option>
                    <option value="Arabic">Arabic</option>
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Italian">Italian</option>
                    <option value="Russian">Russian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Turkish">Turkish</option>
                    <option value="Other">Other...</option>
                  </select>

                  {showOtherInput && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        placeholder="Type language and click Add..."
                        className={inputClass}
                        value={otherLanguageText}
                        onChange={(e) => setOtherLanguageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddOtherLanguage();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddOtherLanguage}
                        className="rounded-xl bg-[#00AFE5] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowOtherInput(false);
                          setOtherLanguageText("");
                        }}
                        className="rounded-xl border border-(--color-border) px-4 py-2 text-sm font-semibold text-(--color-text) hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <input
                    type="hidden"
                    {...register("Languages", {
                      required: "You must select at least one language",
                    })}
                  />

                  {errors.Languages && (
                    <p className={errorClass}>{errors.Languages.message}</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-3 py-4">
                <label htmlFor="studentImage" className="cursor-pointer">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Selected profile preview"
                      className="h-28 w-28 rounded-full object-cover ring-2 ring-[#00AFE5]/40"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-[#00AFE5]/50 bg-[#00AFE5]/10">
                      <IoPersonCircleOutline className="text-6xl text-[#00AFE5]" />
                    </div>
                  )}
                </label>

                <input
                  id="studentImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("Image", {
                    required: "Profile image is required",
                  })}
                />

                <label
                  htmlFor="studentImage"
                  className="cursor-pointer rounded-full bg-[#00AFE5] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                >
                  {profileImagePreview
                    ? "Change profile image"
                    : "Upload profile image"}
                </label>

                {!errors.Image && (
                  <p className="text-xs text-gray-500">
                    JPG, PNG, WEBP supported
                  </p>
                )}

                {errors.Image && (
                  <p className="text-xs text-red-600">
                    {errors.Image.message as string}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className={`${inputClass} ${
                      errors.Email && "border-red-500"
                    }`}
                    {...register("Email", {
                      required: "You must provide your email",
                    })}
                  />
                  {errors.Email && (
                    <p className={errorClass}>{errors.Email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="nationalIdStudent" className={labelClass}>
                    National ID Number
                  </label>
                  <input
                    id="nationalIdStudent"
                    type="text"
                    placeholder="12345678901234"
                    className={`${inputClass} ${
                      errors.NationalId && "border-red-500"
                    }`}
                    {...register("NationalId", {
                      required: "You must provide your national ID number",
                    })}
                  />
                  {errors.NationalId && (
                    <p className={errorClass}>{errors.NationalId.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="yearsOfStudy" className={labelClass}>
                    Years of Study
                  </label>
                  <input
                    id="yearsOfStudy"
                    type="number"
                    placeholder="4"
                    className={`${inputClass} ${
                      errors.YearsOfStudy && "border-red-500"
                    }`}
                    {...register("YearsOfStudy", {
                      required: "You must provide your years of study",
                      setValueAs: (value) => (value === "" ? 0 : Number(value)),
                    })}
                  />
                  {errors.YearsOfStudy && (
                    <p className={errorClass}>{errors.YearsOfStudy.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="university" className={labelClass}>
                    University
                  </label>
                  <input
                    id="university"
                    type="text"
                    placeholder="Cairo University"
                    className={`${inputClass} ${
                      errors.University && "border-red-500"
                    }`}
                    {...register("University", {
                      required: "You must provide your university",
                    })}
                  />
                  {errors.University && (
                    <p className={errorClass}>{errors.University.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                <div>
                  <label htmlFor="supervisingNumber" className={labelClass}>
                    Supervising Number
                  </label>
                  <input
                    id="supervisingNumber"
                    type="text"
                    placeholder="SUP-12345"
                    className={`${inputClass} ${
                      errors.SupervisingNumber && "border-red-500"
                    }`}
                    {...register("SupervisingNumber", {
                      required: "You must provide the supervising number",
                    })}
                  />
                  {errors.SupervisingNumber && (
                    <p className={errorClass}>
                      {errors.SupervisingNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col items-start gap-1">
            <label htmlFor="file" className={labelClass}>
              {isStudentDoctor
                ? "Upload Dental University Proof"
                : "Upload Medical Certificate"}
            </label>

            <div className="w-full rounded-2xl border border-[#00AFE5]/25 bg-linear-to-br from-[#00AFE5]/8 via-transparent to-[#00AFE5]/4 p-6 sm:p-8">
              <input
                type="file"
                id="file"
                accept="image/*,.pdf"
                className="hidden"
                {...register(
                  isStudentDoctor ? "CertificateFile" : "Certificate",
                  {
                    required: isStudentDoctor
                      ? "You must provide your dental university proof"
                      : "You must provide your certificate",
                  },
                )}
              />

              {!certificatePreviewUrl && (
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00AFE5]/15">
                    <LuUpload className="text-3xl text-[#00AFE5]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-(--color-text)">
                      {isStudentDoctor
                        ? "Click to upload dental university proof"
                        : "Click to upload your certificate"}
                    </h3>
                    <p className="text-sm text-(--color-text-light)">
                      PDF, JPG or PNG
                    </p>
                  </div>
                  <label
                    htmlFor="file"
                    className="cursor-pointer rounded-full bg-[#00AFE5] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#00AFE5]/30 transition-all hover:-translate-y-0.5 hover:bg-blue-500"
                  >
                    Choose File
                  </label>
                </div>
              )}

              {certificatePreviewUrl && (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={certificatePreviewUrl}
                    alt="Preview"
                    className="max-h-80 w-full rounded-xl border border-(--color-border) bg-(--color-surface) object-contain p-2"
                  />
                  {certificateName && (
                    <p className="rounded-full bg-(--color-surface) px-4 py-1.5 text-sm text-(--color-text-light)">
                      Selected: {certificateName}
                    </p>
                  )}
                  <label
                    htmlFor="file"
                    className="cursor-pointer rounded-full bg-[#00AFE5] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#00AFE5]/30 transition-all hover:-translate-y-0.5 hover:bg-blue-500"
                  >
                    Choose another file
                  </label>
                </div>
              )}

              {certificateName && !certificatePreviewUrl && (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-(--color-text)">
                      Selected file
                    </p>
                    <p className="text-sm text-(--color-text-light)">
                      {certificateName}
                    </p>
                  </div>
                  <label
                    htmlFor="file"
                    className="cursor-pointer rounded-full bg-[#00AFE5] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                  >
                    Change
                  </label>
                </div>
              )}
            </div>

            {(errors.Certificate || errors.CertificateFile) && (
              <p className={errorClass}>
                {errors.Certificate?.message || errors.CertificateFile?.message}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> All information will be verified by our
              admin team. Please ensure all details are accurate and documents
              are clear and valid.
            </p>
          </div>

          <div className="w-full">
            <button
              disabled={isSubmitting}
              className="w-full cursor-pointer rounded-xl bg-[#00AFE5] p-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Submitting..." : "Submit for Verification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyDoctorPage;
