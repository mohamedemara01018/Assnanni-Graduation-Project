import { setToken } from "@/store/slices/auth/authSlice";
import { clearEmail } from "@/store/slices/email/emailSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState, useEffect, type FormEvent } from "react";
import type { RootState } from "@/store/store";
import axios from "axios";
import Cookies from "js-cookie";
import { Mail, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";

function VerifyEmailPage() {
  const backendUrl = useSelector((s: RootState) => s.config.backendUrl);
  const authBase = backendUrl + "Authentications/";
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = useSelector(
    (state: { email: { emailAddress: string } }) => state.email.emailAddress,
  );

  useEffect(() => {
    Cookies.set("needsVerification", "true");
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (value.length < 6) return;

    setIsSubmitting(true);
    const data = { email, code: value };

    try {
      const state = location.state as {
        isDoctor?: boolean;
        isStudentDoctor?: boolean;
        isPatient?: boolean;
        doctorId?: string;
      } | null;
      const isDoctor = state?.isDoctor;
      const isStudentDoctor = state?.isStudentDoctor;
      const isPatient = state?.isPatient;
      const doctorId = state?.doctorId;

      const verificationUrl = isPatient
        ? backendUrl + "Patient/email-verify"
        : authBase + "Verify-Email";

      const response = await axios.post(verificationUrl, data);

      if (!isDoctor && !isStudentDoctor) {
        dispatch(setToken(response.data?.data?.token));
      }
      dispatch(clearEmail());
      Cookies.remove("needsVerification");

      if (isDoctor || isStudentDoctor) {
        navigator("/verify-doctor", { state: { isStudentDoctor, doctorId } });
      } else if (isPatient) {
        navigator("/");
      } else {
        navigator("/onboarding");
      }

      toast.success("Email verified successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const returnToRegister = () => {
    dispatch(clearEmail());
    Cookies.remove("needsVerification");
    navigator("/register");
  };

  const isComplete = value.length === 6;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-4">

        {/* ── Card ──────────────────────────────────────────────────────── */}
        <div
          className="rounded-2xl border p-7 sm:p-8"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow)",
          }}
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-4 text-center mb-7">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "var(--color-bg-blue)" }}
            >
              <ShieldCheck className="w-8 h-8" style={{ color: "var(--color-primary)" }} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold mb-1.5" style={{ color: "var(--color-text)" }}>
                Verify Your Email
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-light)" }}>
                We've sent a 6-digit code to
              </p>
              <div
                className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl border text-sm font-medium"
                style={{
                  backgroundColor: "var(--color-bg-blue)",
                  borderColor: "var(--color-primary-lighter)",
                  color: "var(--color-primary)",
                }}
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                {email || "your email address"}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--color-text-light)" }}>
                Enter Verification Code
              </p>

              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={value}
                onChange={setValue}
              >
                <InputOTPGroup className="gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="h-12 w-11 rounded-xl text-base font-bold transition-all"
                      style={{
                        backgroundColor: "var(--color-bg)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              {/* Progress dots */}
              <div className="flex items-center gap-1.5 mt-1">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                    style={{
                      backgroundColor: i < value.length
                        ? "var(--color-primary)"
                        : "var(--color-border)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isComplete || isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: "var(--color-primary)" }}
              onMouseEnter={(e) => {
                if (!isSubmitting && isComplete)
                  e.currentTarget.style.backgroundColor = "var(--color-primary-dark)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-primary)";
              }}
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Verifying…</>
              ) : (
                <><ShieldCheck className="w-4 h-4" />Verify Email</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 h-px" style={{ backgroundColor: "var(--color-border)" }} />

          {/* Footer actions */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={returnToRegister}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Wrong email? Return to register
            </button>
          </div>
        </div>

        {/* Hint below card */}
        <p className="text-center text-xs" style={{ color: "var(--color-text-light)" }}>
          Didn't receive the code? Check your spam folder or{" "}
          <button
            type="button"
            className="font-medium cursor-pointer transition-colors hover:opacity-75"
            style={{ color: "var(--color-primary)" }}
          >
            resend
          </button>
        </p>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
