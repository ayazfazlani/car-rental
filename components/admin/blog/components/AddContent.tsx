'use client'

import React from 'react'
import { Content } from '@tiptap/react'
import { ImagePicker } from './ImagePicker'
import { RTE } from '@/components/admin/RTE'

export const AddContent = ({ content, updateContent }: { content: Content, updateContent: (content: Content, Object: any, text: string) => void }) => {
    const [modal, setModal] = React.useState<boolean>(false)
    const onClose = () => {
        setModal(false)
    }
    const openModal = () => {
        setModal(true)
    }

    return (
        <div className='relative'>
            <RTE 
                value={content} 
                onUpdate={(html, json, text) => updateContent(html, json, text)}
                onImageTap={openModal}
                minHeight='500px'
            />
            <ImagePicker onClose={onClose} isOpen={modal} />
        </div>
    )
}