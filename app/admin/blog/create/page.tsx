'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { CreateBlogSchema, TCreateBlog } from '@/lib/validations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AddContent } from '@/components/admin/blog/components';
import { useMutation } from '@tanstack/react-query';
import { API } from '@/lib/api';
import { Asset, Blog } from '@prisma/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImageIcon, XCircle, Loader2, FileText, Tag, Key } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

const initialValues: TCreateBlog = {
    title: '',
    slug: '',
    content: {},
    tags: [],
    cover: '',
    info: '',
    keywords: [],
    draft: true,
}

export default function Page() {
    const router = useRouter()
    const [tag, setTag] = React.useState<string>('')
    const [keyword, setKeyword] = React.useState<string>('')
    const [content, setContent] = React.useState<any>(null)

    const { mutate: createBlog, isPending } = useMutation({
        mutationFn: (data: TCreateBlog) => API.queryPost<Blog>({ url: '/api/admin/blog', payload: data, auth: true }),
        onSuccess: (data: Blog) => {
            toast.success('Blog created successfully!')
            router.push(`/blog/${data.slug}`)
        },
        onError: (error: any) => toast.error(error.message || 'Something went wrong'),
    })

    const { mutate: uploadAsset } = useMutation({
        mutationFn: (data: FormData) => API.queryPost<Asset>({ url: '/api/admin/assets', payload: data, auth: true, isMultipart: true }),
        onSuccess: (data: Asset) => {
            toast.success('Cover image uploaded')
            form.setValue('cover', data.url)
        },
        onError: (error: any) => toast.error(error.message),
    })

    const onUploadCover = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = () => {
            if (input.files?.[0]) {
                const formData = new FormData()
                formData.append('file', input.files[0])
                uploadAsset(formData)
            }
        }
        input.click()
    }

    const form = useForm<TCreateBlog>({
        defaultValues: initialValues,
        resolver: zodResolver(CreateBlogSchema)
    })

    const onSubmit = (data: TCreateBlog) => {
        createBlog(data)
    }

    const updateContent = (html: string, contentJson: any, text: string) => {
        setContent(contentJson)
        form.setValue('content', contentJson)

        let info = text?.trim() || ''
        info = info.length > 160 ? info.slice(0, 160) + '...' : info
        form.setValue('info', info)
    }

    const handelTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value
        form.setValue('title', title)
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        form.setValue('slug', slug)
    }

    const handelTagsChange = () => {
        if (!tag.trim()) return
        const currentTags = form.getValues('tags') || []
        if (currentTags.includes(tag.trim())) return toast.error('Tag already exists')
        form.setValue('tags', [...currentTags, tag.trim()])
        setTag('')
    }

    const onRemoveTag = (index: number) => {
        const tags = form.getValues('tags') || []
        form.setValue('tags', tags.filter((_, i) => i !== index))
    }

    const handelKeywordsChange = () => {
        if (!keyword.trim()) return
        const currentKeywords = form.getValues('keywords') || []
        if (currentKeywords.includes(keyword.trim())) return toast.error('Keyword already exists')
        form.setValue('keywords', [...currentKeywords, keyword.trim()])
        setKeyword('')
    }

    const onRemoveKeyword = (index: number) => {
        const keywords = form.getValues('keywords') || []
        form.setValue('keywords', keywords.filter((_, i) => i !== index))
    }

    return (
        <div className='flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-8'>
            <div className='mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                <div>
                    <h1 className='text-4xl font-bold'>Create New Blog</h1>
                    <p className='text-slate-600'>Write and publish a new blog post</p>
                </div>
                <div className='flex gap-3'>
                    <Button variant="outline" disabled={isPending} onClick={() => { form.setValue('draft', true); form.handleSubmit(onSubmit)() }}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save as Draft
                    </Button>
                    <Button disabled={isPending} onClick={() => { form.setValue('draft', false); form.handleSubmit(onSubmit)() }}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Publish
                    </Button>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Title & Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Blog Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField name="title" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} onChange={handelTitleChange} placeholder="Blog Title" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField name="slug" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="blog-post-slug" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* Tags & Keywords - Add your existing cards here if needed */}

                    {/* Cover Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cover Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div onClick={onUploadCover} className="cursor-pointer border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                                {form.watch('cover') ? (
                                    <Image src={getImageUrl(form.watch('cover'))!} alt="cover" width={600} height={400} className="mx-auto rounded-lg" />
                                ) : (
                                    <div className="text-slate-500">
                                        <ImageIcon className="w-12 h-12 mx-auto mb-3" />
                                        <p>Click to upload cover image</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Editor */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AddContent content={content} updateContent={updateContent} />
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    )
}