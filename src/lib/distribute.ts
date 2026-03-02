export async function distributeFetch(
  path: string,
  options: { method: string; body?: unknown },
): Promise<Response | null> {
  const baseUrl = process.env.NEXT_PUBLIC_DISTRIBUTE_API_URL;
  const key = process.env.DISTRIBUTE_API_KEY;
  if (!baseUrl || !key) {
    console.warn(
      `[distribute] Missing NEXT_PUBLIC_DISTRIBUTE_API_URL or DISTRIBUTE_API_KEY, skipping ${options.method} ${path}`,
    );
    return null;
  }

  return fetch(`${baseUrl}${path}`, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
}
