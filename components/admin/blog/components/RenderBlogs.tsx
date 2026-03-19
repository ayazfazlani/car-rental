'use client'

import React from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Blog } from '@prisma/client';
import { formatDate, getImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slug } from '@/components/blog/Slug';
import { Delete, Edit, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { API } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent } from '@/components/ui/dialog';

function BlogItem({ blog, onDelete }: { blog: Blog, onDelete: (id: string) => void }) {
    const router = useRouter()
    const NavigateToBlog = () => {
        window.open(`/blog/${blog.slug}`, '_blank')
    }

    const navigateToEdit = () => {
        router.push(`/admin/blog/${blog.id}`)
    }

    return (
        <div className='flex flex-col items-center md:items-start md:flex-row w-full justify-between p-4 gap-10 border rounded-3xl'>
            <div className='h-[250px] w-[300px] relative'>
                <Image
                    src={getImageUrl(blog?.cover)}
                    alt={blog?.title}
                    className='rounded-2xl overflow-hidden'
                    fill
                    style={{ objectFit: "cover" }}
                />
            </div>
            <div className='flex flex-1 flex-col xl:flex-row gap-3 mt-4'>
                <div className='flex flex-1 flex-col gap-3 mt-4'>
                    {blog?.draft && <Slug text='Draft' color='' />}
                    <h2 className='text-lg md:text-xl lg:text-2xl font-semibold text-veryDarkGray'>{blog?.title || ''}</h2>
                    <p className='text-sm text-darkGrayishBlueAlt'>{formatDate(blog?.createdAt) || ''}</p>
                    <p className='text-avg text-darkGrayishBlueAlt'>{blog?.info || ''}</p>
                </div>
                <div className='flex flex-row xl:flex-col gap-3 mt-4 mr-4 items-center justify-center'>
                    <Button onClick={() => NavigateToBlog()}>
                        <Eye className='h-4 w-4 mr-2' />
                        View
                    </Button>
                    <Button variant='outline' onClick={() => navigateToEdit()}>
                        <Edit className='h-4 w-4 mr-2' />
                        Edit
                    </Button>
                    <Button variant={'destructive'} onClick={() => onDelete(blog.id)}>
                        <Delete className='h-4 w-4 mr-2' />
                        Delete
                    </Button></div>
            </div>
        </div>
    )
}


export function RenderBlogs({ blogs, refetch }: { blogs: Blog[], refetch: () => void }) {
    const [modal, setModal] = React.useState<boolean>(false)
    const [deleteId, setDeleteId] = React.useState<string>('')

    const onCancelDelete = () => {
        setModal(false)
        setDeleteId('')
    }

    const { mutate: deleteBlog, isPending } = useMutation({
        mutationFn: (id: string) => API.queryDelete({ url: `/api/admin/blog/${id}`, auth: true }),
        onSuccess: () => {
            toast.success('Blog deleted')
            refetch()
        },
        onError: (error: any) => {
            toast.error(error.message)
            console.error("Error deleting blog:", error)
        }
    })


    const openDeleteModal = (id: string) => {
        setDeleteId(id)
        setModal(true)
    }

    return (
        <div className='flex flex-col gap-4'>
            {blogs.map(blog => (
                <BlogItem key={blog.id} blog={blog} onDelete={openDeleteModal} />
            ))}
            <Dialog open={modal} onOpenChange={onCancelDelete}>
                <DialogContent>
                    <div className='flex flex-col gap-4 p-4'>
                        <h2 className='text-2xl font-semibold text-veryDarkGray'>Delete Blog</h2>
                        <p className='text-avg text-darkGrayishBlueAlt'>Are you sure you want to delete this blog?</p>
                        <div className='flex justify-end gap-4 mt-4'>
                            <Button variant='outline' onClick={() => onCancelDelete()}>
                                Cancel
                            </Button>
                            <Button variant='destructive' onClick={() => deleteBlog(deleteId)}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}