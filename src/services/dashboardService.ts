export type DashboardResponse = {
  total_customers: number;
  total_vendors: number;
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

export async function fetchDashboard(): Promise<DashboardResponse> {
  const url = `${base}/admin/dashboard`;
  const res = await fetch(url, { headers: getHeaders() });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch dashboard data');
  }

  const data = await res.json() as DashboardResponse;
  return data;
}

export default { fetchDashboard };
