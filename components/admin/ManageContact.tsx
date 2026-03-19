'use client';
import { contactSchema, TContact } from "@/lib/validations";
import { Contact, ContactType } from '@prisma/client'
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { API } from '@/lib/api'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAdminTranslation } from '@/lib/admin-translations';
import { Button } from '../ui/button';
import { ArrowLeft, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from '../ui/input';
import Link from 'next/link';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const initialValues: TContact = {
    title: "",
    value: "",
    type: ContactType.PHONE,
    enabled: false,
}

export default function ManageContact() {
    const { t } = useAdminTranslation();
    const [showForm, setShowForm] = useState(false);

    // Fetch contacts
    const { data, refetch } = useQuery({
        queryKey: ['contacts'],
        queryFn: () => API.queryGet<Contact[]>({ url: '/api/admin/contact', auth: true }),
    });
    const contacts = data || [];

    // Add contact mutation
    const { mutate: addContact, isPending: isAdding } = useMutation({
        mutationFn: (data: TContact) => API.queryPost({
            url: '/api/admin/contact',
            payload: data,
            auth: true,
        }),
        onSuccess: () => {
            toast.success(t('admin.contact.added') || 'Contact added successfully');
            form.reset(initialValues);
            setShowForm(false);
            refetch();
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to add contact');
        }
    });

    // Enable contact mutation
    const { mutate: enableContact, isPending: isEnabling } = useMutation({
        mutationFn: (id: string) => API.queryPut({
            url: '/api/admin/contact',
            payload: { id },
            auth: true,
        }),
        onSuccess: () => {
            toast.success(t('admin.contact.enabled') || 'Contact enabled successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to enable contact');
        }
    });

    // Delete contact mutation
    const { mutate: deleteContact } = useMutation({
        mutationFn: async (id: string) => API.queryDelete({
            url: `/api/admin/contact/${id}`,
            auth: true,
        }),
        onSuccess: () => {
            toast.success(t('admin.contact.deleted') || 'Contact deleted successfully');
            refetch();
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete contact');
        }
    });

    const form = useForm({
        defaultValues: initialValues,
        resolver: zodResolver(contactSchema)
    });

    function onSubmit(formData: TContact) {
        addContact(formData);
    }

    console.log(contacts);

    return (
        <div className='w-full'>
            <Button variant="outline" size="sm" asChild>
                <Link href="/admin/cars">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t("admin.backToCars") || 'Back'}
                </Link>
            </Button>

            <div className="max-w-5xl mx-auto mt-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">{t('admin.contact.title') || 'Manage Contacts'}</h1>
                    <Button onClick={() => setShowForm(!showForm)} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        {t('admin.contact.add') || 'Add Contact'}
                    </Button>
                </div>

                {/* Add Contact Form */}
                {showForm && (
                    <div className="mb-6 p-4 border rounded-lg bg-slate-50">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('admin.contact.titleLabel') || 'Title'}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Sales Phone"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('admin.contact.contactTypeLabel') || 'Contact Type'}</FormLabel>
                                            <FormControl>
                                                <Select {...field} onValueChange={(v) => field.onChange(v)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('admin.selectTransmission')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value={ContactType.PHONE}>{t('admin.contact.phone') || 'Phone'}</SelectItem>
                                                            <SelectItem value={ContactType.EMAIL}>{t('admin.contact.email') || 'Email'}</SelectItem>
                                                            <SelectItem value={ContactType.WHATSAPP}>{t('admin.contact.whatsapp') || 'WhatsApp'}</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{
                                                form.watch("type") === ContactType.PHONE
                                                    ? t('admin.contact.phoneLabel') || 'Phone Number' :
                                                    form.watch("type") === ContactType.EMAIL
                                                        ? t('admin.contact.email') || 'Email'
                                                        : t('admin.contact.whatsapp') || 'WhatsApp'
                                            }</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={
                                                        form.watch("type") === ContactType.PHONE
                                                            ? "+1 (555) 123-4567" :
                                                            form.watch("type") === ContactType.EMAIL
                                                                ? "john.doe@example.com" :
                                                                "+971561234567"
                                                    }
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={isAdding}>
                                        {isAdding ? (t('admin.contact.saving') || 'Saving...') : (t('admin.save') || 'Save')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowForm(false);
                                            form.reset(initialValues);
                                        }}
                                    >
                                        {t('admin.cancel') || 'Cancel'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                )}

                {/* Contacts Table */}
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-100">
                                <TableHead>{t('admin.contact.title') || 'Title'}</TableHead>
                                <TableHead>{t('admin.contact.type') || 'Type'}</TableHead>
                                <TableHead>{t('admin.contact.value') || 'Value'}</TableHead>
                                <TableHead className="text-center">{t('admin.contact.status') || 'Status'}</TableHead>
                                <TableHead className="text-right">{t('admin.actions') || 'Actions'}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contacts?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4 text-slate-500">
                                        {t('admin.contact.noContacts') || 'No contacts added yet'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                contacts?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell>{item.value}</TableCell>
                                        <TableCell className="text-center">
                                            <button
                                                onClick={() => !item.enabled && enableContact(item.id)}
                                                disabled={isEnabling}
                                                className="flex items-center justify-center w-full"
                                            >
                                                {item.enabled ? (
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                ) : (
                                                    <Circle className="h-5 w-5 text-slate-300 hover:text-slate-400" />
                                                )}
                                            </button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteContact(item.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
