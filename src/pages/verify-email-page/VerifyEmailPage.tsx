import { updateRole } from "@/features/auth/authSlice";
import axios from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { MdOutlineMail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
// import { InputOtp } from "@heroui/input-otp";
// import { useState } from "react";

interface Inputs {
  num1: string;
  num2: string;
  num3: string;
  num4: string;
  num5: string;
  num6: string;
}

function VerifyEmailPage() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const email = useSelector(
    (state: { email: { emailAddress: string } }) => state.email.emailAddress
  );
  const { register, handleSubmit } = useForm<Inputs>();
  //   const [value, setValue] = useState("");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = {
      email,
      code:
        data.num1 + data.num2 + data.num3 + data.num4 + data.num5 + data.num6,
    };
    try {
      await axios.post(backendUrl + "Verify-Email", formData);
      dispatch(updateRole("doctor"));
      navigator("/");
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col  items-center">
            <p className="text-(--color-text)">Enter Verification Code</p>
            <div>
              <div className="flex items-center gap-2 my-4">
                {/* <InputOtp length={4} value={value} onValueChange={setValue} /> */}
                <input
                  type="text"
                  {...register("num1")}
                  className="w-10 py-3 pl-4 sm:w-14 sm:py-4 sm:pl-7 border-2 outline-0 bg-(--color-bg) rounded-xl  focus:border-(--color-primary)"
                />

                <input
                  type="text"
                  {...register("num2")}
                  className="w-10 py-3 pl-4 sm:w-14 sm:py-4 sm:pl-7 border-2 outline-0 bg-(--color-bg) rounded-xl  focus:border-(--color-primary)"
                />
                <input
                  type="text"
                  {...register("num3")}
                  className="w-10 py-3 pl-4 sm:w-14 sm:py-4 sm:pl-7 border-2 outline-0 bg-(--color-bg) rounded-xl  focus:border-(--color-primary)"
                />
                <input
                  type="text"
                  {...register("num4")}
                  className="w-10 py-3 pl-4 sm:w-14 sm:py-4 sm:pl-7 border-2 outline-0 bg-(--color-bg) rounded-xl  focus:border-(--color-primary)"
                />
                <input
                  type="text"
                  {...register("num5")}
                  className="w-10 py-3 pl-4 sm:w-14 sm:py-4 sm:pl-7 border-2 outline-0 bg-(--color-bg) rounded-xl  focus:border-(--color-primary)"
                />
                <input
                  type="text"
                  {...register("num6")}
                  className="w-10 py-3 pl-4 sm:w-14 sm:py-4 sm:pl-7 border-2 outline-0 bg-(--color-bg) rounded-xl  focus:border-(--color-primary)"
                />
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
