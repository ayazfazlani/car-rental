import { AuthenticatedRequest, withAdmin } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/utils";
import { CreateBlogSchema } from "@/lib/validations";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

async function getBlog(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const blog = await prisma.blog.findUnique({ where: { id } });
        return NextResponse.json(successResponse(blog));
    } catch (error) {
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to fetch blog"),
            { status: 500 }
        );
    }
}

async function deleteBlog(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const blog = await prisma.blog.findUnique({ where: { id } });
        if (!blog) {
            return NextResponse.json(
                errorResponse("NOT_FOUND", "Blog not found"),
                { status: 404 }
            );
        }
        await prisma.blog.delete({ where: { id } });
        revalidateTag('blog', 'max');
        return NextResponse.json(successResponse(blog));
    } catch (error) {
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to delete blog"),
            { status: 500 }
        );
    }
}

async function updateBlog(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const validate = CreateBlogSchema.parse(body);
        const blog = await prisma.blog.findUnique({ where: { id } });
        if (!blog) {
            return NextResponse.json(
                errorResponse("NOT_FOUND", "Blog not found"),
                { status: 404 }
            );
        }

        const exists = await prisma.blog.findFirst({ where: { slug: validate.slug, id: { not: blog.id } } });
        if (exists) {
            return NextResponse.json(
                errorResponse("VALIDATION_ERROR", "Slug already exists"),
                { status: 400 }
            );
        }

        const validated = await prisma.blog.update({
            where: { id },
            data: validate,
        });
        revalidateTag('blog', 'max');

        return NextResponse.json(successResponse(validated));
    } catch (error) {
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to update blog"),
            { status: 500 }
        );
    }
}

async function draftAction(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        if (!body.draft) {
            return NextResponse.json(
                errorResponse("VALIDATION_ERROR", "Draft is required"),
                { status: 400 }
            );
        }

        const draft = (body.draft && typeof body.draft === 'boolean') ? body.draft : false;
        const blog = await prisma.blog.findUnique({ where: { id } });

        if (!blog) {
            return NextResponse.json(
                errorResponse("NOT_FOUND", "Blog not found"),
                { status: 404 }
            );
        }

        const validated = await prisma.blog.update({
            where: { id },
            data: {
                draft: draft,
            },
        });

        revalidateTag('blog', 'max');

        return NextResponse.json(successResponse(validated));
    } catch (error) {
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to update blog"),
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withAdmin((r) => deleteBlog(r, { params }))(req);
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withAdmin((r) => getBlog(r, { params }))(req);
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withAdmin((r) => updateBlog(r, { params }))(req);
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withAdmin((r) => draftAction(r, { params }))(req);
}