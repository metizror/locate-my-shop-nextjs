"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Eye, BarChart3, Plus, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPosts: 0, publishedPosts: 0, totalAuthors: 0, totalViews: 0, recentPosts: [] as any[] });

  useEffect(() => { fetchDashboardStats(); }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [postsRes, authorsRes] = await Promise.all([
        fetch('/api/posts', { credentials: 'include' }),
        fetch('/api/admin/authors', { credentials: 'include' }),
      ]);
      const posts: any[] = postsRes.ok ? await postsRes.json() : [];
      const authors: any[] = authorsRes.ok ? await authorsRes.json() : [];
      const publishedPosts = posts.filter((p) => p.published_at !== null).length;
      const recentPosts = [...posts]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      setStats({ totalPosts: posts.length, publishedPosts, totalAuthors: authors.length, totalViews: 1250, recentPosts });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>
    );
  }

  const statCards = [
    { title: "Total Posts", value: stats.totalPosts, icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50", change: "+12%" },
    { title: "Published", value: stats.publishedPosts, icon: Eye, color: "text-green-600", bgColor: "bg-green-50", change: "+8%" },
    { title: "Authors", value: stats.totalAuthors, icon: Users, color: "text-purple-600", bgColor: "bg-purple-50", change: "+2" },
    { title: "Total Views", value: stats.totalViews.toLocaleString(), icon: BarChart3, color: "text-orange-600", bgColor: "bg-orange-50", change: "+23%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your blog.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/posts?new=1"><Button className="bg-primary hover:bg-primary-soft"><Plus className="w-4 h-4 mr-2" />New Post</Button></Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="gradient-card border border-border shadow-card hover:shadow-glow transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-muted-foreground">{stat.title}</p><p className="text-2xl font-bold text-foreground">{stat.value}</p></div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
              </div>
              <div className="mt-4 flex items-center gap-2"><Badge className="text-xs">{stat.change}</Badge><span className="text-xs text-muted-foreground">from last month</span></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="gradient-card border border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold">Recent Posts</CardTitle>
            <Link href="/admin/posts"><Button variant="outline" size="sm">View All<ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentPosts.length === 0 ? (
              <div className="text-center py-8"><FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No posts yet</p><Link href="/admin/posts?new=1"><Button className="mt-4"><Plus className="w-4 h-4 mr-2" />Create First Post</Button></Link></div>
            ) : (
              stats.recentPosts.map((post:any) => (
                <div key={post.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <img src={post.image_url} alt={post.title} className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground line-clamp-1">{post.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card className="gradient-card border border-border shadow-card">
          <CardHeader><CardTitle className="text-xl font-semibold">Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/posts" className="block"><Button variant="outline" className="w-full justify-start gap-3 h-12"><Plus className="w-5 h-5" /><div className="text-left"><div className="font-medium">Create New Post</div><div className="text-xs text-muted-foreground">Write and publish a new article</div></div></Button></Link>
            <Link href="/admin/authors" className="block"><Button variant="outline" className="w-full justify-start gap-3 h-12"><Users className="w-5 h-5" /><div className="text-left"><div className="font-medium">Add New Author</div><div className="text-xs text-muted-foreground">Create a new author profile</div></div></Button></Link>
            <Link href="/admin/analytics" className="block"><Button variant="outline" className="w-full justify-start gap-3 h-12"><BarChart3 className="w-5 h-5" /><div className="text-left"><div className="font-medium">View Analytics</div><div className="text-xs text-muted-foreground">Check your blog performance</div></div></Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
