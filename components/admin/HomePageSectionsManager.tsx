'use client';

import { use, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API } from '@/lib/api';
import { useAdminTranslation } from '@/lib/admin-translations';
import { HomePageSection } from '@prisma/client';
import { Button } from '../ui/button';
import { ArrowLeft, GripVertical, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import SectionConfigForm from './SectionConfigForm';

export default function HomePageSectionsManager() {
    const router = useRouter();
    const { t } = useAdminTranslation();
    const queryClient = useQueryClient();
    const [editingSection, setEditingSection] = useState<HomePageSection | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Fetch sections
    const { data: sections = [], isLoading } = useQuery({
        queryKey: ['home-sections'],
        queryFn: () => API.queryGet({ url: '/api/admin/home-sections', auth: true }) as Promise<HomePageSection[]>,
    });

    // Toggle visibility mutation
    const { mutate: toggleVisibility } = useMutation({
        mutationFn: (section: HomePageSection) =>
            API.queryPut({
                url: '/api/admin/home-sections',
                payload: {
                    id: section.id,
                    isVisible: !section.isVisible,
                },
                auth: true,
            }),
        onSuccess: () => {
            toast.success(t('admin.updated') || 'Updated successfully');
            queryClient.invalidateQueries({ queryKey: ['home-sections'] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // Delete mutation
    const { mutate: deleteSection } = useMutation({
        mutationFn: (id: string) =>
            API.queryDelete({
                url: '/api/admin/home-sections',
                payload: { id },
                auth: true,
            }),
        onSuccess: () => {
            toast.success(t('admin.deleted') || 'Deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['home-sections'] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // Update mutation
    const { mutate: updateSection } = useMutation({
        mutationFn: (data: any) =>
            API.queryPut({
                url: '/api/admin/home-sections',
                payload: data,
                auth: true,
            }),
        onSuccess: () => {
            toast.success(t('admin.updated') || 'Updated successfully');
            queryClient.invalidateQueries({ queryKey: ['home-sections'] });
            setIsDialogOpen(false);
            setEditingSection(null);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // Reorder mutation
    const { mutate: reorderSections } = useMutation({
        mutationFn: (reorderedSections: any[]) =>
            API.queryPatch({
                url: '/api/admin/home-sections',
                payload: {
                    sections: reorderedSections.map((s, index) => ({
                        id: s.id,
                        order: index,
                    })),
                },
                auth: true,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['home-sections'] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);

        if (sourceIndex === targetIndex) return;

        const newSections = [...sections];
        const [movedSection] = newSections.splice(sourceIndex, 1);
        newSections.splice(targetIndex, 0, movedSection);

        reorderSections(newSections);
    };

    const handleEditClick = (section: HomePageSection) => {
        setEditingSection(section);
        setIsDialogOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-muted-foreground">
                    {t('admin.loading') || 'Loading...'}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Button variant="outline" size="sm" asChild className="mb-6">
                <Link href="/admin">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('admin.backToDashboard') || 'Back to Dashboard'}
                </Link>
            </Button>

            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        {t('admin.homeSections') || 'Home Page Sections'}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('admin.homeSectionsDescription') ||
                            'Manage the order and visibility of sections on the home page. Drag to reorder.'}
                    </p>
                </div>

                {sections.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                            {t('admin.noSections') || 'No sections found'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sections.map((section, index) => (
                            <div
                                key={section.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${section.isVisible
                                    ? 'bg-card border-border hover:bg-muted/50'
                                    : 'bg-muted border-muted-foreground/20 opacity-60'
                                    }`}
                            >
                                <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0 cursor-grab" />

                                <div className="flex-1">
                                    <div className="font-semibold">
                                        {index + 1}. {section.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Type: {section.type}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleVisibility(section)}
                                        title={section.isVisible ? 'Hide section' : 'Show section'}
                                    >
                                        {section.isVisible ? (
                                            <Eye className="h-4 w-4" />
                                        ) : (
                                            <EyeOff className="h-4 w-4" />
                                        )}
                                    </Button>

                                    {/* <Dialog open={editingSection?.id === section.id && isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditClick(section)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>{t('admin.editSection') || 'Edit Section'}</DialogTitle>
                                                <DialogDescription>
                                                    {t('admin.editSectionDescription') ||
                                                        'Update section settings and configuration'}
                                                </DialogDescription>
                                            </DialogHeader>
                                            {editingSection && (
                                                <SectionConfigForm
                                                    section={editingSection}
                                                    onSave={(data) => {
                                                        updateSection({
                                                            id: editingSection.id,
                                                            ...data,
                                                        });
                                                    }}
                                                    onCancel={() => {
                                                        setIsDialogOpen(false);
                                                        setEditingSection(null);
                                                    }}
                                                />
                                            )}
                                        </DialogContent>
                                    </Dialog> */}
                                    {/* 
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            if (confirm(t('admin.confirmDelete') || 'Are you sure?')) {
                                                deleteSection(section.id);
                                            }
                                        }}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button> */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
