"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import { createSlug } from "@/lib/utils";
import { useAdminTranslation } from "@/lib/admin-translations";
import { RTE } from "@/components/admin/RTE";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string | null;
  isActive: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
}

const defaultValues = {
  name: "",
  slug: "",
  description: "",

  seo_title: "",
  seo_description: "",
  seo_keywords: "",
};

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState(defaultValues);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useAdminTranslation();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const res = await fetch("/api/admin/brands", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setBrands(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingBrand
        ? `/api/admin/brands/${editingBrand.id}`
        : "/api/admin/brands";
      const method = editingBrand ? "PATCH" : "POST";

      // Use FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("slug", formData.slug || createSlug(formData.name));
      if (formData.description) {
        formDataToSend.append("description", formData.description);
      }
      if (logoFile) {
        formDataToSend.append("logo", logoFile);
      }
      if (formData.seo_title) {
        formDataToSend.append("seo_title", formData.seo_title);
      }
      if (formData.seo_description) {
        formDataToSend.append("seo_description", formData.seo_description);
      }
      if (formData.seo_keywords) {
        formDataToSend.append("seo_keywords", formData.seo_keywords);
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type header - browser will set it with boundary for FormData
        },
        body: formDataToSend,
      });

      if (res.ok) {
        setShowForm(false);
        setEditingBrand(null);
        setFormData(defaultValues);
        setLogoFile(null);
        setLogoPreview(null);
        fetchBrands();
      } else {
        const errorData = await res.json();
        alert(errorData.message || t("admin.failedToSaveBrand"));
      }
    } catch (error) {
      console.error("Failed to save brand:", error);
      alert(t("admin.failedToSaveBrand"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.areYouSureDeleteBrand"))) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/brands/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchBrands();
      }
    } catch (error) {
      console.error("Failed to delete brand:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("admin.brands")}</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("admin.addBrand")}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingBrand ? t("admin.editBrand") : t("admin.addNewBrand")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("admin.name")}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      // Auto-generate slug from name if slug is empty or was auto-generated
                      slug:
                        formData.slug && !editingBrand
                          ? formData.slug
                          : createSlug(name),
                    });
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">{t("admin.slug")}</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder={t("admin.autoGeneratedFromName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">{t("admin.logoImage")}</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                {logoPreview && (
                  <div className="mt-2">
                    <img
                      src={logoPreview}
                      alt={t("admin.logoPreview")}
                      className="h-20 w-20 object-contain border rounded"
                    />
                  </div>
                )}
                {editingBrand && editingBrand.logoUrl && !logoPreview && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("admin.currentLogo")}
                    </p>
                    <img
                      src={editingBrand.logoUrl}
                      alt="Current logo"
                      className="h-20 w-20 object-contain border rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("common.description")}</Label>
                <RTE
                  value={formData.description}
                  onChange={(v: string) => setFormData({ ...formData, description: v })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo_title">{t("admin.seoTitle")}</Label>
                <Input
                  id="seo_title"
                  value={formData.seo_title}
                  onChange={(e) =>
                    setFormData({ ...formData, seo_title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo_description">{t("admin.seoDescription")}</Label>
                <Input
                  id="seo_description"
                  value={formData.seo_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo_description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo_keywords">{t("admin.seoKeywords")}</Label>
                <Input
                  id="seo_keywords"
                  value={formData.seo_keywords}
                  onChange={(e) =>
                    setFormData({ ...formData, seo_keywords: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{t("admin.save")}</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingBrand(null);
                    setFormData(defaultValues);
                    setLogoFile(null);
                    setLogoPreview(null);
                  }}>
                  {t("admin.cancel")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div>{t("admin.loading")}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <Card key={brand.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {brand.logoUrl && (
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="h-12 w-12 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  )}
                  <CardTitle>{brand.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingBrand(brand);
                      setFormData({
                        name: brand.name,
                        slug: brand.slug,
                        description: brand.description || "",
                        seo_title: brand.seo_title || "",
                        seo_description: brand.seo_description || "",
                        seo_keywords: brand.seo_keywords || "",
                      });
                      setLogoFile(null);
                      setLogoPreview(null);
                      setShowForm(true);
                    }}>
                    <Edit className="h-4 w-4 mr-2" />
                    {t("admin.edit")}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(brand.id)}>
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
