"use client";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useBlogPosts, useBlogAuthors, BlogPost } from "@/hooks/useBlogData";
import { Plus, Edit, Trash2, Eye, Calendar, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function PostsPage() {
  const { posts, loading, error, refetch } = useBlogPosts();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { authors } = useBlogAuthors();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author_id: "",
    image_url: "",
    slug: "",
    read_time: "",
    seo_title: "",
    seo_description: "",
    seo_schema: "",
    published_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const shouldOpen = searchParams.get("new") === "1";
    if (shouldOpen) {
      setEditingPost(null);
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        author_id: "",
        image_url: "",
        slug: "",
        read_time: "",
        seo_title: "",
        seo_description: "",
        seo_schema: "",
        published_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      });
      setIsDialogOpen(true);
      router.replace("/admin/posts");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Auth, slug, date parts, and user_id are handled server-side by the API.

      // Parse schema - always process it for both new and existing posts
      let seoSchemaParsed: any = null;
      const hasSchemaInput = formData.seo_schema && formData.seo_schema.trim().length > 0;
      
      if (hasSchemaInput) {
        try {
          seoSchemaParsed = JSON.parse(formData.seo_schema);
          // Validate that parsed result is an object or array
          if (seoSchemaParsed !== null && typeof seoSchemaParsed !== 'object') {
            setSaving(false);
            return toast({ title: "Invalid SEO Schema", description: "Schema must be a valid JSON object or array.", variant: "destructive" });
          }
        } catch (parseError) {
          setSaving(false);
          return toast({ title: "Invalid SEO Schema", description: "Please provide valid JSON-LD. " + (parseError instanceof Error ? parseError.message : ""), variant: "destructive" });
        }
      }

      // The API computes slug, date parts, and user_id server-side.
      const payload = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author_id: formData.author_id,
        image_url: formData.image_url,
        slug: formData.slug,
        read_time: formData.read_time,
        seo_title: formData.seo_title,
        seo_description: formData.seo_description,
        seo_schema: hasSchemaInput ? seoSchemaParsed : null,
        published_at: new Date(formData.published_at).toISOString(),
      };

      const res = await fetch(
        editingPost ? `/api/admin/posts/${editingPost.id}` : "/api/admin/posts",
        {
          method: editingPost ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error((await res.json()).error || "Failed to save post");

      toast({ title: "Success", description: `Post ${editingPost ? 'updated' : 'created'} successfully!` });
      setIsDialogOpen(false);
      setEditingPost(null);
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        author_id: "",
        image_url: "",
        slug: "",
        read_time: "",
        seo_title: "",
        seo_description: "",
        seo_schema: "",
        published_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      });
      refetch();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    
    // Properly handle schema - can be object, array, or null
    let schemaString = "";
    if (post?.seo_schema) {
      try {
        // Ensure it's properly stringified regardless of whether it's an object or array
        schemaString = JSON.stringify(post.seo_schema, null, 2);
      } catch (e) {
        console.error('Error stringifying schema:', e);
        schemaString = "";
      }
    }
    
    setFormData({
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content || "",
      author_id: post.author_id || "",
      image_url: post.image_url || "",
      slug: post.slug || "",
      read_time: post.read_time || "",
      seo_title: post.seo_title || "",
      seo_description: post.seo_description || "",
      seo_schema: schemaString,
      published_at: post.published_at ? format(new Date(post.published_at), "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast({ title: "Error", description: "Image size must be less than 5MB", variant: "destructive" }); return; }
    if (!file.type.startsWith('image/')) { toast({ title: "Error", description: "Please select an image file", variant: "destructive" }); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setFormData(prev => ({ ...prev, image_url: data.url }));
      toast({ title: "Success", description: "Image uploaded successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally { setUploading(false); }
  };

  const removeImage = () => { setFormData(prev => ({ ...prev, image_url: "" })); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const confirmDelete = (postId: string) => { setPendingDeleteId(postId); setConfirmOpen(true); };
  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try { const res = await fetch(`/api/admin/posts/${pendingDeleteId}`, { method: "DELETE", credentials: "include" }); if (!res.ok) throw new Error((await res.json()).error || "Delete failed"); toast({ title: "Success", description: "Post deleted successfully!" }); refetch(); }
    catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    finally { setPendingDeleteId(null); }
  };

  if (loading) { return (<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>); }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Posts Management</h1>
          <p className="text-muted-foreground">Create and manage your blog posts</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingPost(null); setFormData({ title: "", excerpt: "", content: "", author_id: "", image_url: "", slug: "", read_time: "", seo_title: "", seo_description: "", seo_schema: "", published_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"), }); }}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label htmlFor="title">Title</Label><Input id="title" value={formData.title} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, title: e.target.value }))} required /></div>
              <div><Label htmlFor="slug">Slug</Label><Input id="slug" value={formData.slug} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, slug: e.target.value }))} placeholder="Auto-generated from title if empty" /></div>
              <div><Label htmlFor="excerpt">Excerpt</Label><Textarea id="excerpt" value={formData.excerpt} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))} rows={3} /></div>
              <div><Label htmlFor="content">Content</Label><RichTextEditor value={formData.content} onChange={(value) => setFormData(prev => ({ ...prev, content: value }))} placeholder="Write your blog content here..." className="mt-2" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="author_id">Author</Label><Select value={formData.author_id} onValueChange={(value) => setFormData(prev => ({ ...prev, author_id: value }))}><SelectTrigger><SelectValue placeholder="Select an author" /></SelectTrigger><SelectContent>{authors.map((author) => (<SelectItem key={author.id} value={author.id}>{author.name}</SelectItem>))}</SelectContent></Select></div>
                <div><Label htmlFor="read_time">Read Time</Label><Input id="read_time" value={formData.read_time} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, read_time: e.target.value }))} placeholder="e.g. 5 min read" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="published_at">Published Date</Label><Input id="published_at" type="datetime-local" value={formData.published_at} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, published_at: e.target.value }))} /></div>
                <div></div>
              </div>
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-foreground">SEO Settings</h3>
                <div><Label htmlFor="seo_title">SEO Title (max 70 characters)</Label><Input id="seo_title" value={formData.seo_title} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))} placeholder="Optional: Custom title for search engines" maxLength={70} /><p className="text-xs text-muted-foreground mt-1">{formData.seo_title.length}/70 characters</p></div>
                <div><Label htmlFor="seo_description">SEO Description (max 160 characters)</Label><Textarea id="seo_description" value={formData.seo_description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))} placeholder="Optional: Custom description for search engines" maxLength={160} rows={3} /><p className="text-xs text-muted-foreground mt-1">{formData.seo_description.length}/160 characters</p></div>
                <div>
                  <Label htmlFor="seo_schema">SEO Schema (JSON-LD)</Label>
                  <Textarea
                    id="seo_schema"
                    value={formData.seo_schema}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, seo_schema: e.target.value }))}
                    placeholder='Paste valid JSON-LD. You can provide a single object or an array of objects.'
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Provide valid JSON. Example: FAQPage and BlogPosting objects.</p>
                </div>
              </div>
              <div>
                <Label>Blog Image</Label>
                <div className="space-y-4">
                  {formData.image_url ? (
                    <div className="space-y-2">
                      <div className="relative"><img src={formData.image_url} alt="Blog preview" className="w-full h-48 object-cover rounded-md border" /><Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={removeImage}><X className="w-4 h-4" /></Button></div>
                      <Input value={formData.image_url} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, image_url: e.target.value }))} placeholder="Or enter image URL manually" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 text-center"><Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" /><p className="text-sm text-muted-foreground mb-2">Upload an image or enter URL below</p><Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>{uploading ? "Uploading..." : "Choose File"}</Button><input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} /></div>
                      <Input value={formData.image_url} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, image_url: e.target.value }))} placeholder="Or enter image URL manually" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving..." : (editingPost ? "Update" : "Create")}</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {error && (<Card className="border-destructive"><CardContent className="pt-6"><p className="text-destructive">{error}</p></CardContent></Card>)}
      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id}><CardHeader><div className="flex items-start justify-between"><div className="flex-1"><CardTitle className="text-lg">{post.title}</CardTitle>{post.excerpt && (<p className="text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>)}<div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground"><div className="flex items-center gap-1"><Calendar className="w-4 h-4" />{format(new Date(post.published_at), 'MMM d, yyyy')}</div>{post.author?.name && (<Badge variant="secondary">By {post.author.name}</Badge>)}{post.read_time && (<span>{post.read_time}</span>)}</div></div><div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => window.open(`/blog/${post.slug}`, '_blank')}><Eye className="w-4 h-4" /></Button><Button variant="outline" size="sm" onClick={() => handleEdit(post)}><Edit className="w-4 h-4" /></Button><Button variant="destructive" size="sm" onClick={() => confirmDelete(post.id)}><Trash2 className="w-4 h-4" /></Button></div></div></CardHeader></Card>
        ))}
      </div>
      {posts.length === 0 && !loading && (<Card><CardContent className="pt-6 text-center"><p className="text-muted-foreground">No posts found. Create your first post to get started!</p></CardContent></Card>)}
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Delete post?" description="This will permanently remove the post." confirmText="Delete" onConfirm={handleDelete} />
    </div>
  );
}

