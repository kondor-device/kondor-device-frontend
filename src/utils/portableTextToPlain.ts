import type { PortableTextBlock } from "@portabletext/react";

// Plain text of Portable Text blocks (buttons and other non-text blocks are skipped)
export const portableTextToPlain = (blocks?: PortableTextBlock[] | null) =>
  (blocks ?? [])
    .filter((block) => block._type === "block")
    .map((block) =>
      ((block.children as { text?: string }[]) ?? [])
        .map((child) => child.text ?? "")
        .join(""),
    )
    .filter(Boolean)
    .join("\n");
