import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthenticatedRequest, withAdmin } from '@/lib/middleware';
import { revalidateTag } from 'next/cache';
import { FaqSchema } from '@/lib/validations';

async function updateFaq(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const body = await request.json();
        const validatedData = FaqSchema.parse(body);

        const existing = await prisma.faq.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ message: 'Error', error: 'Faq not found' }, { status: 404 });
        }

        const updated = await prisma.faq.update({
            where: { id },
            data: {
                question: validatedData.question,
                question_ar: validatedData.question_ar,
                answer: validatedData.answer,
                answer_ar: validatedData.answer_ar,
                isEnabled: validatedData.isEnabled,
            },
        });

        revalidateTag('faq', 'max');

        return NextResponse.json({ data: updated });
    } catch (err) {
        return NextResponse.json({ message: 'Error', error: String(err) }, { status: 500 });
    }
}

async function deleteFaq(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const existing = await prisma.faq.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ message: 'Error', error: 'Faq not found' }, { status: 404 });
        }

        const deleted = await prisma.faq.delete({ where: { id } });
        revalidateTag('faq', 'max');

        return NextResponse.json({ data: deleted });
    } catch (err) {
        return NextResponse.json({ message: 'Error', error: String(err) }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withAdmin((r) => updateFaq(r, { params }))(req);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withAdmin((r) => deleteFaq(r, { params }))(req);
}
