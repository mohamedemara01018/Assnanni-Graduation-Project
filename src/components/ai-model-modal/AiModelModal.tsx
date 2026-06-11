import { useEffect, useState } from 'react';
import { X, Save, Pencil, Plus, Brain, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import { toast } from 'react-toastify';

import {
    updateAIModel,
    resetUpdateState,
    selectUpdateAIModelState,
    type UpdateAIModelPayload,
} from '@/store/slices/admin-slice/update-aI-model-slice/updateAIModelSlice';

import type { DetailedAIModel, TrainingDetails } from '@/store/slices/admin-slice/single-model-slice/singleModelSlice';
import { createAIModel, resetCreateState, selectCreateAIModelState, type AIModelPayload } from '@/store/slices/admin-slice/create-ai-model-slice/createAIModelSlice';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AIModelModalMode = 'create' | 'edit';

interface AIModelModalProps {
    mode: AIModelModalMode;
    model?: DetailedAIModel;           // required when mode === 'edit'
    onClose: () => void;
    onSaved?: (updated: DetailedAIModel) => void;  // edit callback
    onCreated?: () => void;                         // create callback (refetch list)
}

// ─── Blank form template ──────────────────────────────────────────────────────

const BLANK: DetailedAIModel = {
    id: 0,
    name: '',
    description: '',
    deployedDate: new Date().toISOString().split('T')[0],
    type: '',
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
    trainingDetails: {
        datasetName: '',
        totalImages: 0,
        epochs: 0,
        batchSize: 0,
        learningRate: 0,
        optimizer: '',
        trainingTime: '',
        gpuUsed: '',
    },
};

// ─── Reusable field ───────────────────────────────────────────────────────────

function Field({
    label, value, onChange, type = 'text', required,
}: {
    label: string;
    value: string | number;
    onChange: (v: string) => void;
    type?: string;
    required?: boolean;
}) {
    return (
        <div>
            <label
                className="block text-[11px] uppercase tracking-widest font-medium mb-1.5"
                style={{ color: 'var(--color-text-light)' }}
            >
                {label}
                {required && <span style={{ color: '#dc2626' }} className="ml-0.5">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-colors"
                style={{
                    backgroundColor: 'var(--color-bg)',
                    border: '1.5px solid var(--color-border)',
                    color: 'var(--color-text)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            />
        </div>
    );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function AIModelModal({ mode, model, onClose, onSaved, onCreated }: AIModelModalProps) {
    const dispatch = useDispatch<AppDispatch>();

    const { loading: updateLoading, success: updateSuccess, error: updateError } =
        useSelector(selectUpdateAIModelState);
    const { createState: { loading: createLoading, success: createSuccess, error: createError } } =
        useSelector(selectCreateAIModelState);

    const loading = mode === 'edit' ? updateLoading : createLoading;
    const isEdit = mode === 'edit';

    const [form, setForm] = useState<DetailedAIModel>(
        isEdit && model ? { ...model, trainingDetails: { ...model.trainingDetails } } : BLANK
    );

    const set = (field: keyof DetailedAIModel, value: string | number) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const setTrain = (field: keyof TrainingDetails, value: string | number) =>
        setForm((prev) => ({ ...prev, trainingDetails: { ...prev.trainingDetails, [field]: value } }));

    // ── Side effects ──────────────────────────────────────────────────────────

    useEffect(() => {
        if (updateSuccess) {
            toast.success('Model updated successfully');
            dispatch(resetUpdateState());
            onSaved?.({ ...form });
            onClose();
        }
    }, [updateSuccess]);

    useEffect(() => {
        if (createSuccess) {
            toast.success('AI Model created successfully');
            dispatch(resetCreateState());
            onCreated?.();
            onClose();
        }
    }, [createSuccess]);

    useEffect(() => {
        if (updateError) toast.error(updateError);
    }, [updateError]);

    useEffect(() => {
        if (createError) toast.error(createError);
    }, [createError]);

    // ── Submit ────────────────────────────────────────────────────────────────

    const handleSave = () => {
        const shared: AIModelPayload = {
            name: form.name,
            description: form.description,
            deployedDate: form.deployedDate,
            type: form.type,
            accuracy: Number(form.accuracy),
            precision: Number(form.precision),
            recall: Number(form.recall),
            f1Score: Number(form.f1Score),
            datasetName: form.trainingDetails.datasetName,
            totalImages: Number(form.trainingDetails.totalImages),
            epochs: Number(form.trainingDetails.epochs),
            batchSize: Number(form.trainingDetails.batchSize),
            learningRate: Number(form.trainingDetails.learningRate),
            optimizer: form.trainingDetails.optimizer,
            trainingTime: form.trainingDetails.trainingTime,
            gpuUsed: form.trainingDetails.gpuUsed,
        };

        if (isEdit && model) {
            dispatch(updateAIModel({ id: model.id, payload: shared as UpdateAIModelPayload }));
        } else {
            dispatch(createAIModel(shared));
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div
                    className="flex items-center justify-between px-6 py-4 shrink-0"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: isEdit ? 'rgba(139,92,246,0.1)' : 'var(--color-bg-blue)' }}
                        >
                            {isEdit
                                ? <Pencil className="w-4 h-4" style={{ color: '#7c3aed' }} />
                                : <Brain className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                            }
                        </div>
                        <div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                                {isEdit ? 'Edit AI Model' : 'Add New AI Model'}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                                {isEdit ? model?.name : 'Fill in the model details below'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
                        style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                    >
                        <X className="w-3.5 h-3.5" style={{ color: 'var(--color-text-light)' }} />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="overflow-y-auto px-6 py-5 space-y-6 flex-1">

                    {/* Basic info */}
                    <section>
                        <p
                            className="text-[11px] uppercase tracking-widest font-semibold mb-3"
                            style={{ color: 'var(--color-text-light)' }}
                        >
                            Basic Info
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <Field label="Name" value={form.name} onChange={(v) => set('name', v)} required />
                            </div>
                            <div className="sm:col-span-2">
                                <label
                                    className="block text-[11px] uppercase tracking-widest font-medium mb-1.5"
                                    style={{ color: 'var(--color-text-light)' }}
                                >
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={form.description}
                                    onChange={(e) => set('description', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-colors resize-none"
                                    style={{
                                        backgroundColor: 'var(--color-bg)',
                                        border: '1.5px solid var(--color-border)',
                                        color: 'var(--color-text)',
                                    }}
                                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                                />
                            </div>
                            <Field label="Type" value={form.type} onChange={(v) => set('type', v)} required />
                            <Field
                                label="Deployed Date"
                                value={form.deployedDate?.split('T')[0] ?? ''}
                                onChange={(v) => set('deployedDate', v)}
                                type="date"
                                required
                            />
                        </div>
                    </section>

                    {/* Metrics */}
                    <section>
                        <p
                            className="text-[11px] uppercase tracking-widest font-semibold mb-3"
                            style={{ color: 'var(--color-text-light)' }}
                        >
                            Performance Metrics
                            <span className="normal-case tracking-normal font-normal ml-1" style={{ color: 'var(--color-border)' }}>
                                (0 – 1)
                            </span>
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Field label="Accuracy" value={form.accuracy} onChange={(v) => set('accuracy', v)} type="number" required />
                            <Field label="Precision" value={form.precision} onChange={(v) => set('precision', v)} type="number" required />
                            <Field label="Recall" value={form.recall} onChange={(v) => set('recall', v)} type="number" required />
                            <Field label="F1 Score" value={form.f1Score} onChange={(v) => set('f1Score', v)} type="number" required />
                        </div>
                    </section>

                    {/* Training details */}
                    <section>
                        <p
                            className="text-[11px] uppercase tracking-widest font-semibold mb-3"
                            style={{ color: 'var(--color-text-light)' }}
                        >
                            Training Details
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Dataset Name" value={form.trainingDetails.datasetName} onChange={(v) => setTrain('datasetName', v)} required />
                            <Field label="Total Images" value={form.trainingDetails.totalImages} onChange={(v) => setTrain('totalImages', v)} type="number" />
                            <Field label="Epochs" value={form.trainingDetails.epochs} onChange={(v) => setTrain('epochs', v)} type="number" />
                            <Field label="Batch Size" value={form.trainingDetails.batchSize} onChange={(v) => setTrain('batchSize', v)} type="number" />
                            <Field label="Learning Rate" value={form.trainingDetails.learningRate} onChange={(v) => setTrain('learningRate', v)} type="number" />
                            <Field label="Optimizer" value={form.trainingDetails.optimizer} onChange={(v) => setTrain('optimizer', v)} />
                            <Field label="Training Time" value={form.trainingDetails.trainingTime} onChange={(v) => setTrain('trainingTime', v)} />
                            <Field label="GPU Used" value={form.trainingDetails.gpuUsed} onChange={(v) => setTrain('gpuUsed', v)} />
                        </div>
                    </section>
                </div>

                {/* ── Footer ── */}
                <div
                    className="flex justify-end gap-2.5 px-6 py-4 shrink-0 rounded-b-2xl"
                    style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg)' }}
                >
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2.5 rounded-xl border text-sm transition-opacity hover:opacity-80 disabled:opacity-50 cursor-pointer"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-light)' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-50 cursor-pointer min-w-[140px] justify-center"
                        style={{ backgroundColor: isEdit ? '#7c3aed' : 'var(--color-primary)' }}
                    >
                        {loading ? (
                            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
                        ) : isEdit ? (
                            <><Save className="w-3.5 h-3.5" /> Save Changes</>
                        ) : (
                            <><Plus className="w-3.5 h-3.5" /> Create Model</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
