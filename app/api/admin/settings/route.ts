import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdmin } from '@/lib/middleware';
import { errorResponse, successResponse } from '@/lib/utils';
import { revalidateTag } from 'next/cache';

export async function GET() {
    try {
        const items = await prisma.keyValuePair.findMany({ where: { deletedAt: null } });
        return NextResponse.json({ data: items });
    } catch (err) {
        return NextResponse.json({ message: 'Error', error: String(err) }, { status: 500 });
    }
}

const saveOrUpdate = async (request: Request) => {
    try {
        const body = await request.json();
        const pairs = Array.isArray(body) ? body : body.pairs || [];

        const results: any[] = [];
        for (const p of pairs) {
            if (!p?.key) continue;
            const res = await prisma.keyValuePair.upsert({
                where: { key: p.key },
                create: { key: p.key, value: p.value || '' },
                update: { value: p.value || '' },
            });
            results.push(res);
        }

        revalidateTag('settings', 'max');

        return NextResponse.json(successResponse(results, 'saved'));
    } catch (err) {
        return NextResponse.json({ message: 'Error', error: String(err) }, { status: 500 });
    }
};

export const PUT = withAdmin(saveOrUpdate);
export const POST = withAdmin(saveOrUpdate);
