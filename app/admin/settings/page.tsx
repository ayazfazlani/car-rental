'use client'

import React, { useMemo, useState } from 'react'
import { KEY_VALUE_TYPES } from '@/lib/constants'
import { API } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { sentanceCase, cn } from '@/lib/utils'
import { RTE } from '@/components/admin/RTE'

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
                {keys.map((k) => (
                    <SettingItem 
                        // Key changes only if the database value for THIS setting changes
                        key={k + (map[k] || '')} 
                        id={k} 
                        initialValue={map[k] ?? ''} 
                        onSave={async (v) => { await mutateAsync([{ key: k, value: v }]) }}
                    />
                ))}
            </div>
        </div>
    )
}
