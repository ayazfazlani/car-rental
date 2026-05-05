'use client'

import React from 'react'
import { RTE } from '@/components/admin/RTE'
import { ImagePicker } from './ImagePicker'

export const AddContent = ({
    content,
    updateContent
}: {
    content: any
    updateContent: (html: string, json: any, text: string) => void
}) => {
    const [showImagePicker, setShowImagePicker] = React.useState(false)

    return (
        <div className='relative'>
            <RTE
                value={content}
                onUpdate={updateContent}
                onImageTap={() => setShowImagePicker(true)}
                minHeight="700px"
            />
            <ImagePicker
                isOpen={showImagePicker}
                onClose={() => setShowImagePicker(false)}
            />
        </div>
    )
}