const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.API_BASE_URL ||
  'http://localhost:8000';

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const headers = new Headers(options?.headers);

  if (options?.body instanceof URLSearchParams) {
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
  } else if (options?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${BASE_URL}${normalizedEndpoint}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type') || '';
  let payload: unknown = null;

  if (contentType.includes('application/json')) {
    payload = await res.json();
  } else if (contentType.includes('text/')) {
    payload = await res.text();
  }

  if (!res.ok) {
    const message =
      (payload as { detail?: string; message?: string } | null)?.detail ||
      (payload as { detail?: string; message?: string } | null)?.message ||
      `API error: ${res.status}`;
    throw new Error(message);
  }

  return payload as T;
}