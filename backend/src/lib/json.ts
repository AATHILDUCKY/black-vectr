// Helpers for the JSON-string columns SQLite forces us to use for
// arrays/objects. `serializeJsonFields` runs before writes, `parseJsonFields`
// after reads, so the API speaks real arrays/objects to clients.

export function safeParse<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string") return (value as T) ?? fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function parseJsonFields<T extends Record<string, any>>(
  row: T | null,
  fields: string[],
): T | null {
  if (!row) return row;
  const out: Record<string, any> = { ...row };
  for (const f of fields) {
    if (f in out) out[f] = safeParse(out[f], out[f]);
  }
  return out as T;
}

export function parseJsonFieldsAll<T extends Record<string, any>>(
  rows: T[],
  fields: string[],
): T[] {
  return rows.map((r) => parseJsonFields(r, fields) as T);
}

export function serializeJsonFields<T extends Record<string, any>>(
  data: T,
  fields: string[],
): T {
  const out: Record<string, any> = { ...data };
  for (const f of fields) {
    if (f in out && typeof out[f] !== "string") {
      out[f] = JSON.stringify(out[f]);
    }
  }
  return out as T;
}
