export type ErrorReportItem = {
  id: number;
  user_id: number;
  error: string;
  created_at: string;
};

export type ErrorReportListResponse = {
  total: number;
  page: number;
  page_size: number;
  items: ErrorReportItem[];
};

const base = import.meta.env.VITE_API_BASE_URL as string;

function getHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function get<T>(path: string, errorMessage: string): Promise<T> {
  const response = await fetch(`${base}${path}`, { method: 'GET', headers: getHeaders() });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || errorMessage);
  }

  return response.json() as Promise<T>;
}

export function fetchErrorReports(): Promise<ErrorReportListResponse> {
  return get<ErrorReportListResponse>('/error-report/list', 'Failed to fetch reported errors');
}

export function fetchErrorReport(errorId: number): Promise<ErrorReportItem> {
  return get<ErrorReportItem>(`/error-report/${errorId}`, 'Failed to fetch error details');
}

export default { fetchErrorReports, fetchErrorReport };
