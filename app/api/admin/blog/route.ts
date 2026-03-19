import { AuthenticatedRequest, withAdmin } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { errorResponse, getPaginationMeta, getPaginationParams, successResponse } from "@/lib/utils";
import { CreateBlogSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

async function getBlogs(
    req: AuthenticatedRequest,
) {
    try {
        const { searchParams } = new URL(req.url);
        const where: Prisma.BlogWhereInput = {};
        const pagination = getPaginationParams({
            page: searchParams.get("page") || undefined,
            limit: searchParams.get("limit") || undefined,
        });

        const search = searchParams.get('search');
        const draft = searchParams.get('draft');

        if (search && search !== '') {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { info: { contains: search, mode: 'insensitive' } },
                { tags: { hasSome: search.split(' ') } },
                { keywords: { hasSome: search.split(' ') } },
            ];
        }

        if (draft) {
            where.draft = draft === 'true';
        }

        const blogs = await prisma.blog.findMany({
            where,
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
            orderBy: {
                createdAt: 'desc',
            },
        });

        const total = await prisma.blog.count({ where });

        return NextResponse.json(
            successResponse({
                blogs,
                pagination: getPaginationMeta(total, pagination.page, pagination.limit),
            })
        );
    } catch (error) {
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to fetch blogs"),
            { status: 500 }
        );
    }
}

async function createBlog(req: AuthenticatedRequest) {
    try {
        const body = await req.json();
        const validated = CreateBlogSchema.parse(body);
        if (!validated.content) {
            return NextResponse.json(
                errorResponse("VALIDATION_ERROR", "Content is required"),
                { status: 400 }
            );
        }

        const blog = await prisma.blog.findFirst({ where: { slug: validated.slug } });
        if (blog) {
            return NextResponse.json(
                errorResponse("VALIDATION_ERROR", "Slug already exists"),
                { status: 400 }
            );
        }

        const validatedData = await prisma.blog.create({
            data: {
                ...validated,
                content: validated.content as any,
            },
        });

        revalidateTag('blog', 'max');
        return NextResponse.json(successResponse(validatedData));
    } catch (error) {
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to create blog"),
            { status: 500 }
        );
    }
}

export const GET = withAdmin(getBlogs);
export const POST = withAdmin(createBlog);