interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

// "<" is escaped so CMS text can never close the script tag
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <>
      {(Array.isArray(data) ? data : [data]).map((entry, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(entry).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
