import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { FiCreditCard, FiLock, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Cookies from "js-cookie";
import axios from "axios";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { NavLink } from "react-router";

interface PaymentFormData {
  appointmentId: number;
  patientId: number;
  amount: number;
  currency: string;
  idempotencyKey: string;
  createdBy: string;
}

const OnlinePaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const backendUrl = useSelector((state: RootState) => state.config.backendUrl);
  const token = Cookies.get("jwtToken");
  const { id: userId, role } = useSelector((state: RootState) => state.auth);

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");

  // Get appointment details from URL params
  const appointmentId = Number(searchParams.get("appointmentId")) || 0;
  const patientId = Number(searchParams.get("patientId")) || 0;
  const amount = Number(searchParams.get("amount")) || 0;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const paymentData: PaymentFormData = {
        appointmentId,
        patientId,
        amount,
        currency: "USD",
        idempotencyKey: Date.now().toString(),
        createdBy: userId || role || "system",
      };

      const response = await axios.post(
        `${backendUrl}payments/create`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.succeeded || response.status === 200) {
        toast.success("Payment processed successfully!");
        // Redirect based on role or to appointments
        navigate("/appointments");
      } else {
        toast.error(response.data.message || "Payment processing failed");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(
        error.response?.data?.message || "Payment processing failed. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Online Payment">
      <div className="-mt-6 -ml-6 bg-(--color-bg) rounded-2xl min-h-screen">
        <div className="p-6">
          <NavLink
            to="/appointments"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition mb-6 text-sm w-fit group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Appointments
          </NavLink>

          <div className="flex flex-col mb-8">
            <h1 className="text-3xl text-(--color-text) font-semibold font-sans tracking-tight">
              Secure Online Payment
            </h1>
            <p className="text-(--color-text-light) font-light text-base mt-2">
              Complete your payment securely using Stripe
            </p>
          </div>

          <div className="max-w-4xl">
            <div className="bg-(--color-surface) border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
              {/* Payment Summary */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Appointment ID</p>
                    <p className="text-xl font-bold">{appointmentId || "N/A"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90">Amount to Pay</p>
                    <p className="text-3xl font-bold">${amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Card Holder Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-(--color-text)">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      value={cardHolderName}
                      onChange={(e) => setCardHolderName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Card Number */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-(--color-text)">
                      Card Number
                    </label>
                    <div className="relative">
                      <FiCreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                        className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 py-3 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Expiry Date */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-(--color-text)">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                        className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>

                    {/* CVV */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-(--color-text)">
                        CVV
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
                          placeholder="123"
                          maxLength={4}
                          required
                          className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 py-3 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-green-50/50 border border-green-100 dark:bg-green-900/10 dark:border-green-900/20 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                      <FiCheckCircle className="text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <h3 className="text-green-800 dark:text-green-400 font-semibold mb-1 text-sm">
                          Secure Payment
                        </h3>
                        <p className="text-xs text-green-700/80 dark:text-green-500/80 leading-relaxed">
                          Your payment information is encrypted and secure. We use Stripe
                          to process payments safely.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-4 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <FiLock className="text-lg" />
                        Pay ${amount.toFixed(2)} Securely
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Stripe Badge */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span>Powered by</span>
                <span className="font-semibold text-gray-700">Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OnlinePaymentPage;
