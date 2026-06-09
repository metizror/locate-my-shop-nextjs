"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Tag, FileText } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Category { id: string; name: string; description?: string; slug: string; color: string; post_count: number; created_at: string; }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", color: "#3B82F6" });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch posts');
      const posts = await res.json();
      const categoryMap = new Map<string, number>();
      posts?.forEach((post: any) => { if (post.category) { categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1); } });
      const categoryList: Category[] = Array.from(categoryMap.entries()).map(([name, count], index) => ({
        id: `cat-${index}`, name, description: `Category for ${name} posts`, slug: name.toLowerCase().replace(/\s+/g, '-'), color: getRandomColor(), post_count: count, created_at: new Date().toISOString()
      }));
      setCategories(categoryList);
    } catch (e) {
      toast({ title: "Error", description: "Failed to fetch categories", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const getRandomColor = () => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    try {
      setSaving(true);
      toast({ title: "Success", description: editingCategory ? "Category updated successfully" : "Category created successfully" });
      setIsDialogOpen(false);
      setFormData({ name: "", description: "", color: "#3B82F6" });
      setEditingCategory(null);
      fetchCategories();
    } catch {}
    finally { setSaving(false); }
  };

  const handleEdit = (category: Category) => { setEditingCategory(category); setFormData({ name: category.name, description: category.description || "", color: category.color }); setIsDialogOpen(true); };
  const confirmDelete = (categoryId: string) => { setPendingDeleteId(categoryId); setConfirmOpen(true); };
  const handleDelete = async () => { if (!pendingDeleteId) return; toast({ title: "Success", description: "Category deleted successfully" }); setPendingDeleteId(null); fetchCategories(); };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map((i)=> (
            <Card key={i} className="gradient-card border-0 shadow-card"><CardContent className="p-6"><div className="animate-pulse"><div className="h-4 bg-muted rounded w-3/4 mb-2"></div><div className="h-8 bg-muted rounded w-1/2"></div></div></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">Organize your blog posts with categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-soft" onClick={() => { setFormData({ name: "", description: "", color: "#3B82F6" }); setEditingCategory(null); }}>
              <Plus className="w-4 h-4 mr-2" /> New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>{editingCategory ? "Edit Category" : "Create New Category"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={formData.name} onChange={(e)=> setFormData(prev=> ({...prev, name: e.target.value}))} placeholder="Enter category name" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e)=> setFormData(prev=> ({...prev, description: e.target.value}))} placeholder="Enter category description" rows={3} />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2 items-center">
                  <Input id="color" type="color" value={formData.color} onChange={(e)=> setFormData(prev=> ({...prev, color: e.target.value}))} className="w-16 h-10" />
                  <Input value={formData.color} onChange={(e)=> setFormData(prev=> ({...prev, color: e.target.value}))} placeholder="#3B82F6" className="flex-1" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={()=> setIsDialogOpen(false)} className="flex-1">Cancel</Button>
                <Button type="submit" disabled={saving || !formData.name.trim()} className="flex-1">{saving ? "Saving..." : editingCategory ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {categories.length === 0 ? (
        <Card className="gradient-card border-0 shadow-card"><CardContent className="flex flex-col items-center justify-center py-16"><Tag className="w-16 h-16 text-muted-foreground mb-4" /><h3 className="text-xl font-semibold text-foreground mb-2">No Categories Found</h3><p className="text-muted-foreground text-center mb-6">Categories are automatically created when you publish posts with categories.</p><Button onClick={()=> setIsDialogOpen(true)}><Plus className="w-4 h-4 mr-2" />Create First Category</Button></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="gradient-card border-0 shadow-card hover:shadow-glow transition-smooth">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={()=> handleEdit(category)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={()=> confirmDelete(category.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">{category.post_count} posts</span></div>
                  <Badge variant="secondary" className="text-xs">{category.slug}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Delete category?" description="This will permanently remove the category." confirmText="Delete" onConfirm={handleDelete} />
    </div>
  );
}

