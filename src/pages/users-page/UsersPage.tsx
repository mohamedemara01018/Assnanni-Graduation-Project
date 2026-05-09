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
  Edit,
  Eye,
  Filter,
  Mail,
  MoreVertical,
  Phone,
  Search,
  Shield,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminUsers,
  selectUsers,
  type UsersState,
} from "@/store/slices/admin-slice/users-slice/UsersSlice";
import type { AppDispatch } from "@/store/store";
import { ScaleLoader } from "react-spinners";
import Error from "@/components/error/Error";
import { toast } from "react-toastify";
import Pagination from "@/components/pagination/Pagination";

type UserRole =
  | ""
  | "Doctor"
  | "Patient"
  | "Receptionist"
  | "Student"
  | "Admin";

type UserGender = "" | "male" | "female";

function UsersPage() {
  const dispatch: AppDispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole>("");
  const [filterGender, setFilterGender] = useState<UserGender>("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // const [showDetailModal, setShowDetailModal] = useState(false);
  // const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  const { data, loading, error } = useSelector(selectSummary) as SummaryState;

  const {
    usersData,
    totalCount = 0,
    loading: usersLoading,
  } = useSelector(selectUsers) as UsersState;

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchAdminSummary()),
          dispatch(
            fetchAdminUsers({
              SearchTerm: searchQuery,
              Role: filterRole,
              gender: filterGender,
              PageNumber: pageNumber,
              PageSize: pageSize,
            }),
          ),
        ]);
      } catch (error: any) {
        console.log(error);
        const errorMessage =
          typeof error == "string" ? String(error) : error.message;
        toast.error(errorMessage);
      }
    };

    fetchData();
  }, [dispatch, searchQuery, filterRole, filterGender, pageNumber, pageSize]);

  // Reset page number when filters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageNumber(1);
  }, [searchQuery, filterRole, filterGender]);

  const totalUser = data
    ? data.totalDoctors +
    data.totalPatients +
    data.totalReceptionists +
    data.totalStudents
    : 0;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      case "doctor":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      case "student-doctor":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
      case "receptionist":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  // const getStatusBadgeColor = (status: string) => {
  //     switch (status) {
  //         case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
  //         case 'suspended': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  //         case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
  //         default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  //     }
  // };

  // const handleSuspendUser = (userId: string) => {
  //     console.log('Suspending user:', userId);
  //     setShowActionsMenu(null);
  // };

  // const handleActivateUser = (userId: string) => {
  //     console.log('Activating user:', userId);
  //     setShowActionsMenu(null);
  // };

  // const handleViewDetails = (user: User) => {
  //     setSelectedUser(user);
  //     setShowDetailModal(true);
  //     setShowActionsMenu(null);
  // };

  // const handleEditUser = (userId: string) => {
  //     console.log('Editing user:', userId);
  //     setShowActionsMenu(null);
  // };

  // const handleExportUsers = () => {
  //     console.log('Exporting users...');
  // };

  return (
    <DashboardLayout pageTitle="Users page">
      {/* header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl text-(--color-text)">Users Management</h1>
          <p className=" text-(--color-text-light)">
            Manage all platform users and their permissions
          </p>
        </div>
        <Link
          to="/add-user"
          className=" px-4 py-2 bg-(--color-primary) text-white w-fit h-fit rounded-lg hover:bg-(--color-primary-light) transition-colors flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        <div className="bg-(--color-surface) rounded-xl p-4 border border-(--color-border)">
          <p className="text-xs text-(--color-text-light)  mb-1">Total Users</p>
          <p className="text-2xl ">{totalUser}</p>
        </div>
        <div className="bg-(--color-surface) rounded-xl p-4 border border-(--color-border)">
          <p className="text-xs text-(--color-text-light) mb-1">Patients</p>
          <p className="text-2xl ">{data?.totalPatients}</p>
        </div>
        <div className="bg-(--color-surface) rounded-xl p-4 border border-(--color-border)">
          <p className="text-xs text-(--color-text-light) mb-1">Doctors</p>
          <p className="text-2xl ">{data?.totalDoctors}</p>
        </div>
        <div className="bg-(--color-surface) rounded-xl p-4 border border-(--color-border)">
          <p className="text-xs text-(--color-text-light) mb-1">Students</p>
          <p className="text-2xl ">{data?.totalStudents}</p>
        </div>
        <div className="bg-(--color-surface) rounded-xl p-4 border border-(--color-border)">
          <p className="text-xs text-(--color-text-light) mb-1">
            Receptionists
          </p>
          <p className="text-2xl ">{data?.totalReceptionists}</p>
        </div>
        <div className="bg-(--color-surface) rounded-xl p-4 border border-(--color-border)">
          <p className="text-xs text-(--color-text-light) mb-1">Active</p>
          <p className="text-2xl text-green-600 dark:text-green-400">
            {data?.totalActionedToday}
          </p>
        </div>
        <div className="bg-(--color-surface) rounded-xl p-4 border border-(--color-border)">
          <p className="text-xs text-(--color-text-light) mb-1">Suspended</p>
          <p className="text-2xl text-red-600 dark:text-red-400">
            {data?.totalRejected}
          </p>
        </div>
        <div className="bg-(--color-surface) rounded-xl p-4 border border-(--color-border)">
          <p className="text-xs text-(--color-text-light) mb-1">Pending</p>
          <p className="text-2xl text-yellow-600 dark:text-yellow-400">
            {data?.pendingRequests}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-(--color-surface) rounded-xl border border-(--color-border) p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-(--color-text-light)" />
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg  placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--color-text-blue)"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-(--color-text-light)" />
            <select
              onChange={(e) => setFilterRole(e.target.value as UserRole)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-(--color-border) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-text-blue)"
            >
              <option value="">All Roles</option>
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
              <option value="Student">Student Doctor</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Admin">Admin</option>
            </select>
            <select
              onChange={(e) => setFilterGender(e.target.value as UserGender)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-(--color-border) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-text-blue)"
            >
              <option value="">All Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-(--color-surface) rounded-xl border border-(--color-border) overflow-hidden">
        {error ? (
          <Error message={error} />
        ) : loading || usersLoading ? (
          <div className="w-full py-10  flex items-center justify-center">
            <ScaleLoader color="#6d61ff" />{" "}
          </div>
        ) : usersData.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-(--color-text-light) mx-auto mb-4" />
            <p className="text-(--color-text-light)">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-(--color-border)">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-(--color-text-light) uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-(--color-text-light) uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-(--color-text-light) uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-(--color-text-light) uppercase tracking-wider">
                    Gender
                  </th>

                  <th className="px-6 py-3 text-left text-xs text-(--color-text-light) uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs text-(--color-text-light) uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {usersData.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-green-500 rounded-full flex items-center justify-center text-white shrink-0">
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">
                              {user.fullName}
                            </p>
                            {user.isActive && (
                              <CheckCircle className="w-4 h-4 text-(--color-text-blue)" />
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2 text-(--color-text-light)">
                          <Mail className="w-3 h-3" />
                          <span className="text-xs truncate max-w-[200px]">
                            {user.email}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-(--color-text-light)">
                          <Phone className="w-3 h-3" />
                          <span className="text-xs">{user.phoneNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center space-x-1 ${getRoleBadgeColor("user.role")}`}
                      >
                        <Shield className="w-3 h-3" />
                        <span className="capitalize">
                          {user.role.replace("-", " ")}
                        </span>
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center space-x-1`}
                      >
                        <Shield className="w-3 h-3" />
                        <span className="capitalize">{user.gender}</span>
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm text-(--color-text-light)">
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          // onClick={() => handleViewDetails(user)}
                          className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          // onClick={() => handleEditUser(user.id)}
                          className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button
                            // onClick={() => setShowActionsMenu(showActionsMenu === user.id ? null : user.id)}
                            className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {/* {showActionsMenu === user.id && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-(--color-surface) rounded-lg shadow-lg border border-(--c) z-10">
                                                            {user.status === 'active' ? (
                                                                <button
                                                                    onClick={() => handleSuspendUser(user.id)}
                                                                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                                                                >
                                                                    <Ban className="w-4 h-4" />
                                                                    <span>Suspend User</span>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleActivateUser(user.id)}
                                                                    className="w-full px-4 py-2 text-left text-sm text-green-600 dark:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                    <span>Activate User</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    )} */}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              pageNumber={pageNumber}
              pageSize={pageSize}
              totalItems={usersData.length + 20}
              onPageChange={(page) => setPageNumber(page)}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPageNumber(1);
              }}
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      {!error && !loading && !usersLoading && usersData.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-between items-center bg-(--color-surface) p-4 rounded-xl border border-(--color-border) shadow-sm gap-4">
          <div className="flex items-center gap-6">
            <span className="text-sm text-(--color-text-light) font-medium">
              Showing {(pageNumber - 1) * pageSize + 1} to{" "}
              {Math.min(pageNumber * pageSize, totalCount)} of {totalCount}{" "}
              users
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-(--color-text-light) font-semibold uppercase tracking-wider">
                Show:
              </span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageNumber(1);
                }}
                className="bg-gray-50 dark:bg-gray-700 border border-(--color-border) rounded-lg px-2 py-1 text-xs font-bold text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-text-blue) cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              disabled={pageNumber === 1 || usersLoading}
              className={`p-2 rounded-lg border border-(--color-border) transition-all ${pageNumber === 1 || usersLoading
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-gray-50 dark:bg-gray-700 text-(--color-text) hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Simple logic for showing pages around current page
                // For now just show first 5 pages or all if totalPages <= 5
                return (
                  <button
                    key={i + 1}
                    onClick={() => setPageNumber(i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all cursor-pointer ${pageNumber === i + 1
                      ? "bg-(--color-primary) text-white shadow-md shadow-(--color-primary)/20"
                      : "bg-gray-50 dark:bg-gray-700 text-(--color-text) border border-(--color-border) hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <span className="px-2 self-center text-gray-400">...</span>
              )}
            </div>

            <button
              onClick={() =>
                setPageNumber((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={pageNumber >= totalPages || usersLoading}
              className={`p-2 rounded-lg border border-(--color-border) transition-all ${pageNumber >= totalPages || usersLoading
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-gray-50 dark:bg-gray-700 text-(--color-text) hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default UsersPage;
