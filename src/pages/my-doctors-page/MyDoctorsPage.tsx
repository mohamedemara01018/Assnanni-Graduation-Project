import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
    Star, MessageSquare, Phone, MapPin,
    Stethoscope, Award, Globe, Mail, Clock,
    ChevronRight, User, Search, CalendarCheck,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard-layout/DashboardLayout';
import { GiveFeedbackModal } from '@/components/give-feedback-modal/GiveFeedbackModal';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import {
    myDoctorsState,
    fetchMyDoctors,
    type MyDoctor,
} from '@/store/slices/patient-slice/my-doctors-slice/myDoctorsSlice';
import Pagination from '@/components/pagination/Pagination';
import MiniLoading from '@/components/mini-loading/MiniLoading';
import Error from '@/components/error/Error';
import { NotFound } from '@/components/notfound/NotFound';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function InfoPill({ icon: Icon, value }: { icon: any; value?: string | null }) {
    if (!value) return null;
    return (
        <span className="inline-flex items-center gap-1 text-[11px] text-(--color-text-light) bg-(--color-bg) border border-(--color-border) rounded-md px-2 py-0.5">
            <Icon className="w-3 h-3 shrink-0" />
            {value}
        </span>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MyDoctorsPage() {
    const [search, setSearch] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedDoctor, setSelectedDoctor] = useState<MyDoctor | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const dispatch: AppDispatch = useDispatch();
    const { data, loading, error } = useSelector(myDoctorsState);

    useEffect(() => {
        dispatch(fetchMyDoctors({ search, pageNumber, pageSize }));
    }, [dispatch, search, pageNumber, pageSize]);

    const openFeedback = (doctor: MyDoctor) => {
        setSelectedDoctor(doctor);
        setShowFeedback(true);
    };

    const closeFeedback = () => {
        setShowFeedback(false);
        setSelectedDoctor(null);
    };

    return (
        <DashboardLayout pageTitle="My Doctors">
            <div className="space-y-5">

                {/* ── Header ────────────────────────────────────────────────── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-(--color-text)">My Doctors</h1>
                        <p className="text-sm text-(--color-text-light) mt-0.5">
                            Healthcare professionals you've consulted with
                        </p>
                    </div>
                    {!loading && !error && (
                        <span className="text-xs text-(--color-text-light) bg-(--color-bg) border border-(--color-border) rounded-lg px-3 py-1.5">
                            <span className="font-semibold text-(--color-text)">{data.totalCount}</span> doctor{data.totalCount !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {/* ── Search bar ────────────────────────────────────────────── */}
                <div
                    className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4"
                    style={{ boxShadow: 'var(--shadow)' }}
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-light)" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPageNumber(1); }}
                            placeholder="Search by name, specialty, or clinic…"
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text) text-sm placeholder:text-(--color-text-light) outline-none focus:border-(--color-primary) transition-colors"
                        />
                    </div>
                </div>

                {/* ── Content ───────────────────────────────────────────────── */}
                {loading ? (
                    <div className="py-10"><MiniLoading message="Loading your doctors…" /></div>
                ) : error ? (
                    <Error message={error} />
                ) : data.items?.length === 0 ? (
                    // ── Empty state ────────────────────────────────────────

                    <NotFound
                        message={search ? "No reviews match your filters" : "No feedback yet"}
                        subMessage={
                            search
                                ? "Try different keywords or clear filters"
                                : "Your reviews will appear here after completing appointments"
                        }
                        resetLabel="Clear filters"
                    />

                    // <div
                    //     className="flex flex-col items-center justify-center rounded-2xl border border-(--color-border) bg-(--color-surface) py-16 px-8 text-center"
                    //     style={{ boxShadow: 'var(--shadow)' }}
                    // >
                    //     <div className="w-14 h-14 rounded-2xl bg-(--color-bg) border border-(--color-border) flex items-center justify-center mb-4">
                    //         <Stethoscope className="w-6 h-6 text-(--color-text-light)" />
                    //     </div>
                    //     <p className="text-sm font-medium text-(--color-text) mb-1">No doctors found</p>
                    //     <p className="text-xs text-(--color-text-light) mb-5">
                    //         {search ? 'Try adjusting your search' : "You haven't consulted with any doctors yet"}
                    //     </p>
                    //     {!search && (
                    //         <Link
                    //             to="/doctors-list"
                    //             className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-(--color-primary) text-white text-xs font-medium hover:bg-(--color-primary-dark) transition-colors"
                    //         >
                    //             Find a Doctor
                    //         </Link>
                    //     )}
                    // </div>
                ) : (
                    <>
                        {/* ── Doctors grid ──────────────────────────────────── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {data.items?.map((doctor) => (
                                <DoctorCard
                                    key={doctor.doctorId}
                                    doctor={doctor}
                                    onFeedback={() => openFeedback(doctor)}
                                />
                            ))}
                        </div>

                        {/* ── Pagination ─────────────────────────────────────── */}
                        <Pagination
                            pageNumber={data.pageNumber}
                            pageSize={data.pageSize}
                            totalItems={data.totalCount}
                            onPageChange={(p) => setPageNumber(p)}
                            onPageSizeChange={(s) => { setPageSize(s); setPageNumber(1); }}
                        />
                    </>
                )}
            </div>

            {/* ── Feedback modal ─────────────────────────────────────────────── */}
            {
                selectedDoctor && (
                    <GiveFeedbackModal
                        isOpen={showFeedback}
                        onClose={closeFeedback}
                        doctor={{
                            id: String(selectedDoctor.doctorId),
                            name: selectedDoctor.name,
                            specialty: selectedDoctor.specialization,
                            image: selectedDoctor.imageUrl,
                        }}
                        onSubmit={(feedback) => {
                            console.log('Feedback submitted:', feedback);
                            closeFeedback();
                        }}
                    />
                )
            }
        </DashboardLayout >
    );
}

// ── Doctor card ───────────────────────────────────────────────────────────────

function DoctorCard({ doctor, onFeedback }: { doctor: MyDoctor; onFeedback: () => void }) {
    const lastFeedback = doctor.feedbacks?.[0] ?? null;
    const hasPrescriptions = doctor.prescriptions?.length > 0;

    return (
        <div
            className="group flex flex-col rounded-2xl border border-(--color-border) bg-(--color-surface) overflow-hidden transition-all duration-200 hover:border-(--color-primary)/30 hover:shadow-md"
            style={{ boxShadow: 'var(--shadow)' }}
        >
            {/* ── Top section ──────────────────────────────────────────────── */}
            <div className="p-5 flex items-start gap-4">
                {/* Avatar */}
                <div className="relative shrink-0">
                    {doctor.imageUrl ? (
                        <img
                            src={doctor.imageUrl}
                            alt={doctor.name}
                            className="w-16 h-16 rounded-xl object-cover ring-2 ring-(--color-border)"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-xl bg-(--color-bg-blue) border border-(--color-primary)/20 flex items-center justify-center">
                            <User className="w-7 h-7 text-(--color-primary)" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1 space-y-1.5">
                    <Link
                        to={`/doctors-list/${doctor.doctorId}`}
                        className="text-sm font-semibold text-(--color-text) hover:text-(--color-primary) transition-colors truncate block"
                    >
                        {doctor.name ? `Dr. ${doctor.name}` : 'Unknown'}
                    </Link>

                    {doctor.specialization && (
                        <p className="text-xs text-(--color-text-light) flex items-center gap-1">
                            <Stethoscope className="w-3 h-3 shrink-0" />
                            {doctor.specialization}
                        </p>
                    )}

                    {/* Rating + experience */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {doctor.rating > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                {doctor.rating}
                            </span>
                        )}
                        {doctor.experienceYears > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-(--color-text-light) bg-(--color-bg) border border-(--color-border) rounded-md px-2 py-0.5">
                                <Award className="w-3 h-3" />
                                {doctor.experienceYears} yr{doctor.experienceYears !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Stats row ────────────────────────────────────────────────── */}
            <div className="mx-5 mb-4 grid grid-cols-2 gap-2 rounded-xl bg-(--color-bg) border border-(--color-border) p-3">
                <div>
                    <p className="text-[10px] uppercase tracking-widest text-(--color-text-light) mb-0.5">Last Visit</p>
                    <p className="text-xs font-medium text-(--color-text)">{formatDate(doctor.lastAppointmentDate)}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-widest text-(--color-text-light) mb-0.5">Prescriptions</p>
                    <p className="text-xs font-medium text-(--color-text)">
                        {doctor.prescriptions?.length ?? 0} record{doctor.prescriptions?.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* ── Clinic info pills ─────────────────────────────────────────── */}
            <div className="px-5 pb-4 flex flex-wrap gap-1.5">
                <InfoPill icon={MapPin} value={doctor.clinicName} />
                <InfoPill icon={Phone} value={doctor.clinicPhoneNumber} />
                <InfoPill icon={Mail} value={doctor.clinicEmail} />
                <InfoPill icon={Globe} value={doctor.clinicWebsite} />
                <InfoPill icon={Clock} value={doctor.clinicHours} />
                {doctor.governments?.length ? (
                    <InfoPill icon={MapPin} value={doctor.governments.join(', ')} />
                ) : null}
            </div>

            {/* ── Last feedback snippet ─────────────────────────────────────── */}
            {lastFeedback?.comment && (
                <div className="mx-5 mb-4 flex items-start gap-2 rounded-xl bg-(--color-bg-blue) border border-(--color-primary)/20 px-3 py-2.5">
                    <Star className="w-3 h-3 text-(--color-primary) mt-0.5 shrink-0 fill-(--color-primary)" />
                    <p className="text-[11px] text-(--color-text-light) line-clamp-2 leading-relaxed">
                        "{lastFeedback.comment}"
                    </p>
                </div>
            )}

            {/* ── Prescriptions preview ─────────────────────────────────────── */}
            {hasPrescriptions && (
                <div className="mx-5 mb-4 rounded-xl border border-(--color-border) bg-(--color-surface) divide-y divide-(--color-border) overflow-hidden">
                    <div className="px-3 py-2 flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-widest font-medium text-(--color-text-light)">Latest Prescription</p>
                        <Link
                            to={`/doctors-list/${doctor.doctorId}`}
                            className="text-[10px] text-(--color-primary) hover:text-(--color-primary-light) flex items-center gap-0.5"
                        >
                            View all <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {doctor.prescriptions.slice(0, 1).map((rx) => (
                        <div key={rx.id} className="px-3 py-2 space-y-1">
                            <p className="text-xs font-medium text-(--color-text) truncate">{rx.diagnosis}</p>
                            <div className="flex flex-wrap gap-1">
                                {rx.items.slice(0, 3).map((item, i) => (
                                    <span key={i} className="text-[10px] bg-(--color-bg) border border-(--color-border) text-(--color-text-light) rounded-md px-1.5 py-0.5">
                                        {item.medicationName} · {item.dosage}
                                    </span>
                                ))}
                                {rx.items.length > 3 && (
                                    <span className="text-[10px] text-(--color-text-light)">+{rx.items.length - 3} more</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Actions ──────────────────────────────────────────────────── */}
            <div className="mt-auto px-5 pb-4 flex items-center gap-2 pt-3 border-t border-(--color-border)">
                <Link
                    to={`/appointments/booking/${doctor.doctorId}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-(--color-primary) text-white text-xs font-medium hover:bg-(--color-primary-dark) active:scale-95 transition-all duration-150"
                >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    Book Appointment
                </Link>
                <Link
                    to={`/chat/${doctor.doctorId}`}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--color-border) text-(--color-text-light) hover:border-(--color-primary) hover:text-(--color-primary) hover:bg-(--color-bg-blue) transition-all duration-150"
                    title="Message doctor"
                >
                    <MessageSquare className="w-3.5 h-3.5" />
                </Link>
                <button
                    onClick={onFeedback}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--color-border) text-(--color-text-light) hover:border-amber-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all duration-150 cursor-pointer"
                    title="Leave feedback"
                >
                    <Star className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
