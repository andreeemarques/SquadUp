const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.error || 'Erro na API')
  }

  if (res.status === 204) return null

  return res.json()
}

export function toApiEnum(value: string) {
  return value.replace(/ /g, '_')
}

export function fromApiEnum(value: string) {
  return value.replace(/_/g, ' ')
}