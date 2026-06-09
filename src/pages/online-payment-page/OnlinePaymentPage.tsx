import { useState } from "react";
import { useNavigate, useSearchParams, NavLink } from "react-router";
import {
  FiCheckCircle,
  FiArrowLeft,
  FiAlertCircle,
  FiLock,
} from "react-icons/fi";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// ─── Stripe Setup ────────────────────────────────────────────────────────────
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
);

// ─── Shared Stripe Element Styles ────────────────────────────────────────────
const ELEMENT_STYLE = {
  base: {
    fontSize: "16px",
    color: "#1f2937",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontSmoothing: "antialiased",
    "::placeholder": {
      color: "#9ca3af",
    },
  },
  invalid: {
    color: "#ef4444",
    iconColor: "#ef4444",
  },
};

// ─── Checkout Form ──────────────────────────────────────────────────────────

interface CheckoutFormProps {
  amount: number;
  appointmentId: number;
  paymentId: string;
}

function CheckoutForm({ amount, appointmentId, paymentId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [email, setEmail] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (!nameOnCard.trim()) {
      setErrorMessage("Please enter the name on your card.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) {
        throw new Error("Card element not found.");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        // The clientSecret is passed via Elements provider options
        // We need to get it from the URL params — but confirmCardPayment
        // uses the clientSecret from the Elements context automatically
        // when using PaymentElement. For CardElement, we pass it explicitly.
        new URLSearchParams(window.location.search).get("clientSecret") || "",
        {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: nameOnCard,
              email: email,
            },
          },
        }
      );

      if (error) {
        setErrorMessage(
          error.message || "An error occurred while processing your payment."
        );
        toast.error(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setIsPaymentComplete(true);
        toast.success("Payment completed successfully!");
      } else if (paymentIntent && paymentIntent.status === "requires_action") {
        toast.info("Additional authentication required...");
      } else {
        toast.info("Payment is being processed...");
        setIsPaymentComplete(true);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Success State ──
  if (isPaymentComplete) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <FiCheckCircle className="text-green-500 text-4xl" />
        </div>
        <h2 className="text-2xl font-semibold text-(--color-text) mb-2">
          Payment Successful!
        </h2>
        <p className="text-(--color-text-light) mb-2">
          Your appointment has been confirmed and payment processed.
        </p>
        <p className="text-sm text-(--color-text-light) mb-8">
          Appointment ID:{" "}
          <span className="font-medium text-(--color-text)">
            {appointmentId}
          </span>{" "}
          &bull; Payment ID:{" "}
          <span className="font-medium text-(--color-text)">{paymentId}</span>
        </p>
        <button
          onClick={() => navigate("/dashboard/patient")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // ── Payment Form ──
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2
        className="text-xl font-semibold mb-6"
        style={{ color: "var(--color-text)" }}
      >
        Pay with card
      </h2>

      {/* Email */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--color-text)" }}
        >
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@gmail.com"
          required
          className="w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          style={{
            backgroundColor: "var(--color-bg)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        />
      </div>

      {/* Card Information */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--color-text)" }}
        >
          Card information
        </label>
        <div
          className="border rounded-t-lg px-4 py-3.5"
          style={{
            backgroundColor: "var(--color-bg)",
            borderColor: "var(--color-border)",
          }}
        >
          <CardNumberElement
            options={{
              style: ELEMENT_STYLE,
              showIcon: true,
              placeholder: "1234 1234 1234 1234",
            }}
          />
        </div>
        <div className="flex">
          <div
            className="flex-1 border-l border-b border-r-0 rounded-bl-lg px-4 py-3.5"
            style={{
              backgroundColor: "var(--color-bg)",
              borderColor: "var(--color-border)",
            }}
          >
            <CardExpiryElement
              options={{
                style: ELEMENT_STYLE,
                placeholder: "MM / YY",
              }}
            />
          </div>
          <div
            className="flex-1 border rounded-br-lg border-t-0 px-4 py-3.5"
            style={{
              backgroundColor: "var(--color-bg)",
              borderColor: "var(--color-border)",
            }}
          >
            <CardCvcElement
              options={{
                style: ELEMENT_STYLE,
                placeholder: "CVC",
              }}
            />
          </div>
        </div>
      </div>

      {/* Name on card */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--color-text)" }}
        >
          Name on card
        </label>
        <input
          type="text"
          value={nameOnCard}
          onChange={(e) => setNameOnCard(e.target.value)}
          placeholder="Full name on card"
          required
          className="w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          style={{
            backgroundColor: "var(--color-bg)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        />
      </div>

      {/* Error message */}
      {errorMessage && (
        <div
          className="rounded-lg p-3 flex items-start gap-2 text-sm"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            color: "#ef4444",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <FiAlertCircle className="mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Pay Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full text-white px-6 py-3.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: isProcessing
            ? "#8b8bf5"
            : "linear-gradient(to right, #7c3aed, #6366f1)",
        }}
      >
        {isProcessing ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Processing...
          </>
        ) : (
          <>Pay ${amount.toFixed(2)}</>
        )}
      </button>
    </form>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

const OnlinePaymentPage = () => {
  const [searchParams] = useSearchParams();

  const clientSecret = searchParams.get("clientSecret") || "";
  const paymentId = searchParams.get("paymentId") || "";
  const appointmentId = Number(searchParams.get("appointmentId")) || 0;
  const amount = Number(searchParams.get("amount")) || 0;

  // Handle redirect-back from Stripe 3D Secure
  const redirectStatus = searchParams.get("redirect_status");
  const statusParam = searchParams.get("status");
  const isRedirectSuccess =
    redirectStatus === "succeeded" || statusParam === "success";

  // No clientSecret and not a redirect → error
  if (!clientSecret && !isRedirectSuccess) {
    return (
      <DashboardLayout pageTitle="Online Payment">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FiAlertCircle className="text-red-500 text-2xl" />
            </div>
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--color-text)" }}
            >
              No Payment Session Found
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--color-text-light)" }}
            >
              Please book an appointment first and select online payment.
            </p>
            <NavLink
              to="/appointments"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition text-sm font-medium"
            >
              <FiArrowLeft />
              Go to Appointments
            </NavLink>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Redirect-back success state
  if (isRedirectSuccess && !clientSecret) {
    return (
      <DashboardLayout pageTitle="Online Payment">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <FiCheckCircle className="text-green-500 text-4xl" />
            </div>
            <h2
              className="text-2xl font-semibold mb-2"
              style={{ color: "var(--color-text)" }}
            >
              Payment Successful!
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: "var(--color-text-light)" }}
            >
              Your appointment has been confirmed and payment processed.
            </p>
            <NavLink
              to="/dashboard/patient"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-sm font-semibold transition-all"
            >
              Go to Dashboard
            </NavLink>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Online Payment">
      <div className="min-h-[80vh] flex items-start justify-center pt-4">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-0 rounded-2xl overflow-hidden shadow-lg border"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          {/* ── Left: Payment Summary ── */}
          <div
            className="lg:w-[45%] p-8 lg:p-10 flex flex-col justify-between"
            style={{ backgroundColor: "var(--color-bg)" }}
          >
            <div>
              <NavLink
                to="/appointments"
                className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:opacity-70"
                style={{ color: "var(--color-text-light)" }}
              >
                <FiArrowLeft className="w-4 h-4" />
                Back
              </NavLink>

              <p
                className="text-sm font-medium mb-1"
                style={{ color: "var(--color-text-light)" }}
              >
                Medical Consultation
              </p>
              <p
                className="text-4xl font-bold mb-1"
                style={{ color: "var(--color-text)" }}
              >
                ${amount.toFixed(2)}
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-light)" }}
              >
                Appointment #{appointmentId}
              </p>

              <div
                className="mt-8 pt-6 space-y-3"
                style={{ borderTop: "1px solid var(--color-border)" }}
              >
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--color-text-light)" }}>
                    Consultation fee
                  </span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--color-text)" }}
                  >
                    ${amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--color-text-light)" }}>
                    Payment ID
                  </span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: "var(--color-text-light)" }}
                  >
                    {paymentId.slice(0, 8)}...
                  </span>
                </div>
                <div
                  className="flex justify-between text-sm pt-3 font-semibold"
                  style={{
                    borderTop: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  <span>Total due</span>
                  <span>${amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div
              className="mt-10 flex items-center gap-2 text-xs"
              style={{ color: "var(--color-text-light)" }}
            >
              <FiLock className="w-3 h-3" />
              <span>
                Powered by{" "}
                <span className="font-semibold" style={{ color: "var(--color-text)" }}>
                  stripe
                </span>
              </span>
              <span className="mx-1">|</span>
              <span>Terms</span>
              <span>Privacy</span>
            </div>
          </div>

          {/* ── Right: Card Form ── */}
          <div className="lg:w-[55%] p-8 lg:p-10">
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                },
              }}
            >
              <CheckoutForm
                amount={amount}
                appointmentId={appointmentId}
                paymentId={paymentId}
              />
            </Elements>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OnlinePaymentPage;
