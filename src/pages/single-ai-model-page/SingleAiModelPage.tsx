import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import {
    ArrowLeft, Brain, Target, Activity, Zap, Award,
    Clock, Database, Calendar, Pencil,
    Cpu, Layers, Hash, AlertCircle,
} from 'lucide-react';
import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    Radar, Tooltip, ResponsiveContainer,
} from 'recharts';
import DashboardLayout from '@/components/dashboard-layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import MiniLoading from '@/components/mini-loading/MiniLoading';
import { clearCurrentModel, fetchModelById, selectSingleModelState, type DetailedAIModel } from '@/store/slices/admin-slice/single-model-slice/singleModelSlice';
import { resetUpdateState } from '@/store/slices/admin-slice/update-aI-model-slice/updateAIModelSlice';
import { AIModelModal } from '@/components/ai-model-modal/AiModelModal';
import { formatDateTime, pct } from '@/lib/utils';


// ─── Helpers ──────────────────────────────────────────────────────────────────



// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ icon: Icon, label, value, iconBg, iconColor }: {
    icon: any; label: string; value: string; iconBg: string; iconColor: string;
}) {
    return (
        <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow)' }}
        >
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: iconBg }}
            >
                <Icon className="w-5 h-5" style={{ color: iconColor }} />
            </div>
            <p className="text-xs mb-1" style={{ color: 'var(--color-text-light)' }}>{label}</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{value}</p>
        </div>
    );
}

function TrainRow({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
    return (
        <div className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
            <div
                className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(139,92,246,0.08)' }}
            >
                <Icon className="w-4 h-4" style={{ color: '#7c3aed' }} />
            </div>
            <span className="text-sm flex-1" style={{ color: 'var(--color-text-light)' }}>{label}</span>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{value}</span>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SingleAiModelPage() {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { currentModel, loading, error } = useSelector(selectSingleModelState);
    const [showEdit, setShowEdit] = useState(false);
    const [model, setModel] = useState<DetailedAIModel | null>(null);

    useEffect(() => {
        if (id) dispatch(fetchModelById(id));
        return () => { dispatch(clearCurrentModel()); };
    }, [dispatch, id]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (currentModel) setModel(currentModel);
    }, [currentModel]);

    if (loading) {
        return (
            <DashboardLayout pageTitle="Model Details">
                <div className="py-16"><MiniLoading message="Loading model details…" /></div>
            </DashboardLayout>
        );
    }

    if (error || !model) {
        return (
            <DashboardLayout pageTitle="Model Not Found">
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}
                    >
                        <AlertCircle className="w-6 h-6" style={{ color: '#dc2626' }} />
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                        {error ?? 'Model not found'}
                    </p>
                    <Link
                        to="/ai-models"
                        className="text-xs font-medium transition-colors hover:opacity-75"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        ← Back to AI Models
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    const radarData = [
        { metric: 'Accuracy', value: model.accuracy * 100 },
        { metric: 'Precision', value: model.precision * 100 },
        { metric: 'Recall', value: model.recall * 100 },
        { metric: 'F1 Score', value: model.f1Score * 100 },
    ];

    const metricBars = [
        { label: 'Accuracy', value: model.accuracy, color: 'bg-blue-500' },
        { label: 'Precision', value: model.precision, color: 'bg-emerald-500' },
        { label: 'Recall', value: model.recall, color: 'bg-purple-500' },
        { label: 'F1 Score', value: model.f1Score, color: 'bg-orange-500' },
    ];

    const metricCards = [
        { icon: Target, label: 'Accuracy', value: pct(model.accuracy), iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3b82f6' },
        { icon: Activity, label: 'Precision', value: pct(model.precision), iconBg: 'rgba(16,185,129,0.1)', iconColor: '#10b981' },
        { icon: Zap, label: 'Recall', value: pct(model.recall), iconBg: 'rgba(139,92,246,0.1)', iconColor: '#8b5cf6' },
        { icon: Award, label: 'F1 Score', value: pct(model.f1Score), iconBg: 'rgba(249,115,22,0.1)', iconColor: '#f97316' },
    ];

    return (
        <DashboardLayout pageTitle="Model Details">
            <div className="space-y-6">

                {/* Back */}
                <Link
                    to="/ai-models"
                    className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-75"
                    style={{ color: 'var(--color-primary)' }}
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to AI Models
                </Link>

                {/* Header card */}
                <div
                    className="rounded-2xl border p-6"
                    style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow)' }}
                >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-start gap-4">
                            <div
                                className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center"
                                style={{ backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                            >
                                <Brain className="w-7 h-7" style={{ color: '#7c3aed' }} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                                    {model.name}
                                </h2>
                                <p className="text-sm mb-3 max-w-xl leading-relaxed" style={{ color: 'var(--color-text-light)' }}>
                                    {model.description}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-light)' }}>
                                        <Layers className="w-3.5 h-3.5 shrink-0" />{model.type}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-light)' }}>
                                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                                        Deployed {formatDateTime(model.deployedDate).date}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowEdit(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all active:scale-95 shrink-0 cursor-pointer"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
                        >
                            <Pencil className="w-4 h-4" /> Edit Model
                        </button>
                    </div>
                </div>

                {/* Metric cards */}
                <div>
                    <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                        Performance Metrics
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {metricCards.map((m) => <MetricCard key={m.label} {...m} />)}
                    </div>
                </div>

                {/* Radar + Training details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* Radar */}
                    <div
                        className="rounded-2xl border p-6"
                        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow)' }}
                    >
                        <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
                            Multi-Metric Overview
                        </h4>
                        <ResponsiveContainer width="100%" height={260}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="var(--color-border)" opacity={0.6} />
                                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: 'var(--color-text-light)' }} />
                                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--color-text-light)' }} />
                                <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.35} />
                                <Tooltip
                                    formatter={(v) => [`${v ? Number(v).toFixed(1) : '0.0'}%`, 'Value']}
                                    contentStyle={{
                                        backgroundColor: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '10px',
                                        color: 'var(--color-text)',
                                        fontSize: '12px',
                                    }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>

                        <div className="mt-4 space-y-2.5">
                            {metricBars.map(({ label, value, color }) => (
                                <div key={label}>
                                    <div className="flex justify-between text-[11px] mb-1" style={{ color: 'var(--color-text-light)' }}>
                                        <span>{label}</span>
                                        <span className="font-medium" style={{ color: 'var(--color-text)' }}>{pct(value)}</span>
                                    </div>
                                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
                                        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${value * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Training details */}
                    <div
                        className="rounded-2xl border p-6"
                        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow)' }}
                    >
                        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                            <Database className="w-4 h-4" style={{ color: '#7c3aed' }} />
                            Training Details
                        </h4>
                        <TrainRow icon={Database} label="Dataset" value={model.trainingDetails.datasetName} />
                        <TrainRow icon={Hash} label="Total Images" value={model.trainingDetails.totalImages.toLocaleString()} />
                        <TrainRow icon={Activity} label="Epochs" value={model.trainingDetails.epochs} />
                        <TrainRow icon={Layers} label="Batch Size" value={model.trainingDetails.batchSize} />
                        <TrainRow icon={Activity} label="Learning Rate" value={model.trainingDetails.learningRate === 0 ? 'Scheduled' : model.trainingDetails.learningRate} />
                        <TrainRow icon={Brain} label="Optimizer" value={model.trainingDetails.optimizer} />
                        <TrainRow icon={Clock} label="Training Time" value={model.trainingDetails.trainingTime} />
                        <TrainRow icon={Cpu} label="GPU" value={model.trainingDetails.gpuUsed} />
                    </div>
                </div>
            </div>

            {/* ── Edit modal ── */}
            {showEdit && model && (
                <AIModelModal
                    mode="edit"
                    model={model}
                    onClose={() => { setShowEdit(false); dispatch(resetUpdateState()); }}
                    onSaved={(updated) => { setModel(updated); setShowEdit(false); }}
                />
            )}
        </DashboardLayout>
    );
}
