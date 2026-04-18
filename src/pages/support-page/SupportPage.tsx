import { useState } from 'react';
import { Mail, Phone, MessageSquare, Send } from 'lucide-react';


export default function SupportPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock form submission
        alert('Support request submitted successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 ">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-gray-900 dark:text-white mb-4">Support Center</h1>
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
                        <h3 className="text-gray-900 dark:text-white mb-2">Email Support</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Get help via email within 24 hours
                        </p>
                        <a href="mailto:support@assnani.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                            support@assnani.com
                        </a>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-gray-900 dark:text-white mb-2">Phone Support</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Mon-Fri, 9 AM - 6 PM EST
                        </p>
                        <a href="tel:+15551234567" className="text-green-600 dark:text-green-400 hover:underline">
                            +1 (555) 123-4567
                        </a>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-gray-900 dark:text-white mb-2">Live Chat</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Chat with our support team
                        </p>
                        <button className="text-purple-600 dark:text-purple-400 hover:underline">
                            Start Chat
                        </button>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
                        <h2 className="text-gray-900 dark:text-white mb-6">Send us a message</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                                    Subject
                                </label>
                                <input
                                    id="subject"
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    required
                                    rows={6}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Please describe your issue or question..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Send className="w-5 h-5" />
                                <span>Send Message</span>
                            </button>
                        </form>
                    </div>

                    {/* Additional Resources */}
                    <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                        <h3 className="text-blue-900 dark:text-blue-300 mb-3">Looking for quick answers?</h3>
                        <p className="text-blue-700 dark:text-blue-400 mb-4">
                            Check out our FAQ page for answers to common questions.
                        </p>
                        <a
                            href="/faq"
                            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Visit FAQ
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
