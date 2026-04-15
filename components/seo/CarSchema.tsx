import { Car, CarBrand, CarCategory, CarImage, CarFaq } from "@prisma/client";
import JsonLd from "./JsonLd";
import { getImageUrl } from "@/lib/utils";
import { getSettingsMap } from "@/lib/data/settings";
import { KEY_VALUE_TYPES } from "@/lib/constants";

type TCar = Car & {
  brand?: CarBrand | null;
  category?: CarCategory | null;
  images?: CarImage[];
  carFaqs?: CarFaq[];
};

export default async function CarSchema({ car, locale }: { car: TCar, locale: string }) {
  const primaryImage = car.images?.find((img) => img.isPrimary)?.url || car.images?.[0]?.url;
  
  const settingsMap = await getSettingsMap();
  const siteLogo = settingsMap[KEY_VALUE_TYPES.SITE_LOGO];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://luxuscarrental.com";

  const fallbackLogo = siteLogo 
    ? (siteLogo.startsWith('http') ? siteLogo : `${baseUrl}${siteLogo}`)
    : `${baseUrl}/images/luxuslogo.png`;

  const logo = car.brand?.logoUrl || fallbackLogo;
  const carUrl = `${baseUrl}/${locale}/cars/${car.slug}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${car.brand?.name} ${car.model} Rental`,
    "image": getImageUrl(primaryImage),
    "description": car.description || `Rent ${car.brand?.name} ${car.model} in Dubai with ${process.env.NEXT_PUBLIC_SITE_NAME}. Best rates for daily, weekly, and monthly rentals.`,
    "brand": {
      "@type": "Brand",
      "name": car.brand?.name,
      "logo": getImageUrl(logo)
    },
    "offers": {
      "@type": "Offer",
      "url": carUrl,
      "priceCurrency": "AED",
      "price": car.baseDailyPrice.toString(),
      "itemCondition": "https://schema.org/UsedCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": process.env.NEXT_PUBLIC_SITE_NAME as string
      }
    }
  };

  const carSchema = {
    "@context": "https://schema.org",
    "@type": "Car",
    "name": `${car.brand?.name} ${car.model}`,
    "image": getImageUrl(primaryImage),
    "model": car.model,
    "brand": car.brand?.name,
    "color": car.color,
    "manufacturer": car.brand?.name,
    "vehicleConfiguration": `${car.transmission}, ${car.fuelType}, ${car.seats} seats`,
    "bodyType": car.category?.name,
    "seatingCapacity": car.seats,
    "numberOfDoors": car.doors,
    "url": carUrl
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
        "name": car.brand?.name,
        "item": `${baseUrl}/${locale}/brands/${car.brand?.slug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": car.model,
        "item": carUrl
      }
    ]
  };

  let faqSchema = null;
  if (car.carFaqs && car.carFaqs.length > 0) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": car.carFaqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  return (
    <>
      <JsonLd data={productSchema} />
      <JsonLd data={carSchema} />
      <JsonLd data={breadcrumbSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
    </>
  );
}
