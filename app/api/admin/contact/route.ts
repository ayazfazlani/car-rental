import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthenticatedRequest, withAdmin } from '@/lib/middleware';
import { contactSchema, enableContactSchema } from '@/lib/validations';
import { revalidateTag } from 'next/cache';

export async function GET() {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ data: contacts });
}

const save = async (request: Request) => {
    try {
        const body = await request.json();
        const validated = contactSchema.parse(body);
        const existing = await prisma.contact.findFirst({ where: { value: validated.value, type: validated.type } });
        if (existing) {
            return NextResponse.json({ message: 'Error', error: 'Phone number already exists' }, { status: 400 });
        }
        const contact = await prisma.contact.create({ data: validated });
        if (contact.enabled) {
            await prisma.contact.updateMany({ data: { enabled: false }, where: { id: { not: contact.id }, type: contact.type } });
        }
        revalidateTag('contact', 'max');

        return NextResponse.json({ data: contact });
    } catch (err) {
        return NextResponse.json({ message: 'Error', error: String(err) }, { status: 500 });
    }
}

async function enableContact(request: AuthenticatedRequest) {
    try {
        const body = await request.json();
        const validated = enableContactSchema.parse(body);
        const existing = await prisma.contact.findFirst({ where: { id: validated.id } });
        if (!existing) {
            return NextResponse.json({ message: 'Error', error: 'Phone number does not exist' }, { status: 400 });
        }
        const contact = await prisma.contact.update({ where: { id: existing.id }, data: { enabled: true } });
        await prisma.contact.updateMany({ data: { enabled: false }, where: { id: { not: contact.id }, type: existing.type } });
        revalidateTag('contact', 'max');

        return NextResponse.json({ data: contact });
    } catch (err) {
        return NextResponse.json({ message: 'Error', error: String(err) }, { status: 500 });
    }
}

export const PUT = withAdmin(enableContact);
export const POST = withAdmin(save);
