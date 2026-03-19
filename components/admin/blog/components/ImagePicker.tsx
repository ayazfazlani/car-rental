'use client'

import React from 'react'
import { useCurrentEditor } from '@tiptap/react'
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { Asset } from '@prisma/client';
import { toast } from 'sonner';
import { API } from '@/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CloudUpload } from 'lucide-react';

const style = 'relative w-24 h-24 rounded-xl overflow-hidden border cursor-pointer'
const activeImage = 'border-2 border-primary ' + style
const inActiveImage = 'border border-border' + ' ' + style


const ImageViewer = ({ name }: { name: string }) => {
    return <Image
        alt={name}
        src={getImageUrl(name)}
        fill={true}
        style={{ objectFit: "contain" }}
    />
}

type Props = {
    isOpen: boolean
    onClose: () => void
}

export function ImagePicker({ isOpen, onClose }: Props) {
    const { editor } = useCurrentEditor()
    const [progress, setProgress] = React.useState<number>(0)
    const [selectedImage, setSelectedImage] = React.useState<string>('')
    const [error, setError] = React.useState<string>('')

    const { data: assets = [], isLoading, refetch } = useQuery({
        queryKey: ['assets'],
        queryFn: () => API.queryGet<Asset[]>({ url: '/api/admin/assets', auth: true }),
    })

    if (!editor) {
        return null
    }
    const setImage = () => {
        if (!editor) return
        if (!selectedImage || selectedImage === '') {
            setError('Please select an image')
            return
        }
        editor.chain().focus().setImage({ src: getImageUrl(selectedImage) }).run()
        onClose()
    }

    const { mutate: uploadAsset, isPending } = useMutation({
        mutationFn: (data: FormData) => API.queryPost({ url: '/api/admin/assets', payload: data, auth: true, isMultipart: true }),
        onSuccess: () => {
            toast.success('Asset uploaded')
            refetch()
        },
        onError: (error: any) => {
            toast.error(error.message)
            console.error("Error uploading asset:", error)
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


    const loading = isLoading || isPending

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <div className='flex flex-col gap-4 p-4'>
                    {(progress > 0 && progress < 100)
                        &&
                        <div className='w-full bg-veryLightgray2 rounded-full'>
                            <div className={`bg-vividBlue rounded-full h-2`} style={{ width: progress + "%" }} />
                        </div>
                    }
                    <div className='flex justify-between'>
                        <h2 className='text-2xl font-semibold text-veryDarkGray'>Select Image</h2>
                        <Button
                            variant='outline'
                            onClick={onUpload}
                        >
                            <CloudUpload />
                            Upload
                        </Button>
                    </div>
                    {error && <p className='text-red-500'>{error}</p>}
                    <div className='border border-borderColor rounded-xl min-h-[100px]'>
                        {assets.length > 0 ?
                            <div className='grid grid-cols-4 gap-4 p-4 max-h-[300px] overflow-y-scroll'>
                                {assets.map((asset, index) =>
                                    <div key={index}
                                        onClick={() => { setSelectedImage(asset.url) }}
                                        className={asset.url === selectedImage ? activeImage : inActiveImage}
                                    >
                                        <ImageViewer name={asset?.url} />
                                    </div>
                                )}
                            </div>
                            :
                            <div className='flex justify-center items-center h-full'>
                                <p className='text-veryDarkGray'>No images found</p>
                            </div>
                        }
                    </div>
                    <div className='flex justify-end gap-4 mt-4'>
                        <Button variant='outline' onClick={onClose}>
                            Cancel
                        </Button>
                        <Button disabled={selectedImage === '' || !selectedImage || loading} onClick={() => setImage()}>
                            Add Image
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
