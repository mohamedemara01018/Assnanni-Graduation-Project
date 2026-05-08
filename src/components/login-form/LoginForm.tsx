import { NavLink, useNavigate } from "react-router";
import { Button } from "../ui/button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { setToken } from "@/store/slices/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import axios from "axios";
// import { updateRole } from "@/features/auth/authSlice";

interface Inputs {
  //   role: string;
  email: string;
  password: string;
}
function LoginForm() {
  const loginApiBase = `${useSelector(
    (state: RootState) => state.config.backendUrl,
  )}Authentications/`;
  void loginApiBase;
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post(loginApiBase + "Login", data);
      console.log(response);
      dispatch(setToken(response.data.data.token)); // Use real token when uncommenting API
      // dispatch(setToken(response..data.data.token));
      toast.success("Welcome Back");
      navigator("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="login-form-container flex flex-col gap-3">
        <div className="flex flex-col items-start w-full gap-1">
          <label htmlFor={"email"} className="text-(--color-text)">
            Email
          </label>
          <input
            id={"email"}
            type="email"
            placeholder={"john.doe@example.com"}
            className="w-full px-4 py-3 bg-(--color-bg) border border-(--color-border) rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent text-(--color-text)"
            {...register("email", {
              required: "You must provide your email",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please, make sure your Email Address is correct",
              },
            })}
          />
          {errors.email && (
            <p className="text-xs text-red-600 ml-1 font-light">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="flex flex-col items-start w-full gap-1">
          <label htmlFor={"password"} className="text-(--color-text)">
            Password
          </label>
          <input
            id={"password"}
            type={"password"}
            placeholder={"Password"}
            className="w-full px-4 py-3 bg-(--color-bg) border border-(--color-border) rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent text-(--color-text)"
            {...register("password", {
              required: "Password is Required",
            })}
          />
          {errors.password && (
            <p className="text-xs text-red-600 ml-1 font-light">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex justify-center my-1">
          <NavLink to={"/password-reset"} className={"text-(--color-primary)"}>
            Forgot Password?
          </NavLink>
        </div>
        <div>
          <Button
            disabled={isSubmitting}
            className={`w-full p-4 cursor-pointer transition-all duration-200 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "bg-(--color-primary) hover:bg-(--color-primary-dark)"
            }`}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
