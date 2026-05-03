import { useEffect, useState, type ChangeEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FiFileText } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { toast } from "react-toastify";

// import axios from "axios";
import { useLocation, useNavigate } from "react-router";

interface Inputs {
  MedicalLicenseNumber: string;
  NationalId: string;
  YearsOfExperience: number;
  ClinicName: string;
  ClinicAddress: string;
  ClinicPhone: string;
  Certificate: FileList;
  nationalIdNumber: string;
  yearsOfStudy: number;
  supervisorDoctor: string;
  supervisorDoctorClinicName: string;
  supervisorDoctorClinicAddress: string;
  supervisorDoctorClinicPhone: string;
  DentalUniversityProof: FileList;
}

function VerifyDoctorPage() {
  // API base: useSelector((s: RootState) => s.config.backendUrl) + 'Authentications/'

  const navigator = useNavigate();
  const { state } = useLocation();
  const isStudentDoctor = Boolean(
    (state as { isStudentDoctor?: boolean } | null)?.isStudentDoctor,
  );
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [certificateName, setCertificateName] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const labelClass = "mb-1 inline-block text-sm font-medium text-(--color-text)";
  const inputClass =
    "w-full rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-3 text-(--color-text) placeholder:text-gray-500 placeholder:text-sm transition focus:border-[#00AFE5] focus:outline-none focus:ring-2 focus:ring-[#00AFE5]/25";
  const errorClass = "ml-1 mt-1 text-xs font-light text-red-600";

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setCertificateName(file.name);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setCertificateName("");
      setImagePreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (isStudentDoctor) {
      data.yearsOfStudy = Number(data.yearsOfStudy);
    } else {
      data.YearsOfExperience = Number(data.YearsOfExperience);
    }
    try {
      // await axios.post(authBase + "Submit-Doctor-Verification", data);
      navigator("/verify-email");
      toast.success(
        "You have successfully send the request wait until the admin accept it",
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-10 sm:px-8">
      <div className="w-full max-w-4xl rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-xl sm:p-8">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00AFE5]/15">
            <FiFileText className="text-3xl text-[#00AFE5]" />
          </div>
          <h1 className="text-2xl font-semibold text-(--color-text) sm:text-3xl">
            {isStudentDoctor ? "Student Doctor Verification" : "Doctor Verification"}
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
                    <p className={errorClass}>{errors.YearsOfExperience.message}</p>
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
                      required: "You must provide your clinic phone",
                    })}
                  />
                  {errors.ClinicPhone && (
                    <p className={errorClass}>{errors.ClinicPhone.message}</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="studentNationalIdNumber" className={labelClass}>
                    National ID Number
                  </label>
                  <input
                    id="studentNationalIdNumber"
                    type="text"
                    placeholder="123-45-6789"
                    className={`${inputClass} ${
                      errors.nationalIdNumber && "border-red-500"
                    }`}
                    {...register("nationalIdNumber", {
                      required: "You must provide your National ID Number",
                    })}
                  />
                  {errors.nationalIdNumber && (
                    <p className={errorClass}>{errors.nationalIdNumber.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="yearsOfStudy" className={labelClass}>
                    Years of Study
                  </label>
                  <input
                    id="yearsOfStudy"
                    type="number"
                    placeholder="4"
                    className={`${inputClass} ${
                      errors.yearsOfStudy && "border-red-500"
                    }`}
                    {...register("yearsOfStudy", {
                      required: "You must provide your years of study",
                    })}
                  />
                  {errors.yearsOfStudy && (
                    <p className={errorClass}>{errors.yearsOfStudy.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="supervisorDoctor" className={labelClass}>
                    Supervisor Doctor
                  </label>
                  <input
                    id="supervisorDoctor"
                    type="text"
                    placeholder="Dr. Ahmed Ali"
                    className={`${inputClass} ${
                      errors.supervisorDoctor && "border-red-500"
                    }`}
                    {...register("supervisorDoctor", {
                      required: "You must provide the supervisor doctor",
                    })}
                  />
                  {errors.supervisorDoctor && (
                    <p className={errorClass}>{errors.supervisorDoctor.message}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="supervisorDoctorClinicName"
                    className={labelClass}
                  >
                    Supervisor Doctor Clinic Name
                  </label>
                  <input
                    id="supervisorDoctorClinicName"
                    type="text"
                    placeholder="Assnani Clinic"
                    className={`${inputClass} ${
                      errors.supervisorDoctorClinicName && "border-red-500"
                    }`}
                    {...register("supervisorDoctorClinicName", {
                      required:
                        "You must provide supervisor doctor clinic name",
                    })}
                  />
                  {errors.supervisorDoctorClinicName && (
                    <p className={errorClass}>
                      {errors.supervisorDoctorClinicName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="supervisorDoctorClinicAddress"
                    className={labelClass}
                  >
                    Supervisor Doctor Clinic Address
                  </label>
                  <input
                    id="supervisorDoctorClinicAddress"
                    type="text"
                    placeholder="Street, City, Area"
                    className={`${inputClass} ${
                      errors.supervisorDoctorClinicAddress && "border-red-500"
                    }`}
                    {...register("supervisorDoctorClinicAddress", {
                      required:
                        "You must provide supervisor doctor clinic address",
                    })}
                  />
                  {errors.supervisorDoctorClinicAddress && (
                    <p className={errorClass}>
                      {errors.supervisorDoctorClinicAddress.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="supervisorDoctorClinicPhone"
                    className={labelClass}
                  >
                    Supervisor Doctor Clinic Phone
                  </label>
                  <input
                    id="supervisorDoctorClinicPhone"
                    type="text"
                    placeholder="01003010"
                    className={`${inputClass} ${
                      errors.supervisorDoctorClinicPhone && "border-red-500"
                    }`}
                    {...register("supervisorDoctorClinicPhone", {
                      required:
                        "You must provide supervisor doctor clinic phone",
                    })}
                  />
                  {errors.supervisorDoctorClinicPhone && (
                    <p className={errorClass}>
                      {errors.supervisorDoctorClinicPhone.message}
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
                  isStudentDoctor ? "DentalUniversityProof" : "Certificate",
                  {
                    required: isStudentDoctor
                      ? "You must provide your dental university proof"
                      : "You must provide your certificate",
                  },
                )}
                onChange={handleImageChange}
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
            {(errors.Certificate || errors.DentalUniversityProof) && (
              <p className={errorClass}>
                {errors.Certificate?.message ||
                  errors.DentalUniversityProof?.message}
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
            <button className="w-full cursor-pointer rounded-xl bg-[#00AFE5] p-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-500">
              Submit for Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyDoctorPage;
