// REST client for the AI Interview & Resume Copilot backend.
// Configurable via VITE_API_BASE_URL. Defaults to the FastAPI dev server.

const RAW_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000";
export const API_BASE = RAW_BASE.replace(/\/$/, "");

const TOKEN_KEY = "aic_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type ReqOpts = {
  method?: string;
  body?: unknown;
  formData?: FormData;
  signal?: AbortSignal;
  auth?: boolean;
};

export async function api<T = unknown>(path: string, opts: ReqOpts = {}): Promise<T> {
  const { method = "GET", body, formData, signal, auth = true } = opts;
  const headers: Record<string, string> = {};
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  let payload: BodyInit | undefined;
  if (formData) {
    payload = formData;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { method, headers, body: payload, signal });
  } catch (err) {
    throw new ApiError(0, (err as Error).message || "Network error");
  }

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }

  if (!res.ok) {
    const obj = (data && typeof data === "object" ? (data as Record<string, unknown>) : null);
    const pick = (k: string) => {
      if (!obj || !(k in obj)) return "";
      const v = obj[k];
      if (typeof v === "string") return v;
      if (Array.isArray(v)) return v.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(", ");
      return v == null ? "" : JSON.stringify(v);
    };
    const msg = pick("detail") || pick("message") || pick("error") || res.statusText || "Request failed";
    throw new ApiError(res.status, msg, data);
  }
  return data as T;
}
