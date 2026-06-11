import { useEffect, useState } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Award,
  Briefcase,
  Calendar,
  MapPin,
  Mail,
  Phone,
  AlertCircle,
  DollarSign,
  GraduationCap,
  Languages,
  Building2,
  Globe,
  Clock,
  User,
  Hash,
  X,
  ExternalLink,
  Loader2,
  MessageSquare,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useSelector, useDispatch } from "react-redux";
import { getTimeAgo } from "@/lib/utils";
import {
  fetchSearchPendingDoctor,
  selectSearchPendingDoctor,
  type SearchPendingDoctor,
  type SearchPendingDoctorState,
} from "@/store/slices/admin-slice/search-pending-doctors-slice/searchPendingDoctorSlice";
import type { AppDispatch } from "@/store/store";
import Error from "@/components/error/Error";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { selectVerifyDoctorState, verifyDoctorAccount, type VerifyDoctorState } from "@/store/slices/admin-slice/verify-doctor-account-slice/verifyDoctorAccountSlice";
import { rejectDoctorAccount, selectRejectDoctorState, type RejectDoctorState } from "@/store/slices/admin-slice/reject-doctor-account-slice/rejectDoctorAccountSlice";


// ─── Info Row (used in modal) ─────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
  href?: string;
}) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 animate-in fade-in duration-150">
      <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium flex items-center gap-1 hover:underline text-blue-600 dark:text-blue-400"
        >
          {String(value)}
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
      ) : (
        <p className="text-xs font-medium flex items-center gap-1.5 text-gray-900 dark:text-white">
          <span className="text-gray-400 dark:text-gray-500">{icon}</span>
          {String(value)}
        </p>
      )}
    </div>
  );
}

// ─── Info Pill (used in card) ─────────────────────────────────────────────────

function InfoPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md border"
      style={{
        backgroundColor: "var(--color-bg)",
        borderColor: "var(--color-border)",
        color: "var(--color-text-light)",
      }}
    >
      {icon}
      {label}
    </span>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({
  doctor,
  onClose,
  onApprove,
  onReject,
}: {
  doctor: SearchPendingDoctor;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const doctorInitials = doctor.fullName
    ? doctor.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "";

  return (
    <>
      <div
        className="fixed inset-0 z-40 backdrop-blur-xs transition-opacity duration-200"
        style={{ background: "rgba(10,14,20,0.72)" }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-45 flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl flex flex-col rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-hidden">
          {/* Modal header */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #16a34a)",
                }}
              >
                {doctor.fullProfileImageUrl ? (
                  <img
                    src={doctor.fullProfileImageUrl}
                    alt={doctor.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  doctorInitials
                )}
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {doctor.fullName}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-light mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>{doctor.clinicName || "No Clinic"}</span>
                  {doctor.clinicLocation && (
                    <>
                      <span>·</span>
                      <span>{doctor.clinicLocation}</span>
                    </>
                  )}
                  {doctor.createdAt && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Submitted {getTimeAgo(doctor.createdAt)}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Modal body */}
          <div className="p-7 space-y-6 overflow-y-auto flex-1 min-h-0">
            {/* Personal */}
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-3 text-gray-400 dark:text-gray-500">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow
                  icon={<Mail className="w-3.5 h-3.5" />}
                  label="Email"
                  value={doctor.email}
                />
                <InfoRow
                  icon={<Phone className="w-3.5 h-3.5" />}
                  label="Phone"
                  value={doctor.phoneNumber}
                />
                <InfoRow
                  icon={<Phone className="w-3.5 h-3.5" />}
                  label="Clinic Phone"
                  value={doctor.clinicPhoneNumber}
                />
                <InfoRow
                  icon={<User className="w-3.5 h-3.5" />}
                  label="Gender"
                  value={doctor.gender}
                />
                <InfoRow
                  icon={<Calendar className="w-3.5 h-3.5" />}
                  label="Birth Date"
                  value={doctor.birthDate}
                />
                <InfoRow
                  icon={<MapPin className="w-3.5 h-3.5" />}
                  label="Country"
                  value={doctor.country}
                />
                <InfoRow
                  icon={<MapPin className="w-3.5 h-3.5" />}
                  label="City"
                  value={doctor.city}
                />
                <InfoRow
                  icon={<MapPin className="w-3.5 h-3.5" />}
                  label="Street"
                  value={doctor.street}
                />
              </div>
            </section>

            {/* Professional */}
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-3 text-gray-400 dark:text-gray-500">
                Professional Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow
                  icon={<Hash className="w-3.5 h-3.5" />}
                  label="License Number"
                  value={doctor.medicalLicenseNumber}
                />
                <InfoRow
                  icon={<Briefcase className="w-3.5 h-3.5" />}
                  label="Experience"
                  value={
                    doctor.yearsOfExperience
                      ? `${doctor.yearsOfExperience} years`
                      : null
                  }
                />
                <InfoRow
                  icon={<DollarSign className="w-3.5 h-3.5" />}
                  label="Consultation Fee"
                  value={doctor.price ? `$${doctor.price}` : null}
                />
                <InfoRow
                  icon={<Award className="w-3.5 h-3.5" />}
                  label="Degree"
                  value={doctor.degree}
                />
                <InfoRow
                  icon={<GraduationCap className="w-3.5 h-3.5" />}
                  label="Education"
                  value={doctor.education}
                />
                <InfoRow
                  icon={<Languages className="w-3.5 h-3.5" />}
                  label="Languages"
                  value={doctor.languages}
                />
              </div>
            </section>

            {/* Clinic */}
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-3 text-gray-400 dark:text-gray-500">
                Clinic Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow
                  icon={<Building2 className="w-3.5 h-3.5" />}
                  label="Clinic Name"
                  value={doctor.clinicName}
                />
                <InfoRow
                  icon={<MapPin className="w-3.5 h-3.5" />}
                  label="Clinic Location"
                  value={doctor.clinicLocation}
                />
              </div>
            </section>

            {/* About */}
            {doctor.about && (
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-widest mb-3 text-gray-400 dark:text-gray-500">
                  About
                </h4>
                <div className="p-4 rounded-xl text-sm leading-relaxed bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white">
                  {doctor.about}
                </div>
              </section>
            )}

            {/* Details */}
            {doctor.details && (
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-widest mb-3 text-gray-400 dark:text-gray-500">
                  Additional Details
                </h4>
                <div className="p-4 rounded-xl text-sm leading-relaxed bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white">
                  {doctor.details}
                </div>
              </section>
            )}

            {/* Certificate */}
            {doctor.fullCertificateUrl && (
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-widest mb-3 text-gray-400 dark:text-gray-500">
                  Documents
                </h4>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl gap-4 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Board Certification
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-light mt-0.5">
                        Medical practitioner license & verification document
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <a
                      href={doctor.fullCertificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors border border-blue-100 dark:border-blue-900/40"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </a>
                    <a
                      href={doctor.fullCertificateUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Download
                    </a>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 px-7 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-2xl">
            <button
              onClick={onReject}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-85 hover:scale-[1.01] active:scale-[0.99] transition-transform"
              style={{ backgroundColor: "#dc2626" }}
            >
              <XCircle className="w-4 h-4" />
              Reject Application
            </button>
            <button
              onClick={onApprove}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-85 hover:scale-[1.01] active:scale-[0.99] transition-transform"
              style={{ backgroundColor: "var(--color-success)" }}
            >
              <CheckCircle className="w-4 h-4" />
              Approve & Activate
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VerifyDoctorsPage() {
  const dispatch: AppDispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] =
    useState<SearchPendingDoctor | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectButton, setSelectButton] = useState("");

  // Modals for confirmation
  const [targetDoctor, setTargetDoctor] = useState<SearchPendingDoctor | null>(
    null,
  );
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Core pending list state
  const { doctors, error, loading } = useSelector(
    selectSearchPendingDoctor,
  ) as SearchPendingDoctorState;

  // Flattened structural states matching your updated slices
  const verifyDoctorState = useSelector(
    selectVerifyDoctorState,
  ) as VerifyDoctorState;

  const rejectDoctorState = useSelector(
    selectRejectDoctorState,
  ) as RejectDoctorState;

  useEffect(() => {
    dispatch(
      fetchSearchPendingDoctor({
        searchTerm: searchQuery,
        pageNumber: 1,
        pageSize: 10,
      }),
    );
  }, [dispatch, searchQuery]);

  const refetch = () =>
    dispatch(
      fetchSearchPendingDoctor({
        searchTerm: searchQuery,
        pageNumber: 1,
        pageSize: 10,
      }),
    );

  const handleConfirmApprove = async (doctorId: string) => {
    setSelectButton(doctorId);
    try {
      // Corrected parameter signature to match verifyDoctorAccount slice (POST /api/Admin/verify-doctor/{doctorId})
      await dispatch(
        verifyDoctorAccount(Number(doctorId)),
      ).unwrap();

      toast.success("Doctor approved successfully");
      refetch();
      setShowDetailModal(false);
      setShowApproveModal(false);
      setTargetDoctor(null);
    } catch (err: any) {
      toast.error(err || "Failed to approve");
    } finally {
      setSelectButton("");
    }
  };

  const handleConfirmReject = async (doctorId: string, reason: string) => {
    setSelectButton(doctorId);
    try {
      // Bound correctly to match your payload template for rejectDoctorAccount (POST /api/Admin/reject-doctor/{doctorId})
      await dispatch(
        rejectDoctorAccount({ reason, doctorId: Number(doctorId) }),
      ).unwrap();

      toast.success("Doctor rejected successfully");
      refetch();
      setShowDetailModal(false);
      setShowRejectModal(false);
      setTargetDoctor(null);
    } catch (err: any) {
      toast.error(err || "Failed to reject");
    } finally {
      setSelectButton("");
    }
  };

  const handleViewDetails = (doctor: SearchPendingDoctor) => {
    setSelectedDoctor(doctor);
    setShowDetailModal(true);
  };

  return (
    <DashboardLayout pageTitle="Verify Doctors">
      {/* ── Header ── */}
      <div className="mb-6">
        <h2
          className="text-2xl font-semibold mb-1"
          style={{ color: "var(--color-text)" }}
        >
          Doctor Verifications
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-light)" }}>
          Review and verify pending doctor applications
        </p>
      </div>

      {/* ── Search ── */}
      <div
        className="rounded-2xl border p-4 mb-6"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--color-text-light)" }}
          />
          <input
            type="text"
            placeholder="Search by name, email or clinic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
            style={{
              backgroundColor: "var(--color-bg)",
              border: "1.5px solid var(--color-border)",
              color: "var(--color-text)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--color-primary)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--color-border)")
            }
          />
        </div>
      </div>

      {/* ── List ── */}
      {loading ? (
        <div className="flex justify-center py-16">
          <ScaleLoader color="#6d61ff" />
        </div>
      ) : error ? (
        <Error message={error} onRetry={refetch} />
      ) : doctors.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 rounded-2xl border"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <AlertCircle
            className="w-10 h-10 mb-3"
            style={{ color: "var(--color-text-light)" }}
          />
          <p className="text-sm" style={{ color: "var(--color-text-light)" }}>
            No verifications found
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {doctors.map((doctor) => {
            const isThisLoading = selectButton === doctor.doctorId;
            return (
              <div
                key={doctor.doctorId}
                className="rounded-2xl border p-5 space-y-4 hover:border-(--color-primary) transition-all duration-155"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  boxShadow: "var(--shadow)",
                }}
              >
                {/* Top: avatar + name + actions */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Avatar */}
                    <div
                      className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #2563eb, #16a34a)",
                      }}
                    >
                      {doctor.fullProfileImageUrl ? (
                        <img
                          src={doctor.fullProfileImageUrl}
                          alt={doctor.fullName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = "none";
                          }}
                        />
                      ) : (
                        doctor.fullName?.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <h3
                        className="text-sm font-semibold truncate"
                        style={{ color: "var(--color-text)" }}
                      >
                        {doctor.fullName}
                      </h3>
                      {doctor.clinicName && (
                        <p
                          className="text-xs flex items-center gap-1"
                          style={{ color: "var(--color-text-light)" }}
                        >
                          <Building2 className="w-3 h-3 shrink-0" />
                          {doctor.clinicName}
                          {doctor.clinicLocation &&
                            ` · ${doctor.clinicLocation}`}
                        </p>
                      )}
                      {doctor.createdAt && (
                        <p
                          className="text-xs flex items-center gap-1"
                          style={{ color: "var(--color-text-light)" }}
                        >
                          <Clock className="w-3 h-3 shrink-0" />
                          Submitted {getTimeAgo(doctor.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleViewDetails(doctor)}
                      className="p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-opacity hover:opacity-80 border animate-in duration-100"
                      style={{
                        backgroundColor: "var(--color-bg)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text-light)",
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      <span className="max-sm:hidden">Details</span>
                    </button>
                    <button
                      disabled={isThisLoading}
                      onClick={() => {
                        setTargetDoctor(doctor);
                        setShowApproveModal(true);
                      }}
                      className="p-2 rounded-lg flex items-center gap-1.5 text-xs font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-transform duration-100"
                      style={{ backgroundColor: "var(--color-success)" }}
                    >
                      {isThisLoading && verifyDoctorState.loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span className="max-sm:hidden">Approve</span>
                    </button>
                    <button
                      disabled={isThisLoading}
                      onClick={() => {
                        setTargetDoctor(doctor);
                        setShowRejectModal(true);
                      }}
                      className="p-2 rounded-lg flex items-center gap-1.5 text-xs font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-transform duration-100"
                      style={{ backgroundColor: "#dc2626" }}
                    >
                      {isThisLoading && rejectDoctorState.loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span className="max-sm:hidden">Reject</span>
                    </button>
                  </div>
                </div>

                {/* Info pills — all available fields */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {doctor.email && (
                    <InfoPill
                      icon={<Mail className="w-3 h-3" />}
                      label={doctor.email}
                    />
                  )}
                  {doctor.phoneNumber && (
                    <InfoPill
                      icon={<Phone className="w-3 h-3" />}
                      label={doctor.phoneNumber}
                    />
                  )}
                  {doctor.yearsOfExperience > 0 && (
                    <InfoPill
                      icon={<Briefcase className="w-3 h-3" />}
                      label={`${doctor.yearsOfExperience} yrs exp`}
                    />
                  )}
                  {doctor.price > 0 && (
                    <InfoPill
                      icon={<DollarSign className="w-3 h-3" />}
                      label={`$${doctor.price} / visit`}
                    />
                  )}
                  {doctor.education && (
                    <InfoPill
                      icon={<GraduationCap className="w-3 h-3" />}
                      label={doctor.education}
                    />
                  )}
                  {doctor.languages && (
                    <InfoPill
                      icon={<Languages className="w-3 h-3" />}
                      label={doctor.languages}
                    />
                  )}
                  {doctor.country && (
                    <InfoPill
                      icon={<Globe className="w-3 h-3" />}
                      label={`${doctor.city ? doctor.city + ", " : ""}${doctor.country}`}
                    />
                  )}
                  {doctor.medicalLicenseNumber && (
                    <InfoPill
                      icon={<Hash className="w-3 h-3" />}
                      label={doctor.medicalLicenseNumber}
                    />
                  )}
                </div>

                {/* About snippet */}
                {doctor.about?.trim() && (
                  <p
                    className="text-xs leading-relaxed line-clamp-2"
                    style={{ color: "var(--color-text-light)" }}
                  >
                    {doctor.about}
                  </p>
                )}

                {/* Certificate link */}
                {doctor.fullCertificateUrl && (
                  <a
                    href={doctor.fullCertificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                    style={{ color: "var(--color-primary)" }}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Certificate
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Detail Modal ── */}
      {showDetailModal && selectedDoctor && (
        <DetailModal
          doctor={selectedDoctor}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedDoctor(null);
          }}
          onApprove={() => {
            setTargetDoctor(selectedDoctor);
            setShowApproveModal(true);
          }}
          onReject={() => {
            setTargetDoctor(selectedDoctor);
            setShowRejectModal(true);
          }}
        />
      )}

      {/* ── Approve Confirmation Modal ── */}
      {showApproveModal && targetDoctor && (
        <ApproveDoctorModal
          isOpen={showApproveModal}
          onClose={() => {
            setShowApproveModal(false);
            setTargetDoctor(null);
          }}
          onConfirm={() =>
            handleConfirmApprove(targetDoctor.doctorId)
          }
          doctor={targetDoctor}
          submitting={
            selectButton === targetDoctor.doctorId && verifyDoctorState.loading
          }
        />
      )}

      {/* ── Reject Confirmation Modal ── */}
      {showRejectModal && targetDoctor && (
        <RejectDoctorModal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setTargetDoctor(null);
          }}
          onConfirm={(reason) =>
            handleConfirmReject(targetDoctor.doctorId, reason)
          }
          doctor={targetDoctor}
          submitting={
            selectButton === targetDoctor.doctorId && rejectDoctorState.loading
          }
        />
      )}
    </DashboardLayout>
  );
}

// ─── Confirmation Modals ───────────────────────────────────────────────────────

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (text: string) => void;
  doctor: SearchPendingDoctor;
  submitting: boolean;
}

function ApproveDoctorModal({
  isOpen,
  onClose,
  onConfirm,
  doctor,
  submitting,
}: ConfirmModalProps) {
  const [note, setNote] = useState("");

  const doctorInitials = doctor.fullName
    ? doctor.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
      style={{ background: "rgba(10,14,20,0.72)" }}
    >
      <div className="relative w-full max-w-lg flex flex-col rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/30 shrink-0">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white tracking-tight">
                Approve Doctor
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-light mt-0.5">
                Verify credentials and activate account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 px-7 py-5 overflow-y-auto flex-1 min-h-0">
          {/* Confirmation banner */}
          <div className="flex items-start gap-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 px-4 py-3 border border-green-100/30 dark:border-green-900/30">
            <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-green-700 dark:text-green-400 mb-1">
                Confirm Approval
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 font-light leading-relaxed">
                You are about to approve this doctor. Their profile will be
                activated immediately and they will be allowed to log in and set
                up schedules.
              </p>
            </div>
          </div>

          {/* Doctor details card */}
          <div className="flex items-start gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 px-4 py-3.5 border border-gray-100 dark:border-gray-800">
            <div
              className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{
                background: "linear-gradient(135deg, #2563eb, #16a34a)",
              }}
            >
              {doctor.fullProfileImageUrl ? (
                <img
                  src={doctor.fullProfileImageUrl}
                  alt={doctor.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                doctorInitials
              )}
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-0.5">
                Pending Doctor
              </p>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {doctor.fullName}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-0.5">
                {doctor.email} {doctor.clinicName && `· ${doctor.clinicName}`}
              </p>
            </div>
          </div>

          {/* Note Input */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
              <MessageSquare className="h-3.5 w-3.5" />
              Approval Note
              <span className="normal-case tracking-normal font-light text-gray-300 dark:text-gray-600 ml-1">
                (optional)
              </span>
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="e.g. Welcome to Assnanni! Your credentials have been successfully verified..."
              className="w-full resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 outline-none focus:border-green-500 dark:focus:border-green-400 transition-colors font-light"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-2xl">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/30 text-xs font-medium text-green-600 dark:text-green-400">
              {doctorInitials}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900 dark:text-white">
                {doctor.fullName}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-light">
                Experience: {doctor.yearsOfExperience} years
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(note)}
              disabled={submitting}
              className="flex items-center gap-1.5 rounded-lg bg-green-600 hover:bg-green-700 px-4 py-2 text-xs font-medium text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed transition-colors min-w-[130px] justify-center"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Approving…
                </>
              ) : (
                <>
                  <CheckCircle className="h-3.5 w-3.5" /> Approve Doctor
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RejectDoctorModal({
  isOpen,
  onClose,
  onConfirm,
  doctor,
  submitting,
}: ConfirmModalProps) {
  const [reason, setReason] = useState("");

  const doctorInitials = doctor.fullName
    ? doctor.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
      style={{ background: "rgba(10,14,20,0.72)" }}
    >
      <div className="relative w-full max-w-lg flex flex-col rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/30 shrink-0">
              <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white tracking-tight">
                Reject Doctor
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-light mt-0.5">
                Decline application and send explanation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 px-7 py-5 overflow-y-auto flex-1 min-h-0">
          {/* Confirmation banner */}
          <div className="flex items-start gap-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 px-4 py-3 border border-red-100/30 dark:border-red-900/30">
            <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-red-700 dark:text-red-400 mb-1">
                Are you sure?
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 font-light leading-relaxed">
                You are about to reject this application. This action is
                permanent, and the doctor will be notified of the reason.
              </p>
            </div>
          </div>

          {/* Doctor details card */}
          <div className="flex items-start gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 px-4 py-3.5 border border-gray-100 dark:border-gray-800">
            <div
              className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{
                background: "linear-gradient(135deg, #2563eb, #16a34a)",
              }}
            >
              {doctor.fullProfileImageUrl ? (
                <img
                  src={doctor.fullProfileImageUrl}
                  alt={doctor.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                doctorInitials
              )}
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-0.5">
                Pending Doctor
              </p>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {doctor.fullName}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-0.5">
                {doctor.email} {doctor.clinicName && `· ${doctor.clinicName}`}
              </p>
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
              <MessageSquare className="h-3.5 w-3.5" />
              Rejection Reason
              <span className="text-red-500 ml-0.5">*</span>
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g. Uploaded certificate is illegible, or license number doesn't match official registries..."
              className="w-full resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 outline-none focus:border-red-500 dark:focus:border-red-400 transition-colors font-light"
              required
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-2xl">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30 text-xs font-medium text-red-500 dark:text-red-400">
              {doctorInitials}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900 dark:text-white">
                {doctor.fullName}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-light">
                Experience: {doctor.yearsOfExperience} years
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(reason)}
              disabled={!reason.trim() || submitting}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-medium text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed transition-colors min-w-[130px] justify-center"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Rejecting…
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5" /> Reject Doctor
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
