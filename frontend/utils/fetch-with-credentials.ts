export async function fetchWithCredentials(
  endpoint: string,
  options?: Omit<RequestInit, 'credentials'>,
  retry = true,
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
  });

  if (res.status === 401 && retry) {
    const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}user/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshRes.ok) {
      return fetchWithCredentials(endpoint, options, false);
    }
  }

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res;
}
