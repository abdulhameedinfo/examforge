export type HttpClient = {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
};

export function createHttpClient(baseUrl: string): HttpClient {
  async function request<T>(path: string, init: RequestInit): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
      ...init,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${path}`);
    }

    return (await response.json()) as T;
  }

  return {
    get<T>(path: string) {
      return request<T>(path, { method: 'GET' });
    },
    post<T>(path: string, body: unknown) {
      return request<T>(path, { method: 'POST', body: JSON.stringify(body) });
    },
  };
}

