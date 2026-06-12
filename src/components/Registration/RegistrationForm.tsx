import { NavLink, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  Mail, Phone, Lock, Calendar, MapPin,
  User, AlertCircle, Droplets, Loader2, Camera,
} from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getEmail } from "@/store/slices/email/emailSlice";
import type { RootState } from "@/store/store";

interface Inputs {
  image?: FileList;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
  address?: string;
  gender?: string;
  bloodType?: string;
}

interface RegistrationFormProps {
  isDoctorRegister?: boolean;
  isStudentDoctorRegister?: boolean;
}

// ─── Reusable field wrapper ───────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
  required,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--color-text-light)" }}
      >
        {label}
        {required && (
          <span style={{ color: "#dc2626" }} className="ml-0.5">*</span>
        )}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs mt-0.5" style={{ color: "#dc2626" }}>
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Input with icon ──────────────────────────────────────────────────────────

function InputIcon({
  icon: Icon,
  hasError,
  children,
}: {
  icon: React.ElementType;
  hasError?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center"
        style={{ color: "var(--color-text-light)" }}
      >
        <Icon className="w-4 h-4" />
      </div>
      {/* inject border-color via wrapper; children must have pl-10 */}
      <div
        style={{
          borderRadius: "0.75rem",
          border: `1.5px solid ${hasError ? "#dc2626" : "var(--color-border)"}`,
        }}
        className="overflow-hidden transition-colors focus-within:!border-[var(--color-primary)]"
      >
        {children}
      </div>
    </div>
  );
}

const inputCls =
  "w-full bg-(--color-bg) text-(--color-text) placeholder:text-gray-400 placeholder:text-sm py-2.5 pl-10 pr-3 outline-none border-none focus:outline-none";

// ─── Component ────────────────────────────────────────────────────────────────

const RegistrationForm = ({
  isDoctorRegister = false,
  isStudentDoctorRegister = false,
}: RegistrationFormProps) => {
  // ── ALL ORIGINAL LOGIC — UNTOUCHED ──────────────────────────────────────────
  const authBase = useSelector((s: RootState) => s.config.backendUrl);
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { pathname } = useLocation();
  const doctor: boolean =
    isDoctorRegister ||
    (!isStudentDoctorRegister && pathname.includes("doctor-register"));
  const studentDoctor: boolean =
    isStudentDoctorRegister || pathname.includes("student-register");
  const isDoctor: boolean =
    pathname.includes("/doctor-register") ||
    pathname.includes("/student-register");
  const isPatient: boolean = !doctor && !studentDoctor;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  // eslint-disable-next-line react-hooks/incompatible-library
  const password = watch("password");
  const imageFile = watch("image");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const selectedImage = imageFile?.[0];
    if (!selectedImage) { setImagePreview(null); return; }
    const imageUrl = URL.createObjectURL(selectedImage);
    setImagePreview(imageUrl);
    return () => URL.revokeObjectURL(imageUrl);
  }, [imageFile]);

  const registerMutation = useMutation({
    mutationFn: async (data: Inputs) => {
      if (doctor) {
        const response = await axios.post(
          authBase + "Authentications/Register-Doctor",
          {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            password: data.password,
            confirmPassword: data.confirmPassword,
          },
        );
        return response;
      } else if (studentDoctor) {
        const formData = new FormData();
        formData.append("FirstName", data.firstName);
        formData.append("LastName", data.lastName);
        formData.append("Email", data.email);
        formData.append("Password", data.password);
        formData.append("ConfirmPassword", data.confirmPassword);
        formData.append("PhoneNumber", data.phoneNumber);
        if (data.image?.[0]) formData.append("ProfileImage", data.image[0]);
        const response = await axios.post(
          authBase + "StudentDoctor/register",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        return response;
      } else {
        const formattedDate = data.dateOfBirth
          ? `${data.dateOfBirth}T00:00:00Z`
          : new Date().toISOString();
        return axios.post(authBase + "Patient/register", {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phoneNumber: data.phoneNumber,
          dateOfBirth: formattedDate,
          address: data.address,
          gender: data.gender,
          bloodType: data.bloodType,
        });
      }
    },
    onSuccess: (response: any, data) => {
      dispatch(getEmail(data.email));
      let doctorId = null;
      if (doctor && response && response.data) {
        const responseText =
          typeof response.data === "string"
            ? response.data
            : JSON.stringify(response.data);
        console.log(responseText);
        const doctorIdMatch = responseText.match(/DoctorId:\s*(\d+)/);
        if (doctorIdMatch) doctorId = doctorIdMatch[1];
      }
      navigator("/verify-email", {
        state: { isDoctor: doctor, isStudentDoctor: studentDoctor, doctorId },
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Registration failed";
      toast.error(
        typeof errorMessage === "string" ? errorMessage : "Registration failed",
      );
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    registerMutation.mutate(data);
  };
  // ── END ORIGINAL LOGIC ──────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

      {/* ── Profile image (doctor / student) ── */}
      {!isPatient && (
        <div className="flex flex-col items-center gap-3 py-2">
          <label htmlFor="image" className="cursor-pointer group relative">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile preview"
                className="w-24 h-24 rounded-2xl object-cover"
                style={{ border: "2px solid var(--color-border)" }}
              />
            ) : (
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center"
                style={{
                  background: "var(--color-bg-blue)",
                  border: "2px dashed var(--color-primary-lighter)",
                }}
              >
                <Camera className="w-8 h-8" style={{ color: "var(--color-primary)" }} />
              </div>
            )}
            {/* overlay */}
            <div
              className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.35)" }}
            >
              <Camera className="w-6 h-6 text-white" />
            </div>
          </label>

          <input
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            {...register("image", { required: "Profile image is required" })}
          />

          <label
            htmlFor="image"
            className="cursor-pointer text-xs font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-80"
            style={{ background: "var(--color-primary)", color: "#fff" }}
          >
            {imagePreview ? "Change photo" : "Upload photo"}
          </label>

          {!errors.image && (
            <p className="text-xs" style={{ color: "var(--color-text-light)" }}>
              JPG, PNG or WEBP
            </p>
          )}
          {errors.image?.message && (
            <p className="text-xs flex items-center gap-1" style={{ color: "#dc2626" }}>
              <AlertCircle className="w-3 h-3" />{errors.image.message}
            </p>
          )}
        </div>
      )}

      {/* ── Name row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name" error={errors.firstName?.message} required>
          <InputIcon icon={User} hasError={!!errors.firstName}>
            <input
              type="text"
              className={inputCls}
              placeholder="John"
              id="firstName"
              {...register("firstName", { required: "First name is required" })}
            />
          </InputIcon>
        </Field>

        <Field label="Last Name" error={errors.lastName?.message} required>
          <InputIcon icon={User} hasError={!!errors.lastName}>
            <input
              type="text"
              className={inputCls}
              placeholder="Doe"
              id="lastName"
              {...register("lastName", { required: "Last name is required" })}
            />
          </InputIcon>
        </Field>
      </div>

      {/* ── Email ── */}
      <Field label="Email" error={errors.email?.message} required>
        <InputIcon icon={Mail} hasError={!!errors.email}>
          <input
            type="email"
            className={inputCls}
            placeholder="john.doe@example.com"
            id="email"
            {...register("email", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
              required: "Email address is required",
            })}
          />
        </InputIcon>
      </Field>

      {/* ── Phone ── */}
      <Field label="Phone Number" error={errors.phoneNumber?.message} required>
        <InputIcon icon={Phone} hasError={!!errors.phoneNumber}>
          <input
            type="text"
            className={inputCls}
            placeholder="+1 (555) 000-0000"
            id="phoneNumber"
            {...register("phoneNumber", {
              required: "Phone number is required",
              minLength: { value: 11, message: "Phone number must be 11 digits" },
              maxLength: { value: 11, message: "Phone number must be 11 digits" },
              pattern: {
                value: /^01[0-2]\d{1,8}$/i,
                message: "Please enter a valid phone number",
              },
            })}
          />
        </InputIcon>
      </Field>

      {/* ── Password row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Password" error={errors.password?.message} required>
          <InputIcon icon={Lock} hasError={!!errors.password}>
            <input
              type="password"
              className={inputCls}
              placeholder="••••••••"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
                  message: "Min 8 chars, 1 uppercase, 1 lowercase, 1 number",
                },
              })}
            />
          </InputIcon>
        </Field>

        <Field label="Confirm Password" error={errors.confirmPassword?.message} required>
          <InputIcon icon={Lock} hasError={!!errors.confirmPassword}>
            <input
              type="password"
              className={inputCls}
              placeholder="••••••••"
              id="cPassword"
              {...register("confirmPassword", {
                validate: (value) => value === password || "Passwords do not match",
              })}
            />
          </InputIcon>
        </Field>
      </div>

      {/* ── Patient-only fields ── */}
      {isPatient && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Date of Birth" error={errors.dateOfBirth?.message} required>
              <InputIcon icon={Calendar} hasError={!!errors.dateOfBirth}>
                <input
                  type="date"
                  className={inputCls}
                  id="dateOfBirth"
                  {...register("dateOfBirth", { required: "Date of birth is required" })}
                />
              </InputIcon>
            </Field>

            <Field label="Gender" error={errors.gender?.message} required>
              <InputIcon icon={User} hasError={!!errors.gender}>
                <select
                  className={inputCls}
                  id="gender"
                  {...register("gender", { required: "Gender is required" })}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </InputIcon>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Address" error={errors.address?.message} required>
              <InputIcon icon={MapPin} hasError={!!errors.address}>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="123 Main St"
                  id="address"
                  {...register("address", { required: "Address is required" })}
                />
              </InputIcon>
            </Field>

            <Field label="Blood Type" error={errors.bloodType?.message} required>
              <InputIcon icon={Droplets} hasError={!!errors.bloodType}>
                <select
                  className={inputCls}
                  id="bloodType"
                  {...register("bloodType", { required: "Blood type is required" })}
                >
                  <option value="">Select blood type</option>
                  <option value="A_Positive">A+</option>
                  <option value="A_Negative">A-</option>
                  <option value="B_Positive">B+</option>
                  <option value="B_Negative">B-</option>
                  <option value="AB_Positive">AB+</option>
                  <option value="AB_Negative">AB-</option>
                  <option value="O_Positive">O+</option>
                  <option value="O_Negative">O-</option>
                </select>
              </InputIcon>
            </Field>
          </div>
        </>
      )}

      {/* ── Doctor notice banner ── */}
      {isDoctor && (
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3"
          style={{
            background: "var(--color-bg-blue)",
            border: "1px solid var(--color-primary-lighter)",
          }}
        >
          <AlertCircle
            className="w-4 h-4 mt-0.5 shrink-0"
            style={{ color: "var(--color-primary)" }}
          />
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-blue)" }}>
            After registration, you'll need to upload your medical license and
            credentials for verification.
          </p>
        </div>
      )}

      {/* ── Divider ── */}
      <div style={{ height: 1, background: "var(--color-border)" }} />

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "var(--color-primary)" }}
      >
        {registerMutation.isPending ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Registering…</>
        ) : (
          "Create Account"
        )}
      </button>

      {/* ── Sign-in link ── */}
      <p className="text-center text-sm" style={{ color: "var(--color-text-light)" }}>
        Already have an account?{" "}
        <NavLink
          to="/login"
          className="font-semibold underline underline-offset-4 transition-opacity hover:opacity-75"
          style={{ color: "var(--color-primary)" }}
        >
          Sign in
        </NavLink>
      </p>
    </form>
  );
};

export default RegistrationForm;
