export type FeedbackItem = {
  id: number;
  user_id: number;
  feedback: string;
  created_at: string;
};

type FeedbackListResponse = FeedbackItem[] | { items?: FeedbackItem[]; feedbacks?: FeedbackItem[] };

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

export async function fetchFeedbacks(): Promise<FeedbackItem[]> {
  const data = await get<FeedbackListResponse>('/feedback/list', 'Failed to fetch feedbacks');
  if (Array.isArray(data)) return data;
  return data.items ?? data.feedbacks ?? [];
}

export function fetchFeedback(feedbackId: number): Promise<FeedbackItem> {
  return get<FeedbackItem>(`/feedback/${feedbackId}`, 'Failed to fetch feedback details');
}

export default { fetchFeedbacks, fetchFeedback };
