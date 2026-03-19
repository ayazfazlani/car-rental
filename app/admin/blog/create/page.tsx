'use client'
import React from 'react'
import Image from 'next/image'
import { Content } from '@tiptap/react'
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
    const [content, setContent] = React.useState<Content>({})

    const { mutate: createBlog, isPending } = useMutation({
        mutationFn: (data: TCreateBlog) => API.queryPost<Blog>({ url: '/api/admin/blog', payload: data, auth: true }),
        onSuccess: (data: Blog) => {
            toast.success('Blog created')
            router.push(`/blog/${data.slug}`)
        },
        onError: (error: any) => {
            toast.error(error.message)
        }
    })

    const { mutate: uploadAsset } = useMutation({
        mutationFn: (data: FormData) => API.queryPost<Asset>({ url: '/api/admin/assets', payload: data, auth: true, isMultipart: true }),
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

    const form = useForm({
        defaultValues: initialValues,
        resolver: zodResolver(CreateBlogSchema)
    })

    const onSubmit = (data: TCreateBlog) => {
        createBlog(data)
    }

    const updateContent = (content: Content, contentJson: Object, text: string) => {
        setContent(content);
        form.setValue('content', contentJson)
        let info = text;
        info = info.length > 100 ? info.slice(0, 100) + '...' : info;
        info = info.replace(/\s+/g, ' ').trim();
        form.setValue('info', info)
    }

    const handelTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        form.setValue('title', e.target.value)
        let title = e.target.value;
        let slug = title.toLowerCase().replace(/ /g, '-');
        form.setValue('slug', slug)
        form.setValue('info', title) //Fix Me 
    }

    const handelTagsChange = () => {
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
        form.setValue('tags', tags.filter((tag, i) => i !== index))
    }

    const handelKeywordsChange = () => {
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
        form.setValue('keywords', keywords.filter((keyword, i) => i !== index))
    }

    return (
        <div className='flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-8'>
            {/* Header Section */}
            <div className='mb-8'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6'>
                    <div className='flex flex-col gap-2'>
                        <h1 className='text-4xl font-bold text-slate-900'>Create Blog Post</h1>
                        <p className='text-slate-600'>Create engaging content for your blog</p>
                    </div>
                    <div className='flex items-center gap-3 w-full sm:w-auto'>
                        <Button
                            type='button'
                            variant='outline'
                            disabled={isPending}
                            onClick={() => {
                                form.setValue('draft', true)
                                form.handleSubmit(onSubmit)()
                            }}
                            className='flex-1 sm:flex-none'
                        >
                            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                            Draft
                        </Button>
                        <Button
                            type='submit'
                            disabled={isPending}
                            onClick={() => {
                                form.setValue('draft', false)
                                form.handleSubmit(onSubmit)()
                            }}
                            className='flex-1 sm:flex-none'
                        >
                            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                            Publish
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
                                                    onChange={handelTitleChange}
                                                    value={form.getValues('title')}
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
                                    {form.getValues('tags').map((tag, index) => (
                                        <Badge
                                            key={index}
                                            variant='secondary'
                                            className='px-3 py-1.5 cursor-pointer hover:bg-red-100 transition-colors group'
                                            onClick={() => onRemoveTag(index)}
                                        >
                                            {tag}
                                            <XCircle className='ml-2 h-3 w-3 opacity-60 group-hover:opacity-100' />
                                        </Badge>
                                    ))}
                                </div>
                                <Separator />
                                <div className='flex gap-2'>
                                    <FormField
                                        control={form.control}
                                        name="tags"
                                        render={({ field }) => (
                                            <FormItem className='flex-1'>
                                                <FormControl>
                                                    <Input
                                                        type='text'
                                                        placeholder='Add a tag and press Enter or click Add'
                                                        className='border-slate-300 focus:border-green-500'
                                                        value={tag}
                                                        onChange={(e) => setTag(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handelTagsChange())}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='button' size='sm' onClick={handelTagsChange} className='mt-1'>
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
                                    {form.getValues('keywords').map((keyword, index) => (
                                        <Badge
                                            key={index}
                                            variant='default'
                                            className='px-3 py-1.5 cursor-pointer hover:opacity-75 transition-opacity group'
                                            onClick={() => onRemoveKeyword(index)}
                                        >
                                            {keyword}
                                            <XCircle className='ml-2 h-3 w-3 opacity-60 group-hover:opacity-100' />
                                        </Badge>
                                    ))}
                                </div>
                                <Separator />
                                <div className='flex gap-2'>
                                    <FormField
                                        control={form.control}
                                        name="keywords"
                                        render={({ field }) => (
                                            <FormItem className='flex-1'>
                                                <FormControl>
                                                    <Input
                                                        type='text'
                                                        placeholder='Add a keyword and press Enter or click Add'
                                                        className='border-slate-300 focus:border-purple-500'
                                                        value={keyword}
                                                        onChange={(e) => setKeyword(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handelKeywordsChange())}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='button' size='sm' onClick={handelKeywordsChange} className='mt-1'>
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
                                                onClick={() => onUpload()}
                                                className='w-full aspect-video relative flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg cursor-pointer hover:from-slate-200 hover:to-slate-300 transition-all border-2 border-dashed border-slate-300 hover:border-blue-400 group'
                                            >
                                                {form.getValues('cover') === "" ? (
                                                    <div className='flex flex-col items-center gap-2 text-slate-500 group-hover:text-blue-600'>
                                                        <ImageIcon className='w-12 h-12 opacity-40 group-hover:opacity-60' />
                                                        <span className='text-sm font-medium'>Click to upload</span>
                                                    </div>
                                                ) : (
                                                    <div className='relative w-full h-full'>
                                                        <Image
                                                            src={getImageUrl(form.getValues('cover'))}
                                                            alt='cover'
                                                            fill
                                                            objectFit='cover'
                                                            className='rounded-lg'
                                                        />
                                                        <div className='absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center group'>
                                                            <span className='text-white opacity-0 group-hover:opacity-100 transition-opacity'>Click to change</span>
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
