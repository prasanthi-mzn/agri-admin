import { useCallback, useEffect, useState } from 'react';
import { CircleAlert, Loader2, X } from 'lucide-react';
import errorReportService from '../../services/errorReportService';
import type { ErrorReportItem } from '../../services/errorReportService';

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

const ReportedErrors = () => {
  const [reports, setReports] = useState<ErrorReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedReport, setSelectedReport] = useState<ErrorReportItem | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await errorReportService.fetchErrorReports();
      setReports(response.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reported errors');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const openReport = async (errorId: number) => {
    setSelectedId(errorId);
    setSelectedReport(null);
    setModalError('');
    setModalLoading(true);
    try {
      setSelectedReport(await errorReportService.fetchErrorReport(errorId));
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to load error details');
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedId(null);
    setSelectedReport(null);
    setModalError('');
  };

  return (
    <div className="min-w-0 space-y-6 text-left">
      <div className="flex items-center gap-3">
        <CircleAlert className="shrink-0 text-red-600" size={28} />
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Reported Errors</h1>
          <p className="text-gray-500">View errors reported by users.</p>
        </div>
      </div>

      {error && <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs">
              <tr>
                <th className="px-4 py-3">Error ID</th>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Error</th>
                <th className="px-4 py-3">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="cursor-pointer transition-colors hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => void openReport(report.id)}
                >
                  <td className="px-4 py-3">{report.id}</td>
                  <td className="px-4 py-3">{report.user_id}</td>
                  <td className="max-w-xl truncate px-4 py-3">{report.error}</td>
                  <td className="whitespace-nowrap px-4 py-3">{formatDate(report.created_at)}</td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td className="px-4 py-10 text-center text-gray-500" colSpan={4}>
                    {loading ? 'Loading reported errors...' : 'No reported errors found.'}
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
            aria-labelledby="error-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <h2 id="error-modal-title" className="text-lg font-semibold text-[var(--text-h)]">Reported Error Details</h2>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] hover:bg-[var(--code-bg)]"
                aria-label="Close reported error details"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              {modalLoading && (
                <div className="flex min-h-48 items-center justify-center text-sm">
                  <Loader2 className="mr-2 animate-spin" size={18} /> Loading error details...
                </div>
              )}
              {modalError && <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{modalError}</div>}
              {selectedReport && !modalLoading && (
                <dl className="grid gap-3 sm:grid-cols-2">
                  <DetailItem label="Error ID" value={selectedReport.id} />
                  <DetailItem label="User ID" value={selectedReport.user_id} />
                  <div className="sm:col-span-2"><DetailItem label="Created At" value={formatDate(selectedReport.created_at)} /></div>
                  <div className="sm:col-span-2"><DetailItem label="Error" value={selectedReport.error} /></div>
                </dl>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportedErrors;
