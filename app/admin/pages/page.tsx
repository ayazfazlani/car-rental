"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Globe } from "lucide-react";
import { useAdminTranslation } from "@/lib/admin-translations";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import { RTE } from "@/components/admin/RTE";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: any;
  excerpt?: string;
  isPublished: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  canonical?: string;
}

const defaultValues = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  isPublished: false,
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  canonical: "",
};

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState(defaultValues);
  const router = useRouter();
  const { t } = useAdminTranslation();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const res = await fetch("/api/admin/pages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setPages(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingPage
        ? `/api/admin/pages/${editingPage.id}`
        : "/api/admin/pages";
      const method = editingPage ? "PATCH" : "POST";

      const submissionData = { ...formData };
      if (!submissionData.slug) {
        submissionData.slug = slugify(submissionData.title);
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (res.ok) {
        toast.success(editingPage ? "Page updated" : "Page created");
        setShowForm(false);
        setEditingPage(null);
        setFormData(defaultValues);
        fetchPages();
      } else {
        const err = await res.json();
        toast.error(err.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Failed to save page:", error);
      toast.error("Failed to save page");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Page deleted");
        fetchPages();
      }
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Custom Pages</h1>
        {!showForm && (
          <Button onClick={() => {
            setShowForm(true);
            setEditingPage(null);
            setFormData(defaultValues);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Page
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPage ? "Edit Page" : "Add New Page"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="leave-empty-to-auto-generate"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Page Content</Label>
                <RTE
                  value={formData.content}
                  onChange={(v: string) => setFormData({ ...formData, content: v })}
                  minHeight="500px"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                />
                <Label htmlFor="isPublished">Publish this page</Label>
              </div>

              <div className="border-t pt-4 mt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Globe className="h-4 w-4" /> SEO Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seo_title">SEO Title</Label>
                    <Input
                      id="seo_title"
                      value={formData.seo_title}
                      onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seo_keywords">SEO Keywords</Label>
                    <Input
                      id="seo_keywords"
                      value={formData.seo_keywords}
                      onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="seo_description">SEO Description</Label>
                    <Input
                      id="seo_description"
                      value={formData.seo_description}
                      onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="canonical">Canonical URL</Label>
                    <Input
                      id="canonical"
                      value={formData.canonical}
                      onChange={(e) => setFormData({ ...formData, canonical: e.target.value })}
                      placeholder="https://luxuscarrental.com/custom-slug"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Page</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-10">Loading pages...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pages.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground border rounded-lg">
              No custom pages found.
            </div>
          ) : (
            pages.map((page) => (
              <Card key={page.id} className="flex flex-col md:flex-row items-center justify-between p-4">
                <div className="flex flex-col mb-4 md:mb-0">
                  <h3 className="font-bold text-lg">{page.title}</h3>
                  <p className="text-sm text-muted-foreground">/{page.slug}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-2 py-1 rounded text-xs ${page.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {page.isPublished ? "Published" : "Draft"}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPage(page);
                        setFormData({
                          title: page.title,
                          slug: page.slug,
                          content: page.content,
                          excerpt: page.excerpt || "",
                          isPublished: page.isPublished,
                          seo_title: page.seo_title || "",
                          seo_description: page.seo_description || "",
                          seo_keywords: page.seo_keywords || "",
                          canonical: page.canonical || "",
                        });
                        setShowForm(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(page.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
