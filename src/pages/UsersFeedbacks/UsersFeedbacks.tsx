import { useCallback, useEffect, useState } from 'react';
import { Loader2, MessageSquareText, X } from 'lucide-react';
import feedbackService from '../../services/feedbackService';
import type { FeedbackItem } from '../../services/feedbackService';

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const DetailItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-md border border-[var(--border)] bg-[var(--code-bg)] px-3 py-3">
    <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text)] opacity-80">{label}</dt>
    <dd className="mt-1 whitespace-pre-wrap break-words text-sm font-medium text-[var(--text-h)]">{value}</dd>
  </div>
);

const UsersFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setFeedbacks(await feedbackService.fetchFeedbacks());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFeedbacks();
  }, [loadFeedbacks]);

  const openFeedback = async (feedbackId: number) => {
    setSelectedId(feedbackId);
    setSelectedFeedback(null);
    setModalError('');
    setModalLoading(true);
    try {
      setSelectedFeedback(await feedbackService.fetchFeedback(feedbackId));
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to load feedback details');
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedId(null);
    setSelectedFeedback(null);
    setModalError('');
  };

  return (
    <div className="min-w-0 space-y-6 text-left">
      <div className="flex items-center gap-3">
        <MessageSquareText className="shrink-0 text-green-600" size={28} />
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Users Feedbacks</h1>
          <p className="text-gray-500">View feedback submitted by users.</p>
        </div>
      </div>

      {error && <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs">
              <tr>
                <th className="px-4 py-3">Feedback ID</th>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Feedback</th>
                <th className="px-4 py-3">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {feedbacks.map((item) => (
                <tr
                  key={item.id}
                  className="cursor-pointer transition-colors hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => void openFeedback(item.id)}
                >
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">{item.user_id}</td>
                  <td className="max-w-xl truncate px-4 py-3">{item.feedback}</td>
                  <td className="whitespace-nowrap px-4 py-3">{formatDate(item.created_at)}</td>
                </tr>
              ))}
              {feedbacks.length === 0 && (
                <tr>
                  <td className="px-4 py-10 text-center text-gray-500" colSpan={4}>
                    {loading ? 'Loading feedbacks...' : 'No feedbacks found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onMouseDown={closeModal}>
          <div
            className="w-full max-w-2xl overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--widget-bg)] text-[var(--text)] shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <h2 id="feedback-modal-title" className="text-lg font-semibold text-[var(--text-h)]">Feedback Details</h2>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] hover:bg-[var(--code-bg)]"
                aria-label="Close feedback details"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              {modalLoading && (
                <div className="flex min-h-48 items-center justify-center text-sm">
                  <Loader2 className="mr-2 animate-spin" size={18} /> Loading feedback details...
                </div>
              )}
              {modalError && <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{modalError}</div>}
              {selectedFeedback && !modalLoading && (
                <dl className="grid gap-3 sm:grid-cols-2">
                  <DetailItem label="Feedback ID" value={selectedFeedback.id} />
                  <DetailItem label="User ID" value={selectedFeedback.user_id} />
                  <div className="sm:col-span-2"><DetailItem label="Created At" value={formatDate(selectedFeedback.created_at)} /></div>
                  <div className="sm:col-span-2"><DetailItem label="Feedback" value={selectedFeedback.feedback} /></div>
                </dl>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersFeedbacks;
