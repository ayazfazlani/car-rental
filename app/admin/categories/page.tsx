"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useAdminTranslation } from "@/lib/admin-translations";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  description: string | null;
  showOnHome: boolean;
  type: string;
  slug: string;
  isActive: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

const categoryTypes = [
  "SEDAN",
  "SUV",
  "SPORTS",
  "LUXURY",
  "COUPE",
  "CONVERTIBLE",
];

const defaultValues = {
  name: "",
  type: "SEDAN",
  description: "",
  showOnHome: false,
  slug: "",

  seo_title: "",
  seo_description: "",
  seo_keywords: "",
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState(defaultValues);
  const router = useRouter();
  const { t } = useAdminTranslation();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const res = await fetch("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      const method = editingCategory ? "PATCH" : "POST";

      if (!formData.slug) {
        formData.slug = slugify(formData.name)
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowForm(false);
        setEditingCategory(null);
        setFormData(defaultValues);
        fetchCategories();
      };
    } catch (error) {
      console.error("Failed to save category:", error);
      toast.error("Failed to save category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.areYouSureDeleteCategory"))) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("admin.categories")}</h1>
        <Button onClick={() => {
          setShowForm(true)
          setFormData(defaultValues);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          {t("admin.addCategory")}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingCategory
                ? t("admin.editCategory")
                : t("admin.addNewCategory")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("admin.name")}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">{t("common.description")}</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">{t("admin.type")}</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.selectCategoryType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categoryTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="showOnHome">{t("admin.showOnHome")}</Label>
                <Select value={formData.showOnHome ? "true" : "false"} onValueChange={(v) => setFormData({ ...formData, showOnHome: v === 'true' })} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.showOnHome")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={"true"}>{t("admin.yes")}</SelectItem>
                      <SelectItem value={'false'}>{t("admin.no")}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
                    setEditingCategory(null);
                    setFormData(defaultValues);
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
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{category.type}</p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingCategory(category);
                      setFormData({
                        name: category.name,
                        slug: category.slug,
                        type: category.type,
                        description: category.description || "",
                        showOnHome: category.showOnHome,
                        seo_title: category.seo_title || "",
                        seo_description: category.seo_description || "",
                        seo_keywords: category.seo_keywords || "",
                      });
                      setShowForm(true);
                    }}>
                    <Edit className="h-4 w-4 mr-2" />
                    {t("admin.edit")}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(category.id)}>
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
