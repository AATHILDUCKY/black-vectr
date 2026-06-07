"use client";

// Browser-side API helper. Goes through the Next rewrite (/api → backend) so
// cookies (the JWT) are sent same-origin. Used by forms and the admin UI.

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: {
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
    ...options,
  });

  if (res.status === 204) return undefined as T;

  const data = res.headers.get("content-type")?.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "error" in data && (data as any).error) ||
      `Request failed (${res.status})`;
    throw new ApiError(res.status, message, (data as any)?.details);
  }
  return data as T;
}

// Purge the public site's cache after an admin mutation so edits appear right
// away. `tag` is the content type (e.g. "logos"); omit to purge all. Best-effort
// — never blocks or throws the calling save flow.
export async function revalidatePublic(tag?: string): Promise<void> {
  try {
    await fetch("/revalidate", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tag ? { tag } : {}),
    });
  } catch {
    // Ignore — the page will still refresh within the normal revalidate window.
  }
}
