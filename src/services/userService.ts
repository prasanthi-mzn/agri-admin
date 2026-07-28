// Read token directly from localStorage to attach as Bearer token

export type UserItem = {
  id: number;
  email: string;
  user_type: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  address?: string;
  zipcode?: string;
  city?: string;
  district?: string;
  state?: string;
  is_active: boolean;
  is_verified: boolean;
  is_admin: boolean;
  is_superuser?: boolean;
  vendor_verification_status?: string | null;
  vendor?: VendorDetails | null;
};

export type UserListResponse = {
  total: number;
  page: number;
  page_size: number;
  items: UserItem[];
};

export type VendorDetails = {
  id: number;
  company_name: string;
  company_registration_number: string;
  company_address: string;
  company_phone_number: string;
  company_email: string;
  gst_number: string;
};

export type UserDetails = UserItem & {
  address: string;
  zipcode: string;
  city: string;
  district: string;
  state: string;
  is_superuser: boolean;
  vendor: VendorDetails | null;
};

export type UpdateUserPayload = {
  first_name: string;
  last_name: string;
  mobile_number: string;
};

const base = import.meta.env.VITE_API_BASE_URL as string;

function getHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function fetchUsers(): Promise<UserListResponse> {
  const url = `${base}/admin/users`;
  const headers = getHeaders();
  const res = await fetch(url, { headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch users');
  }

  const data = await res.json() as UserListResponse;
  return data;
}

export async function fetchUser(userId: number): Promise<UserDetails> {
  const url = `${base}/admin/users/${userId}`;
  const res = await fetch(url, { headers: getHeaders() });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch user details');
  }

  const data = await res.json() as UserDetails;
  return data;
}

export async function updateUser(userId: number, payload: UpdateUserPayload): Promise<UserDetails> {
  const url = `${base}/admin/users/${userId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to update user');
  }

  const data = await res.json() as UserDetails;
  return data;
}

export async function updateUserStatus(userId: number, payload: Partial<Pick<UserDetails, 'is_active' | 'is_verified' | 'vendor_verification_status'>>): Promise<UserDetails | { message: string }> {
  const url = `${base}/admin/users/${userId}/status`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to update user status');
  }

  const data = await res.json() as UserDetails | { message: string };
  return data;
}

export async function verifyVendor(userId: number, approve: boolean): Promise<UserDetails | { message: string }> {
  const url = `${base}/admin/users/${userId}/verify-vendor`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ approved: approve, credit_limit: 0 }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to verify vendor');
  }

  const data = await res.json() as UserDetails | { message: string };
  return data;
}

export default { fetchUsers, fetchUser, updateUser, updateUserStatus, verifyVendor };
