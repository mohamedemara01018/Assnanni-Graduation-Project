import { useState } from 'react';
import {  useNavigate } from 'react-router';
import {
  Calendar,
  Clock,
  CheckCircle,
  User,
  Star,
  Briefcase,
  Building2,
  FileText,
  ArrowLeft,

} from 'lucide-react';
import DashboardLayout from '@/components/dashboard-layout/DashboardLayout';


export default function AppointmentBookingPage() {

  const doctors = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: ['Cardiology', 'Internal Medicine'],
      experience: 12,
      rating: 4.8,
      reviewCount: 245,
      clinic: 'Heart Care Medical Center',
      location: 'New York, NY',
      gender: 'Female',
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      about: 'Board-certified cardiologist with over 12 years of experience in treating cardiovascular diseases.',
      education: 'MD from Harvard Medical School',
      languages: ['English', 'Spanish'],
      consultationFee: 150,
      availableSlots: [
        { date: '2025-12-12', times: ['09:00', '10:00', '14:00', '15:00'] },
        { date: '2025-12-13', times: ['09:00', '11:00', '14:00', '16:00'] },
        { date: '2025-12-14', times: ['10:00', '11:00', '15:00', '16:00'] }
      ]
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: ['Neurology'],
      experience: 15,
      rating: 4.9,
      reviewCount: 312,
      clinic: 'Brain & Spine Institute',
      location: 'Los Angeles, CA',
      gender: 'Male',
      availability: 'busy',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
      about: 'Renowned neurologist specializing in brain disorders and neurodegenerative diseases.',
      education: 'MD from Stanford University',
      languages: ['English', 'Mandarin'],
      consultationFee: 180,
      availableSlots: [
        { date: '2025-12-15', times: ['10:00', '14:00'] },
        { date: '2025-12-16', times: ['09:00', '15:00'] }
      ]
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialization: ['Pediatrics', 'General Practice'],
      experience: 8,
      rating: 4.7,
      reviewCount: 189,
      clinic: 'Children\'s Health Clinic',
      location: 'Chicago, IL',
      gender: 'Female',
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
      about: 'Compassionate pediatrician dedicated to providing comprehensive care for children.',
      education: 'MD from Johns Hopkins University',
      languages: ['English', 'Spanish', 'Portuguese'],
      consultationFee: 120,
      availableSlots: [
        { date: '2025-12-12', times: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'] },
        { date: '2025-12-13', times: ['08:00', '09:00', '11:00', '14:00', '16:00'] }
      ]
    },
    {
      id: '4',
      name: 'Dr. James Williams',
      specialization: ['Orthopedics', 'Sports Medicine'],
      experience: 20,
      rating: 4.9,
      reviewCount: 428,
      clinic: 'Advanced Orthopedic Center',
      location: 'Houston, TX',
      gender: 'Male',
      availability: 'offline',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
      about: 'Expert orthopedic surgeon specializing in joint replacement and sports injuries.',
      education: 'MD from Yale School of Medicine',
      languages: ['English'],
      consultationFee: 200,
      availableSlots: [
        { date: '2025-12-17', times: ['09:00', '13:00', '15:00'] }
      ]
    },
    {
      id: '5',
      name: 'Dr. Aisha Patel',
      specialization: ['Dermatology', 'Cosmetic Surgery'],
      experience: 10,
      rating: 4.8,
      reviewCount: 267,
      clinic: 'Skin & Beauty Medical Center',
      location: 'San Francisco, CA',
      gender: 'Female',
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400',
      about: 'Skilled dermatologist offering advanced treatments for skin conditions and cosmetic procedures.',
      education: 'MD from Columbia University',
      languages: ['English', 'Hindi', 'Gujarati'],
      consultationFee: 140,
      availableSlots: [
        { date: '2025-12-12', times: ['10:00', '11:00', '13:00', '15:00', '16:00'] },
        { date: '2025-12-13', times: ['09:00', '10:00', '14:00', '15:00'] }
      ]
    },
    {
      id: '6',
      name: 'Dr. Robert Anderson',
      specialization: ['Radiology'],
      experience: 18,
      rating: 4.7,
      reviewCount: 198,
      clinic: 'Advanced Imaging Center',
      location: 'Boston, MA',
      gender: 'Male',
      availability: 'busy',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
      about: 'Expert radiologist with extensive experience in diagnostic imaging and AI-assisted analysis.',
      education: 'MD from University of Pennsylvania',
      languages: ['English', 'French'],
      consultationFee: 160,
      availableSlots: [
        { date: '2025-12-14', times: ['11:00', '15:00'] }
      ]
    }
  ];
  // const { doctorId } = useParams();
  const navigate = useNavigate();
  const doctor = doctors[0]
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');

  // Mock check for saved payment methods (in a real app, this would come from a context or API)
  const [hasSavedPaymentMethods] = useState(false);

  // Mock clinic data
  const clinic = {
    name: 'Assnani Heart Care Center',
    address: '123 Medical Plaza, Suite 302',
    city: 'New York, NY 10001',
    phone: '+1 (555) 100-2000',
    email: 'info@heartcare.assnani.com',
    website: 'www.heartcare.assnani.com',
    hours: 'Mon-Fri: 8:00 AM - 6:00 PM'
  };

  if (!doctor) return <div>Doctor not found</div>;

  const handleBooking = () => {
    setShowConfirmation(true);
    setTimeout(() => navigate('/dashboard/patient'), 2000);
  };

  if (showConfirmation) {
    return (
      <DashboardLayout pageTitle="Appointment Confirmed">
        <div className="flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl text-gray-900 dark:text-white mb-4">Appointment Confirmed!</h2>
            <div className="space-y-2 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your appointment with
              </p>
              <p className="text-base text-gray-900 dark:text-white font-medium">{doctor.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedDate} at {selectedTime}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Payment: <span className="font-medium">{paymentMethod === 'cash' ? 'Cash at Clinic' : 'Online Payment'}</span>
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                A confirmation email has been sent to your registered email address.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Book Appointment">
      <div >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Schedule Appointment</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Book your consultation with {doctor.name}
              </p>
            </div>

            {/* Appointment Type */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-base text-gray-900 dark:text-white font-medium mb-4">Appointment Type</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className={`p-4 rounded-lg border-2 transition-colors 'border-blue-600 bg-blue-50 dark:bg-blue-900/20`}
                >
                  <Building2 className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                  <p className="text-sm text-gray-900 dark:text-white font-medium">In-Person</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Visit clinic</p>
                </button>

              </div>
            </div>

            {/* Date Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-base text-gray-900 dark:text-white font-medium mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Select Date
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {doctor.availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedDate(slot.date);
                      setSelectedTime('');
                    }}
                    className={`p-3 rounded-lg border-2 transition-colors ${selectedDate === slot.date
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-400'
                      }`}
                  >
                    <Calendar className="w-5 h-5 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                    <p className="text-xs text-gray-900 dark:text-white font-medium">{slot.date}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-base text-gray-900 dark:text-white font-medium mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Select Time
                </h2>
                <div className="grid grid-cols-4 gap-3">
                  {doctor.availableSlots
                    .find(s => s.date === selectedDate)
                    ?.times.map((time, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg border-2 transition-colors ${selectedTime === time
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-blue-400'
                          }`}
                      >
                        <Clock className="w-4 h-4 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                        <p className="text-xs text-gray-900 dark:text-white font-medium">{time}</p>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Reason for Visit */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-base text-gray-900 dark:text-white font-medium mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Reason for Visit
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400"
                placeholder="Describe your symptoms or reason for consultation (optional)..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This information helps the doctor prepare for your appointment
              </p>
            </div>

            {/* Payment Method */}
            {/* <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-base text-gray-900 dark:text-white font-medium mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-lg border-2 transition-colors ${paymentMethod === 'cash'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-400'
                    }`}
                >
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                  <p className="text-sm text-gray-900 dark:text-white font-medium">Pay at Clinic</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cash payment</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('online')}
                  className={`p-4 rounded-lg border-2 transition-colors ${paymentMethod === 'online'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-400'
                    }`}
                >
                  <CreditCard className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                  <p className="text-sm text-gray-900 dark:text-white font-medium">Pay Online</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Card payment</p>
                </button>
              </div>

              {paymentMethod === 'cash' && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Payment of <span className="font-medium">${doctor.consultationFee}</span> will be completed at the clinic
                  </p>
                </div>
              )}

              {paymentMethod === 'online' && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  {hasSavedPaymentMethods ? (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Your saved payment method will be charged <span className="font-medium">${doctor.consultationFee}</span>
                    </p>
                  ) : (
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          No payment method saved.
                        </p>
                        <Link
                          to="/payment-methods"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Add payment method →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div> */}
          </div>

          {/* Sidebar - Doctor & Clinic Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Doctor Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <h2 className="text-sm text-gray-900 dark:text-white font-medium mb-4 flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                Doctor Details
              </h2>
              <div className="flex flex-col items-center mb-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-full border-2 border-blue-100 dark:border-blue-900 mb-3"
                />
                <h3 className="text-base text-gray-900 dark:text-white font-medium text-center">{doctor.name}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{doctor.specialization.join(', ')}</p>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-gray-700 dark:text-gray-300">{doctor.rating}</span>
                  </div>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <div className="flex items-center space-x-1">
                    <Briefcase className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{doctor.experience} exp</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Consultation Fee</span>
                  <span className="text-gray-900 dark:text-white font-medium">${doctor.consultationFee}</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-2">
                  {doctor.languages.map((lang) => (
                    <span key={lang} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <>
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-xs text-gray-900 dark:text-white font-medium mb-3 flex items-center">
                    <Building2 className="w-3 h-3 mr-1 text-blue-600 dark:text-blue-400" />
                    Clinic Location
                  </h3>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-900 dark:text-white font-medium">{clinic.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{clinic.address}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{clinic.city}</p>
                    <div className="flex items-center space-x-1 pt-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{clinic.hours}</span>
                    </div>
                  </div>
                </div>
              </>

              {/* Summary */}
              {selectedDate && selectedTime && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-xs text-gray-900 dark:text-white font-medium mb-3">Appointment Summary</h3>
                  <div className="space-y-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Date</span>
                      <span className="text-gray-900 dark:text-white font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Time</span>
                      <span className="text-gray-900 dark:text-white font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Type</span>
                      <span className="text-gray-900 dark:text-white font-medium capitalize">In-Person</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime || (paymentMethod === 'online' && !hasSavedPaymentMethods)}
                className="w-full mt-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-sm font-medium"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}