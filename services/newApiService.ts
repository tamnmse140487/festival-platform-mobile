// Core HTTP client dùng chung
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export interface ApiResponse<T> {
  data?: T;
  success?: boolean;
  message?: string;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

class ApiService {
  private defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  setAuthToken(token?: string) {
    if (!token) delete this.defaultHeaders.Authorization;
    else this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  setHeader(key: string, value?: string) {
    if (value === undefined) delete this.defaultHeaders[key];
    else this.defaultHeaders[key] = value;
  }

  private buildUrl(endpoint: string, query?: Record<string, any>) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (query) {
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
      });
    }
    return url.toString();
  }

  async request<T>(
    endpoint: string,
    {
      method = "GET",
      body,
      headers,
      query,
      signal,
    }: {
      method?: HttpMethod;
      body?: unknown;
      headers?: Record<string, string>;
      query?: Record<string, any>;
      signal?: AbortSignal;
    } = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, query);
    const init: RequestInit = {
      method,
      headers: { ...this.defaultHeaders, ...(headers || {}) },
      signal,
    };
    if (body !== undefined) {
      init.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    try {
      const res = await fetch(url, init);
      const text = await res.text();
      return text ? JSON.parse(text) : ({ success: res.ok } as ApiResponse<T>);
    } catch (err: any) {
      console.error(`HTTP Error - ${method} ${endpoint}:`, err);
      return { success: false, message: err?.message || "Unknown error" };
    }
  }

  get<T>(endpoint: string, opts?: { headers?: Record<string, string>; query?: Record<string, any>; signal?: AbortSignal }) {
    return this.request<T>(endpoint, { method: "GET", ...opts });
  }
  post<T>(endpoint: string, body?: unknown, opts?: { headers?: Record<string, string>; query?: Record<string, any>; signal?: AbortSignal }) {
    return this.request<T>(endpoint, { method: "POST", body, ...opts });
  }
  put<T>(endpoint: string, body?: unknown, opts?: { headers?: Record<string, string>; query?: Record<string, any>; signal?: AbortSignal }) {
    return this.request<T>(endpoint, { method: "PUT", body, ...opts });
  }
  delete<T>(endpoint: string, body?: unknown, opts?: { headers?: Record<string, string>; query?: Record<string, any>; signal?: AbortSignal }) {
    return this.request<T>(endpoint, { method: "DELETE", body, ...opts });
  }
}

export const apiService = new ApiService();
