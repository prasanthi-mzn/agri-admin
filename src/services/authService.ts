/* Auth service for login and token management */
type LoginResponse = {
  access_token: string;
  token_type: string;
  user_id: number;
  user_type: string;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  const base = import.meta.env.VITE_API_BASE_URL as string;
  const url = `${base}/auth/login`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json','ngrok-skip-browser-warning': 'true', },
    body: JSON.stringify({ email_id: email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Login failed');
  }

  const data = await res.json() as LoginResponse;
  if (data?.access_token) {
    localStorage.setItem('auth_token', data.access_token);
    localStorage.setItem('user_type', data.user_type ?? '');
  }
  return data;
}

type ForgotPasswordResponse = {
  message: string;
  otp?: string;
};

export async function requestPasswordReset(email: string): Promise<ForgotPasswordResponse> {
  const base = import.meta.env.VITE_API_BASE_URL as string;
  const url = `${base}/auth/forgot-password`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email_id: email }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }

  const data = await res.json() as ForgotPasswordResponse;
  return data;
}

export async function resetPasswordWithOtp(email: string, otp: string, newPassword: string): Promise<{ message: string }> {
  const base = import.meta.env.VITE_API_BASE_URL as string;
  const url = `${base}/auth/reset-password-otp`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email_id: email, otp, new_password: newPassword }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Reset failed');
  }

  const data = await res.json() as { message: string };
  return data;
}

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_type');
}

export default { login, getAuthToken, getAuthHeaders, logout, requestPasswordReset, resetPasswordWithOtp };
