const API_URL = "https://api.distribute.you";

export async function distributeFetch(
  path: string,
  options: { method: string; body?: unknown },
): Promise<Response | null> {
  const key = process.env.DISTRIBUTE_API_KEY;
  if (!key) {
    console.warn(
      `[distribute] Missing DISTRIBUTE_API_KEY, skipping ${options.method} ${path}`,
    );
    return null;
  }

  return fetch(`${API_URL}${path}`, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
}
