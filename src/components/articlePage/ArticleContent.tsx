import { PortableText } from "@portabletext/react";
import { BlogPost } from "@/types/blog";
import { blogPortableTextComponents } from "./portableText/blogPortableTextComponents";

interface ArticleContentProps {
  content: BlogPost["content"];
}

export default function ArticleContent({ content }: ArticleContentProps) {
  if (!content?.length) return null;

  return (
    <div className="min-w-0">
      <PortableText value={content} components={blogPortableTextComponents} />
    </div>
  );
}
