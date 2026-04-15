import { Link } from "@/i18n/routing";
import Image from "next/image";
import Logo from "@/public/images/luxuslogo.png";
import { getLocale, getTranslations } from "next-intl/server";
import { getActiveContacts } from "@/lib/data/contact";
import { getSettingsMap } from '@/lib/data/settings'
import { ContactIcons } from "./contact/icon";
import { getContactLink } from "@/lib/utils";
import { KEY_VALUE_TYPES } from "@/lib/constants";

export async function Footer() {
  const locale = await getLocale()
  const t = await getTranslations("footer");
  const contacts = await getActiveContacts()
  const settingsMap = await getSettingsMap()
  const siteLogo = settingsMap[KEY_VALUE_TYPES.SITE_LOGO]

  const footerKey = locale === 'ar' ? KEY_VALUE_TYPES.FOOTER_DESCRIPTION_AR : KEY_VALUE_TYPES.FOOTER_DESCRIPTION_EN
  const footerDescription = settingsMap[footerKey]

  return (
    <footer className="bg-blue py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="mb-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={siteLogo || Logo}
                  alt={process.env.NEXT_PUBLIC_SITE_NAME || "Car Rental"}
                  width={120}
                  height={40}
                  className=" w-auto"
                />
              </Link>
            </div>
            <div
              className="text-sm text-muted-foreground leading-relaxed prose prose-sm prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: footerDescription ?? t("description") ?? "Find the best deals on budget and luxury car rentals with professional chauffeur services. Based in Dubai, we serve customers across select cities worldwide."
              }}
            />
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">
              {t("resources") || "Resources"}
            </h3>
            <ul className="space-y-2.5">
              {[
                { key: "rentCarsByBrand", label: "Rent Cars by Brand", url: "/cars" },
                { key: "carWithDriver", label: "Car with Driver", url: "/cars?hasChauffeur=true" },
                { key: "carRentalDirectory", label: "Car Rental Directory", url: "/cars" },
              ].map((item) => (
                <li key={item.key}>
                  <Link
                    // @ts-expect-error query not in type
                    href={item.url || "/"}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {t(item.key) || item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">
              {t("company") || "Company"}
            </h3>
            <ul className="space-y-2.5">
              {[
                { key: "aboutUs", label: "About Us", url: "/company/about" },
                { key: "contactUs", label: "Contact Us", url: "/company/contact" },
              ].map((item) => (
                <li key={item.key}>
                  <Link
                    // @ts-expect-error query not in type
                    href={item.url || "/"}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {t(item.key) || item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">
              {t("legal") || "Legal"}
            </h3>
            <ul className="space-y-2.5">
              {[
                { key: "privacyPolicy", label: "Privacy Policy", url: "/legal/privacy-policy" },
                { key: "termsConditions", label: "Terms & Conditions", url: "/legal/terms-conditions" },
                { key: "termsOfUse", label: "Terms of Use", url: "/legal/terms-of-use" },
                { key: "sitemap", label: "Sitemap", url: "/sitemap.xml" },
              ].map((item) => (
                <li key={item.key}>
                  {item.url === "/sitemap.xml" ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {t(item.key) || item.label}
                    </a>
                  ) : (
                    <Link
                      // @ts-expect-error query not in type
                      href={item.url || "/"}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {t(item.key) || item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <div className="space-y-3">
              {contacts.length > 0 && contacts.map((contact) => (
                <div key={contact.id} className="pt-3">
                  <p className="text-xs text-muted-foreground mb-1.5 italic">
                    {contact.title}
                  </p>
                  <div className="flex items-center gap-3">
                    <ContactIcons type={contact.type} />
                    <a href={getContactLink(contact)} className="text-sm text-foreground hover:text-primary transition-colors">
                      {contact.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            ©{process.env.NEXT_PUBLIC_SITE_NAME} 2026.{" "}
            {t("allRightsReserved") || "All rights reserved"}
          </p>
        </div>
      </div>
    </footer>
  );
}
