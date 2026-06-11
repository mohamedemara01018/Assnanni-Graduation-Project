import { useEffect, useState } from 'react';
import {
  Brain, Calendar, Target, Award, Trash2,
  ChevronRight, X, AlertTriangle, Loader2, Plus,
} from 'lucide-react';
import { Link } from 'react-router';
import DashboardLayout from '@/components/dashboard-layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import MiniLoading from '@/components/mini-loading/MiniLoading';
import Error from '@/components/error/Error';
import { fetchAllAIModels, selectAIModelsState, type AIModelItem } from '@/store/slices/admin-slice/ai-model-slice/aiModelsSlice';
import { deleteAIModel, selectDeleteAIModelState } from '@/store/slices/admin-slice/delete-aI-model-slice/deleteAIModelSlice';
import { toast } from 'react-toastify';
import { AIModelModal } from '@/components/ai-model-modal/AiModelModal';
import { formatDateTime, getBarColor, pct } from '@/lib/utils';



// ─── Delete confirm modal ─────────────────────────────────────────────────────

function DeleteConfirmModal({ model, onConfirm, onCancel, loading }: {
  model: AIModelItem;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(220,38,38,0.08)' }}>
              <AlertTriangle className="w-4 h-4" style={{ color: '#dc2626' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Delete AI Model</p>
          </div>
          <button
            onClick={onCancel}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
            style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
          >
            <X className="w-3.5 h-3.5" style={{ color: 'var(--color-text-light)' }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-light)' }}>
            Are you sure you want to delete{' '}
            <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{model.name}</span>
            ? This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-5 pb-5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border py-2.5 text-sm transition-opacity hover:opacity-80 disabled:opacity-50 cursor-pointer"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-light)' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: '#dc2626' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Model card ───────────────────────────────────────────────────────────────

function ModelCard({ model, onDelete }: { model: AIModelItem; onDelete: (model: AIModelItem) => void }) {
  // console.log(mod)
  return (
    <div
      className="rounded-2xl border p-5 transition-all duration-150"
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow)' }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div
            className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            <Brain className="w-6 h-6" style={{ color: '#7c3aed' }} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate mb-0.5" style={{ color: 'var(--color-text)' }}>
              {model.name}
            </h3>
            <p className="text-xs mb-3" style={{ color: 'var(--color-text-light)' }}>{model.type}</p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: 'var(--color-text-light)' }}>
                <Target className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                Accuracy:&nbsp;
                <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{pct(model.accuracy)}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: 'var(--color-text-light)' }}>
                <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                F1 Score:&nbsp;
                <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{pct(model.f1Score)}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: 'var(--color-text-light)' }}>
                <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--color-text-light)' }} />
                {formatDateTime(model.deployedDate).date}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onDelete(model)}
            title="Delete model"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70 cursor-pointer"
            style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: '#dc2626' }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <Link
            to={`/ai-models/${model.id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-white transition-all active:scale-95"
            style={{ backgroundColor: 'var(--color-primary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
          >
            View Details
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metric bars */}
      <div className="mt-4 pt-4 grid grid-cols-2 gap-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        {[
          { label: 'Accuracy', value: model.accuracy },
          { label: 'F1 Score', value: model.f1Score },
        ].map(({ label, value }) => (
          <div key={label}>
            <div className="flex justify-between text-[11px] mb-1.5" style={{ color: 'var(--color-text-light)' }}>
              <span>{label}</span>
              <span className="font-medium" style={{ color: 'var(--color-text)' }}>{pct(value)}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(value)}`}
                style={{ width: `${value * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AIModelHistoryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { models, loading, error } = useSelector(selectAIModelsState);
  const { loading: deleteLoading } = useSelector(selectDeleteAIModelState);

  const [selectedModel, setSelectedModel] = useState<AIModelItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllAIModels());
  }, [dispatch]);

  const handleDelete = async () => {
    if (!selectedModel) return;
    const successMessage = await dispatch(deleteAIModel(selectedModel.id)).unwrap();
    dispatch(fetchAllAIModels());
    toast.success(successMessage || 'AI Model removed successfully.');
    setSelectedModel(null);
  };

  return (
    <DashboardLayout pageTitle="AI Models">
      <div className="space-y-5">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>AI Models</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-light)' }}>
              {loading ? 'Loading…' : `${models.length} model${models.length !== 1 ? 's' : ''} deployed`}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
            style={{ background: 'var(--color-primary)' }}
          >
            <Plus className="w-4 h-4" />
            Add AI Model
          </button>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="py-10"><MiniLoading message="Loading AI models…" /></div>
        ) : error ? (
          <Error message={error} />
        ) : models.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-2xl border py-16 px-8 text-center"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            >
              <Brain className="w-6 h-6" style={{ color: 'var(--color-text-light)' }} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>No AI models found</p>
            <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>Deployed models will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {models.map((model) => (
              <ModelCard key={model.id} model={model} onDelete={setSelectedModel} />
            ))}
          </div>
        )}
      </div>

      {/* ── Delete modal ── */}
      {selectedModel && (
        <DeleteConfirmModal
          model={selectedModel}
          onConfirm={handleDelete}
          onCancel={() => setSelectedModel(null)}
          loading={deleteLoading}
        />
      )}

      {/* ── Add modal ── */}
      {showAddModal && (
        <AIModelModal
          mode="create"
          onClose={() => setShowAddModal(false)}
          onCreated={() => dispatch(fetchAllAIModels())}
        />
      )}
    </DashboardLayout>
  );
}
