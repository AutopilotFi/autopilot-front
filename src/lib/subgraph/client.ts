export type GraphResponse<T> = { data?: T; errors?: Array<{ message: string }> };

export async function executeGraphCall<T extends object = Record<string, unknown>>(
  url: string,
  query: string,
  variables: Record<string, unknown> = {},
  { retries = 2, signal }: { retries?: number; signal?: AbortSignal } = {}
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query, variables }),
        signal,
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`GraphQL ${res.status}: ${text}`);
      }
      const json = (await res.json()) as GraphResponse<T>;
      if (json.errors && json.errors.length) {
        throw new Error(json.errors.map(e => e.message).join("; "));
      }
      if (!json.data) throw new Error("GraphQL: empty response");
      return json.data;
    } catch (err) {
      lastErr = err;
      if (attempt === retries) break;
      await new Promise(r => setTimeout(r, 350 * (attempt + 1)));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}
