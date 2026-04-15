'use client'

import React, { useMemo, useState, useRef } from 'react'
import { KEY_VALUE_TYPES } from '@/lib/constants'
import { API } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { sentanceCase, cn } from '@/lib/utils'
import { RTE } from '@/components/admin/RTE'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'

const SettingItem = ({ 
    id, 
    initialValue, 
    onSave 
}: { 
    id: string; 
    initialValue: string; 
    onSave: (value: string) => Promise<void> 
}) => {
    const [current, setCurrent] = useState(initialValue)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await onSave(current)
        } finally {
            setIsSaving(false)
        }
    }

    const hasChanged = current !== initialValue

    return (
        <div className='p-4 border rounded bg-white shadow-sm'>
            <div className='flex justify-between items-center mb-4'>
                <strong className='text-lg text-slate-800'>{sentanceCase(id)}</strong>
                <button
                    className={cn(
                        'px-4 py-1.5 rounded transition-all font-medium text-sm',
                        hasChanged 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    )}
                    onClick={handleSave}
                    disabled={isSaving || !hasChanged}
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </button>
            </div>
            <RTE
                value={initialValue}
                onChange={setCurrent}
            />
        </div>
    )
}

const ImageSettingItem = ({
    id,
    initialValue,
    onSave
}: {
    id: string;
    initialValue: string;
    onSave: (value: string) => Promise<void>
}) => {
    const [isUploading, setIsUploading] = useState(false)
    const [preview, setPreview] = useState(initialValue)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            // Using fetch directly for FormData upload if API.queryPost doesn't handle it well
            const token = localStorage.getItem('token')
            const res = await fetch('/api/admin/assets', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            const data = await res.json()
            if (data.success) {
                const url = data.data.url
                setPreview(url)
                await onSave(url)
                toast.success('Logo updated successfully')
            } else {
                toast.error(data.message || 'Upload failed')
            }
        } catch (err) {
            console.error('Logo upload error:', err)
            toast.error('Error uploading logo')
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    return (
        <div className='p-4 border rounded bg-white shadow-sm'>
            <div className='flex justify-between items-center mb-4'>
                <strong className='text-lg text-slate-800'>{sentanceCase(id)}</strong>
            </div>
            
            <div className='flex flex-col items-center gap-4 p-6 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50'>
                {preview ? (
                    <div className='relative group'>
                        <img 
                            src={preview} 
                            alt={id} 
                            className='max-h-32 object-contain rounded shadow-sm bg-white p-2' 
                        />
                        <button 
                            onClick={() => { setPreview(''); onSave('') }}
                            className='absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm'
                        >
                            <X className='w-4 h-4' />
                        </button>
                    </div>
                ) : (
                    <div className='flex flex-col items-center text-slate-400 py-4'>
                        <ImageIcon className='w-12 h-12 mb-2 opacity-20' />
                        <p className='text-sm'>No image selected</p>
                    </div>
                )}
                
                <input 
                    type='file' 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className='hidden'
                    accept='image/*'
                />
                
                <button
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className='flex items-center gap-2 px-6 py-2 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50 transition-colors text-sm font-medium'
                >
                    {isUploading ? (
                        <>
                            <Loader2 className='w-4 h-4 animate-spin' />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className='w-4 h-4' />
                            {preview ? 'Change Image' : 'Upload Image'}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default function AdminSettingsPage() {
    const queryClient = useQueryClient()

    const { data: settings = [] } = useQuery({
        queryKey: ['admin-settings'],
        queryFn: () => API.queryGet<any[]>({ url: '/api/admin/settings', auth: true }),
    })

    const map = useMemo(() => {
        const m: Record<string, string> = {}
        settings.forEach((s: any) => (m[s.key] = s.value))
        return m
    }, [settings])

    const { mutateAsync } = useMutation({
        mutationFn: (pairs: { key: string; value: string }[]) =>
            API.queryPut({ url: '/api/admin/settings', payload: { pairs }, auth: true }),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
            toast.success('Saved successfully')
        },
        onError(err: any) {
            toast.error(err.message ?? 'Error saving')
        }
    })

    const keys = useMemo(() => 
        Object.values(KEY_VALUE_TYPES).filter(v => typeof v === 'string') as string[], 
    [])

    return (
        <div className='container mx-auto py-8 max-w-4xl'>
            <div className='flex items-center justify-between mb-8'>
                <h1 className='text-3xl font-bold text-slate-900'>System Settings</h1>
                <p className='text-slate-500 text-sm'>Manage your application content</p>
            </div>
            
            <div className='space-y-6'>
                {keys.map((k) => {
                    const isImage = k === KEY_VALUE_TYPES.SITE_LOGO
                    
                    if (isImage) {
                        return (
                            <ImageSettingItem
                                key={k + (map[k] || '')}
                                id={k}
                                initialValue={map[k] ?? ''}
                                onSave={async (v) => { await mutateAsync([{ key: k, value: v }]) }}
                            />
                        )
                    }

                    return (
                        <SettingItem 
                            key={k + (map[k] || '')} 
                            id={k} 
                            initialValue={map[k] ?? ''} 
                            onSave={async (v) => { await mutateAsync([{ key: k, value: v }]) }}
                        />
                    )
                })}
            </div>
        </div>
    )
}
