'use client'

import React from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TipTapImage from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import {
    Bold, Heading1, Heading2, Heading3, ImageIcon, Italic, List, ListOrdered,
    MessageSquareQuote, Minus, Pilcrow, Redo, Strikethrough, Type, Undo, Link2,
    Table as TableIcon, BetweenHorizontalStart
} from 'lucide-react'
import { cn } from '@/lib/utils'
import './RTE.css'

const getExtensions = () => [
    StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: false,
    }),
    Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: {
            target: '_blank',
            rel: 'noopener noreferrer',
            class: 'tiptap-link',
        },
    }),
    TipTapImage.configure({
        HTMLAttributes: { class: 'rounded-lg my-2 mx-auto' },
    }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
]

interface RteProps {
    value: any
    onChange?: (value: string) => void          // ← Added for backward compatibility
    onUpdate?: (html: string, json: any, text: string) => void
    onImageTap?: () => void
    minHeight?: string
    placeholder?: string
}

const ToolbarButton = ({ isActive, onClick, disabled, icon: Icon, title, ariaLabel }: any) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Button
                type="button"
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={onClick}
                disabled={disabled}
                className="h-9 w-9 p-0"
            >
                <Icon className="h-4 w-4" />
            </Button>
        </TooltipTrigger>
        <TooltipContent>{title}</TooltipContent>
    </Tooltip>
)

const MenuBar = ({ editor, onImageTap }: { editor: Editor | null, onImageTap?: () => void }) => {
    if (!editor) return null

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        let url = window.prompt('Enter URL', previousUrl || 'https://')
        if (url === null) return
        url = url.trim()
        if (url === '' || url === 'https://' || url === 'http://') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        if (!url.startsWith('http')) url = 'https://' + url
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    return (
        <TooltipProvider>
            <div className='flex flex-wrap items-center gap-1 p-3 bg-slate-50 border-b border-slate-200 rounded-t-lg sticky top-0 z-10'>
                <div className='flex items-center gap-1'>
                    <ToolbarButton isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} icon={Bold} title="Bold" ariaLabel="Bold" />
                    <ToolbarButton isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} icon={Italic} title="Italic" ariaLabel="Italic" />
                    <ToolbarButton isActive={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} icon={Strikethrough} title="Strikethrough" ariaLabel="Strike" />
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <div className='flex items-center gap-1'>
                    <ToolbarButton isActive={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} icon={Heading1} title="H1" ariaLabel="Heading 1" />
                    <ToolbarButton isActive={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} icon={Heading2} title="H2" ariaLabel="Heading 2" />
                    <ToolbarButton isActive={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} icon={Heading3} title="H3" ariaLabel="Heading 3" />
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <div className='flex items-center gap-1'>
                    <ToolbarButton isActive={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} icon={List} title="Bullet List" ariaLabel="Bullet" />
                    <ToolbarButton isActive={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} icon={ListOrdered} title="Ordered List" ariaLabel="Ordered" />
                    <ToolbarButton isActive={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} icon={MessageSquareQuote} title="Quote" ariaLabel="Quote" />
                </div>

                <div className='flex items-center gap-1 ml-auto'>
                    <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={Undo} title="Undo" ariaLabel="Undo" />
                    <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={Redo} title="Redo" ariaLabel="Redo" />
                    <ToolbarButton isActive={editor.isActive('link')} onClick={setLink} icon={Link2} title="Link" ariaLabel="Link" />
                    <ToolbarButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} icon={TableIcon} title="Table" ariaLabel="Table" />
                    {onImageTap && <ToolbarButton onClick={onImageTap} icon={ImageIcon} title="Image" ariaLabel="Image" />}
                </div>
            </div>
        </TooltipProvider>
    )
}

export const RTE = ({ value, onChange, onUpdate, onImageTap, minHeight = '700px', placeholder }: RteProps) => {
    const editor = useEditor({
        extensions: getExtensions(),
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: cn('editor focus:outline-none p-6 prose max-w-none min-h-[400px]'),
                style: `min-height: ${minHeight};`,
                placeholder: placeholder || '',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            const json = editor.getJSON()
            const text = editor.getText()

            if (onUpdate) onUpdate(html, json, text)
            if (onChange) onChange(html)           // Support old onChange prop
        },
    })

    return (
        <div className='border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm'>
            <MenuBar editor={editor} onImageTap={onImageTap} />
            <EditorContent editor={editor} />
        </div>
    )
}