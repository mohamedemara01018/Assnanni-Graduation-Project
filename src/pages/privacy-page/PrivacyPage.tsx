

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
                    <h1 className="text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                        Last updated: January 1, 2024
                    </p>

                    <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                        <section>
                            <h2 className="text-gray-900 dark:text-white mb-3">1. Information We Collect</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                We collect several types of information to provide and improve our services:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-1">
                                <li>Personal information (name, email, phone number, address)</li>
                                <li>Medical information (health records, scan images, prescriptions)</li>
                                <li>Usage data (how you interact with our platform)</li>
                                <li>Device information (IP address, browser type, operating system)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-gray-900 dark:text-white mb-3">2. How We Use Your Information</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                We use the collected information for various purposes:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-1">
                                <li>To provide and maintain our services</li>
                                <li>To facilitate appointment booking and management</li>
                                <li>To process medical scan analysis</li>
                                <li>To communicate with you about your appointments and health records</li>
                                <li>To improve our AI models and services</li>
                                <li>To detect and prevent fraud</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-gray-900 dark:text-white mb-3">3. Data Security</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                We implement industry-standard security measures to protect your personal and medical information. All data is encrypted both in transit and at rest. We comply with healthcare data protection regulations including HIPAA and GDPR.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-gray-900 dark:text-white mb-3">4. Data Sharing</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                We do not sell your personal information. We may share your information only in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-1">
                                <li>With healthcare providers involved in your care</li>
                                <li>With your explicit consent</li>
                                <li>To comply with legal obligations</li>
                                <li>To protect our rights and prevent fraud</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-gray-900 dark:text-white mb-3">5. Your Rights</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                You have the right to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-1">
                                <li>Access your personal and medical information</li>
                                <li>Request correction of inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Object to processing of your data</li>
                                <li>Export your data in a portable format</li>
                                <li>Withdraw consent at any time</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-gray-900 dark:text-white mb-3">6. Medical Records Retention</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                We retain medical records in accordance with applicable healthcare regulations. Even if you delete your account, certain medical records may be retained for legal and regulatory compliance.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-gray-900 dark:text-white mb-3">7. Cookies and Tracking</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-gray-900 dark:text-white mb-3">8. Third-Party Services</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Our platform may contain links to third-party services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-gray-900 dark:text-white mb-3">9. Children's Privacy</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent and believe your child has provided us with personal information, please contact us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-gray-900 dark:text-white mb-3">10. Changes to This Privacy Policy</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-gray-900 dark:text-white mb-3">11. Contact Us</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                If you have any questions about this Privacy Policy, please contact us at privacy@assnani.com or visit our support page.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
