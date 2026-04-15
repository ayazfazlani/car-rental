"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useAdminTranslation } from "@/lib/admin-translations";
import { sentanceCase } from "@/lib/utils";
import { PAGE_METATAGS } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { metaDataSchema, TMetaData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const categoryTypes = [
    PAGE_METATAGS.CARS,
    PAGE_METATAGS.ABOUT,
    PAGE_METATAGS.PRIVACY_POLICY,
    PAGE_METATAGS.TERMS_CONDITIONS,
    PAGE_METATAGS.BLOGS,
    PAGE_METATAGS.CONTACT,
    PAGE_METATAGS.HOME,
    PAGE_METATAGS.TERMS_OF_USE,
    PAGE_METATAGS.BRANDS,
    PAGE_METATAGS.CATEGORIES,
    PAGE_METATAGS.RENT_WITH_DRIVER,
];

const defaultValues: TMetaData = {
    description: "",
    keywords: "",
    page: PAGE_METATAGS.HOME,
    title: "",
    canonical: "",
}

export default function AdminCategories() {
    const { t } = useAdminTranslation();
    const [showForm, setShowForm] = useState(false);
    const [edit, setEdit] = useState<TMetaData | null>(null);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin-metadata'],
        queryFn: () => API.queryGet<TMetaData[]>({ url: '/api/admin/metadata', auth: true }),
    })

    const { mutate: mutateMetadata } = useMutation({
        mutationFn: (data: TMetaData) => API.queryPost<TMetaData>({ url: '/api/admin/metadata', payload: data, auth: true }),
        onSuccess: () => {
            toast.success("Metadata updated successfully")
            refetch()
            form.reset(defaultValues)
            setEdit(null)
            setShowForm(false)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const form = useForm({
        defaultValues: defaultValues,
        resolver: zodResolver(metaDataSchema),
    })

    const handleSubmit = (data: TMetaData) => {
        mutateMetadata(data)
    }

    const metadatas = data || []

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Metadata</h1>
                <Button onClick={() => {
                    setShowForm(true)
                    form.reset(defaultValues)
                }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Metadata
                </Button>
            </div>

            {showForm && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>
                            {edit
                                ? "Edit Metadata"
                                : "Add New Metadata"
                            }
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
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
                                    name="keywords"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Keywords (comma separated)</FormLabel>
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
                                    name="page"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Page ( will update if already exists)</FormLabel>
                                            <FormControl>
                                                <Select {...field} onValueChange={(val) => field.onChange(val)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select page" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {categoryTypes.map((type) => (
                                                                <SelectItem key={type} value={type}>
                                                                    {sentanceCase(type)}
                                                                </SelectItem>
                                                            ))}
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
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
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
                                    name="canonical"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Canonical URL (optional)</FormLabel>
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
                                <div className="flex gap-2">
                                    <Button type="submit">{t("admin.save")}</Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEdit(null)
                                            form.reset(defaultValues)
                                        }}>
                                        {t("admin.cancel")}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}

            {isLoading ? (
                <div>{t("admin.loading")}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {metadatas.length === 0 && <div>No metadata found</div>}
                    {metadatas.map((metadata) => (
                        <Card key={metadata.page}>
                            <CardHeader>
                                <CardTitle>{metadata.page}</CardTitle>
                                <p className="text-sm text-muted-foreground">{metadata.title}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setEdit(metadata);
                                            form.reset(metadata)
                                        }}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        {t("admin.edit")}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
