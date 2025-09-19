export function getToken() {
  // Prefer Authorization Bearer token stored in localStorage by login flow
  try {
    return localStorage.getItem('token') || null;
  } catch { 
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = options.headers || {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // If the caller passed a plain object as body (not FormData/Blob/URLSearchParams),
  // send it as JSON and set Content-Type accordingly. If body is already a string
  // or FormData (used for file uploads) or URLSearchParams, leave it alone.
  let body = options.body;
  const isPlainObject = body && typeof body === 'object'
    && !(body instanceof FormData)
    && !(body instanceof Blob)
    && !(body instanceof URLSearchParams)
    && !(body instanceof ArrayBuffer)
    && !(ArrayBuffer.isView && ArrayBuffer.isView(body));

  if (isPlainObject && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
    try {
      body = JSON.stringify(body);
    } catch (err) {
      // If stringify fails, let fetch handle it and surface a readable error
      console.error('Failed to stringify request body for', path, err);
    }
  }

  const res = await fetch(path, { ...options, headers, body });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`${res.status} ${txt}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}
