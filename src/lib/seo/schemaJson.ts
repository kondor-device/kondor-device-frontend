const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// schema.org JSON uploaded to a SEO block in the admin (`seoSettings.schemaJson`)
export async function fetchSchemaJsonLd(
  url?: string | null,
): Promise<Record<string, unknown>[] | null> {
  if (!url?.trim()) return null;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const parsed: unknown = await res.json();
    const objects = (Array.isArray(parsed) ? parsed : [parsed]).filter(isObject);

    return objects.length > 0 ? objects : null;
  } catch {
    return null;
  }
}
