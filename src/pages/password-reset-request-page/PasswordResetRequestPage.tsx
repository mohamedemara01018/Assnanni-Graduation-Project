import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, ArrowLeft } from 'lucide-react';

export default function PasswordResetRequestPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock password reset request
        setIsSubmitted(true);
        setTimeout(() => {
            navigate('/password-reset/new');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-gray-900 dark:text-white mb-2">Reset Password</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Enter your email address and we'll send you instructions to reset your password
                    </p>
                </div>

                {!isSubmitted ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Send Reset Instructions
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link to="/login" className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Login</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-gray-900 dark:text-white mb-2">Check Your Email</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            We've sent password reset instructions to <span className="font-medium">{email}</span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Didn't receive the email? Check your spam folder or try again
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}