import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthenticatedRequest, withAdmin } from '@/lib/middleware';
import { revalidateTag } from 'next/cache';

async function deleteContact(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const existing = await prisma.contact.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ message: 'Error', error: 'Contact not found' }, { status: 404 });
        }

        const deleted = await prisma.contact.delete({ where: { id } });
        revalidateTag('contact', 'max');

        return NextResponse.json({ data: deleted });
    } catch (err) {
        return NextResponse.json({ message: 'Error', error: String(err) }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withAdmin((r) => deleteContact(r, { params }))(req);
}
