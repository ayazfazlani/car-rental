'use client'
import React from 'react'
import Image from 'next/image'
import { Content } from '@tiptap/react'
import { useRouter, useParams } from 'next/navigation';
import { CreateBlogSchema, TCreateBlog } from '@/lib/validations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AddContent } from '@/components/admin/blog/components';
import { useMutation, useQuery } from '@tanstack/react-query';
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

// Helper function to get initial values based on edit mode
const getInitialValues = (blog?: Blog): TCreateBlog => ({
    title: blog?.title || '',
    slug: blog?.slug || '',
    content: blog?.content || {},
    tags: blog?.tags || [],
    cover: blog?.cover || '',
    info: blog?.info || '',
    keywords: blog?.keywords || [],
    draft: blog?.draft ?? true,
    canonical: blog?.canonical || '',
    seo_title: blog?.seo_title || '',
    seo_description: blog?.seo_description || '',
})

export default function Page() {
    const router = useRouter()
    const params = useParams()
    const blogId = params?.id as string // Assuming route is /admin/blog/edit/[id]
    const isEditMode = !!blogId

    const [tag, setTag] = React.useState<string>('')
    const [keyword, setKeyword] = React.useState<string>('')
    const [content, setContent] = React.useState<Content>({})

    // Fetch blog data if in edit mode
    const { data: existingBlog, isLoading: isLoadingBlog } = useQuery({
        queryKey: ['blog', blogId],
        queryFn: () => API.queryGet<Blog>({ url: `/api/admin/blog/${blogId}`, auth: true }),
        enabled: isEditMode,
    })

    const form = useForm({
        defaultValues: getInitialValues(),
        resolver: zodResolver(CreateBlogSchema)
    })

    // Populate form and editor when existing blog data is loaded
    React.useEffect(() => {
        if (isEditMode && existingBlog) {
            // Reset form with existing blog data
            form.reset({
                title: existingBlog.title || '',
                slug: existingBlog.slug || '',
                content: existingBlog.content || {},
                tags: existingBlog.tags || [],
                cover: existingBlog.cover || '',
                info: existingBlog.info || '',
                keywords: existingBlog.keywords || [],
                draft: existingBlog.draft ?? true,
                canonical: existingBlog.canonical || '',
                seo_title: existingBlog.seo_title || '',
                seo_description: existingBlog.seo_description || '',
            })

            // Set content for the rich text editor
            if (existingBlog.content) {
                setContent(existingBlog.content as Content)
            }
        }
    }, [isEditMode, existingBlog, form])

    const { mutate: saveBlog, isPending } = useMutation({
        mutationFn: (data: TCreateBlog) => {
            if (isEditMode) {
                return API.queryPut<Blog>({
                    url: `/api/admin/blog/${blogId}`,
                    payload: data,
                    auth: true
                })
            }
            return API.queryPost<Blog>({
                url: '/api/admin/blog',
                payload: data,
                auth: true
            })
        },
        onSuccess: (data: Blog) => {
            toast.success(isEditMode ? 'Blog updated successfully' : 'Blog created successfully')
            router.push(`/blog/${data.slug}`)
        },
        onError: (error: any) => {
            toast.error(error.message || 'Something went wrong')
        }
    })

    const { mutate: uploadAsset } = useMutation({
        mutationFn: (data: FormData) => API.queryPost<Asset>({
            url: '/api/admin/assets',
            payload: data,
            auth: true,
            isMultipart: true
        }),
        onSuccess: (data: Asset) => {
            toast.success('Asset uploaded')
            form.setValue('cover', data.url)
        },
        onError: (error: any) => {
            toast.error(error.message)
        }
    })

    const onUpload = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.multiple = false
        input.onchange = async () => {
            if (!input.files) return
            const file = input.files[0]
            const formData = new FormData()
            formData.append('file', file)
            uploadAsset(formData)
        }
        input.click()
    }

    const onSubmit = (formData: TCreateBlog) => {
        // Merge the rich text editor content into the submission payload
        const payload: TCreateBlog = {
            ...formData,
            // Ensure we always send the latest editor content (JSON format)
            content: content,
        };
        saveBlog(payload);
    }

    const updateContent = (content: Content, contentJson: Object, text: string) => {
        setContent(content);
        form.setValue('content', contentJson)
        let info = text;
        info = info.length > 100 ? info.slice(0, 100) + '...' : info;
        info = info.replace(/\s+/g, ' ').trim();
        form.setValue('info', info)
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value
        form.setValue('title', title)
        // Only auto-generate slug if not in edit mode OR if slug is empty/auto-generated
        if (!isEditMode || !form.getValues('slug') || form.getValues('slug') === form.getValues('title')?.toLowerCase().replace(/ /g, '-')) {
            let slug = title.toLowerCase().replace(/ /g, '-')
            form.setValue('slug', slug)
        }
        form.setValue('info', title) // Fix Me - This should be separate from title
    }

    const handleTagsChange = () => {
        if (tag !== '') {
            const tags = form.getValues('tags') || []
            if (tags.includes(tag)) {
                toast.error('Tag already exists')
                return;
            }
            if (tags.length > 6) {
                toast.error('Tag length must be less than 6')
                return;
            }
            form.setValue('tags', [...tags, tag])
            setTag('')
        }
    }

    const onRemoveTag = (index: number) => {
        const tags = form.getValues('tags') || []
        form.setValue('tags', tags.filter((_, i) => i !== index))
    }

    const handleKeywordsChange = () => {
        if (keyword !== '') {
            const keywords = form.getValues('keywords') || []
            if (keywords.includes(keyword)) {
                toast.error('Keyword already exists')
                return;
            }
            form.setValue('keywords', [...keywords, keyword])
            setKeyword('')
        }
    }

    const onRemoveKeyword = (index: number) => {
        const keywords = form.getValues('keywords') || []
        form.setValue('keywords', keywords.filter((_, i) => i !== index))
    }

    // Show loading state while fetching existing blog
    if (isEditMode && isLoadingBlog) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
            </div>
        )
    }

    const handleSaveAsDraft = () => {
        // Explicitly set draft flag before submitting
        form.setValue('draft', true);
        form.handleSubmit(onSubmit)();
    };

    const handlePublish = () => {
        // Ensure draft flag is false for publishing
        form.setValue('draft', false);
        form.handleSubmit(onSubmit)();
    };

    return (
        <div className='flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-8'>
            {/* Header Section */}
            <div className='mb-8'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6'>
                    <div className='flex flex-col gap-2'>
                        <h1 className='text-4xl font-bold text-slate-900'>
                            {isEditMode ? 'Edit Blog Post' : 'Create Blog Post'}
                        </h1>
                        <p className='text-slate-600'>
                            {isEditMode ? 'Edit your existing blog content' : 'Create engaging content for your blog'}
                        </p>
                    </div>
                    <div className='flex items-center gap-3 w-full sm:w-auto'>
                        <Button
                            type='button'
                            variant='outline'
                            disabled={isPending}
                            onClick={handleSaveAsDraft}
                            className='flex-1 sm:flex-none'
                        >
                            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                            Save as Draft
                        </Button>
                        <Button
                            type='button'
                            disabled={isPending}
                            onClick={handlePublish}
                            className='flex-1 sm:flex-none'
                        >
                            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                            {isEditMode ? 'Update & Publish' : 'Publish'}
                        </Button>
                    </div>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col lg:flex-row gap-8'>
                    {/* Main Content Column */}
                    <div className='flex-1 space-y-6'>
                        {/* Title and Slug Card */}
                        <Card className='border-slate-200 shadow-md hover:shadow-lg transition-shadow'>
                            <CardHeader className='bg-gradient-to-r from-blue-50 to-indigo-50 border-b'>
                                <CardTitle className='flex items-center gap-2'>
                                    <FileText className='h-5 w-5 text-blue-600' />
                                    Post Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-5 pt-6'>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-slate-700 font-semibold'>Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter blog post title"
                                                    onChange={handleTitleChange}
                                                    value={field.value}
                                                    className='border-slate-300 focus:border-blue-500'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-slate-700 font-semibold'>URL Slug</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="url-slug-auto-generated"
                                                    className='border-slate-300 focus:border-blue-500'
                                                />
                                            </FormControl>
                                            <p className='text-xs text-slate-500 mt-2'>Auto-generated from title</p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="canonical"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-slate-700 font-semibold'>Canonical URL (Optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="https://example.com/blog/..."
                                                    className='border-slate-300 focus:border-blue-500'
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="seo_title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-slate-700 font-semibold'>SEO Title (Optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Custom SEO Title"
                                                    className='border-slate-300 focus:border-blue-500'
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="seo_description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-slate-700 font-semibold'>SEO Description (Optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Custom SEO Description"
                                                    className='border-slate-300 focus:border-blue-500'
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Tags Card */}
                        <Card className='border-slate-200 shadow-md hover:shadow-lg transition-shadow'>
                            <CardHeader className='bg-gradient-to-r from-green-50 to-emerald-50 border-b'>
                                <CardTitle className='flex items-center gap-2'>
                                    <Tag className='h-5 w-5 text-green-600' />
                                    Tags
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4 pt-6'>
                                <div className='flex flex-wrap gap-2 min-h-10'>
                                    {form.watch('tags')?.map((tagItem, index) => (
                                        <Badge
                                            key={index}
                                            variant='secondary'
                                            className='px-3 py-1.5 cursor-pointer hover:bg-red-100 transition-colors group'
                                            onClick={() => onRemoveTag(index)}
                                        >
                                            {tagItem}
                                            <XCircle className='ml-2 h-3 w-3 opacity-60 group-hover:opacity-100' />
                                        </Badge>
                                    ))}
                                </div>
                                <Separator />
                                <div className='flex gap-2'>
                                    <FormField
                                        control={form.control}
                                        name="tags"
                                        render={() => (
                                            <FormItem className='flex-1'>
                                                <FormControl>
                                                    <Input
                                                        type='text'
                                                        placeholder='Add a tag and press Enter or click Add'
                                                        className='border-slate-300 focus:border-green-500'
                                                        value={tag}
                                                        onChange={(e) => setTag(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagsChange())}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='button' size='sm' onClick={handleTagsChange} className='mt-1'>
                                        Add
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Keywords Card */}
                        <Card className='border-slate-200 shadow-md hover:shadow-lg transition-shadow'>
                            <CardHeader className='bg-gradient-to-r from-purple-50 to-violet-50 border-b'>
                                <CardTitle className='flex items-center gap-2'>
                                    <Key className='h-5 w-5 text-purple-600' />
                                    Keywords
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4 pt-6'>
                                <div className='flex flex-wrap gap-2 min-h-10'>
                                    {form.watch('keywords')?.map((keywordItem, index) => (
                                        <Badge
                                            key={index}
                                            variant='default'
                                            className='px-3 py-1.5 cursor-pointer hover:opacity-75 transition-opacity group'
                                            onClick={() => onRemoveKeyword(index)}
                                        >
                                            {keywordItem}
                                            <XCircle className='ml-2 h-3 w-3 opacity-60 group-hover:opacity-100' />
                                        </Badge>
                                    ))}
                                </div>
                                <Separator />
                                <div className='flex gap-2'>
                                    <FormField
                                        control={form.control}
                                        name="keywords"
                                        render={() => (
                                            <FormItem className='flex-1'>
                                                <FormControl>
                                                    <Input
                                                        type='text'
                                                        placeholder='Add a keyword and press Enter or click Add'
                                                        className='border-slate-300 focus:border-purple-500'
                                                        value={keyword}
                                                        onChange={(e) => setKeyword(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleKeywordsChange())}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='button' size='sm' onClick={handleKeywordsChange} className='mt-1'>
                                        Add
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Cover Image */}
                    <div className='w-full lg:w-80 space-y-6'>
                        <Card className='border-slate-200 shadow-md hover:shadow-lg transition-shadow sticky top-8'>
                            <CardHeader className='bg-gradient-to-r from-orange-50 to-red-50 border-b'>
                                <CardTitle className='flex items-center gap-2'>
                                    <ImageIcon className='h-5 w-5 text-orange-600' />
                                    Cover Image
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='pt-6'>
                                <FormField
                                    control={form.control}
                                    name="cover"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div
                                                onClick={onUpload}
                                                className='w-full aspect-video relative flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg cursor-pointer hover:from-slate-200 hover:to-slate-300 transition-all border-2 border-dashed border-slate-300 hover:border-blue-400 group'
                                            >
                                                {!field.value ? (
                                                    <div className='flex flex-col items-center gap-2 text-slate-500 group-hover:text-blue-600'>
                                                        <ImageIcon className='w-12 h-12 opacity-40 group-hover:opacity-60' />
                                                        <span className='text-sm font-medium'>Click to upload</span>
                                                    </div>
                                                ) : (
                                                    <div className='relative w-full h-full'>
                                                        <Image
                                                            src={getImageUrl(field.value) || ''}
                                                            alt='cover'
                                                            fill
                                                            className='object-cover rounded-lg'
                                                        />
                                                        <div className='absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center'>
                                                            <span className='text-white opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 px-2 py-1 rounded'>
                                                                Click to change
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <p className='text-xs text-slate-500 mt-3 text-center'>Recommended Ratio: 4:3, 3:2</p>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </Form>

            {/* Content Editor Section */}
            <div className='mt-8'>
                <Card className='border-slate-200 shadow-md hover:shadow-lg transition-shadow'>
                    <CardHeader className='bg-gradient-to-r from-cyan-50 to-blue-50 border-b'>
                        <CardTitle>Content Editor</CardTitle>
                    </CardHeader>
                    <CardContent className='pt-6'>
                        <AddContent content={content} updateContent={updateContent} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}