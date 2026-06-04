/* eslint-disable @typescript-eslint/no-unused-vars */
import CardComp from "@/components/card-comp/CardComp";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Error from "@/components/error/Error";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Loading from "@/components/loading/Loading";
import {
  doctorProfileState,
  fetchDoctorProfile,
  type DoctorDetails,
  type DoctorDetailsState,
} from "@/store/slices/patient-slice/doctor-profile-slice/doctorProfileSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { User } from "lucide-react";
import { useEffect } from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { CiBookmark } from "react-icons/ci";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FiAward, FiMail, FiPhone, FiGlobe, FiClock } from "react-icons/fi";
import { IoLanguageOutline, IoLocationOutline } from "react-icons/io5";
import { LuAward } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Returns true only when id is a non-empty positive integer string */
function isValidId(id: string | undefined): id is string {
  if (!id) return false;
  const n = Number(id);
  return Number.isInteger(n) && n > 0;
}

/** Safely render up to 5 filled/empty stars */
function StarRating({ rating }: { rating: number }) {
  const clamped = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <span className="flex items-center gap-0.5" aria-label={`${clamped} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) =>
        i < clamped
          ? <FaStar key={i} className="text-yellow-400 text-sm" />
          : <FaRegStar key={i} className="text-yellow-400 text-sm" />
      )}
    </span>
  );
}

/** Validate the data shape coming from the slice before rendering */
function isValidDoctorData(data: DoctorDetails | null | undefined): data is DoctorDetails {
  return !!data && typeof data === "object" && data.id > 0;
}

// ─── Page Shell ─────────────────────────────────────────────────────────────

function DoctorProfilePage() {
  const role = useSelector(
    (state: { auth: { role: string } }) => state.auth.role
  );

  return role === "patient" ? (
    <DashboardLayout pageTitle="Doctor Profile">
      <View />
    </DashboardLayout>
  ) : (
    <>
      <Header />
      <div className="wrapper m-auto my-30">
        <View />
      </div>
      <Footer />
    </>
  );
}

// ─── Main View ───────────────────────────────────────────────────────────────

function View() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    doctorProfileState
  ) as DoctorDetailsState;

  const role = useSelector((state: RootState) => state.auth.role);
  console.log(role)
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    if (role === "guest") {
      const redirectPath = `/appointments/booking/${id}`;

      sessionStorage.setItem("redirectAfterAuth", redirectPath);

      toast.info("Please sign in to continue booking your appointment.");

      navigate("/login");
      return;
    }

    navigate(`/appointments/booking/${id}`);
  };
  // ── Validation: id must be a positive integer ──
  const validId = isValidId(id);

  useEffect(() => {
    if (validId) {
      dispatch(fetchDoctorProfile({ id }));
    }
  }, [dispatch, id, validId]);

  // ── Guard: invalid route param ──
  if (!validId) {
    return <Error message="Invalid doctor ID. Please check the URL and try again." />;
  }

  if (loading) return <Loading />;

  if (error) return <Error message={error} />;

  // ── Guard: API returned but data is empty/malformed ──
  if (!isValidDoctorData(data)) {
    return <Error message="Doctor profile not found or data is unavailable." />;
  }



  const doctorImage =
    data.doctorImage?.trim()
      ? data.doctorImage
      : "https://via.placeholder.com/150?text=Doctor";

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <CardComp>
        <div className="flex items-center gap-6 max-md:flex-col max-md:text-center">
          {doctorImage ? <img
            className="w-32 h-32 rounded-full object-cover border-2"
            style={{ borderColor: "var(--color-border)" }}
            src={doctorImage}
            alt={`Dr. ${data.name}`}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://via.placeholder.com/150?text=Doctor";
            }}
          /> :
            <div className="w-32 h-32 rounded-full bg-(--color-bg-blue) border border-primary/20 flex items-center justify-center">
              <User className="w-7 h-7 text-(--color-primary)" />
            </div>
          }

          <div className="space-y-3 flex-1">
            <h1 className="text-3xl font-semibold" style={{ color: "var(--color-text)" }}>
              Dr. {data.name || "Unknown Doctor"}
            </h1>

            <p className="text-base" style={{ color: "var(--color-text-light)" }}>
              {data.specialty || "Specialty not available"}
            </p>

            <div className="flex items-center gap-5 flex-wrap">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <StarRating rating={data.rating ?? 0} />
                <span className="text-sm" style={{ color: "var(--color-text-light)" }}>
                  {(data.rating ?? 0).toFixed(1)} ({data.reviewsCount ?? 0} reviews)
                </span>
              </div>

              {/* Experience */}
              <div className="flex items-center gap-1.5">
                <LuAward style={{ color: "var(--color-primary)" }} />
                <span className="text-sm" style={{ color: "var(--color-text-light)" }}>
                  {data.yearsOfExperience ?? 0} yrs experience
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-1">
                <BsCurrencyDollar style={{ color: "var(--color-primary)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                  ${data.consultationPrice ?? 0} / visit
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardComp>

      {/* ── Body ── */}
      <div className="flex gap-4 max-lg:flex-col">

        {/* ── LEFT column ── */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">

          {/* About */}
          <CardComp>
            <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              About
            </h2>

            <p className="leading-relaxed" style={{ color: "var(--color-text-light)" }}>
              {data.about || "No information available."}
            </p>

            <div className="mt-5 space-y-4">
              {/* Education */}
              <InfoRow icon={<FiAward className="mt-0.5 shrink-0" />} label="Education">
                {data.education || "Not available"}
              </InfoRow>

              {/* Languages */}
              <InfoRow icon={<IoLanguageOutline className="mt-0.5 shrink-0" />} label="Languages">
                {data.languages?.length
                  ? data.languages.join(", ")
                  : "Not specified"}
              </InfoRow>
            </div>
          </CardComp>

          {/* Clinic Information */}
          <CardComp>
            <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text)" }}>
              Clinic Information
            </h2>

            <div className="space-y-3">
              <InfoRow icon={<IoLocationOutline className="mt-0.5 shrink-0" />} label={data.clinicName || "Clinic"}>
                {data.clinicLocation || "No location provided"}
              </InfoRow>

              {data.clinicPhoneNumber && (
                <InfoRow icon={<FiPhone className="mt-0.5 shrink-0" />} label="Phone">
                  <a
                    href={`tel:${data.clinicPhoneNumber}`}
                    style={{ color: "var(--color-primary)" }}
                    className="hover:underline"
                  >
                    {data.clinicPhoneNumber}
                  </a>
                </InfoRow>
              )}

              {data.clinicEmail && (
                <InfoRow icon={<FiMail className="mt-0.5 shrink-0" />} label="Email">
                  <a
                    href={`mailto:${data.clinicEmail}`}
                    style={{ color: "var(--color-primary)" }}
                    className="hover:underline"
                  >
                    {data.clinicEmail}
                  </a>
                </InfoRow>
              )}

              {data.clinicWebsite && (
                <InfoRow icon={<FiGlobe className="mt-0.5 shrink-0" />} label="Website">
                  <a
                    href={data.clinicWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-primary)" }}
                    className="hover:underline"
                  >
                    {data.clinicWebsite}
                  </a>
                </InfoRow>
              )}

              {data.clinicHours && (
                <InfoRow icon={<FiClock className="mt-0.5 shrink-0" />} label="Hours">
                  {data.clinicHours}
                </InfoRow>
              )}

              {/* Government/Regions */}
              {data.government?.length > 0 && (
                <InfoRow icon={<IoLocationOutline className="mt-0.5 shrink-0" />} label="Regions Served">
                  {data.government.join(", ")}
                </InfoRow>
              )}
            </div>
          </CardComp>

          {/* Patient Reviews */}
          <CardComp>
            <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text)" }}>
              Patient Reviews
              {data.reviewsCount > 0 && (
                <span
                  className="ml-2 text-sm font-normal"
                  style={{ color: "var(--color-text-light)" }}
                >
                  ({data.reviewsCount})
                </span>
              )}
            </h2>

            {data.reviews?.length ? (
              <div className="space-y-5">
                {data.reviews.map((review: any, i: number) => {
                  // Validate each review has at least a comment
                  if (!review) return null;
                  return (
                    <div
                      key={review.id ?? i}
                      className="pb-5 border-b last:border-b-0"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium" style={{ color: "var(--color-text)" }}>
                          {review.patientName || "Anonymous"}
                        </p>
                        {review.createdAt && (
                          <span className="text-xs" style={{ color: "var(--color-text-light)" }}>
                            {review.createdAt}
                          </span>
                        )}
                      </div>

                      <StarRating rating={review.rating ?? 0} />

                      {review.comment && (
                        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-text-light)" }}>
                          {review.comment}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: "var(--color-text-light)" }}>No reviews yet.</p>
            )}
          </CardComp>
        </div>

        {/* ── RIGHT column ── */}
        <div className="flex flex-col gap-4 w-full lg:w-[340px] shrink-0">

          {/* Booking */}
          <CardComp>
            <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              Book Appointment
            </h2>

            {/* Availability badge */}
            <div
              className="flex items-center gap-2 mb-4 px-3 py-2 rounded-md text-sm font-medium w-fit"
              style={{
                backgroundColor: data.isAvailable
                  ? "rgba(22, 163, 74, 0.1)"
                  : "rgba(220, 38, 38, 0.08)",
                color: data.isAvailable
                  ? "var(--color-success)"
                  : "#dc2626",
              }}
            >
              <span
                className={`w-2 h-2 rounded-full ${data.isAvailable ? "bg-green-500" : "bg-red-500"}`}
              />
              {data.isAvailable ? "Available for booking" : "Currently unavailable"}
            </div>

            {data.isAvailable ? (
              <button
                onClick={() => handleClick(id)}
                className="flex items-center justify-center gap-2 w-full p-2.5 rounded-md text-white font-medium transition-colors"
                style={{ backgroundColor: "var(--color-primary)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--color-primary-dark)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--color-primary)")
                }
              >
                <CiBookmark className="text-lg" />
                Book Appointment
              </button>
            ) : (
              <button
                disabled
                aria-disabled="true"
                className="flex items-center justify-center gap-2 w-full p-2.5 rounded-md text-white font-medium cursor-not-allowed opacity-50"
                style={{ backgroundColor: "var(--color-text-light)" }}
              >
                <CiBookmark className="text-lg" />
                Booking Unavailable
              </button>
            )}
          </CardComp>

          {/* Time Slots */}
          <CardComp>
            <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              Available Slots
            </h2>

            {data.timeSlots?.length ? (
              <div className="space-y-5">
                {data.timeSlots.map((slot, i) => {
                  if (!slot?.date) return null;
                  return (
                    <div key={slot.date ?? i}>
                      <p
                        className="text-xs font-semibold uppercase tracking-wide mb-2"
                        style={{ color: "var(--color-text-light)" }}
                      >
                        {slot.date}
                      </p>

                      {slot.times?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {slot.times.map((t) => (
                            <span
                              key={t.id}
                              className="px-3 py-1 text-sm rounded-md border"
                              style={{
                                borderColor: "var(--color-border)",
                                color: "var(--color-text)",
                                backgroundColor: "var(--color-bg)",
                              }}
                            >
                              {t.startTime}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm" style={{ color: "var(--color-text-light)" }}>
                          No times for this date.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: "var(--color-text-light)" }}>
                No available slots at this time.
              </p>
            )}
          </CardComp>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Info Row ───────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span style={{ color: "var(--color-primary)" }}>{icon}</span>
      <div>
        <h3 className="font-medium text-sm" style={{ color: "var(--color-text)" }}>
          {label}
        </h3>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-light)" }}>
          {children}
        </p>
      </div>
    </div>
  );
}

export default DoctorProfilePage;
