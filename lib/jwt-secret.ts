/** Match Express / dotenv: trim and strip one pair of surrounding quotes. */
export function normalizeJwtSecret(raw: string | undefined): string {
  if (raw == null) return "";
  let s = raw.trim();
  if (
    s.length >= 2 &&
    ((s.startsWith('"') && s.endsWith('"')) ||
      (s.startsWith("'") && s.endsWith("'")))
  ) {
    s = s.slice(1, -1);
  }
  return s;
}

export function getJwtSecret(): string | undefined {
  const s = normalizeJwtSecret(process.env.JWT_SECRET);
  return s || undefined;
}
