/**
 * Extracts a human-readable error message from an Axios error response.
 * Falls back to the provided `fallback` string when no message is available.
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response
    return response?.data?.message ?? fallback
  }
  return fallback
}
