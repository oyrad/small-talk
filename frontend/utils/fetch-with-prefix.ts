export function fetchWithPrefix(url: string, options?: RequestInit) {
  return fetch(`http://localhost:5542/${url}`, options);
}
