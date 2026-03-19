'use client';
import { use, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { API } from '@/lib/api'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { homeHeroSchema, THomeHero } from '@/lib/validations';
import { HomeHero } from '@prisma/client';
import { useAdminTranslation } from '@/lib/admin-translations';
import { Button } from '../ui/button';
import { ArrowLeft, GripVertical, Trash2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Label } from '../ui/label';

const initalValues: THomeHero = {
    tagline: "",
    tagline_ar: "",
    heading: "",
    heading_ar: "",
    description: "",
    description_ar: "",
    imageSrc: "",
}

export default function ManageHomeHero({ homeHero }: { homeHero: Promise<HomeHero | null> }) {
    const router = useRouter()
    const { t, } = useAdminTranslation();
    const data = use(homeHero)
    const [message, setMessage] = useState<string | null>(null);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: THomeHero) => API.queryPut({ url: '/api/admin/home-hero', payload: data, auth: true }),
        onSuccess: () => {
            setMessage(t('admin.homeHero.saved') || 'Saved successfully');
        },
        onError: (error) => {
            toast.error(error.message)
            console.error("Error creating car:", error)
        }
    })

    const { mutate: upload } = useMutation({
        mutationFn: (data: { form: FormData }) => API.queryPatch({
            url: `/api/admin/home-hero`,
            payload: data.form,
            auth: true,
            isMultipart: true,
        }),
        onSuccess: () => {
            toast.success(t('admin.homeHero.saved') || 'Saved successfully');
            router.refresh()
        },
        onError: (error) => {
            toast.error(error.message)
            console.error("Error creating car:", error)
        }
    })

    function submit(data: THomeHero) {
        mutate({ ...data });
    }

    const form = useForm({
        defaultValues: data ? data : initalValues,
        resolver: zodResolver(homeHeroSchema)
    })


    return (
        <div className='w-full'>
            <Button variant="outline" size="sm" asChild>
                <Link href="/admin/cars">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t("admin.backToCars")}
                </Link>
            </Button>
            <div className="max-w-5xl mx-auto mt-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
                        {message ? <div className="text-sm text-green-600">{message}</div> : null}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name="tagline"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('admin.homeHero.taglineEn') || 'Tagline (EN)'}</FormLabel>
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
                                name="tagline_ar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('admin.homeHero.taglineAr') || 'Tagline (AR)'}</FormLabel>
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
                        </div>
                        <FormField
                            control={form.control}
                            name="heading"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('admin.homeHero.headingEn') || 'Heading (EN)'}</FormLabel>
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
                            name="heading_ar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('admin.homeHero.headingAr') || 'Heading (AR)'}</FormLabel>
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('admin.homeHero.descriptionEn') || 'Description (EN)'}</FormLabel>
                                    <FormControl>
                                        <Textarea
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
                            name="description_ar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('admin.homeHero.descriptionAr') || 'Description (AR)'}</FormLabel>
                                    <FormControl>
                                        <Textarea
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
                            name="imageSrc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('admin.homeHero.imageUrl') || 'Image URL'}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            {...field}
                                            value={field?.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-4">
                            <Button type="submit">
                                {isPending ? (t('admin.homeHero.saving') || 'Saving...') : (t('admin.save') || 'Save')}
                            </Button>
                        </div>
                    </form>
                </Form>
                <div className='h-1 border-t border-border w-full my-4'>
                    &nbsp;
                </div>

                <Card>
                    <CardContent className='p-6'>
                        <CardTitle className='mb-3'>
                            Hero Image
                        </CardTitle>
                        {data?.imageUrl && (
                            <img
                                src={data?.imageUrl}
                                className="w-48 h-48 object-cover rounded-t-lg"
                            />
                        )}

                        <div>
                            <Label className="block text-sm font-medium">{t('admin.homeHero.imageUrl') || 'Image URL'}</Label>
                            <Input
                                type="file"
                                accept="image/*,.gif"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const formData = new FormData();
                                        formData.append("image", e.target.files[0]);
                                        upload({ form: formData })
                                    }
                                }}
                                className="mt-4"
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Recommended dimensions: 1200 × 600px for 2:1 aspect ratio (best fills available space)
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
