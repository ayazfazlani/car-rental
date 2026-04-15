import { getActiveContacts } from "@/lib/data/contact";
import { ContactType } from "@prisma/client";
import JsonLd from "./JsonLd";
import { getSettingsMap } from "@/lib/data/settings";
import { KEY_VALUE_TYPES } from "@/lib/constants";

export default async function OrganizationSchema() {
  const contacts = await getActiveContacts();
  const settingsMap = await getSettingsMap();
  const siteLogo = settingsMap[KEY_VALUE_TYPES.SITE_LOGO];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://luxuscarrental.com";
  
  const phone = contacts?.find(c => c.type === ContactType.PHONE)?.value || "+971561234567";
  const whatsapp = contacts?.find(c => c.type === ContactType.WHATSAPP)?.value || "+971561234567";

  const logoUrl = siteLogo 
    ? (siteLogo.startsWith('http') ? siteLogo : `${baseUrl}${siteLogo}`)
    : `${baseUrl}/images/luxuslogo.png`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": process.env.NEXT_PUBLIC_SITE_NAME as string,
    "alternateName": `${process.env.NEXT_PUBLIC_SITE_NAME} Dubai`,
    "url": baseUrl,
    "logo": logoUrl,
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
    "name": process.env.NEXT_PUBLIC_SITE_NAME as string,
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
