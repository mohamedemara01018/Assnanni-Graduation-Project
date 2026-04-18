import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            category: 'General',
            questions: [
                {
                    question: 'What is Assnani?',
                    answer: 'Assnani is a comprehensive healthcare management platform that connects patients with doctors, enables appointment booking, medical scan analysis, and provides secure access to medical records.'
                },
                {
                    question: 'How do I create an account?',
                    answer: 'Click on the "Register" button on the homepage, fill in your details, and verify your email address. Doctors will need to complete additional verification steps.'
                },
                {
                    question: 'Is my medical data secure?',
                    answer: 'Yes, we use industry-standard encryption and comply with healthcare data protection regulations to ensure your medical information is secure and private.'
                }
            ]
        },
        {
            category: 'Appointments',
            questions: [
                {
                    question: 'How do I book an appointment?',
                    answer: 'Browse our doctor listings, select a doctor, choose an available time slot, and confirm your appointment. You will receive a confirmation email.'
                },
                {
                    question: 'Can I cancel or reschedule an appointment?',
                    answer: 'Yes, you can cancel or reschedule appointments up to 24 hours before the scheduled time from your dashboard.'
                },
                {
                    question: 'What happens if I miss an appointment?',
                    answer: 'Please notify us as soon as possible. Repeated no-shows may result in restrictions on future bookings.'
                }
            ]
        },
        {
            category: 'Medical Scans',
            questions: [
                {
                    question: 'What types of scans can I upload?',
                    answer: 'You can upload X-rays, MRI scans, CT scans, and other medical imaging files. Our AI models support various formats including DICOM, JPEG, and PNG.'
                },
                {
                    question: 'How accurate is the AI analysis?',
                    answer: 'Our AI models have high accuracy rates (90%+) but should not replace professional medical diagnosis. Always consult with a qualified healthcare provider.'
                },
                {
                    question: 'How long does scan analysis take?',
                    answer: 'Most scans are analyzed within 2-5 minutes. Complex scans may take longer.'
                }
            ]
        },
        {
            category: 'Billing',
            questions: [
                {
                    question: 'What payment methods do you accept?',
                    answer: 'We accept all major credit cards, debit cards, and digital payment methods. Insurance billing is also supported.'
                },
                {
                    question: 'Can I get a receipt for my payment?',
                    answer: 'Yes, receipts are automatically generated and sent to your email after each payment. You can also download them from your billing history.'
                }
            ]
        }
    ];

    let globalIndex = 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Find answers to common questions about Assnani
                    </p>
                </div>

                <div className="space-y-8">
                    {faqs.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                            <h2 className="text-gray-900 dark:text-white mb-4">{category.category}</h2>
                            <div className="space-y-3">
                                {category.questions.map((faq) => {
                                    const currentIndex = globalIndex++;
                                    const isOpen = openIndex === currentIndex;

                                    return (
                                        <div
                                            key={currentIndex}
                                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                                        >
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? null : currentIndex)}
                                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                            >
                                                <span className="text-gray-900 dark:text-white pr-4">{faq.question}</span>
                                                {isOpen ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                                                )}
                                            </button>
                                            {isOpen && (
                                                <div className="px-6 pb-4">
                                                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <h3 className="text-blue-900 dark:text-blue-300 mb-2">Still have questions?</h3>
                    <p className="text-blue-700 dark:text-blue-400 mb-4">
                        Can't find the answer you're looking for? Please contact our support team.
                    </p>
                    <a
                        href="/support"
                        className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
