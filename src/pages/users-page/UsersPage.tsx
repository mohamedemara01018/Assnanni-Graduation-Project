import DashboardLayout from "@/components/dashboard-layout/DashboardLayout"
import { AlertCircle, Ban, Calendar, CheckCircle, Edit, Eye, Filter, Mail, MapPin, MoreVertical, Phone, Search, Shield, UserPlus, XCircle } from "lucide-react"
import { useState } from "react";
import { Link } from "react-router"

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'patient' | 'doctor' | 'student-doctor' | 'receptionist' | 'admin';
    status: 'active' | 'suspended' | 'pending';
    joinedDate: string;
    lastActive: string;
    location?: string;
    specialty?: string;
    verified: boolean;
    avatar?: string;
}


function UsersPage() {


    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'patient' | 'doctor' | 'student-doctor' | 'receptionist' | 'admin'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);


    // Mock users data
    const users: User[] = [
        {
            id: '1',
            name: 'Dr. Emily Chen',
            email: 'emily.chen@assnani.com',
            phone: '+1 (555) 123-4567',
            role: 'doctor',
            status: 'active',
            joinedDate: '2024-01-15',
            lastActive: '2 hours ago',
            location: 'New York, NY',
            specialty: 'Cardiologist',
            verified: true
        },
        {
            id: '2',
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+1 (555) 234-5678',
            role: 'patient',
            status: 'active',
            joinedDate: '2024-03-20',
            lastActive: '1 day ago',
            location: 'Los Angeles, CA',
            verified: true
        },
        {
            id: '3',
            name: 'Dr. Michael Brown',
            email: 'michael.brown@assnani.com',
            phone: '+1 (555) 345-6789',
            role: 'student-doctor',
            status: 'active',
            joinedDate: '2024-02-10',
            lastActive: '5 hours ago',
            location: 'Chicago, IL',
            specialty: 'Neurologist',
            verified: true
        },
        {
            id: '4',
            name: 'Sarah Williams',
            email: 'sarah.williams@assnani.com',
            phone: '+1 (555) 456-7890',
            role: 'receptionist',
            status: 'active',
            joinedDate: '2024-01-05',
            lastActive: '30 minutes ago',
            location: 'Houston, TX',
            verified: true
        },
        {
            id: '5',
            name: 'Jane Smith',
            email: 'jane.smith@email.com',
            phone: '+1 (555) 567-8901',
            role: 'patient',
            status: 'active',
            joinedDate: '2024-04-01',
            lastActive: '3 days ago',
            location: 'Phoenix, AZ',
            verified: true
        },
        {
            id: '6',
            name: 'Dr. James Anderson',
            email: 'james.anderson@assnani.com',
            phone: '+1 (555) 678-9012',
            role: 'doctor',
            status: 'suspended',
            joinedDate: '2023-11-20',
            lastActive: '1 week ago',
            location: 'Philadelphia, PA',
            specialty: 'Orthopedic Surgeon',
            verified: true
        },
        {
            id: '7',
            name: 'Dr. Patricia Martinez',
            email: 'patricia.martinez@assnani.com',
            phone: '+1 (555) 789-0123',
            role: 'doctor',
            status: 'pending',
            joinedDate: '2024-04-15',
            lastActive: '1 hour ago',
            location: 'San Antonio, TX',
            specialty: 'Dermatologist',
            verified: false
        },
        {
            id: '8',
            name: 'Robert Johnson',
            email: 'robert.johnson@email.com',
            phone: '+1 (555) 890-1234',
            role: 'patient',
            status: 'active',
            joinedDate: '2024-02-28',
            lastActive: '2 days ago',
            location: 'San Diego, CA',
            verified: true
        },
        {
            id: '9',
            name: 'Lisa Davis',
            email: 'lisa.davis@assnani.com',
            phone: '+1 (555) 901-2345',
            role: 'receptionist',
            status: 'active',
            joinedDate: '2024-03-10',
            lastActive: '1 hour ago',
            location: 'Dallas, TX',
            verified: true
        },
        {
            id: '10',
            name: 'Dr. David Wilson',
            email: 'david.wilson@assnani.com',
            phone: '+1 (555) 012-3456',
            role: 'student-doctor',
            status: 'active',
            joinedDate: '2024-01-25',
            lastActive: '4 hours ago',
            location: 'San Jose, CA',
            specialty: 'Pediatrics',
            verified: true
        },
    ];


    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery);
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            case 'doctor': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
            case 'student-doctor': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
            case 'receptionist': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            case 'suspended': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
        }
    };


    const handleSuspendUser = (userId: string) => {
        console.log('Suspending user:', userId);
        setShowActionsMenu(null);
    };

    const handleActivateUser = (userId: string) => {
        console.log('Activating user:', userId);
        setShowActionsMenu(null);
    };

    const handleViewDetails = (user: User) => {
        setSelectedUser(user);
        setShowDetailModal(true);
        setShowActionsMenu(null);
    };

    const handleEditUser = (userId: string) => {
        console.log('Editing user:', userId);
        setShowActionsMenu(null);
    };

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
                    <p className="text-2xl ">1</p>
                </div>
                <div className="bg-(--color-surface) rounded-xl p-4 border border-(--color-border)">
                    <p className="text-xs text-(--color-text-light) mb-1">Patients</p>
                    <p className="text-2xl ">1</p>
                </div>
                <div className="bg-(--color-surface) rounded-xl p-4 border border-(--color-border)">
                    <p className="text-xs text-(--color-text-light) mb-1">Doctors</p>
                    <p className="text-2xl ">1</p>
                </div>
                <div className="bg-(--color-surface) rounded-xl p-4 border border-(--color-border)">
                    <p className="text-xs text-(--color-text-light) mb-1">Students</p>
                    <p className="text-2xl ">1</p>
                </div>
                <div className="bg-(--color-surface) rounded-xl p-4 border border-(--color-border)">
                    <p className="text-xs text-(--color-text-light) mb-1">Staff</p>
                    <p className="text-2xl ">1</p>
                </div>
                <div className="bg-(--color-surface) rounded-xl p-4 border border-(--color-border)">
                    <p className="text-xs text-(--color-text-light) mb-1">Active</p>
                    <p className="text-2xl text-green-600 dark:text-green-400">1</p>
                </div>
                <div className="bg-(--color-surface) rounded-xl p-4 border border-(--color-border)">
                    <p className="text-xs text-(--color-text-light) mb-1">Suspended</p>
                    <p className="text-2xl text-red-600 dark:text-red-400">1</p>
                </div>
                <div className="bg-(--color-surface) rounded-xl p-4 border border-(--color-border)">
                    <p className="text-xs text-(--color-text-light) mb-1">Pending</p>
                    <p className="text-2xl text-yellow-600 dark:text-yellow-400">1</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-(--color-surface) rounded-xl border border-(--color-border) p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-(--color-text-light)" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg  placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--color-text-blue)"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center space-x-3">
                        <Filter className="w-5 h-5 text-(--color-text-light)" />
                        <select
                            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-(--color-border) rounded-lg  focus:outline-none focus:ring-2 focus:ring-(--color-text-blue)"
                        >
                            <option value="all">All Roles</option>
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                            <option value="student-doctor">Student Doctor</option>
                            <option value="receptionist">Receptionist</option>
                            <option value="admin">Admin</option>
                        </select>
                        <select
                            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-(--color-border) rounded-lg  focus:outline-none focus:ring-2 focus:ring-(--color-text-blue)"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>



                </div>

            </div>


            {/* Users Table */}
            <div className="bg-(--color-surface) rounded-xl border border-(--color-border) overflow-hidden">
                {filteredUsers.length === 0 ? (
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
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-(--color-text-light) uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-(--color-text-light) uppercase tracking-wider">
                                        Last Active
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs text-(--color-text-light) uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-green-500 rounded-full flex items-center justify-center text-white shrink-0">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <p className="text-sm font-medium">{user.name}</p>
                                                        {user.verified && (
                                                            <CheckCircle className="w-4 h-4 text-(--color-text-blue)" />
                                                        )}
                                                    </div>
                                                    {user.specialty && (
                                                        <p className="text-xs text-(--color-text-light)">{user.specialty}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col space-y-1">
                                                <div className="flex items-center space-x-2 text-(--color-text-light)">
                                                    <Mail className="w-3 h-3" />
                                                    <span className="text-xs truncate max-w-[200px]">{user.email}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-(--color-text-light)">
                                                    <Phone className="w-3 h-3" />
                                                    <span className="text-xs">{user.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center space-x-1 ${getRoleBadgeColor(user.role)}`}>
                                                <Shield className="w-3 h-3" />
                                                <span className="capitalize">{user.role.replace('-', ' ')}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2 text-sm text-(--color-text-light)">
                                                <Calendar className="w-3 h-3" />
                                                <span className="text-xs">{new Date(user.joinedDate).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-(--color-text-light)">{user.lastActive}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleViewDetails(user)}
                                                    className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditUser(user.id)}
                                                    className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                                    title="Edit User"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setShowActionsMenu(showActionsMenu === user.id ? null : user.id)}
                                                        className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                    {showActionsMenu === user.id && (
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
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default UsersPage