interface JsonLdProps {
  data: Record<string, unknown>;
}

// "<" is escaped so CMS text can never close the script tag
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
