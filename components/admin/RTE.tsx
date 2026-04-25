'use client'

import React from 'react'
import {
    useEditor,
    EditorContent,
    Editor
} from '@tiptap/react'
import * as StarterKitPkg from '@tiptap/starter-kit'
import * as ListItemPkg from '@tiptap/extension-list-item'
import * as ImagePkg from '@tiptap/extension-image'
import * as LinkPkg from '@tiptap/extension-link'
import * as TablePkg from '@tiptap/extension-table'
import * as TableRowPkg from '@tiptap/extension-table-row'
import * as TableCellPkg from '@tiptap/extension-table-cell'
import * as TableHeaderPkg from '@tiptap/extension-table-header'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import {
    BetweenHorizontalStart,
    Bold,
    Heading1,
    Heading2,
    Heading3,
    ImageIcon,
    Italic,
    List,
    ListOrdered,
    MessageSquareQuote,
    Minus,
    Pilcrow,
    Redo,
    Strikethrough,
    Type,
    Undo,
    Link2,
    Table as TableIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import './RTE.css'

// Helper to resolve extensions that might be nested due to CJS/ESM interop issues
const resolveExt = (pkg: any, name: string) => {
    const ext = pkg[name] || pkg.default || (pkg.default && pkg.default[name]) || pkg;
    if (ext && ext.configure) return ext;
    if (pkg.name === name || (pkg.default && pkg.default.name === name)) return pkg.default || pkg;
    return ext;
}

const toolbarButtonStyles = 'h-9 w-9 p-0'

const ToolbarButton = ({
    isActive,
    onClick,
    disabled,
    icon: Icon,
    title,
    ariaLabel
}: {
    isActive?: boolean
    onClick: () => void
    disabled?: boolean
    icon: React.ComponentType<{ className?: string }>
    title: string
    ariaLabel: string
}) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Button
                type="button"
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={onClick}
                disabled={disabled}
                className={cn(toolbarButtonStyles, isActive && 'bg-blue-600 hover:bg-blue-700')}
                aria-label={ariaLabel}
                aria-pressed={isActive}
            >
                <Icon className="h-4 w-4" />
            </Button>
        </TooltipTrigger>
        <TooltipContent>{title}</TooltipContent>
    </Tooltip>
)

const MenuBar = ({ editor, onImageTap }: { editor: Editor | null, onImageTap?: () => void }) => {
    if (!editor) {
        return null
    }

    return (
        <TooltipProvider>
            <div className='flex flex-wrap items-center gap-1 p-3 bg-slate-50 border-b border-slate-200 rounded-t-lg'>
                {/* Style Group */}
                <div className='flex items-center gap-1'>
                    <ToolbarButton
                        isActive={editor.isActive('bold')}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={!editor.can().chain().focus().toggleBold().run()}
                        icon={Bold}
                        title="Bold"
                        ariaLabel="Toggle bold text"
                    />
                    <ToolbarButton
                        isActive={editor.isActive('italic')}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={!editor.can().chain().focus().toggleItalic().run()}
                        icon={Italic}
                        title="Italic"
                        ariaLabel="Toggle italic text"
                    />
                    <ToolbarButton
                        isActive={editor.isActive('strike')}
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        disabled={!editor.can().chain().focus().toggleStrike().run()}
                        icon={Strikethrough}
                        title="Strikethrough"
                        ariaLabel="Toggle strikethrough text"
                    />
                    <ToolbarButton
                        isActive={editor.isActive('paragraph')}
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        icon={Pilcrow}
                        title="Paragraph"
                        ariaLabel="Convert to paragraph"
                    />
                    <ToolbarButton
                        onClick={() => {
                            editor.chain().focus().unsetAllMarks().run()
                            editor.chain().focus().clearNodes().run()
                        }}
                        icon={Type}
                        title="Clear Formatting"
                        ariaLabel="Clear all formatting"
                    />
                    <Separator orientation="vertical" className="h-6 mx-1" />
                </div>

                {/* Heading Group */}
                <div className='flex items-center gap-1'>
                    <ToolbarButton
                        isActive={editor.isActive('heading', { level: 1 })}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        icon={Heading1}
                        title="Heading 1"
                        ariaLabel="Toggle Heading 1"
                    />
                    <ToolbarButton
                        isActive={editor.isActive('heading', { level: 2 })}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        icon={Heading2}
                        title="Heading 2"
                        ariaLabel="Toggle Heading 2"
                    />
                    <ToolbarButton
                        isActive={editor.isActive('heading', { level: 3 })}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        icon={Heading3}
                        title="Heading 3"
                        ariaLabel="Toggle Heading 3"
                    />
                    <Separator orientation="vertical" className="h-6 mx-1" />
                </div>

                {/* Format Group */}
                <div className='flex items-center gap-1'>
                    <ToolbarButton
                        isActive={editor.isActive('bulletList')}
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        icon={List}
                        title="Bullet List"
                        ariaLabel="Toggle bullet list"
                    />
                    <ToolbarButton
                        isActive={editor.isActive('orderedList')}
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        icon={ListOrdered}
                        title="Ordered List"
                        ariaLabel="Toggle ordered list"
                    />
                    <ToolbarButton
                        isActive={editor.isActive('blockquote')}
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        icon={MessageSquareQuote}
                        title="Quote"
                        ariaLabel="Toggle blockquote"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        icon={Minus}
                        title="Horizontal Rule"
                        ariaLabel="Insert horizontal rule"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setHardBreak().run()}
                        icon={BetweenHorizontalStart}
                        title="Line Break"
                        ariaLabel="Insert line break"
                    />
                    <Separator orientation="vertical" className="h-6 mx-1" />
                </div>

                {/* Actions Group */}
                <div className='flex items-center gap-1'>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run()}
                        icon={Undo}
                        title="Undo"
                        ariaLabel="Undo last action"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run()}
                        icon={Redo}
                        title="Redo"
                        ariaLabel="Redo last action"
                    />
                    <ToolbarButton
                        isActive={editor.isActive('link')}
                        onClick={() => {
                            const previousUrl = editor.getAttributes('link').href;
                            const url = window.prompt('URL', previousUrl);
                            if (url === null) return;
                            if (url === '') {
                                editor.chain().focus().extendMarkRange('link').unsetLink().run();
                                return;
                            }
                            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                        }}
                        icon={Link2}
                        title="Link"
                        ariaLabel="Insert link"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                        icon={TableIcon}
                        title="Insert Table"
                        ariaLabel="Insert Table"
                    />
                    {onImageTap && (
                        <ToolbarButton
                            onClick={onImageTap}
                            icon={ImageIcon}
                            title="Insert Image"
                            ariaLabel="Insert image"
                        />
                    )}
                </div>
            </div>
        </TooltipProvider>
    )
}

const getExtensions = () => {
    const starterKit = resolveExt(StarterKitPkg, 'StarterKit');
    const listItem = resolveExt(ListItemPkg, 'ListItem');
    const image = resolveExt(ImagePkg, 'Image');
    const link = resolveExt(LinkPkg, 'Link');
    const table = resolveExt(TablePkg, 'Table');
    const tableRow = resolveExt(TableRowPkg, 'TableRow');
    const tableCell = resolveExt(TableCellPkg, 'TableCell');
    const tableHeader = resolveExt(TableHeaderPkg, 'TableHeader');

    return [
        listItem?.configure({
            HTMLAttributes: {
                class: 'text-lg font-bold',
            },
        }),
        image?.configure({
            HTMLAttributes: {
                class: 'rounded-lg my-2 mx-auto',
            },
        }),
        link?.configure({
            openOnClick: false,
            autolink: true,
            defaultProtocol: 'https',
        }),
        table?.configure({
            resizable: true,
        }),
        tableRow,
        tableHeader,
        tableCell,
        starterKit?.configure({
            listItem: false,
            link: false,
        }),
    ].filter(Boolean);
}

interface RteProps {
    value: any;
    onChange?: (value: string) => void;
    onUpdate?: (html: string, json: any, text: string) => void;
    placeholder?: string;
    minHeight?: string;
    onImageTap?: () => void;
}

export const RTE = ({ value, onChange, onUpdate, placeholder, minHeight = '300px', onImageTap }: RteProps) => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: getExtensions(),
        content: value,
        editorProps: {
            attributes: {
                class: cn(
                    'editor prose prose-sm max-w-none overflow-x-hidden overflow-y-auto w-full focus:outline-none p-4 focus:ring-2 focus:ring-blue-500 focus:ring-inset',
                    'min-h-[' + minHeight + ']'
                ),
                placeholder: placeholder || ''
            },
            transformPastedHTML: (html) => {
                // Remove all style attributes and generic span tags that might carry unwanted formatting
                return html
                    .replace(/ style="[^"]*"/g, '')
                    .replace(/ class="[^"]*"/g, '')
                    .replace(/<span[^>]*>/g, '')
                    .replace(/<\/span>/g, '');
            }
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            const json = editor.getJSON()
            const text = editor.getText()
            if (onChange) onChange(html)
            if (onUpdate) onUpdate(html, json, text)
        },
    })

    // Carefully synchronize value prop ONLY when not focused
    React.useEffect(() => {
        if (!editor || editor.isFocused) return
        
        const currentHTML = editor.getHTML()
        if (value !== currentHTML) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    return (
        <div className='border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow'>
            <MenuBar editor={editor} onImageTap={onImageTap} />
            <EditorContent editor={editor} />
        </div>
    )
}



