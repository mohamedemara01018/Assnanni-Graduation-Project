import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
    User, Mail, Phone, MapPin, Calendar, Shield, Building,
    FileText, Save, X, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard-layout/DashboardLayout';

export default function AddUserPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        // Personal Information
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',

        // Account Information
        role: 'patient',
        password: '',
        confirmPassword: '',

        // Contact & Address
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',

        // Professional Information (for doctors/staff)
        specialty: '',
        licenseNumber: '',
        experience: '',
        qualification: '',
        department: '',

        // Additional
        emergencyContact: '',
        emergencyPhone: '',
        notes: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Required fields validation
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
            newErrors.phone = 'Invalid phone format';
        }
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Role-specific validation
        if (formData.role === 'doctor' || formData.role === 'student-doctor') {
            if (!formData.specialty.trim()) newErrors.specialty = 'Specialty is required';
            if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
            if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';
        }

        if (formData.role === 'receptionist') {
            if (!formData.department.trim()) newErrors.department = 'Department is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Creating user with data:', formData);
            setIsSubmitting(false);
            navigate('/users');
        }, 1500);
    };

    const handleCancel = () => {
        navigate('/users');
    };

    const isProfessionalRole = formData.role === 'doctor' || formData.role === 'student-doctor' || formData.role === 'receptionist';

    return (
        <DashboardLayout pageTitle="Add New User">

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl text-gray-900 dark:text-white mb-2">Add New User</h2>
                        <p className="text-gray-600 dark:text-gray-400">Create a new user account for the platform</p>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.firstName
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                placeholder="Enter first name"
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    {errors.firstName}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.lastName
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                placeholder="Enter last name"
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    {errors.lastName}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.email
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                    placeholder="email@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.phone
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.dateOfBirth
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                />
                            </div>
                            {errors.dateOfBirth && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    {errors.dateOfBirth}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.gender
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                            {errors.gender && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    {errors.gender}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Information */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                User Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                                <option value="student-doctor">Student Doctor</option>
                                <option value="receptionist">Receptionist</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.password
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.confirmPassword
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                placeholder="Re-enter password"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Address Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Street Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="123 Main Street"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="New York"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                State/Province
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="NY"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ZIP/Postal Code
                            </label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="10001"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Country
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="United States"
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Information - Only for doctors and staff */}
                {isProfessionalRole && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Professional Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(formData.role === 'doctor' || formData.role === 'student-doctor') && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Specialty <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="specialty"
                                            value={formData.specialty}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.specialty
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                            placeholder="e.g., Cardiology"
                                        />
                                        {errors.specialty && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.specialty}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            License Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="licenseNumber"
                                            value={formData.licenseNumber}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.licenseNumber
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                            placeholder="Enter license number"
                                        />
                                        {errors.licenseNumber && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.licenseNumber}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Years of Experience
                                        </label>
                                        <input
                                            type="number"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="5"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Qualification <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="qualification"
                                            value={formData.qualification}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.qualification
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                            placeholder="e.g., MD, MBBS"
                                        />
                                        {errors.qualification && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.qualification}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            {formData.role === 'receptionist' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Department <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.department
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                        placeholder="e.g., Front Desk"
                                    />
                                    {errors.department && (
                                        <p className="mt-1 text-sm text-red-500 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {errors.department}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Emergency Contact */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Emergency Contact</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Emergency Contact Name
                            </label>
                            <input
                                type="text"
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="Full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Emergency Contact Phone
                            </label>
                            <input
                                type="tel"
                                name="emergencyPhone"
                                value={formData.emergencyPhone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Notes */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Notes</h3>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                            placeholder="Any additional information or notes..."
                        />
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Creating...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                <span>Create User</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
