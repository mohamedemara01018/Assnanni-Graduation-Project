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
    <div className="py-16 px-4 flex flex-col items-center">
      <div className="flex flex-col items-center gap-6 max-sm:max-w-[500px]  sm:w-[500px] bg-(--color-surface) p-8 rounded-xl shadow-xl">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center ">
          <MdOutlineMail className="w-8 h-8 text-(--color-primary)" />
        </div>
        <div className="flex flex-col  items-center">
          <h1 className="text-3xl text-(--color-text)">Verify Your Email</h1>
          <p className="text-(--color-text-light) text-center">
            We've sent a 6-digit code to{" "}
            <span className="text-(--color-primary)">{email}</span>
          </p>
        </div>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col  items-center">
            <p className="text-(--color-text)">Enter Verification Code</p>
            <div>
              <div className="flex items-center gap-2 my-4">
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={value}
                  onChange={setValue}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-15 h-15" />
                    <InputOTPSlot index={1} className="w-15 h-15" />
                    <InputOTPSlot index={2} className="w-15 h-15" />
                    <InputOTPSlot index={3} className="w-15 h-15" />
                    <InputOTPSlot index={4} className="w-15 h-15" />
                    <InputOTPSlot index={5} className="w-15 h-15" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <button className="bg-(--color-primary) py-2 px-4 rounded-sm w-full hover:bg-(--color-primary-light) cursor-pointer duration-100 transition duration-200">
                Verify Email
              </button>
            </div>
          </div>
        </form>
        <div className="text-(--color-primary) hover:text-(--color-primary-light) cursor-pointer transition duration-200">
          Didn't receive the code? Resend
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
