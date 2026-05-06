import { Link, useNavigate } from "react-router";
import { Mail, ArrowLeft } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import type { RootState } from "@/store/store";

interface Inputs {
  email: string;
}

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export default function PasswordResetRequestPage() {
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post(
        `${backendUrl}Authentications/forget-password`,
        data,
      );
      const isSuccess = response.data.succeeded === true;
      const message = "Password reset instructions sent successfully.";

      if (isSuccess) {
        toast.success(message);
        navigate("/password-reset/new");
        return;
      }

      toast.error(message);
      setError("email", {
        type: "server",
        message,
      });
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Unable to send reset instructions.";

      toast.error(message);
      setError("email", {
        type: "server",
        message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-gray-900 dark:text-white mb-2">Reset Password</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you instructions to reset
            your password
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  aria-invalid={errors.email ? "true" : "false"}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:border-transparent ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500 dark:border-red-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  }`}
                  placeholder="your@email.com"
                  {...register("email", {
                    required: "You must provide your email",
                    pattern: {
                      value: emailRegex,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isSubmitting ? "Sending..." : "Send Reset Instructions"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
