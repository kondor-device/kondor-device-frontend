import Image from "next/image";
import type { PortableTextComponents } from "@portabletext/react";
import { Link } from "@/i18n/routing";
import { urlForImage } from "@/lib/sanityImage";
import type {
  BlogButtonValue,
  BlogGalleryValue,
  BlogImageValue,
  BlogTableValue,
} from "@/types/blog";

const CONTENT_IMAGE_SIZES = "(max-width: 1279px) 100vw, 860px";

const isExternal = (href: string) =>
  /^https?:\/\//.test(href) || href.startsWith("mailto:");

const LINK_CLASS =
  "font-semibold text-yellow underline underline-offset-2 transition duration-300 ease-out laptop:hover:brightness-125 focus-visible:brightness-125";

const BUTTON_CLASS =
  "inline-flex items-center justify-center min-h-[40px] laptop:min-h-[52px] px-8 py-3 rounded-full text-14bold laptop:text-16bold text-dark bg-yellowGradient transition duration-300 ease-out active:scale-95 active:brightness-[115%] laptop:hover:brightness-[115%] focus-visible:brightness-[115%] outline-none";

/** Internal links go through the locale-aware Link, external ones are plain anchors. */
function SmartLink({
  href,
  newTab,
  className,
  children,
}: {
  href: string;
  newTab?: boolean;
  className: string;
  children: React.ReactNode;
}) {
  if (isExternal(href)) {
    return (
      <a
        href={href}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      target={newTab ? "_blank" : undefined}
      className={className}
    >
      {children}
    </Link>
  );
}

const contentImageUrl = (image: BlogImageValue, width: number) =>
  urlForImage(image as Parameters<typeof urlForImage>[0])
    .width(width)
    .fit("max")
    .auto("format")
    .url();

/**
 * Portable Text serializers for article content and FAQ answers. They cover
 * every block of the Sanity `articlePortableText` schema: h2-h4, lists,
 * strong/em/link marks, image, gallery, table and the button block.
 */
export const blogPortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-14med laptop:text-16med leading-[170%]">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 laptop:mt-12 mb-4 laptop:mb-6 text-22bold laptop:text-32bold first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 laptop:mt-8 mb-3 laptop:mb-4 text-18bold laptop:text-24bold first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-5 mb-2 text-16bold laptop:text-20bold first:mt-0">
        {children}
      </h4>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="flex flex-col gap-2 mb-4 pl-5 list-disc marker:text-yellow">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="flex flex-col gap-2 mb-4 pl-5 list-decimal marker:text-yellow marker:font-bold">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-14med laptop:text-16med leading-[170%]">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="text-14med laptop:text-16med leading-[170%]">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <SmartLink
        href={value?.href ?? "#"}
        newTab={value?.blank}
        className={LINK_CLASS}
      >
        {children}
      </SmartLink>
    ),
  },
  types: {
    image: ({ value }: { value: BlogImageValue }) => {
      if (!value?.asset) return null;

      return (
        <figure className="my-6 laptop:my-8 rounded-[12px] laptop:rounded-[20px] shadow-card bg-white overflow-hidden">
          <Image
            src={contentImageUrl(value, 1600)}
            alt={value.alt ?? ""}
            width={value.dimensions?.width ?? 1200}
            height={value.dimensions?.height ?? 800}
            sizes={CONTENT_IMAGE_SIZES}
            className="w-full h-auto max-h-[80dvh] object-contain"
          />
        </figure>
      );
    },
    gallerySection: ({ value }: { value: BlogGalleryValue }) => {
      const items = (value?.items ?? []).filter((item) => item.image?.asset);
      if (items.length === 0) return null;

      return (
        <ul className="grid grid-cols-2 tab:grid-cols-3 gap-2 laptop:gap-4 my-6 laptop:my-8">
          {items.map((item, idx) => (
            <li
              key={item._key ?? idx}
              className="relative aspect-square rounded-[8px] laptop:rounded-[16px] shadow-card bg-white overflow-hidden"
            >
              <Image
                src={contentImageUrl(item.image as BlogImageValue, 900)}
                alt={item.image?.alt ?? ""}
                fill
                sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 280px"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      );
    },
    table: ({ value }: { value: BlogTableValue }) => {
      const [header, ...body] = value?.rows ?? [];
      if (!header) return null;

      return (
        <div className="my-6 laptop:my-8 rounded-[12px] laptop:rounded-[20px] shadow-card overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="bg-yellowGradient text-dark">
                {(header.cells ?? []).map((cell, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 laptop:px-5 laptop:py-4 text-12bold laptop:text-16bold"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, rowIdx) => (
                <tr
                  key={row._key ?? rowIdx}
                  className="border-t border-lightGrey odd:bg-surface"
                >
                  {(row.cells ?? []).map((cell, idx) => (
                    <td
                      key={idx}
                      className={`px-4 py-3 laptop:px-5 laptop:py-4 text-12med laptop:text-14med ${
                        idx === 0 ? "font-bold" : ""
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    faqAnswerButton: ({ value }: { value: BlogButtonValue }) => (
      <div className="inline-block mt-2 mb-4 mr-3">
        <SmartLink
          href={value?.href ?? "/"}
          newTab={value?.newTab}
          className={BUTTON_CLASS}
        >
          {value?.label ?? ""}
        </SmartLink>
      </div>
    ),
  },
};
