// Returns a filename from a URL or path
export function fileNameFromUrl(u: string): string {
  try {
    const clean = u.split("?")[0].split("#")[0];
    const parts = clean.split("/");
    return parts[parts.length - 1] || clean;
  } catch {
    return u;
  }
}

// Build an absolute URL if your API returns relative paths
export function toAbsoluteUrl(u: string, base?: string): string {
  if (!u) return u;
  if (/^https?:\/\//i.test(u)) return u;
  try {
    const b = base || (typeof window !== "undefined" ? window.location.origin : "");
    return new URL(u, b).toString();
  } catch {
    return u;
  }
}

// Robust image detection: prefer MIME, fall back to extension
export function isImageAttachment(att: { mime?: string; url?: string; name?: string } | string): boolean {
  if (!att) return false;
  if (typeof att === "string") {
    const n = fileNameFromUrl(att);
    return /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(n);
  }
  const mime = att.mime || "";
  if (mime.startsWith("image/")) return true;
  const candidate = att.name || att.url || "";
  return /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(fileNameFromUrl(candidate));
}