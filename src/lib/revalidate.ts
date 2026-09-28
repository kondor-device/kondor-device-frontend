import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";
import { client } from "@/lib/sanityClient";

// Спільні хелпери ревалідації кешу: використовуються Sanity-вебхуком
// (`/api/revalidate`) і Telegram-вебхуком модерації відгуків.

export function getLocalizedPaths(pathname: string): string[] {
  const paths = new Set<string>();

  // Публічний URL без префікса (localePrefix: "as-needed")
  paths.add(pathname);

  // Внутрішній шлях App Router з [locale] — саме він часто є ключем кешу
  // після static generation / ISR, включно для defaultLocale.
  routing.locales.forEach((locale) => {
    paths.add(`/${locale}${pathname === "/" ? "" : pathname}`);
  });

  return [...paths];
}

export function revalidatePaths(
  paths: string[],
  type: "page" | "layout" = "page"
): string[] {
  const revalidated = new Set<string>();

  paths.forEach((path) => {
    revalidatePath(path, type);
    revalidated.add(`${path} (${type})`);
  });

  return [...revalidated];
}

export function revalidateSitePages(): string[] {
  // layout — щоб скинути ISR layout (`revalidate = 3600`) і вкладені сторінки
  return [
    ...revalidatePaths(getLocalizedPaths("/"), "layout"),
    ...revalidatePaths(getLocalizedPaths("/catalog"), "layout"),
  ];
}

export function revalidateProductPage(
  slug: string,
  categorySlug: string | null
): string[] {
  const paths = [
    // Легасі-редірект /catalog/[product] (без категорії в URL)
    ...revalidatePaths(getLocalizedPaths(`/catalog/${slug}`), "page"),
  ];

  if (categorySlug) {
    paths.push(
      ...revalidatePaths(
        getLocalizedPaths(`/catalog/${categorySlug}/${slug}`),
        "page"
      ),
      // Категорія теж може змінити свій вміст (наприклад, товар щойно
      // опублікували в цій категорії)
      ...revalidatePaths(getLocalizedPaths(`/catalog/${categorySlug}`), "page")
    );
  }

  return paths;
}

export async function resolveProductCategorySlug(
  productSlug: string
): Promise<string | null> {
  const category = await client.fetch<{ slug?: string } | null>(
    `*[_type == "item" && slug == $slug][0]{ "slug": cat->slug }`,
    { slug: productSlug },
    { cache: "no-store" }
  );

  return category?.slug ?? null;
}

// Сторінка товару та все, що показує його рейтинг (каталог, головна)
export async function revalidateProductWithRating(
  productSlug: string,
  categorySlug?: string | null
): Promise<string[]> {
  const category = categorySlug ?? (await resolveProductCategorySlug(productSlug));

  return [
    ...revalidateSitePages(),
    ...revalidateProductPage(productSlug, category),
  ];
}
