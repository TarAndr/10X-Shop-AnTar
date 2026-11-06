// api-client.ts
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, statusText: string) {
    super(`API request failed: ${status} ${statusText}`);

    this.name = 'ApiError';
    this.status = status;
  }
}

export class ApiClient {
  async get(
    url: string | URL,
    options?: { signal?: AbortSignal },
  ): Promise<unknown> {
    const response = await fetch(url, {
      signal: options?.signal,
    });

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    const data: unknown = await response.json();

    return data;
  }
}

export const apiClient = new ApiClient();