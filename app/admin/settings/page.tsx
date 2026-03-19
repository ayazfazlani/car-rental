'use client'

import React, { useMemo, useState } from 'react'
import { KEY_VALUE_TYPES } from '@/lib/constants'
import { API } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { sentanceCase } from '@/lib/utils'
import { RTE } from '@/components/admin/RTE'

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

    const [local, setLocal] = useState<Record<string, string>>(() => ({ ...map }))

    // keep local in sync when settings load
    React.useEffect(() => {
        setLocal({ ...map })
    }, [map])

    const { mutate, isPending } = useMutation({
        mutationFn: (pairs: { key: string; value: string }[]) =>
            API.queryPut({ url: '/api/admin/settings', payload: { pairs }, auth: true }),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
            toast.success('Saved')
        },
        onError(err: any) {
            toast.error(err.message ?? 'Error saving')
        }
    })

    const keys = Object.values(KEY_VALUE_TYPES).filter(v => typeof v === 'string') as string[]

    return (
        <div className='container mx-auto'>
            <h1 className='text-2xl font-bold mb-4'>Settings</h1>
            <div className='space-y-4'>
                {keys.map((k) => (
                    <div key={k} className='p-4 border rounded'>
                        <div className='flex justify-between items-center mb-2'>
                            <strong>{sentanceCase(k)}</strong>
                        </div>
                        <RTE
                            value={local[k] ?? ''}
                            onChange={(v) => setLocal(prev => ({ ...prev, [k]: v }))}
                        />
                    </div>
                ))}
            </div>
            <div className='mt-4'>
                <button
                    className='px-4 py-2 bg-primary text-white rounded'
                    onClick={() => {
                        const pairs = keys.map(k => ({ key: k, value: local[k] ?? '' }))
                        mutate(pairs)
                    }}
                    disabled={isPending}
                >
                    Save
                </button>
            </div>
        </div>
    )
}
