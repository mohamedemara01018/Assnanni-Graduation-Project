import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useParams, useNavigate } from "react-router";
import {
  IoArrowBack,
  IoPersonOutline,
  IoCalendarOutline,
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoWaterOutline,
  IoAlertCircleOutline,
  IoMedicalOutline,
  IoPinOutline,
  IoTimeOutline,
} from "react-icons/io5";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data based on images
  const patient = {
    id: id || "1",
    name: "Sarah Johnson",
    age: 34,
    gender: "Female",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@email.com",
    address: "123 Main Street, New York, NY 10001",
    bloodType: "O+",
    emergencyContact: {
      name: "John Johnson",
      relationship: "Spouse",
      phone: "+1 (555) 987-6543",
    },
    allergies: ["Penicillin", "Peanuts"],
    medicalHistory: [
      { condition: "Hypertension", date: "2022-03-15", status: "Ongoing" },
      { condition: "Type 2 Diabetes", date: "2023-06-20", status: "Ongoing" },
    ],
    prescriptions: [
      {
        name: "Lisinopril 10mg",
        frequency: "Once daily",
        prescribedBy: "Dr. Michael Chen",
        date: "2024-01-15",
      },
      {
        name: "Metformin 500mg",
        frequency: "Twice daily",
        prescribedBy: "Dr. Sarah Williams",
        date: "2024-01-10",
      },
    ],
    appointments: [
      {
        type: "General Checkup",
        doctor: "Dr. Michael Chen",
        date: "2024-01-15",
        status: "Completed",
      },
      {
        type: "Follow-up",
        doctor: "Dr. Sarah Williams",
        date: "2024-01-20",
        status: "Completed",
      },
    ],
  };

  return (
    <DashboardLayout pageTitle="Patient Information">
      <div className="-mt-6 p-6 bg-(--color-bg) min-h-[85vh] rounded-2xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-(--color-text-light) hover:text-(--color-text) transition-colors mb-4 cursor-pointer"
          >
            <IoArrowBack />
            <span>Back</span>
          </button>
          <h1 className="text-2xl text-(--color-text) font-bold">
            Patient Information
          </h1>
          <p className="text-sm text-(--color-text-light) mt-1 font-medium">
            Patient ID: {patient.id}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Details */}
          <div className="lg:col-span-1">
            <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 shadow-sm">
              <h2 className="text-sm font-bold text-(--color-text) mb-6">
                Personal Details
              </h2>

              <div className="space-y-6">
                <DetailItem
                  icon={<IoPersonOutline />}
                  label="Full Name"
                  value={patient.name}
                />
                <DetailItem
                  icon={<IoCalendarOutline />}
                  label="Age / Gender"
                  value={`${patient.age} years / ${patient.gender}`}
                />
                <DetailItem
                  icon={<IoCallOutline />}
                  label="Phone"
                  value={patient.phone}
                />
                <DetailItem
                  icon={<IoMailOutline />}
                  label="Email"
                  value={patient.email}
                />
                <DetailItem
                  icon={<IoLocationOutline />}
                  label="Address"
                  value={patient.address}
                />
                <DetailItem
                  icon={<IoWaterOutline />}
                  label="Blood Type"
                  value={patient.bloodType}
                />

                <div className="pt-4 border-t border-(--color-border)">
                  <h3 className="text-xs font-bold text-(--color-text-light) uppercase tracking-wider mb-4">
                    Emergency Contact
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-(--color-text)">
                      {patient.emergencyContact.name}
                    </p>
                    <p className="text-xs text-(--color-text-light)">
                      {patient.emergencyContact.relationship}
                    </p>
                    <p className="text-xs text-(--color-text-light)">
                      {patient.emergencyContact.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Medical Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Allergies */}
            <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <IoAlertCircleOutline className="text-red-500 text-xl" />
                <h2 className="text-sm font-bold text-(--color-text)">
                  Allergies
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy, i) => (
                  <span
                    key={i}
                    className="px-4 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>

            {/* Medical History */}
            <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <IoMedicalOutline className="text-blue-500 text-xl" />
                <h2 className="text-sm font-bold text-(--color-text)">
                  Medical History
                </h2>
              </div>
              <div className="space-y-3">
                {patient.medicalHistory.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl flex justify-between items-center border border-border/50"
                  >
                    <div>
                      <p className="text-sm font-bold text-(--color-text)">
                        {item.condition}
                      </p>
                      <p className="text-xs text-(--color-text-light) mt-1">
                        Diagnosed: {item.date}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Prescriptions */}
            <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <IoPinOutline className="text-green-500 text-xl" />
                <h2 className="text-sm font-bold text-(--color-text)">
                  Current Prescriptions
                </h2>
              </div>
              <div className="space-y-3">
                {patient.prescriptions.map((pill, i) => (
                  <div
                    key={i}
                    className="p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-border/50"
                  >
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-bold text-(--color-text)">
                        {pill.name}
                      </p>
                      <span className="text-xs font-medium text-(--color-text-light)">
                        {pill.frequency}
                      </span>
                    </div>
                    <p className="text-xs text-(--color-text-light)">
                      Prescribed by{" "}
                      <span className="text-(--color-text) font-semibold">
                        {pill.prescribedBy}
                      </span>{" "}
                      on {pill.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <IoTimeOutline className="text-purple-500 text-xl" />
                <h2 className="text-sm font-bold text-(--color-text)">
                  Recent Appointments
                </h2>
              </div>
              <div className="space-y-3">
                {patient.appointments.map((app, i) => (
                  <div
                    key={i}
                    className="p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl flex justify-between items-center border border-border/50"
                  >
                    <div>
                      <p className="text-sm font-bold text-(--color-text)">
                        {app.type}
                      </p>
                      <p className="text-xs text-(--color-text-light) mt-1">
                        {app.doctor} • {app.date}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex gap-4 items-start">
    <div className="mt-1 text-gray-400 text-lg">{icon}</div>
    <div>
      <p className="text-xs text-(--color-text-light) font-medium mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-(--color-text)">{value}</p>
    </div>
  </div>
);

export default PatientDetails;
