import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import {
  fetchAdminSummary,
  selectSummary,
  type SummaryState,
} from "@/store/slices/admin-slice/summary-slice/SummarySlice";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Filter,
  Mail,
  Phone,
  Search,
  Shield,
  UserPlus,
  X,
  User,
  ToggleLeft,
  ToggleRight,
  Loader2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminUsers,
  selectUsers,
  type UsersState,
  type User as UserType,
} from "@/store/slices/admin-slice/users-slice/UsersSlice";

import type { AppDispatch } from "@/store/store";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import Pagination from "@/components/pagination/Pagination";
import {
  fetchToggleUserStatus,
  resetToggleStatusState,
  selectToggleStatusState,
} from "@/store/slices/admin-slice/toggle-status-users-slice/toggleStatusUsersSlice";

type UserRole =
  | ""
  | "Doctor"
  | "Patient"
  | "Receptionist"
  | "Student"
  | "Admin";
type UserGender = "" | "male" | "female";

// ─── Role config ──────────────────────────────────────────────────────────────

const roleConfig: Record<string, { bg: string; color: string }> = {
  admin: { bg: "rgba(220,38,38,0.08)", color: "#dc2626" },
  doctor: { bg: "var(--color-bg-blue)", color: "var(--color-text-blue)" },
  "student-doctor": { bg: "rgba(147,51,234,0.08)", color: "#9333ea" },
  receptionist: { bg: "rgba(22,163,74,0.08)", color: "var(--color-success)" },
  patient: { bg: "rgba(234,179,8,0.08)", color: "#ca8a04" },
};

function getRoleStyle(role: string) {
  return (
    roleConfig[role.toLowerCase()] ?? {
      bg: "var(--color-bg)",
      color: "var(--color-text-light)",
    }
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | undefined;
  color?: string;
}) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-1"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <p
        className="text-xs font-medium"
        style={{ color: "var(--color-text-light)" }}
      >
        {label}
      </p>
      <p
        className="text-2xl font-bold"
        style={{ color: color ?? "var(--color-text)" }}
      >
        {value ?? 0}
      </p>
    </div>
  );
}

// ─── User Detail Modal ────────────────────────────────────────────────────────

function UserDetailModal({
  user,
  onClose,
  onToggleStatus,
  toggling,
}: {
  user: UserType;
  onClose: () => void;
  onToggleStatus: () => void;
  toggling: boolean;
}) {
  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const roleStyle = getRoleStyle(user.role);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md flex flex-col rounded-2xl shadow-2xl"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Green/red top accent */}
        <div
          className="h-1.5 w-full rounded-t-2xl"
          style={{
            background: user.isActive ? "var(--color-success)" : "#dc2626",
          }}
        />

        {/* Header */}
        <div
          className="flex items-start justify-between px-6 pt-5 pb-4 shrink-0"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName}
                  className="w-12 h-12 rounded-xl object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
                  }}
                >
                  {initials}
                </div>
              )}
              {/* Online dot */}
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                style={{
                  background: user.isActive
                    ? "var(--color-success)"
                    : "#dc2626",
                  borderColor: "var(--color-surface)",
                }}
              />
            </div>
            <div>
              <h3
                className="text-base font-semibold"
                style={{ color: "var(--color-text)" }}
              >
                {user.fullName}
              </h3>
              <span
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-medium mt-0.5"
                style={{ background: roleStyle.bg, color: roleStyle.color }}
              >
                <Shield className="w-3 h-3" />
                {user.role?.replace("-", " ") || "N/A"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors shrink-0"
            style={{
              border: "1px solid var(--color-border)",
              color: "var(--color-text-light)",
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-3">
          {/* Status banner */}
          <div
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{
              background: user.isActive
                ? "rgba(22,163,74,0.07)"
                : "rgba(220,38,38,0.06)",
              border: `1px solid ${user.isActive ? "rgba(22,163,74,0.22)" : "rgba(220,38,38,0.2)"}`,
            }}
          >
            <div className="flex items-center gap-2">
              {user.isActive ? (
                <CheckCircle
                  className="w-4 h-4"
                  style={{ color: "var(--color-success)" }}
                />
              ) : (
                <XCircle className="w-4 h-4" style={{ color: "#dc2626" }} />
              )}
              <span
                className="text-xs font-semibold"
                style={{
                  color: user.isActive ? "var(--color-success)" : "#dc2626",
                }}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <button
              onClick={onToggleStatus}
              disabled={toggling}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: user.isActive
                  ? "rgba(220,38,38,0.08)"
                  : "rgba(22,163,74,0.08)",
                color: user.isActive ? "#dc2626" : "var(--color-success)",
                border: `1px solid ${user.isActive ? "rgba(220,38,38,0.2)" : "rgba(22,163,74,0.2)"}`,
              }}
            >
              {toggling ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : user.isActive ? (
                <ToggleRight className="w-3.5 h-3.5" />
              ) : (
                <ToggleLeft className="w-3.5 h-3.5" />
              )}
              {user.isActive ? "Deactivate" : "Activate"}
            </button>
          </div>

          {/* Info rows */}
          {[
            {
              icon: <Mail className="w-3.5 h-3.5" />,
              label: "Email",
              value: user.email,
            },
            {
              icon: <Phone className="w-3.5 h-3.5" />,
              label: "Phone",
              value: user.phoneNumber || "—",
            },
            {
              icon: <User className="w-3.5 h-3.5" />,
              label: "Gender",
              value: user.gender || "—",
            },
            {
              icon: <Calendar className="w-3.5 h-3.5" />,
              label: "Joined",
              value: new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: "var(--color-bg-blue)",
                  color: "var(--color-primary)",
                }}
              >
                {row.icon}
              </div>
              <div className="min-w-0">
                <p
                  className="text-[10px] uppercase tracking-widest font-semibold"
                  style={{ color: "var(--color-text-light)" }}
                >
                  {row.label}
                </p>
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: "var(--color-text)" }}
                >
                  {row.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex justify-end"
          style={{
            borderTop: "1px solid var(--color-border)",
            background: "var(--color-bg)",
          }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-semibold transition-colors"
            style={{
              border: "1px solid var(--color-border)",
              color: "var(--color-text-light)",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function UsersPage() {
  const dispatch: AppDispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole>("");
  const [filterGender, setFilterGender] = useState<UserGender>("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const { data } = useSelector(selectSummary) as SummaryState;
  const {
    usersData,
    totalCount,
    loading: usersLoading,
  } = useSelector(selectUsers) as UsersState;
  const { loading: toggling } = useSelector(selectToggleStatusState);

  useEffect(() => {
    dispatch(fetchAdminSummary());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchAdminUsers({
        SearchTerm: searchQuery,
        Role: filterRole,
        gender: filterGender,
        PageNumber: pageNumber,
        PageSize: pageSize,
      }),
    );
  }, [dispatch, searchQuery, filterRole, filterGender, pageNumber, pageSize]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setPageNumber(1);
  }, [searchQuery, filterRole, filterGender]);

  const handleToggleStatus = async (user: UserType) => {
    try {
      await dispatch(fetchToggleUserStatus(user.id)).unwrap();
      toast.success(
        `${user.fullName} is now ${user.isActive ? "inactive" : "active"}.`,
      );
      dispatch(resetToggleStatusState());
      // Re-fetch to update list
      dispatch(
        fetchAdminUsers({
          SearchTerm: searchQuery,
          Role: filterRole,
          gender: filterGender,
          PageNumber: pageNumber,
          PageSize: pageSize,
        }),
      );
      // Update modal user state
      setSelectedUser((prev) =>
        prev ? { ...prev, isActive: !prev.isActive } : null,
      );
    } catch (err: any) {
      toast.error(err || "Failed to toggle status");
    }
  };

  const totalUser = data
    ? data.totalDoctors +
      data.totalPatients +
      data.totalReceptionists +
      data.totalStudents
    : 0;

  const stats = [
    { label: "Total Users", value: totalUser, color: undefined },
    { label: "Patients", value: data?.totalPatients, color: undefined },
    { label: "Doctors", value: data?.totalDoctors, color: undefined },
    { label: "Students", value: data?.totalStudents, color: undefined },
    {
      label: "Receptionists",
      value: data?.totalReceptionists,
      color: undefined,
    },
    {
      label: "Active",
      value: data?.totalActionedToday,
      color: "var(--color-success)",
    },
    { label: "Suspended", value: data?.totalRejected, color: "#dc2626" },
    { label: "Pending", value: data?.pendingRequests, color: "#ca8a04" },
  ];

  return (
    <DashboardLayout pageTitle="Users Management">
      <div className="space-y-6">
        {/* ── Page header ── */}
        <div className="flex justify-between items-start">
          <div>
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: "var(--color-text)" }}
            >
              Users Management
            </h1>
            <p className="text-sm" style={{ color: "var(--color-text-light)" }}>
              Manage all platform users and their permissions
            </p>
          </div>
          <Link
            to="/add-user"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--color-primary)" }}
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </Link>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {stats.map((s) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              color={s.color}
            />
          ))}
        </div>

        {/* ── Search & Filters ── */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--color-text-light)" }}
              />
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
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

            {/* Filters */}
            <div className="flex items-center gap-3 shrink-0">
              <Filter
                className="w-4 h-4 shrink-0"
                style={{ color: "var(--color-text-light)" }}
              />
              {[
                {
                  onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFilterRole(e.target.value as UserRole),
                  options: [
                    { value: "", label: "All Roles" },
                    { value: "Patient", label: "Patient" },
                    { value: "Doctor", label: "Doctor" },
                    { value: "Student", label: "Student Doctor" },
                    { value: "Receptionist", label: "Receptionist" },
                    { value: "Admin", label: "Admin" },
                  ],
                },
                {
                  onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFilterGender(e.target.value as UserGender),
                  options: [
                    { value: "", label: "All Genders" },
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ],
                },
              ].map((sel, i) => (
                <select
                  key={i}
                  onChange={sel.onChange}
                  className="px-3 py-2.5 rounded-xl text-sm outline-none transition-colors"
                  style={{
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "var(--color-primary)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "var(--color-border)")
                  }
                >
                  {sel.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          {usersLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <ScaleLoader
                color="var(--color-primary)"
                radius={4}
                width={3.5}
                height={20}
                margin={2}
              />
              <p
                className="text-xs animate-pulse"
                style={{ color: "var(--color-text-light)" }}
              >
                Loading users…
              </p>
            </div>
          ) : usersData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <AlertCircle
                className="w-10 h-10"
                style={{ color: "var(--color-border)" }}
              />
              <p
                className="text-sm"
                style={{ color: "var(--color-text-light)" }}
              >
                No users found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                      background: "var(--color-bg)",
                    }}
                  >
                    {[
                      "User",
                      "Contact",
                      "Role",
                      "Gender",
                      "Status",
                      "Joined",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-5 py-3 text-xs font-semibold uppercase tracking-widest ${h === "Actions" ? "text-right" : "text-left"}`}
                        style={{ color: "var(--color-text-light)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usersData.map((user, idx) => {
                    const roleStyle = getRoleStyle(user.role);
                    return (
                      <tr
                        key={user.id}
                        className="transition-colors cursor-pointer"
                        style={{
                          borderBottom:
                            idx < usersData.length - 1
                              ? "1px solid var(--color-border)"
                              : "none",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "var(--color-bg)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                        onClick={() => setSelectedUser(user)}
                      >
                        {/* User */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <div className="w-9 h-9 rounded-full">
                                <UserAvatar
                                  src={user.imageUrl}
                                  alt={user.fullName}
                                />
                              </div>

                              <span
                                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                                style={{
                                  background: user.isActive
                                    ? "var(--color-success)"
                                    : "#dc2626",
                                  borderColor: "var(--color-surface)",
                                }}
                              />
                            </div>
                            <p
                              className="text-sm font-medium"
                              style={{ color: "var(--color-text)" }}
                            >
                              {user.fullName}
                            </p>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1">
                            <div
                              className="flex items-center gap-1.5 text-xs"
                              style={{ color: "var(--color-text-light)" }}
                            >
                              <Mail className="w-3 h-3 shrink-0" />
                              <span className="truncate max-w-[180px]">
                                {user.email}
                              </span>
                            </div>
                            <div
                              className="flex items-center gap-1.5 text-xs"
                              style={{ color: "var(--color-text-light)" }}
                            >
                              <Phone className="w-3 h-3 shrink-0" />
                              <span>{user.phoneNumber || "—"}</span>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4">
                          <span
                            className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold"
                            style={{
                              background: roleStyle.bg,
                              color: roleStyle.color,
                            }}
                          >
                            <Shield className="w-3 h-3" />
                            {user.role?.replace("-", " ") || "N/A"}
                          </span>
                        </td>

                        {/* Gender */}
                        <td className="px-5 py-4">
                          <span
                            className="text-xs capitalize"
                            style={{ color: "var(--color-text-light)" }}
                          >
                            {user.gender || "—"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold"
                            style={{
                              background: user.isActive
                                ? "rgba(22,163,74,0.08)"
                                : "rgba(220,38,38,0.08)",
                              color: user.isActive
                                ? "var(--color-success)"
                                : "#dc2626",
                            }}
                          >
                            {user.isActive ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-5 py-4">
                          <div
                            className="flex items-center gap-1.5 text-xs"
                            style={{ color: "var(--color-text-light)" }}
                          >
                            <Calendar className="w-3 h-3 shrink-0" />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {/* Toggle status */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(user);
                              }}
                              disabled={toggling}
                              className="p-2 rounded-lg transition-colors disabled:opacity-50"
                              style={{
                                background: user.isActive
                                  ? "rgba(220,38,38,0.08)"
                                  : "rgba(22,163,74,0.08)",
                                color: user.isActive
                                  ? "#dc2626"
                                  : "var(--color-success)",
                                border: `1px solid ${user.isActive ? "rgba(220,38,38,0.18)" : "rgba(22,163,74,0.18)"}`,
                              }}
                              title={user.isActive ? "Deactivate" : "Activate"}
                            >
                              {toggling ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : user.isActive ? (
                                <ToggleRight className="w-4 h-4" />
                              ) : (
                                <ToggleLeft className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        {!usersLoading && usersData.length > 0 && (
          <Pagination
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalItems={Number(totalCount)}
            onPageChange={(page) => setPageNumber(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPageNumber(1);
            }}
          />
        )}
      </div>

      {/* ── User Detail Modal ── */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onToggleStatus={() => handleToggleStatus(selectedUser)}
          toggling={toggling}
        />
      )}
    </DashboardLayout>
  );
}

export default UsersPage;

const UserAvatar = ({ src, alt }: { src: string; alt: string }) => {
  const [imageError, setImageError] = useState(false);

  if (src?.trim() && !imageError) {
    return (
      <img
        src={src}
        className="object-cover w-full h-full"
        alt={alt || "doctor image"}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div className="w-full h-full rounded-full bg-(--color-bg-blue) border border-primary/20 flex items-center justify-center">
      <User className="w-5 h-5 text-(--color-primary)" />
    </div>
  );
};
