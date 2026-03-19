import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin } from '@/lib/middleware';
import { successResponse } from '@/lib/utils';
import { revalidateTag } from 'next/cache';
import { FaqSchema } from '@/lib/validations';

export async function GET() {
    try {
        const items = await prisma.faq.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json({ data: items });
    } catch (err) {
        return NextResponse.json({ message: 'Error', error: String(err) }, { status: 500 });
    }
}

const save = async (request: Request) => {
    try {
        const body = await request.json();
        const validatedData = FaqSchema.parse(body);

        const item = await prisma.faq.create({
            data: {
                question: validatedData.question,
                question_ar: validatedData.question_ar,
                answer: validatedData.answer,
                answer_ar: validatedData.answer_ar,
                isEnabled: validatedData.isEnabled,
            },
        });

        revalidateTag('faq', 'max');

        return NextResponse.json(successResponse(item, 'saved'));
    } catch (err) {
        return NextResponse.json({ message: 'Error', error: String(err) }, { status: 500 });
    }
};

export const POST = withAdmin(save);
