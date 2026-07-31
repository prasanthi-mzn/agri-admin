export type ApiOrder = {
  id: number;
  status?: string;
  total_amount?: string;
  total_quantity?: number;
  payment_expires_at?: string;
  created_at?: string;
};

export type OrderListResponse = {
  data?: ApiOrder[];
  page?: number;
  page_size?: number;
  total?: number;
  total_pages?: number;
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

function normalizeOrders(data: unknown): ApiOrder[] {
  if (Array.isArray(data)) return data as ApiOrder[];
  if (data && typeof data === 'object') {
    const record = data as OrderListResponse;
    return record.data || [];
  }
  return [];
}

export async function fetchOrders(): Promise<ApiOrder[]> {
  const res = await fetch(`${base}/orders`, { headers: getHeaders() });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch orders');
  }

  return normalizeOrders(await res.json());
}

export default { fetchOrders };
