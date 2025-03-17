export function fetchWithPrefix(url: string, options?: RequestInit) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, options);
}
