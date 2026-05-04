import { setToken } from "@/store/slices/auth/authSlice";
import { clearEmail } from "@/store/slices/email/emailSlice";
// import axios from "axios";
import { MdOutlineMail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState, type FormEvent } from "react";

function VerifyEmailPage() {
  // API base: useSelector((s: RootState) => s.config.backendUrl) + 'Authentications/'
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [value, setValue] = useState("");

  const email = useSelector(
    (state: { email: { emailAddress: string } }) => state.email.emailAddress,
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // const data = {
    //   email,
    //   code: value,
    // };
    try {
      // await axios.post(authBase + "Verify-Email", data);

      dispatch(
        setToken(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicGF0aWVudCJ9.dummy",
        ),
      );
      dispatch(clearEmail());
      navigator("/onboarding");
      toast.success("You have successfully verified your email address");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[540px] rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00AFE5]/15">
            <MdOutlineMail className="h-8 w-8 text-[#00AFE5]" />
          </div>
          <h1 className="text-2xl font-semibold text-(--color-text) sm:text-3xl">
            Verify Your Email
          </h1>
          <p className="text-sm text-(--color-text-light) sm:text-base">
            We've sent a 6-digit code to{" "}
            <span className="font-semibold text-(--color-primary)">{email}</span>
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-(--color-text)">
              Enter Verification Code
            </p>
            <div className="my-4 flex items-center justify-center">
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={value}
                onChange={setValue}
              >
                <InputOTPGroup>
                  <InputOTPSlot
                    index={0}
                    className="h-12 w-11 rounded-lg border-(--color-border) bg-(--color-bg) text-base font-semibold text-(--color-text) focus-visible:ring-2 focus-visible:ring-[#00AFE5]/30"
                  />
                  <InputOTPSlot
                    index={1}
                    className="h-12 w-11 rounded-lg border-(--color-border) bg-(--color-bg) text-base font-semibold text-(--color-text) focus-visible:ring-2 focus-visible:ring-[#00AFE5]/30"
                  />
                  <InputOTPSlot
                    index={2}
                    className="h-12 w-11 rounded-lg border-(--color-border) bg-(--color-bg) text-base font-semibold text-(--color-text) focus-visible:ring-2 focus-visible:ring-[#00AFE5]/30"
                  />
                  <InputOTPSlot
                    index={3}
                    className="h-12 w-11 rounded-lg border-(--color-border) bg-(--color-bg) text-base font-semibold text-(--color-text) focus-visible:ring-2 focus-visible:ring-[#00AFE5]/30"
                  />
                  <InputOTPSlot
                    index={4}
                    className="h-12 w-11 rounded-lg border-(--color-border) bg-(--color-bg) text-base font-semibold text-(--color-text) focus-visible:ring-2 focus-visible:ring-[#00AFE5]/30"
                  />
                  <InputOTPSlot
                    index={5}
                    className="h-12 w-11 rounded-lg border-(--color-border) bg-(--color-bg) text-base font-semibold text-(--color-text) focus-visible:ring-2 focus-visible:ring-[#00AFE5]/30"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          <button className="w-full cursor-pointer rounded-xl bg-[#00AFE5] py-3 text-sm font-semibold text-white shadow-md shadow-[#00AFE5]/30 transition-all hover:-translate-y-0.5 hover:bg-blue-500">
            Verify Email
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            className="cursor-pointer text-sm font-medium text-(--color-primary) transition-colors hover:text-(--color-primary-light)"
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
