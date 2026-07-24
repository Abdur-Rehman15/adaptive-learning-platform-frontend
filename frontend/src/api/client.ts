const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.API_BASE_URL

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
  const text = await res.text();
  let payload: unknown = null;

  if (text) {
    if (contentType.includes('application/json')) {
      try {
        payload = JSON.parse(text);
      } catch (err) {
        payload = text;
      }
    } else {
      payload = text;
    }
  }

  if (!res.ok) {
    let message = `API error: ${res.status}`;
    if (payload && typeof payload === 'object') {
      const p = payload as Record<string, unknown>;
      if (typeof p.detail === 'string') {
        message = p.detail;
      } else if (Array.isArray(p.detail)) {
        // FastAPI model validation errors
        message = p.detail
          .map((d: any) => `${d.loc ? d.loc.join('.') : 'field'}: ${d.msg || 'invalid value'}`)
          .join(', ');
      } else if (p.detail && typeof p.detail === 'object') {
        message = JSON.stringify(p.detail);
      } else if (typeof p.message === 'string') {
        message = p.message;
      }
    } else if (typeof payload === 'string' && payload.trim().length > 0) {
      message = payload;
    }
    throw new Error(message);
  }

  return payload as T;
}