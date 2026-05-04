import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { supervisor } from "@/constants/studentConstants";
import { useState } from "react";
import { FaPaperPlane, FaPhone, FaEnvelope } from "react-icons/fa6";
import { toast } from "react-toastify";

const ContactSupervisor = () => {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !subject) {
      toast.error("Please fill in all fields");
      return;
    }
    // Simulation of sending message
    toast.success("Message sent to supervisor successfully!");
    setMessage("");
    setSubject("");
  };

  return (
    <DashboardLayout pageTitle="Contact Supervisor">
      <div className="-mt-6 -ml-6 bg-(--color-bg) rounded-2xl min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-(--color-text) mb-2">
            Contact Supervisor
          </h1>
          <p className="text-(--color-text-light) mb-8">
            Send a message or inquiry to your assigned supervisor.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Supervisor Info Card */}
            <div className="md:col-span-1">
              <div className="bg-(--color-surface) rounded-2xl p-6 shadow-sm border border-(--color-border)">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={supervisor.imageUrl}
                    alt={supervisor.name}
                    className="w-24 h-24 rounded-full border-4 border-blue-50 mb-4 object-cover"
                  />
                  <h2 className="text-xl font-bold text-(--color-text)">
                    {supervisor.name}
                  </h2>
                  <p className="text-sm text-blue-600 font-medium mb-6">
                    {supervisor.specialty}
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-(--color-border)">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                      <FaEnvelope />
                    </div>
                    <span className="text-(--color-text-light) truncate">
                      {supervisor.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-green-50 p-2 rounded-lg text-green-600">
                      <FaPhone />
                    </div>
                    <span className="text-(--color-text-light)">
                      {supervisor.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Form */}
            <div className="md:col-span-2">
              <div className="bg-(--color-surface) rounded-2xl p-8 shadow-sm border border-(--color-border)">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      className="block text-sm font-bold text-(--color-text) mb-2"
                      htmlFor="subject"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Question about Case Study #42"
                      className="w-full bg-(--color-bg) border border-(--color-border) rounded-xl px-4 py-3 text-(--color-text) focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-bold text-(--color-text) mb-2"
                      htmlFor="message"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full bg-(--color-bg) border border-(--color-border) rounded-xl px-4 py-3 text-(--color-text) focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-blue-200 transition-all transform active:scale-95"
                  >
                    <FaPaperPlane />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContactSupervisor;
