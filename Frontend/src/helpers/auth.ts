export function decodeToken(token: string): { _id: string; first_name: string; email: string; phone: string; role: string } | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function getUserRole(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded?.role ?? null;
}
