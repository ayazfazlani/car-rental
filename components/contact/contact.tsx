'use server';

import { Button } from "../ui/button";
import Translated from "../translated";
import { prisma } from "@/lib/prisma";
import { ContactType } from "@prisma/client";
import { getContactLink } from "@/lib/utils";
import { ContactIcons } from "./icon";


export default async function Contact() {
    const contacts = await prisma.contact.findMany({ where: { enabled: true } });

    if (!contacts.length) {
        <div className="text-center text-muted-foreground mt-20">
            <Translated key="contact.noContacts" fallback="No contacts added yet" />
        </div>
    }

    return (
        <div className="flex gap-2 mt-4">
            {contacts.map((contact) => (
                <Button
                    size="sm"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs h-9 text-white"
                    asChild
                >
                    <a href={getContactLink(contact)}>
                        <ContactIcons type={contact.type} />
                        <Translated
                            key={
                                contact.type === ContactType.PHONE
                                    ? "contact.callNow" :
                                    contact.type === ContactType.EMAIL
                                        ? "contact.email" :
                                        contact.type === ContactType.WHATSAPP
                                            ? "contact.whatsapp" :
                                            "contact.contactNow"
                            }
                            fallback={"Contact Now"}
                        />
                    </a>
                </Button>
            ))}
        </div>
    );
}