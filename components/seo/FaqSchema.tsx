import { Faq } from "@prisma/client";
import JsonLd from "./JsonLd";

export default function FaqSchema({ items }: { items: Faq[] }) {
  if (!items || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return <JsonLd data={schema} />;
}
