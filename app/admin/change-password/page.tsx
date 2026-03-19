'use client';
import { changePasswordSchema, TChangePassword } from "@/lib/validations";
import { useMutation } from '@tanstack/react-query';
import { API } from '@/lib/api'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAdminTranslation } from '@/lib/admin-translations';
import { ArrowLeft } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialValues: TChangePassword = {
    oldpassword: "",
    password: "",
}

export default function ManageChangePassword() {
    const { t } = useAdminTranslation();

    // Add contact mutation
    const { mutate: ChangePassword, isPending: isAdding } = useMutation({
        mutationFn: (data: TChangePassword) => API.queryPost({
            url: '/api/admin/change-password',
            payload: data,
            auth: true,
        }),
        onSuccess: () => {
            toast.success('Password Changed successfully');
            form.reset(initialValues);
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to change password');
        }
    });


    const form = useForm({
        defaultValues: initialValues,
        resolver: zodResolver(changePasswordSchema)
    });

    function onSubmit(formData: TChangePassword) {
        ChangePassword(formData);
    }


    return (
        <div className='w-full'>
            <Button variant="outline" size="sm" asChild>
                <Link href="/admin/cars">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t("admin.backToCars") || 'Back'}
                </Link>
            </Button>

            <div className="max-w-xl mx-auto mt-4">
                <div className="mb-6 p-4 border rounded-lg bg-slate-50">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="oldpassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('admin.oldPassword') || 'Old Password'}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., old password"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('admin.newPassword') || 'New Password'}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., new password"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-2">
                                <Button type="submit" disabled={isAdding}>
                                    {isAdding ? (t('admin.saving') || 'Saving...') : (t('admin.save') || 'Save')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        form.reset(initialValues);
                                    }}
                                >
                                    {t('admin.cancel') || 'Cancel'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
