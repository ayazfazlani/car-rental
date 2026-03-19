'use client'

import React, { useState } from 'react'
import { API } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { Faq } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaqSchema, TFaq } from '@/lib/validations'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAdminTranslation } from '@/lib/admin-translations'
import { RTE } from '@/components/admin/RTE'

const initalValues: TFaq = {
    question: "",
    question_ar: "",
    answer: "",
    answer_ar: "",
    isEnabled: true,
}

export default function AdminFaqPage() {
    const queryClient = useQueryClient()
    const { t } = useAdminTranslation()
    const [id, setId] = useState<string | "new" | null>(null)

    const { data: items = [] } = useQuery({
        queryKey: ['admin-faq'],
        queryFn: () => API.queryGet<Faq[]>({ url: '/api/admin/faq', auth: true }),
    })

    const save = useMutation({
        mutationFn: async (item: (TFaq & { id: string })) =>
            item.id === "new" ? API.queryPost({
                url: `/api/admin/faq`,
                payload: item,
                auth: true
            }) : API.queryPut({
                url: `/api/admin/faq/${item.id}`,
                payload: item,
                auth: true
            }),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['admin-faq'] })
            setId(null)
            toast.success('FAQ saved')
        },
        onError(err: any) {
            toast.error(err.message ?? 'Error saving FAQ')
        }
    })

    const deleteItem = useMutation({
        mutationFn: async (id: string) => {
            return await API.queryDelete({ url: '/api/admin/faq/' + id, auth: true })
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['admin-faq'] })
            toast.success('FAQ deleted')
        },
        onError(err: any) {
            toast.error(err.message ?? 'Error deleting FAQ')
        }
    })

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }


    const form = useForm({
        defaultValues: initalValues,
        resolver: zodResolver(FaqSchema)
    })

    function submit(data: TFaq) {
        save.mutate({ ...data, id: id ?? "new" })
    }


    return (
        <div className='container mx-auto'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-2xl font-bold mb-6'>{t('admin.faq.title') || 'FAQ Management'}</h1>
                <Button variant="outline" size="sm" onClick={() => {
                    setId("new")
                    form.setValue('question', '');
                    form.setValue('question_ar', '');
                    form.setValue('answer', '');
                    form.setValue('answer_ar', '');
                    form.setValue('isEnabled', true);
                }}>
                    {t('admin.faq.addNew') || 'Add New FAQ'}
                </Button>
            </div>
            {id && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)} className='mb-8 p-4 border rounded-lg bg-card'>
                        <h2 className='text-lg font-semibold mb-4'>{t('admin.faq.addNew') || 'Add New FAQ'}</h2>
                        <div className='space-y-4'>
                            <FormField
                                control={form.control}
                                name="question"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('admin.faq.questionEn') || 'Question (EN)'}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field?.value || ''}
                                                className="mt-1 block w-full"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="question_ar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('admin.faq.questionAr') || 'Question (AR)'}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field?.value || ''}
                                                className="mt-1 block w-full"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="answer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('admin.faq.answerEn') || 'Answer (EN)'}</FormLabel>
                                        <FormControl>
                                            <RTE
                                                value={field?.value || ''}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="answer_ar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('admin.faq.answerAr') || 'Answer (AR)'}</FormLabel>
                                        <FormControl>
                                            <RTE
                                                value={field?.value || ''}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end gap-4">
                                <Button type="submit">
                                    {save.isPending ? (t('admin.faq.saving') || 'Saving...') : (t('admin.faq.save') || 'Save')}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => {
                                    setId(null)
                                    form.setValue('question', '');
                                    form.setValue('question_ar', '');
                                    form.setValue('answer', '');
                                    form.setValue('answer_ar', '');
                                    form.setValue('isEnabled', true);
                                }}>
                                    {t('admin.cancel') || 'Cancel'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            )}

            {/* Existing FAQs */}
            <div className='space-y-4'>
                {items?.map((item: any) => (
                    <div key={item.id} className='p-4 border rounded-lg bg-card space-y-3'>
                        <div>
                            <label className='tex-bold font-medium mb-2'>{t('admin.faq.questionEn') || 'Question (EN)'}</label>
                            <div>
                                {item.question}
                            </div>
                        </div>
                        <div>
                            <label className='tex-bold font-medium mb-2'>{t('admin.faq.questionAr') || 'Question (AR)'}</label>
                            <div>
                                {item.question_ar}
                            </div>
                        </div>

                        <div>
                            <label className='tex-bold font-medium mb-2'>{t('admin.faq.answerEn') || 'Answer (EN)'}</label>
                            <div className='prose prose-sm max-w-none' dangerouslySetInnerHTML={{ __html: item.answer }} />
                        </div>
                        <div>
                            <label className='tex-bold font-medium mb-2'>{t('admin.faq.answerAr') || 'Answer (AR)'}</label>
                            <div className='prose prose-sm max-w-none' dangerouslySetInnerHTML={{ __html: item.answer_ar }} />
                        </div>
                        <div className='flex items-center justify-end gap-4'>
                            <label className='tex-bold flex items-center gap-2'>
                                <input
                                    type='checkbox'
                                    checked={item.isEnabled}
                                    onChange={(e) => {
                                        save.mutate({ ...item, isEnabled: e.target.checked })
                                    }}
                                />
                                <span className='text-sm'>{t('admin.faq.enabled') || 'Enabled'}</span>
                            </label>
                            <Button
                                variant='destructive'
                                size='sm'
                                onClick={() => deleteItem.mutate(item.id)}
                                disabled={deleteItem.isPending}
                            >
                                <Trash2 className='h-4 w-4 mr-2' />
                                {t('admin.faq.delete') || 'Delete'}
                            </Button>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => {
                                    form.setValue('question', item.question)
                                    form.setValue('question_ar', item.question_ar)
                                    form.setValue('answer', item.answer)
                                    form.setValue('answer_ar', item.answer_ar)
                                    form.setValue('isEnabled', item.isEnabled)
                                    scrollToTop()
                                    setId(item.id)
                                }}
                            >
                                {t('admin.faq.edit') || 'Edit'}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
