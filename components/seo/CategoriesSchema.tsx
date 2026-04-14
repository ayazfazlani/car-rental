import { CarCategory } from "@prisma/client";
import JsonLd from "./JsonLd";

export default function CategoriesSchema({ categories, locale }: { categories: CarCategory[], locale: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://luxuscarrental.com";
  
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Car Rental Categories in Dubai",
    "numberOfItems": categories.length,
    "itemListElement": categories.map((cat, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Thing",
        "name": cat.name,
        "url": `${baseUrl}/${locale}/categories/${cat.slug}`,
        "description": cat.description
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${baseUrl}/${locale}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Categories",
        "item": `${baseUrl}/${locale}/categories`
      }
    ]
  };

  return (
    <>
      <JsonLd data={itemListSchema} />
      <JsonLd data={breadcrumbSchema} />
    </>
  );
}
