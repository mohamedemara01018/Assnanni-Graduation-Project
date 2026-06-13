import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Phone, MessageSquare, Send, Loader2 } from 'lucide-react';
import type { AppDispatch, RootState } from "@/store/store"; // Adjust path to your actual store configuration
import { selectSupportTicketsState } from '@/store/slices/support-slice/support-tickets-slice/supportTicketsSlice';
import { createSupportTicket, resetSupportTicketState } from '@/store/slices/support-slice/create-support-ticket-slice/createSupportTicketSlice';
import { toast } from 'react-toastify';
import DashboardLayout from '@/components/dashboard-layout/DashboardLayout';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';


export default function SupportPage() {
    const role = useSelector((state: RootState) => state.auth.role)
    return role == 'guest' ? (
        <>
            <Header />
            <main className="flex-1 w-full mt-23">
                < View />
            </main>
            <Footer />
        </>
    ) : <DashboardLayout pageTitle='Support'><View /></DashboardLayout>

}


function View() {
    const dispatch = useDispatch<AppDispatch>();

    // Select Redux global state indicators
    const { loading, success, error } = useSelector(selectSupportTicketsState);

    // Initial component input control fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    // Handle asynchronous feedback side-effects (Success notifications & context cleanup)
    useEffect(() => {
        if (success) {
            alert('Support request submitted successfully!');
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({ name: '', email: '', subject: '', message: '' });
            dispatch(resetSupportTicketState());
        }
    }, [success, dispatch]);

    // Clean state variables when navigating away from the screen
    useEffect(() => {
        return () => {
            dispatch(resetSupportTicketState());
        };
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        try {
            const responseMessage = await dispatch(createSupportTicket({
                fullName: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message
            })).unwrap();
            toast.success(responseMessage || 'Support request submitted successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' });

        } catch (rejectedValueOrError: any) {
            toast.error(rejectedValueOrError || 'Something went wrong');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-gray-900 dark:text-white mb-4 text-4xl font-bold">Support Center</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Need help? We're here to assist you
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Contact Methods */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-gray-900 dark:text-white mb-2 font-semibold">Email Support</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Get help via email within 24 hours
                        </p>
                        <a href="mailto:mohamed.fullstack.eng@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                            mohamed.fullstack.eng@gmail.com
                        </a>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-gray-900 dark:text-white mb-2 font-semibold">Phone Support</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Mon-Fri, 9 AM - 6 PM EST
                        </p>
                        <a href="tel:+201018759812" className="text-green-600 dark:text-green-400 hover:underline">
                            +20 (101) 875-9812
                        </a>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-gray-900 dark:text-white mb-2 font-semibold">Live Chat</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Chat with our chapbot
                        </p>
                        <button
                            type="button"
                            onClick={() => window.dispatchEvent(new CustomEvent("open-chatbot"))}
                            className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer font-medium"
                        >
                            Start Chat
                        </button>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h2>

                        {/* Visual error message banner component display if API fails */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        disabled={loading}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        disabled={loading}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Subject
                                </label>
                                <input
                                    id="subject"
                                    type="text"
                                    required
                                    disabled={loading}
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    required
                                    disabled={loading}
                                    rows={6}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-60"
                                    placeholder="Please describe your issue or question..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Additional Resources */}
                    <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                        <h3 className="text-blue-900 dark:text-blue-300 mb-3 font-semibold">Looking for quick answers?</h3>
                        <p className="text-blue-700 dark:text-blue-400 mb-4 text-sm">
                            Check out our FAQ page for answers to common questions.
                        </p>
                        <a
                            href="/faq"
                            className="inline-block px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Visit FAQ
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}