'use client'

import React from 'react'
import { Content } from '@tiptap/react'
import { ImagePicker } from './ImagePicker'
import { RTE } from '@/components/admin/RTE'

export const AddContent = ({ content, updateContent }: { content: Content, updateContent: (content: Content, Object: any, text: string) => void }) => {
    const [modal, setModal] = React.useState<boolean>(false)
    const [internalContent, setInternalContent] = React.useState<Content>(content)

    // Update internal content when props change
    React.useEffect(() => {
        if (content && Object.keys(content).length > 0) {
            setInternalContent(content)
        }
    }, [content])

    const onClose = () => {
        setModal(false)
    }

    const openModal = () => {
        setModal(true)
    }

    const handleUpdate = (html: string, json: Object, text: string) => {
        console.log('RTE Update - JSON:', json) // Debug log
        setInternalContent(json)
        updateContent(html, json, text)
    }

    return (
        <div className='relative'>
            <RTE
                value={internalContent}
                onUpdate={handleUpdate}
                onImageTap={openModal}
                minHeight='500px'
            />
            <ImagePicker onClose={onClose} isOpen={modal} />
        </div>
    )
}