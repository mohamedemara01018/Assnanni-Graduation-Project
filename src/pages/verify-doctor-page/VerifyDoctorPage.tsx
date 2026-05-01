import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FiFileText } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { toast } from "react-toastify";

// import axios from "axios";
import { useNavigate } from "react-router";

interface Inputs {
  MedicalLicenseNumber: string;
  NationalId: string;
  YearsOfExperience: number;
  ClinicName: string;
  ClinicAddress: string;
  ClinicPhone: string;
  Certificate: FileList;
}

function VerifyDoctorPage() {
  // const backendUrl = import.meta.env.VITE_BACKEND_URL+"Authentications/";

  const navigator = useNavigate();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImagePreviewUrl(null);
    }
  };
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    data.YearsOfExperience = Number(data.YearsOfExperience);
    try {
      // await axios.post(backendUrl + "Submit-Doctor-Verification", data);
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
    <div className="py-16 px-8 flex items-center justify-center">
      <div className="flex flex-col gap-8 items-center bg-(--color-surface) max-w-[650px] p-8 rounded-xl shadow-2xl">
        <div className="w-16 h-16 bg-green-300/50 flex items-center justify-center rounded-full">
          <FiFileText className="text-4xl text-green-500" />
        </div>
        <div className="flex flex-col  items-center">
          <h1 className="text-(--color-text) text-3xl">Doctor Verification</h1>
          <p className="text-(--color-text-light)">
            Complete your professional verification to access the platform
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <div className="flex gap-2 max-sm:flex-col">
            <div className="flex flex-col flex-1 items-start w-full gap-1">
              <div className="input-field w-full">
                <label
                  htmlFor={"medicalLicenseNumber"}
                  className="text-(--color-text)"
                >
                  {"Medical License Number"}
                </label>
                <input
                  id={"medicalLicenseNumber"}
                  type={"text"}
                  placeholder={"ML-123456"}
                  className={`"w-full px-4 py-3 bg-(--color-bg) border border-(--color-border) rounded-lg focus:ring-2 focus:ring-(--color-primary)  text-(--color-text)" ${
                    errors.MedicalLicenseNumber && "border-red-500 w-full"
                  }`}
                  {...register("MedicalLicenseNumber", {
                    required: "You must provide your Medical License Number",
                  })}
                />
                {errors.MedicalLicenseNumber && (
                  <p className="text-red-600 text-xs font-light mt-1 translate-x-1">
                    {errors.MedicalLicenseNumber.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex max-sm:flex-col gap-1 flex-1">
              <div className="input-field">
                <label
                  htmlFor={"nationalIdNumber"}
                  className="text-(--color-text)"
                >
                  {"National ID Number"}
                </label>
                <input
                  id={"nationalIdNumber"}
                  type={"text"}
                  placeholder={"123-45-6789"}
                  className={`"w-full px-4 py-3 bg-(--color-bg) border border-(--color-border) rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent text-(--color-text)" ${
                    errors.NationalId && "border-red-500 w-full"
                  }`}
                  {...register("NationalId", {
                    required: "You must provide your National ID",
                  })}
                />
                {errors.NationalId && (
                  <p className="text-red-600 text-xs font-light mt-1 translate-x-1">
                    {errors.NationalId.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex  max-sm:flex-col  gap-2">
            <div className="flex  flex-col  w-full ">
              <div className="input-field">
                <label
                  htmlFor={"yearsOfExperience"}
                  className="text-(--color-text)"
                >
                  {"Years of Experience"}
                </label>
                <input
                  id={"yearsOfExperience"}
                  type={"number"}
                  placeholder={"5"}
                  className={`"w-full px-4 py-3 bg-(--color-bg) border border-(--color-border) rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent text-(--color-text)" ${
                    errors.YearsOfExperience && "border-red-500 w-full"
                  }`}
                  {...register("YearsOfExperience", {
                    required: "You must provide your Years of Experience",
                  })}
                />
                {errors.YearsOfExperience && (
                  <p className="text-red-600 text-xs font-light mt-1 translate-x-1">
                    {errors.YearsOfExperience.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex -translate-y-1 flex-col items-start w-full gap-1">
              <label htmlFor={"clinicName"} className="text-(--color-text)">
                Clinic Name
              </label>
              <input
                id={"clinicName"}
                type={"text"}
                placeholder={"Assnani"}
                className={`"w-full px-4 py-3 bg-(--color-bg) border border-(--color-border) rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent text-(--color-text)" ${
                  errors.ClinicName && "border-red-500 w-full"
                }`}
                {...register("ClinicName", {
                  required: "You must provide your clinic name",
                })}
              />
              {errors.ClinicName && (
                <p className="text-red-600 text-xs font-light mt-1 translate-x-1">
                  {errors.ClinicName.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex max-sm:flex-col gap-2">
            <div className="flex -translate-y-1 flex-col items-start w-full gap-1">
              <label htmlFor={"clinicAddress"} className="text-(--color-text)">
                Clinic Address
              </label>
              <input
                id={"clinicAddress"}
                type={"text"}
                className={`"w-full px-4 py-3 bg-(--color-bg) border border-(--color-border) rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent text-(--color-text)" ${
                  errors.ClinicAddress && "border-red-500 w-full"
                }`}
                {...register("ClinicAddress", {
                  required: "You must provide your clinic name",
                })}
              />
              {errors.ClinicAddress && (
                <p className="text-red-600 text-xs font-light mt-1 translate-x-1">
                  {errors.ClinicAddress.message}
                </p>
              )}
            </div>
            <div className="flex -translate-y-1 flex-col items-start w-full gap-1">
              <label htmlFor={"clinicPhone"} className="text-(--color-text)">
                Clinic Phone
              </label>
              <input
                id={"clinicPhone"}
                type={"text"}
                placeholder={"01003010"}
                className={`"w-full px-4 py-3 bg-(--color-bg) border border-(--color-border) rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent text-(--color-text)" ${
                  errors.ClinicPhone && "border-red-500 w-full"
                }`}
                {...register("ClinicPhone", {
                  required: "You must provide your clinic name",
                })}
              />
              {errors.ClinicPhone && (
                <p className="text-red-600 text-xs font-light mt-1 translate-x-1">
                  {errors.ClinicPhone.message}
                </p>
              )}
            </div>
          </div>

          <div className=" flex flex-col items-start gap-1 ">
            <label htmlFor="medicalcertificate">
              Upload Medical Certificate
            </label>
            <div className="flex flex-col items-center justify-center gap-4 w-full p-8 border-dashed border-2 rounded-sm">
              {!imagePreviewUrl && (
                <>
                  <LuUpload className="text-5xl text-(--color-text-light)" />
                  <div className="text-center">
                    <h3 className="text-xl">
                      Click to upload or drag and drop
                    </h3>
                    <p className="text-(--color-text-light)">
                      PDF, JPG or PNG (MAX. 10MB)
                    </p>
                  </div>
                  <label
                    htmlFor="file"
                    className="text-white bg-(--color-primary) hover:bg-(--color-primary-dark) py-2 px-4 rounded-sm transition duration-200 cursor-pointer"
                  >
                    Choose File
                  </label>
                </>
              )}
              <input
                type="file"
                id="file"
                className="hidden"
                {...register("Certificate", {
                  required: "you Must provide your Certificate",
                })}
                onChange={handleImageChange}
              />

              {imagePreviewUrl && (
                <div className="flex justify-center items-center relative flex-col ">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-full h-full rounded-2xl"
                  />
                  <label
                    htmlFor="file"
                    className="text-white bg-(--color-primary) hover:bg-(--color-primary-dark) py-2 px-4 rounded-sm transition duration-200 cursor-pointer absolute opacity-60 hover:opacity-80"
                  >
                    Choose another file
                  </label>
                  {errors.Certificate && (
                    <p className="text-red-600 text-xs font-light mt-1 translate-x-1">
                      {errors.Certificate.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>Note:</strong> All information will be verified by our
              admin team. Please ensure all details are accurate and documents
              are clear and valid.
            </p>
          </div>
          <div className="w-full">
            <button className=" text-white bg-(--color-primary) w-full p-4 rounded-sm hover:bg-(--color-primary-dark) cursor-pointer transition duration-200">
              Submit for Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyDoctorPage;
