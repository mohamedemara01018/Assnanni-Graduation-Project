import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FiFileText } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { IoPersonCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";

import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import type { RootState } from "@/store/store";
import { setToken } from "../../store/slices/auth/authSlice";

interface Inputs {
  MedicalLicenseNumber: string;
  NationalId: string;
  YearsOfExperience: number;
  ClinicName: string;
  ClinicAddress: string;
  ClinicPhone: string;
  Certificate: FileList;
  Email: string;
  YearsOfStudy: number;
  University: string;
  SupervisingNumber: string;
  CertificateFile: FileList;
  Image: FileList;
  SpecializationId: number;
  ConsultationPrice: number;
  Languages: string;
}

function VerifyDoctorPage() {
  const authBase = useSelector((s: RootState) => s.config.backendUrl);
  const authId = useSelector((s: RootState) => s.auth.id);
  const dispatch = useDispatch();

  const navigator = useNavigate();
  const { state } = useLocation();
  const isStudentDoctor = Boolean(
    (state as { isStudentDoctor?: boolean } | null)?.isStudentDoctor,
  );
  const stateDoctorId = (state as { doctorId?: string } | null)?.doctorId;
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [certificateName, setCertificateName] = useState<string>("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const profileImageFile = watch("Image");
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null,
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

  const labelClass =
    "mb-1 inline-block text-sm font-medium text-(--color-text)";
  const inputClass =
    "w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-3 text-(--color-text) placeholder:text-gray-500 placeholder:text-sm transition focus:border-[#00AFE5] focus:outline-none focus:ring-2 focus:ring-[#00AFE5]/25";
  const errorClass = "ml-1 mt-1 text-xs font-light text-red-600";

  const certificateFile = watch(
    isStudentDoctor ? "CertificateFile" : "Certificate",
  );

  useEffect(() => {
    const file = certificateFile?.[0];
    if (file) {
      setCertificateName(file.name);
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setCertificateName("");
      setImagePreviewUrl(null);
    }
  }, [certificateFile]);

  const verifyMutation = useMutation({
    mutationFn: async (data: Inputs) => {
      if (isStudentDoctor) {
        data.YearsOfStudy = Number(data.YearsOfStudy);

        const formData = new FormData();
        formData.append("Email", data.Email);
        formData.append("NationalId", data.NationalId);
        formData.append("YearsOfStudy", data.YearsOfStudy.toString());
        formData.append("University", data.University);
        formData.append("SupervisingNumber", data.SupervisingNumber);

        if (data.CertificateFile?.[0]) {
          formData.append("CertificateFile", data.CertificateFile[0]);
        }
        if (data.Image?.[0]) {
          formData.append("Image", data.Image[0]);
        }

        return axios.post(
          authBase + "StudentDoctor/complete-profile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        const formData = new FormData();
        formData.append("DoctorId", stateDoctorId || authId || "24");
        formData.append("MedicalLicenseNumber", data.MedicalLicenseNumber);
        formData.append("NationalId", data.NationalId);
        formData.append(
          "SpecializationId",
          Number(data.SpecializationId).toString(),
        );
        formData.append(
          "YearsOfExperience",
          Number(data.YearsOfExperience).toString(),
        );
        formData.append("ClinicName", data.ClinicName);
        formData.append("ClinicAddress", data.ClinicAddress);
        formData.append("ClinicPhone", data.ClinicPhone);
        formData.append(
          "ConsultationPrice",
          Number(data.ConsultationPrice).toString(),
        );

        const langs = data.Languages
          ? data.Languages.split(",").map((l) => l.trim())
          : [];
        langs.forEach((lang) => {
          if (lang) {
            formData.append("Languages", lang);
          }
        });
        if (data.Certificate?.[0]) {
          formData.append("Certificate", data.Certificate[0]);
        }
        console.log(
          formData.get("DoctorId"),
          formData.get("NationalId"),
          formData.get("SpecializationId"),
          formData.get("YearsOfExperience"),
          formData.get("ClinicName"),
          formData.get("ClinicAddress"),
          formData.get("ClinicPhone"),
          formData.get("ConsultationPrice"),
          formData.getAll("Languages"),
          formData.get("Certificate"),
        );
        return axios.post(
          authBase + "Authentications/Submit-Doctor-Verification",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }
    },

    onSuccess: (response) => {
      // Save token to Redux store using dispatch and setToken
      if (response?.data?.token) {
        dispatch(setToken(response.data.token));
      }
      navigator("/");
      toast.success(
        "You have successfully send request wait until admin accept it",
      );
    },
    onError: (error: any) => {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Verification failed";
      toast.error(
        typeof errorMessage === "string" ? errorMessage : "Verification failed",
      );
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    verifyMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center px-4 py-10 sm:px-8">
      <div className="w-full max-w-4xl rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-xl sm:p-8">
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
              ? "Complete your academic and supervisor details to request verification."
              : "Complete your professional details and upload your certificate to request verification."}
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-5"
        >
          {!isStudentDoctor ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="medicalLicenseNumber" className={labelClass}>
                    Medical License Number
                  </label>
                  <input
                    id="medicalLicenseNumber"
                    type="text"
                    placeholder="ML-123456"
                    className={`${inputClass} ${
                      errors.MedicalLicenseNumber && "border-red-500"
                    }`}
                    {...register("MedicalLicenseNumber", {
                      required: "You must provide your Medical License Number",
                    })}
                  />
                  {errors.MedicalLicenseNumber && (
                    <p className={errorClass}>
                      {errors.MedicalLicenseNumber.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="nationalIdNumber" className={labelClass}>
                    National ID Number
                  </label>
                  <input
                    id="nationalIdNumber"
                    type="text"
                    placeholder="123-45-6789"
                    className={`${inputClass} ${
                      errors.NationalId && "border-red-500"
                    }`}
                    {...register("NationalId", {
                      required: "You must provide your National ID",
                    })}
                  />
                  {errors.NationalId && (
                    <p className={errorClass}>{errors.NationalId.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      required: "You must provide your Years of Experience",
                    })}
                  />
                  {errors.YearsOfExperience && (
                    <p className={errorClass}>
                      {errors.YearsOfExperience.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="clinicName" className={labelClass}>
                    Clinic Name
                  </label>
                  <input
                    id="clinicName"
                    type="text"
                    placeholder="Assnani"
                    className={`${inputClass} ${
                      errors.ClinicName && "border-red-500 w-full"
                    }`}
                    {...register("ClinicName", {
                      required: "You must provide your clinic name",
                    })}
                  />
                  {errors.ClinicName && (
                    <p className={errorClass}>{errors.ClinicName.message}</p>
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
                    placeholder="Street, City, Area"
                    className={`${inputClass} ${
                      errors.ClinicAddress && "border-red-500 w-full"
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
                  <label htmlFor="clinicPhone" className={labelClass}>
                    Clinic Phone
                  </label>
                  <input
                    id="clinicPhone"
                    type="text"
                    placeholder="01003010"
                    className={`${inputClass} ${
                      errors.ClinicPhone && "border-red-500 w-full"
                    }`}
                    {...register("ClinicPhone", {
                      minLength: {
                        value: 11,
                        message: "Clinic phone must be at least 11 digits",
                      },
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
                  <label htmlFor="specializationId" className={labelClass}>
                    Specialization ID
                  </label>
                  <input
                    id="specializationId"
                    type="number"
                    placeholder="1"
                    className={`${inputClass} ${
                      errors.SpecializationId && "border-red-500"
                    }`}
                    {...register("SpecializationId", {
                      required: "You must provide your Specialization ID",
                    })}
                  />
                  {errors.SpecializationId && (
                    <p className={errorClass}>
                      {errors.SpecializationId.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="consultationPrice" className={labelClass}>
                    Consultation Price
                  </label>
                  <input
                    id="consultationPrice"
                    type="number"
                    step="0.01"
                    placeholder="100.00"
                    className={`${inputClass} ${
                      errors.ConsultationPrice && "border-red-500"
                    }`}
                    {...register("ConsultationPrice", {
                      required: "You must provide your Consultation Price",
                    })}
                  />
                  {errors.ConsultationPrice && (
                    <p className={errorClass}>
                      {errors.ConsultationPrice.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                <div>
                  <label htmlFor="languages" className={labelClass}>
                    Languages (comma separated)
                  </label>
                  <input
                    id="languages"
                    type="text"
                    placeholder="English, Arabic"
                    className={`${inputClass} ${
                      errors.Languages && "border-red-500"
                    }`}
                    {...register("Languages", {
                      required: "You must provide at least one language",
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
                  <label htmlFor="nationalId" className={labelClass}>
                    National ID Number
                  </label>
                  <input
                    id="nationalId"
                    type="text"
                    placeholder="123-45-6789"
                    className={`${inputClass} ${
                      errors.NationalId && "border-red-500"
                    }`}
                    {...register("NationalId", {
                      minLength: {
                        value: 14,
                        message: "National ID must be at least 14 digits",
                      },
                      required: "You must provide your National ID Number",
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                className="hidden"
                {...register(
                  isStudentDoctor ? "CertificateFile" : "Certificate",
                  {
                    minLength: {
                      value: 3,
                      message: "You must provide a file",
                    },
                    required: isStudentDoctor
                      ? "You must provide your dental university proof"
                      : "You must provide your certificate",
                  },
                )}
              />
              {!imagePreviewUrl && (
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
                      PDF, JPG or PNG (MAX. 10MB)
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
              {imagePreviewUrl && (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={imagePreviewUrl}
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
              disabled={verifyMutation.isPending}
              className="w-full cursor-pointer rounded-xl bg-[#00AFE5] p-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {verifyMutation.isPending
                ? "Submitting..."
                : "Submit for Verification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyDoctorPage;
