import { CarBrand } from "@prisma/client";
import JsonLd from "./JsonLd";
import { getImageUrl } from "@/lib/utils";

export default function BrandsSchema({ brands, locale }: { brands: CarBrand[], locale: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://luxuscarrental.com";
  
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Car Brands for Rental in Dubai",
    "numberOfItems": brands.length,
    "itemListElement": brands.map((brand, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Brand",
        "name": brand.name,
        "url": `${baseUrl}/${locale}/brands/${brand.slug}`,
        "logo": brand.logoUrl ? getImageUrl(brand.logoUrl) : undefined
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
        "name": "Brands",
        "item": `${baseUrl}/${locale}/brands`
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
