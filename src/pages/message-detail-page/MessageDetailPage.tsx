import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/store";
import {
    fetchSupportTicketById,
    clearSingleTicketState,
    selectSingleTicketState,
} from "@/store/slices/support-slice/single-ticket-slice/singleTicketSlice"; // adjust path
import {
    replyToSupportTicket,
    resetSupportReplyState,
    selectSupportReplyState,
} from "@/store/slices/support-slice/support-reply-slice/supportReplySlice"; // adjust path
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";
import {
    ArrowLeft, Mail, Clock, CheckCircle, MessageSquare,
    Tag, CalendarDays, UserRound, Loader2, Send, Trash2,
    AlertTriangle, X,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";

// ─── Status config (mirrors MessagesPage) ────────────────────────────────────

const STATUS_CONFIG: Record<string, { bg: string; color: string }> = {
    Open: { bg: "rgba(22,163,74,0.08)", color: "var(--color-success)" },
    Closed: { bg: "rgba(100,116,139,0.08)", color: "#64748b" },
    Pending: { bg: "rgba(234,179,8,0.08)", color: "#ca8a04" },
    InProgress: { bg: "var(--color-bg-blue)", color: "var(--color-text-blue)" },
};

function getStatus(status: string) {
    return STATUS_CONFIG[status] ?? STATUS_CONFIG.Open;
}

function formatDate(iso: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString([], {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteConfirmModal({
    loading,
    onConfirm,
    onCancel,
}: {
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={onCancel}
        >
            <div
                className="relative w-full max-w-sm rounded-2xl shadow-2xl p-6"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                    style={{ border: "1px solid var(--color-border)", color: "var(--color-text-light)" }}
                >
                    <X className="w-3.5 h-3.5" />
                </button>

                {/* Icon */}
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(239,68,68,0.08)" }}
                >
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>

                <h3 className="text-base font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                    Delete this ticket?
                </h3>
                <p className="text-sm mb-6" style={{ color: "var(--color-text-light)" }}>
                    This action cannot be undone. The ticket and all its data will be permanently removed.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                        style={{ border: "1px solid var(--color-border)", color: "var(--color-text-light)", background: "var(--color-bg)" }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
                        style={{ background: "#ef4444" }}
                    >
                        {loading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</>
                        ) : (
                            <><Trash2 className="w-4 h-4" /> Delete</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function MessageDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { ticket, loading, error } = useSelector(selectSingleTicketState);
    const { loading: replyLoading,
        success: replySuccess,
        error: replyError } = useSelector(selectSupportReplyState);

    const [reply, setReply] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch on mount
    useEffect(() => {
        if (id) dispatch(fetchSupportTicketById(Number(id)));
        return () => { dispatch(clearSingleTicketState()); };
    }, [id, dispatch]);

    // Reply success
    useEffect(() => {
        if (replySuccess) {
            toast.success("Reply sent successfully!");
            dispatch(resetSupportReplyState());
            setReply("");
            if (id) dispatch(fetchSupportTicketById(Number(id)));
        }
    }, [replySuccess, dispatch, id]);

    // Reply error
    useEffect(() => {
        if (replyError) toast.error(replyError);
    }, [replyError]);

    const handleSendReply = () => {
        if (!reply.trim() || !ticket) return;
        dispatch(replyToSupportTicket({ ticketId: ticket.id, reply: reply.trim() }));
    };

    const handleDelete = async () => {
        // Replace this with your actual delete thunk when available
        // e.g. dispatch(deleteSupportTicket(ticket.id))
        setDeleteLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 800)); // placeholder
            toast.success("Ticket deleted successfully!");
            navigate(-1);
        } catch {
            toast.error("Failed to delete ticket. Please try again.");
        } finally {
            setDeleteLoading(false);
            setShowDeleteModal(false);
        }
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <DashboardLayout pageTitle="Ticket Detail">
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <ScaleLoader color="var(--color-primary)" radius={4} width={3.5} height={20} margin={2} />
                    <p className="text-xs animate-pulse" style={{ color: "var(--color-text-light)" }}>Loading ticket…</p>
                </div>
            </DashboardLayout>
        );
    }

    // ── Error / not found ─────────────────────────────────────────────────────
    if (error || !ticket) {
        return (
            <DashboardLayout pageTitle="Ticket Detail">
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center max-w-xs mx-auto">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.08)" }}>
                        <Mail className="w-6 h-6 text-red-400" />
                    </div>
                    <p className="font-medium" style={{ color: "var(--color-text)" }}>Ticket not found</p>
                    <p className="text-sm" style={{ color: "var(--color-text-light)" }}>{error ?? "The ticket you're looking for doesn't exist."}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-1 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity cursor-pointer"
                        style={{ background: "var(--color-primary)" }}
                    >
                        Go back
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    const cfg = getStatus(ticket.status);

    // ── Detail ────────────────────────────────────────────────────────────────
    return (
        <DashboardLayout pageTitle="Ticket Detail">
            <div className="max-w-2xl mx-auto space-y-4">

                {/* Back + Delete row */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-sm transition-colors cursor-pointer group"
                        style={{ color: "var(--color-text-light)" }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "var(--color-text)"}
                        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "var(--color-text-light)"}
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                        Back
                    </button>

                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-500 transition-colors cursor-pointer"
                        style={{ border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.05)" }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"}
                        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.05)"}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Ticket
                    </button>
                </div>

                {/* ── Header card ── */}
                <div
                    className="rounded-2xl px-6 py-5 space-y-3"
                    style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: "var(--color-bg-blue)" }}
                            >
                                <Tag className="w-4 h-4" style={{ color: "var(--color-text-blue)" }} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs mb-0.5" style={{ color: "var(--color-text-light)" }}>
                                    Ticket #{ticket.id}
                                </p>
                                <h1 className="text-base font-semibold leading-tight" style={{ color: "var(--color-text)" }}>
                                    {ticket.subject}
                                </h1>
                            </div>
                        </div>
                        <span
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0"
                            style={{ background: cfg.bg, color: cfg.color }}
                        >
                            {ticket.status}
                        </span>
                    </div>

                    {/* Meta */}
                    <div
                        className="flex flex-wrap gap-x-5 gap-y-2 pt-3"
                        style={{ borderTop: "1px solid var(--color-border)" }}
                    >
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-light)" }}>
                            <UserRound className="w-3.5 h-3.5" />{ticket.fullName}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-light)" }}>
                            <Mail className="w-3.5 h-3.5" />{ticket.email}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-light)" }}>
                            <CalendarDays className="w-3.5 h-3.5" />{formatDate(ticket.createdAt)}
                        </span>
                    </div>
                </div>

                {/* ── User message ── */}
                <div
                    className="rounded-2xl px-6 py-5 space-y-3"
                    style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                >
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" style={{ color: "var(--color-text-light)" }} />
                        <h2 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Message</h2>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--color-text-light)" }}>
                        {ticket.message}
                    </p>
                </div>

                {/* ── Admin reply (if exists) ── */}
                {ticket.adminReply && (
                    <div
                        className="rounded-2xl px-6 py-5 space-y-3"
                        style={{ background: "var(--color-bg-blue)", border: "1px solid rgba(37,99,235,0.15)" }}
                    >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" style={{ color: "var(--color-success)" }} />
                                <h2 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                                    Admin Reply
                                </h2>
                            </div>
                            {ticket.repliedAt && (
                                <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-light)" }}>
                                    <Clock className="w-3.5 h-3.5" />{formatDate(ticket.repliedAt)}
                                </span>
                            )}
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--color-text-light)" }}>
                            {ticket.adminReply}
                        </p>
                    </div>
                )}

                {/* ── Reply box ── */}
                <div
                    className="rounded-2xl px-6 py-5 space-y-3"
                    style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                >
                    <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" style={{ color: "var(--color-text-light)" }} />
                        <h2 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                            {ticket.adminReply ? "Update Reply" : "Send Reply"}
                        </h2>
                    </div>

                    <textarea
                        rows={5}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Write your response…"
                        className="w-full resize-none rounded-xl text-sm outline-none transition-colors px-4 py-3"
                        style={{
                            background: "var(--color-bg)",
                            border: "1.5px solid var(--color-border)",
                            color: "var(--color-text)",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                    />

                    <div className="flex items-center justify-between">
                        <p className="text-xs" style={{ color: "var(--color-text-light)" }}>
                            {reply.length} / 1000
                        </p>
                        <button
                            onClick={handleSendReply}
                            disabled={!reply.trim() || replyLoading}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            style={{ background: "var(--color-primary)" }}
                        >
                            {replyLoading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                            ) : (
                                <><Send className="w-4 h-4" /> Send Reply</>
                            )}
                        </button>
                    </div>
                </div>

            </div>

            {/* ── Delete confirm modal ── */}
            {showDeleteModal && (
                <DeleteConfirmModal
                    loading={deleteLoading}
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </DashboardLayout>
    );
}

export default MessageDetailPage;
