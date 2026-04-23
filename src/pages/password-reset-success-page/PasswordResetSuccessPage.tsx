import { Link } from 'react-router';
import { CheckCircle } from 'lucide-react';

export default function PasswordResetSuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>

                    <h1 className="text-gray-900 dark:text-white mb-2">Password Reset Successful</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Your password has been successfully reset. You can now log in with your new password.
                    </p>

                    <Link
                        to="/login"
                        className="inline-block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Continue to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}