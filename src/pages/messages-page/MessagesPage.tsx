import { useEffect, useState } from "react";
import {
    Search, Clock,
    Inbox, ChevronRight, Filter,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { useNavigate } from "react-router";
import { ScaleLoader } from "react-spinners";
import Error from "@/components/error/Error";
import { fetchSupportTickets, selectSupportTicketsState, type TicketItem } from "@/store/slices/support-slice/support-tickets-slice/supportTicketsSlice";
import { getTimeAgo } from "@/lib/utils";
import Pagination from "@/components/pagination/Pagination";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { bg: string; color: string; dot: string }> = {
    Open: { bg: "rgba(22,163,74,0.08)", color: "var(--color-success)", dot: "var(--color-success)" },
    Closed: { bg: "rgba(100,116,139,0.08)", color: "#64748b", dot: "#94a3b8" },
    Pending: { bg: "rgba(234,179,8,0.08)", color: "#ca8a04", dot: "#ca8a04" },
    InProgress: { bg: "var(--color-bg-blue)", color: "var(--color-text-blue)", dot: "var(--color-primary)" },
};

function getStatus(status: string) {
    return STATUS_CONFIG[status] ?? STATUS_CONFIG.Open;
}

const STATUS_TABS = ["All", "New", "Resolved"];

// ─── Ticket Card ─────────────────────────────────────────────────────────────

function TicketCard({ ticket, onClick }: { ticket: TicketItem; onClick: () => void }) {
    const cfg = getStatus(ticket.status);
    const initials = getInitials(ticket.fullName);

    return (
        <div
            className="group flex items-start justify-between gap-4 px-5 py-4 rounded-2xl transition-all duration-150 cursor-pointer"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            onClick={onClick}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(37,99,235,0.08)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
        >
            {/* Left: avatar + info */}
            <div className="flex items-start gap-3 min-w-0 flex-1">
                {/* Avatar with status dot */}
                <div className="relative shrink-0">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))" }}
                    >
                        {initials}
                    </div>
                    <span
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                        style={{ background: cfg.dot, borderColor: "var(--color-surface)" }}
                    />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text)" }}>
                            {ticket.fullName}
                        </p>
                        <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                            style={{ background: cfg.bg, color: cfg.color }}
                        >
                            {ticket.status}
                        </span>
                    </div>
                    <p className="text-xs mb-1 truncate" style={{ color: "var(--color-text-light)" }}>
                        {ticket.email}
                    </p>
                    <p className="text-xs font-medium line-clamp-1" style={{ color: "var(--color-text)" }}>
                        {ticket.subject}
                    </p>
                </div>
            </div>

            {/* Right: time + chevron */}
            <div className="flex items-center gap-2 shrink-0 self-center">
                <div className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-light)" }}>
                    <Clock className="w-3 h-3 shrink-0" />
                    {getTimeAgo(ticket.createdAt)}
                </div>
                <ChevronRight
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--color-text-light)" }}
                />
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function MessagesPage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { data: tickets, loading, error } = useSelector(selectSupportTicketsState);

    const [search, setSearch] = useState("");
    const [activeStatus, setActiveStatus] = useState("All");
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const refetch = () =>
        dispatch(fetchSupportTickets({
            search: search || undefined,
            status: activeStatus !== "All" ? activeStatus : undefined,
            pageNumber,
            pageSize,
        }));

    useEffect(() => {
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, search, activeStatus, pageNumber, pageSize]);

    const ticketList = tickets ?? [];

    const stats = [
        { label: "Total", value: ticketList.length, color: "var(--color-primary)", bg: "var(--color-bg-blue)" },
        { label: "Open", value: ticketList.filter(t => t.status === "Open").length, color: "var(--color-success)", bg: "rgba(22,163,74,0.08)" },
        { label: "Pending", value: ticketList.filter(t => t.status === "Pending").length, color: "#ca8a04", bg: "rgba(234,179,8,0.08)" },
        { label: "Closed", value: ticketList.filter(t => t.status === "Closed").length, color: "#64748b", bg: "rgba(100,116,139,0.08)" },
    ];

    return (
        <DashboardLayout pageTitle="Support Tickets">
            <div className="space-y-6">

                {/* ── Header ── */}
                <div>
                    <h1 className="text-2xl font-bold mb-0.5" style={{ color: "var(--color-text)" }}>
                        Support Tickets
                    </h1>
                    <p className="text-sm" style={{ color: "var(--color-text-light)" }}>
                        Review and respond to user support requests
                    </p>
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className="rounded-xl p-4"
                            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                        >
                            <p className="text-xs font-medium mb-1" style={{ color: "var(--color-text-light)" }}>{s.label}</p>
                            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* ── Search + Filter ── */}
                <div
                    className="rounded-2xl p-4 space-y-3"
                    style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                >
                    <div className="relative">
                        <Search
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                            style={{ color: "var(--color-text-light)" }}
                        />
                        <input
                            type="text"
                            placeholder="Search by name, email or subject…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
                            style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                        />
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                        <Filter className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-light)" }} />
                        {STATUS_TABS.map((tab) => {
                            const active = activeStatus === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveStatus(tab)}
                                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                                    style={{
                                        background: active ? "var(--color-primary)" : "var(--color-bg)",
                                        color: active ? "#fff" : "var(--color-text-light)",
                                        border: `1px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
                                    }}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Ticket list ── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <ScaleLoader color="var(--color-primary)" radius={4} width={3.5} height={20} margin={2} />
                        <p className="text-xs animate-pulse" style={{ color: "var(--color-text-light)" }}>Loading tickets…</p>
                    </div>
                ) : error ? (
                    <Error message={error} onRetry={refetch} />
                ) : ticketList.length === 0 ? (
                    <div
                        className="rounded-2xl p-16 flex flex-col items-center text-center"
                        style={{ background: "var(--color-surface)", border: "1px dashed var(--color-border)" }}
                    >
                        <Inbox className="w-10 h-10 mb-3" style={{ color: "var(--color-border)" }} />
                        <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>No tickets found</p>
                        <p className="text-xs" style={{ color: "var(--color-text-light)" }}>
                            {search || activeStatus !== "All"
                                ? "Try adjusting your search or filters"
                                : "Support tickets will appear here when submitted"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {ticketList.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                onClick={() => navigate(`/messages/${ticket.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Pagination
                pageNumber={pageNumber}
                pageSize={pageSize}
                totalItems={50}
                onPageChange={(page) => setPageNumber(page)}
                onPageSizeChange={(size) => { setPageSize(size); setPageNumber(1); }}
            />
        </DashboardLayout>
    );
}

export default MessagesPage;
