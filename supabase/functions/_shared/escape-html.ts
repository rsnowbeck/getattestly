/**
 * Escapes HTML special characters to prevent HTML injection in email templates.
 */
export function escapeHtml(s: string | undefined | null): string {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Escapes a value for safe use in an HTML attribute (href, src, etc.).
 * Validates URL protocol to prevent javascript: injection.
 */
export function escapeAttr(url: string | undefined | null): string {
  if (!url) return "";
  const escaped = escapeHtml(url);
  // Block javascript: and data: protocols
  const lower = url.toLowerCase().trim();
  if (lower.startsWith("javascript:") || lower.startsWith("data:")) {
    return "";
  }
  return escaped;
}
