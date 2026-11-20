import { jsonLd } from "@/lib/seo";

/** Structured data for search engines (schema.org JSON-LD). */
export default function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(data)} />;
}
