'use client';

import { useState } from 'react';
import { HomePageSection } from '@prisma/client';
import { useAdminTranslation } from '@/lib/admin-translations';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateHomePageSectionSchema, TUpdateHomePageSection } from '@/lib/validations';
import { Form } from '../ui/form';

interface SectionConfigFormProps {
    section: HomePageSection;
    onSave: (data: TUpdateHomePageSection) => void;
    onCancel: () => void;
}

export default function SectionConfigForm({
    section,
    onSave,
    onCancel,
}: SectionConfigFormProps) {
    const { t } = useAdminTranslation();

    const form = useForm({
        defaultValues: {
            name: section.name,
            order: section.order,
            isVisible: section.isVisible,
            config: (typeof section.config === 'object' && section.config !== null ? section.config : {}) as any,
        },
        resolver: zodResolver(updateHomePageSectionSchema),
    });

    const handleSubmit = (data: any) => {
        onSave(data);
    };

    const renderConfigFields = () => {
        const config = form.watch('config') || {};

        switch (section.type) {
            case 'AFFORDABLE_CARS':
            case 'RECOMMENDED_CARS':
                return (
                    <>
                        <FormField
                            control={form.control}
                            name="config"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('admin.title') || 'Title'}</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={config.title || ''}
                                            onChange={(e) =>
                                                field.onChange({ ...config, title: e.target.value })
                                            }
                                            placeholder="Section title"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="config"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('admin.subtitle') || 'Subtitle'}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            value={config.subtitle || ''}
                                            onChange={(e) =>
                                                field.onChange({ ...config, subtitle: e.target.value })
                                            }
                                            placeholder="Section subtitle"
                                            rows={2}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {section.type === 'RECOMMENDED_CARS' && (
                            <FormField
                                control={form.control}
                                name="config"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('admin.backgroundColor') || 'Background Color'}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={config.backgroundColor || ''}
                                                onChange={(e) =>
                                                    field.onChange({
                                                        ...config,
                                                        backgroundColor: e.target.value,
                                                    })
                                                }
                                                placeholder="#FBF1E7"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        )}
                    </>
                );

            case 'BRANDS':
                return (
                    <>
                        <FormField
                            control={form.control}
                            name="config"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('admin.title') || 'Title'}</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={config.title || ''}
                                            onChange={(e) =>
                                                field.onChange({ ...config, title: e.target.value })
                                            }
                                            placeholder="Section title"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="config"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('admin.subtitle') || 'Subtitle'}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            value={config.subtitle || ''}
                                            onChange={(e) =>
                                                field.onChange({ ...config, subtitle: e.target.value })
                                            }
                                            placeholder="Section subtitle"
                                            rows={2}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="config"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('admin.viewType') || 'View Type'}</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            value={config.viewType || 'cards'}
                                            onChange={(e) =>
                                                field.onChange({ ...config, viewType: e.target.value })
                                            }
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                        >
                                            <option value="cards">Cards</option>
                                            <option value="pills">Pills</option>
                                            <option value="header">Header</option>
                                        </select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </>
                );

            case 'CATEGORIES':
            case 'FAQ':
            case 'TESTIMONIALS':
                return (
                    <>
                        <FormField
                            control={form.control}
                            name="config"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('admin.title') || 'Title'}</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={config.title || ''}
                                            onChange={(e) =>
                                                field.onChange({ ...config, title: e.target.value })
                                            }
                                            placeholder="Section title"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="config"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('admin.subtitle') || 'Subtitle'}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            value={config.subtitle || ''}
                                            onChange={(e) =>
                                                field.onChange({ ...config, subtitle: e.target.value })
                                            }
                                            placeholder="Section subtitle"
                                            rows={2}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('admin.sectionName') || 'Section Name'}</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Section name" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('admin.order') || 'Order'}</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    min="0"
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isVisible"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                                <input
                                    type="checkbox"
                                    {...field}
                                    value={field.value ? 'on' : 'off'}
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                    className="h-4 w-4"
                                />
                            </FormControl>
                            <FormLabel className="!mt-0">
                                {t('admin.visible') || 'Visible'}
                            </FormLabel>
                        </FormItem>
                    )}
                />

                {renderConfigFields()}

                <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                        {t('admin.save') || 'Save'}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                        {t('admin.cancel') || 'Cancel'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
