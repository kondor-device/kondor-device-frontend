export type PageSearchParams = Record<string, string | string[] | undefined>;

// Appends the visitor's query string to a redirect target.
// next/navigation's redirect()/permanentRedirect() only send the path we give
// them, so without this an old link like /catalog/<product>?color=…&utm_source=…&fbclid=…
// lands on the new URL with the color, UTM tags and click ids cut off: GA4 then
// files the ad visit as direct traffic and Meta loses the click.
export function withQuery(path: string, searchParams: PageSearchParams): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) continue;
    for (const item of Array.isArray(value) ? value : [value]) {
      query.append(key, item);
    }
  }
  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
}
