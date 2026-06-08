import { useEffect, useState } from 'react';
import {
    FileText,
    Calendar,
    Stethoscope,
    Paperclip,
    ExternalLink,
    X,
    ClipboardList,
} from 'lucide-react';
import DashboardLayout from '../dashboard-layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import { fetchMedicalHistory, medicalHistoryState, type Attachment, type MedicalRecord } from '@/store/slices/patient-slice/medical-history-slice/medicalHistorySlice';
import MiniLoading from '../mini-loading/MiniLoading';
import Error from '../error/Error';
import { NotFound } from '../notfound/NotFound';
import { parseDate } from '@/lib/utils';
import { Link } from 'react-router';


// ─── Attachment Preview Modal ─────────────────────────────────────────────────

function AttachmentPreviewModal({
    attachment,
    onClose,
}: {
    attachment: Attachment;
    onClose: () => void;
}) {
    const isImage =
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(attachment.fileUrl) ||
        attachment.fileUrl.includes('/Images/');

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
                style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                >
                    <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                            {attachment.fileName}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={attachment.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            <ExternalLink className="w-4 h-4" />
                            Open
                        </a>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: 'var(--color-text-light)' }}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div
                    className="p-6 flex items-center justify-center min-h-64"
                    style={{ background: 'var(--color-bg)' }}
                >
                    {isImage ? (
                        <img
                            src={attachment.fileUrl}
                            alt={attachment.fileName}
                            className="max-h-96 max-w-full rounded-xl object-contain shadow-md"
                        />
                    ) : (
                        <div className="text-center" style={{ color: 'var(--color-text-light)' }}>
                            <Paperclip className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm mb-2">Preview not available</p>
                            <a
                                href={attachment.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium underline underline-offset-2"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                Download file
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Medical Record Card ──────────────────────────────────────────────────────

function MedicalRecordCard({ record }: { record: MedicalRecord }) {
    const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);



    return (
        <>
            <div
                className="rounded-2xl overflow-hidden"
                style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
            >
                {/* Card header */}
                <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                            className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center"
                            style={{ background: 'var(--color-bg-blue)' }}
                        >
                            <FileText className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        </div>

                        {/* Meta */}
                        <div className="min-w-0 flex-1">
                            <h3
                                className="text-base font-semibold truncate mb-1"
                                style={{ color: 'var(--color-text)' }}
                            >
                                {record.title}
                            </h3>

                            <Link
                                to={`/appointments/${record.appointmentId}`}
                                className="flex items-center gap-1.5 text-sm mb-2 text-(color-text-light) hover:underline hover:text-(--color-text-blue)"
                            >
                                <Stethoscope className="w-3.5 h-3.5 shrink-0" />
                                <span>{record.doctorName}</span>
                            </Link>

                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className="flex items-center gap-1.5 text-xs"
                                    style={{ color: 'var(--color-text-light)' }}
                                >
                                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                                    {parseDate(record.date).fullLabel}
                                </span>

                                <span
                                    className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    style={{
                                        background: 'var(--color-bg-blue)',
                                        color: 'var(--color-text-blue)',
                                        border: '1px solid var(--color-primary-lighter)',
                                    }}
                                >
                                    {record.type}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Always-visible body */}
                {(record.description || record.attachments.length > 0) && (
                    <div
                        className="px-5 sm:px-6 py-5 space-y-4"
                        style={{ borderTop: '1px solid var(--color-border)' }}
                    >
                        {record.description && (
                            <div>
                                <p
                                    className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                                    style={{ color: 'var(--color-text-light)' }}
                                >
                                    Description
                                </p>
                                <p
                                    className="text-sm leading-relaxed"
                                    style={{ color: 'var(--color-text)' }}
                                >
                                    {record.description}
                                </p>
                            </div>
                        )}

                        {record.attachments.length > 0 && (
                            <div>
                                <p
                                    className="text-xs font-semibold uppercase tracking-widest mb-2"
                                    style={{ color: 'var(--color-text-light)' }}
                                >
                                    Attachments ({record.attachments.length})
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {record.attachments.map((att) => (
                                        <button
                                            key={att.id}
                                            onClick={() => setPreviewAttachment(att)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                            style={{
                                                background: 'var(--color-bg)',
                                                border: '1px solid var(--color-border)',
                                                color: 'var(--color-text)',
                                            }}
                                        >
                                            <Paperclip className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                                            {att.fileName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {previewAttachment && (
                <AttachmentPreviewModal
                    attachment={previewAttachment}
                    onClose={() => setPreviewAttachment(null)}
                />
            )}
        </>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function MedicalHistoryInPatient() {
    const dispatch = useDispatch<AppDispatch>();
    const { records, loading, error } = useSelector(medicalHistoryState);

    useEffect(() => {
        dispatch(fetchMedicalHistory());
    }, [dispatch]);

    return (
        <DashboardLayout pageTitle="Medical History">
            <div className="w-full mx-auto px-4 sm:px-0 py-6 sm:py-8">
                {/* Page header */}
                <div className="mb-7">
                    <div className="flex items-center gap-3 mb-1">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'var(--color-bg-blue)' }}
                        >
                            <ClipboardList className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                            Medical History
                        </h1>
                    </div>
                    {!loading && !error && (
                        <p className="text-sm ml-12" style={{ color: 'var(--color-text-light)' }}>
                            {records.length} record{records.length !== 1 ? 's' : ''} found
                        </p>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <MiniLoading />
                )}

                {/* Error */}
                {!loading && error && (
                    <Error message='Failed to load records' />
                )}

                {/* Empty state */}
                {!loading && !error && records.length === 0 && (
                    <NotFound message='No medical records found.' />
                )}

                {/* Records list */}
                {!loading && !error && records.length > 0 && (
                    <div className="space-y-4">
                        {records.map((record) => (
                            <MedicalRecordCard key={record.appointmentId} record={record} />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default MedicalHistoryInPatient;
