import { getActiveContacts } from "@/lib/data/contact";
import { ContactType } from "@prisma/client";
import JsonLd from "./JsonLd";

export default async function OrganizationSchema() {
  const contacts = await getActiveContacts();
  const phone = contacts?.find(c => c.type === ContactType.PHONE)?.value || "+971561234567";
  const whatsapp = contacts?.find(c => c.type === ContactType.WHATSAPP)?.value || "+971561234567";
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Luxus Car Rental",
    "alternateName": "Luxus Car Rental Dubai",
    "url": process.env.NEXT_PUBLIC_APP_URL || "https://luxuscarrental.com",
    "logo": `${process.env.NEXT_PUBLIC_APP_URL || "https://luxuscarrental.com"}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fluxuslogo.39867c4d.png&w=128&q=75`,
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": phone,
        "contactType": "customer service",
        "availableLanguage": ["English", "Arabic"]
      }
    ],
    "sameAs": [
      "https://www.facebook.com/luxuscarrentaldubai",
      "https://www.instagram.com/luxuscarrentaldubai",
      "https://wa.me/" + whatsapp.replace(/[^0-9]/g, '')
    ]
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Luxus Car Rental",
    "url": process.env.NEXT_PUBLIC_APP_URL || "https://luxuscarrental.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_APP_URL || "https://luxuscarrental.com"}/en/cars?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <JsonLd data={schema} />
      <JsonLd data={webSiteSchema} />
    </>
  );
}
