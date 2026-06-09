"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useBlogAuthors, BlogAuthor } from "@/hooks/useBlogData";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, Edit, Trash2, Twitter, Linkedin, Facebook } from "lucide-react";

export default function AuthorsPage() {
  const { authors, loading, error, refetch } = useBlogAuthors();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<BlogAuthor | null>(null);
  const [formData, setFormData] = useState({ name: "", bio: "", avatar_url: "", twitter_url: "", linkedin_url: "", facebook_url: "" });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        editingAuthor ? `/api/admin/authors/${editingAuthor.id}` : "/api/admin/authors",
        {
          method: editingAuthor ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error((await res.json()).error || "Request failed");
      toast({ title: "Success", description: `Author ${editingAuthor ? 'updated' : 'created'} successfully!` });
      setIsDialogOpen(false);
      setEditingAuthor(null);
      setFormData({ name: "", bio: "", avatar_url: "", twitter_url: "", linkedin_url: "", facebook_url: "" });
      refetch();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleEdit = (author: BlogAuthor) => {
    setEditingAuthor(author);
    setFormData({ name: author.name, bio: author.bio || "", avatar_url: author.avatar_url || "", twitter_url: author.twitter_url || "", linkedin_url: author.linkedin_url || "", facebook_url: author.facebook_url || "" });
    setIsDialogOpen(true);
  };

  const confirmDelete = (authorId: string) => { setPendingDeleteId(authorId); setConfirmOpen(true); };
  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try { const res = await fetch(`/api/admin/authors/${pendingDeleteId}`, { method: "DELETE", credentials: "include" }); if (!res.ok) throw new Error((await res.json()).error || "Delete failed"); toast({ title: "Success", description: "Author deleted successfully!" }); refetch(); }
    catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    finally { setPendingDeleteId(null); }
  };

  if (loading) { return (<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>); }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Authors Management</h1>
          <p className="text-muted-foreground">Manage blog authors and their profiles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingAuthor(null); setFormData({ name: "", bio: "", avatar_url: "", twitter_url: "", linkedin_url: "", facebook_url: "" }); }}>
              <Plus className="w-4 h-4 mr-2" />
              New Author
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editingAuthor ? 'Edit Author' : 'Create New Author'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label htmlFor="name">Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required /></div>
              <div><Label htmlFor="bio">Bio</Label><Textarea id="bio" value={formData.bio} onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))} rows={4} /></div>
              <div><Label htmlFor="avatar_url">Avatar URL</Label><Input id="avatar_url" value={formData.avatar_url} onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))} placeholder="https://example.com/avatar.jpg" /></div>
              <div><Label htmlFor="twitter_url">Twitter URL</Label><Input id="twitter_url" value={formData.twitter_url} onChange={(e) => setFormData(prev => ({ ...prev, twitter_url: e.target.value }))} placeholder="https://twitter.com/username" /></div>
              <div><Label htmlFor="linkedin_url">LinkedIn URL</Label><Input id="linkedin_url" value={formData.linkedin_url} onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))} placeholder="https://linkedin.com/in/username" /></div>
              <div><Label htmlFor="facebook_url">Facebook URL</Label><Input id="facebook_url" value={formData.facebook_url} onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))} placeholder="https://facebook.com/username" /></div>
              <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving..." : (editingAuthor ? "Update" : "Create")}</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {error && (<Card className="border-destructive"><CardContent className="pt-6"><p className="text-destructive">{error}</p></CardContent></Card>)}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <Card key={author.id}><CardHeader><div className="flex items-center gap-4"><Avatar className="w-16 h-16"><AvatarImage src={author.avatar_url || undefined} alt={author.name} /><AvatarFallback>{author.name.charAt(0).toUpperCase()}</AvatarFallback></Avatar><div className="flex-1"><CardTitle className="text-lg">{author.name}</CardTitle>{author.bio && (<p className="text-muted-foreground text-sm mt-1 line-clamp-2">{author.bio}</p>)}</div></div></CardHeader><CardContent><div className="flex items-center gap-2 mb-4">{author.twitter_url && (<Button variant="outline" size="sm" asChild><a href={author.twitter_url} target="_blank" rel="noopener noreferrer"><Twitter className="w-4 h-4" /></a></Button>)}{author.linkedin_url && (<Button variant="outline" size="sm" asChild><a href={author.linkedin_url} target="_blank" rel="noopener noreferrer"><Linkedin className="w-4 h-4" /></a></Button>)}{author.facebook_url && (<Button variant="outline" size="sm" asChild><a href={author.facebook_url} target="_blank" rel="noopener noreferrer"><Facebook className="w-4 h-4" /></a></Button>)}</div><div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => handleEdit(author)} className="flex-1"><Edit className="w-4 h-4 mr-2" />Edit</Button><Button variant="destructive" size="sm" onClick={() => confirmDelete(author.id)}><Trash2 className="w-4 h-4" /></Button></div></CardContent></Card>
        ))}
      </div>
      {authors.length === 0 && !loading && (<Card><CardContent className="pt-6 text-center"><p className="text-muted-foreground">No authors found. Create your first author to get started!</p></CardContent></Card>)}
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Delete author?" description="This will permanently remove the author." confirmText="Delete" onConfirm={handleDelete} />
    </div>
  );
}

