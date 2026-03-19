import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getTranslations } from "next-intl/server";
import { getActiveContacts } from "@/lib/data/contact";
import { ContactIcons } from "@/components/contact/icon";
import { getContactLink } from "@/lib/utils";
import { Metadata } from 'next';
import { PAGE_METATAGS } from '@/lib/constants';
import { getMetaData } from '@/lib/data/meta-data';
import { formatMetadata } from '@/lib/utils';


export async function generateMetadata(): Promise<Metadata> {
    const meta = await getMetaData(PAGE_METATAGS.CONTACT)
    return formatMetadata(meta)
}
export default async function ContactPage() {
    const t = await getTranslations('footer');
    const contacts = await getActiveContacts()

    return (
        <>
            <Header />
            <main className="container mx-auto px-6 lg:px-12 py-12">
                <h1 className="text-2xl font-bold mb-4">
                    {t("contactPage.title")}
                </h1>
                <div className="space-y-3">
                    {contacts.length > 0 && contacts.map((contact) => (
                        <div className="pt-3">
                            <p className="text-lg mb-1.5 italic">
                                {contact.title}
                            </p>
                            <div className="flex items-center gap-2 ml-6">
                                <ContactIcons type={contact.type} />
                                <a href={getContactLink(contact)} className="text-sm text-foreground hover:text-primary transition-colors">
                                    {contact.value}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </main >
            <Footer />
        </>
    );
}
