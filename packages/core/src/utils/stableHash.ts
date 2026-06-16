export function stableHash(val: unknown): string {
  if (typeof val === "function") {
    return `"fn:${(val as Function).toString()}"`;
  }
  if (Array.isArray(val)) {
    return "[" + val.map(stableHash) + "]";
  }
  if (val !== null && typeof val === "object") {
    return (
      "{" +
      Object.keys(val as object)
        .sort()
        .map((k) => `"${k}":${stableHash((val as Record<string, unknown>)[k])}`)
        .join(",") +
      "}"
    );
  }
  return JSON.stringify(val);
}