"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, Trash2, Star } from "lucide-react";
import { useAdminTranslation } from "@/lib/admin-translations";

interface CarImage {
    id: string;
    url: string;
    altText: string | null;
    displayOrder: number;
    isPrimary: boolean;
}

export default function CarImagesComponent({ carId }: { carId: string }) {
    const router = useRouter();
    const [images, setImages] = useState<CarImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const { t } = useAdminTranslation();

    useEffect(() => {
        fetchImages();
    }, [carId]);

    const fetchImages = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/admin/login");
                return;
            }

            const res = await fetch(`/api/admin/cars/${carId}/images`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success) {
                setImages(data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch images:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        setUploading(true);
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();

            selectedFiles.forEach((file) => {
                formData.append("images", file);
            });
            formData.append("isPrimary", images.length === 0 ? "true" : "false");

            const res = await fetch(`/api/admin/cars/${carId}/images`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setSelectedFiles([]);
                fetchImages();
                // Reset file input
                const fileInput = document.getElementById(
                    "file-input"
                ) as HTMLInputElement;
                if (fileInput) fileInput.value = "";
            } else {
                alert(data.message || t("admin.failedToUploadImages"));
            }
        } catch (error) {
            console.error("Failed to upload images:", error);
            alert(t("admin.failedToUploadImages"));
        } finally {
            setUploading(false);
        }
    };

    const handleSetPrimary = async (imageId: string) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/admin/cars/${carId}/images/${imageId}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isPrimary: true }),
            });

            if (res.ok) {
                fetchImages();
            } else {
                alert(t("admin.failedToSetPrimary"));
            }
        } catch (error) {
            console.error("Failed to set primary image:", error);
            alert(t("admin.failedToSetPrimary"));
        }
    };

    const handleDelete = async (imageId: string) => {
        if (!confirm(t("admin.areYouSureDeleteImage"))) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/admin/cars/${carId}/images/${imageId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                fetchImages();
            }
        } catch (error) {
            console.error("Failed to delete image:", error);
        }
    };

    return (
        <div>

            {/* Upload Section */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>{t("admin.uploadImages")}</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="file-input">{t("admin.selectImages")}</Label>

                            <Input
                                id="file-input"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileSelect}
                                className="mt-2"
                            />

                            {/* Helper text */}
                            <div className="mt-2 text-sm text-muted-foreground space-y-1">
                                <p>
                                    • <strong>{t("admin.recommendedRatio")}:</strong> 4:3
                                </p>
                                <p>
                                    • <strong>{t("admin.recommendedSize")}:</strong> 1200 × 900 px
                                </p>
                                <p>
                                    • <strong>{t("admin.minimumSize")}:</strong> 800 × 600 px
                                </p>
                                <p>
                                    • <strong>{t("admin.formats")}:</strong> JPG, WebP, PNG
                                </p>
                                <p className="text-xs">
                                    {t("admin.imageNote")}
                                </p>
                            </div>

                            {selectedFiles.length > 0 && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    {selectedFiles.length} {t("admin.filesSelected")}
                                </p>
                            )}
                        </div>

                        <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={selectedFiles.length === 0 || uploading}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploading ? t("admin.uploading") : t("admin.uploadImages")}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Images Grid */}
            {loading ? (
                <div>{t("admin.loadingImages")}</div>
            ) : images.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground">
                            {t("admin.noImagesUploaded")}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image) => (
                        <Card key={image.id}>
                            <div className="relative h-48 w-full">
                                <img
                                    src={image.url}
                                    alt={image.altText || "Car image"}
                                    className="w-full h-full object-cover rounded-t-lg"
                                    onError={(e) => {
                                        // Fallback if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = "none";
                                        const fallback = target.nextElementSibling as HTMLElement;
                                        if (fallback) fallback.style.display = "flex";
                                    }}
                                />
                                {image.isPrimary && (
                                    <Badge className="absolute top-2 left-2 bg-primary">
                                        {t("admin.primary")}
                                    </Badge>
                                )}
                            </div>
                            <CardContent className="p-4">
                                <div className="flex gap-2">
                                    {!image.isPrimary && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            type="button"
                                            onClick={() => handleSetPrimary(image.id)}
                                            className="flex-1">
                                            <Star className="h-4 w-4 mr-2" />
                                            {t("admin.setPrimary")}
                                        </Button>
                                    )}
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        type="button"
                                        onClick={() => handleDelete(image.id)}>
                                        <Trash2 className="h-4 w-4" />
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
