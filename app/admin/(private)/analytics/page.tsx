"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Eye, Users, MessageCircle, Calendar, Globe, Smartphone, Monitor, Tablet } from "lucide-react";

interface AnalyticsData { totalViews: number; uniqueVisitors: number; totalComments: number; averageReadTime: string; topPosts: any[]; recentActivity: any[]; deviceStats: { desktop: number; mobile: number; tablet: number; }; trafficSources: { direct: number; search: number; social: number; referral: number; }; }

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({ totalViews: 0, uniqueVisitors: 0, totalComments: 0, averageReadTime: "0m", topPosts: [], recentActivity: [], deviceStats: { desktop: 0, mobile: 0, tablet: 0 }, trafficSources: { direct: 0, search: 0, social: 0, referral: 0 } });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => { fetchAnalyticsData(); }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, postsRes] = await Promise.all([
        fetch('/api/admin/analytics', { credentials: 'include' }),
        fetch('/api/posts', { credentials: 'include' }),
      ]);
      const analytics = analyticsRes.ok ? await analyticsRes.json() : [];
      const allPosts = postsRes.ok ? await postsRes.json() : [];
      const posts = allPosts.slice(0, 5);
      setAnalyticsData({ totalViews: 12540, uniqueVisitors: 8920, totalComments: analytics?.length || 0, averageReadTime: "3m 24s", topPosts: posts || [], recentActivity: analytics?.slice(0, 10) || [], deviceStats: { desktop: 65, mobile: 28, tablet: 7 }, trafficSources: { direct: 45, search: 35, social: 15, referral: 5 } });
    } finally { setLoading(false); }
  };

  const overviewStats = [
    { title: "Total Views", value: analyticsData.totalViews.toLocaleString(), icon: Eye, change: "+12.5%", changeType: "positive" as const, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Unique Visitors", value: analyticsData.uniqueVisitors.toLocaleString(), icon: Users, change: "+8.2%", changeType: "positive" as const, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Comments", value: analyticsData.totalComments.toLocaleString(), icon: MessageCircle, change: "+15.3%", changeType: "positive" as const, color: "text-purple-600", bgColor: "bg-purple-50" },
    { title: "Avg. Read Time", value: analyticsData.averageReadTime, icon: Calendar, change: "+5.1%", changeType: "positive" as const, color: "text-orange-600", bgColor: "bg-orange-50" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map((i)=> (
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
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track your blog's performance and audience engagement</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
          <Card key={index} className="gradient-card border-0 shadow-card hover:shadow-glow transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-muted-foreground">{stat.title}</p><p className="text-2xl font-bold text-foreground">{stat.value}</p></div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
              </div>
              <div className="mt-4 flex items-center gap-2"><Badge variant={stat.changeType === "positive" ? "default" : "secondary"} className="text-xs">{stat.change}</Badge><span className="text-xs text-muted-foreground">vs previous period</span></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="posts">Top Posts</TabsTrigger><TabsTrigger value="audience">Audience</TabsTrigger><TabsTrigger value="sources">Sources</TabsTrigger></TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="gradient-card border-0 shadow-card"><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" />Views Over Time</CardTitle></CardHeader><CardContent><div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg"><div className="text-center"><BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" /><p className="text-muted-foreground">Chart visualization would go here</p></div></div></CardContent></Card>
            <Card className="gradient-card border-0 shadow-card"><CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader><CardContent className="space-y-3">{analyticsData.recentActivity.length === 0 ? (<div className="text-center py-8"><TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" /><p className="text-muted-foreground">No recent activity</p></div>) : (analyticsData.recentActivity.map((activity:any, index:number) => (<div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"><div className="w-2 h-2 bg-primary rounded-full"></div><div className="flex-1"><p className="text-sm font-medium">Page view</p><p className="text-xs text-muted-foreground">{new Date(activity.created_at).toLocaleString()}</p></div></div>)))}</CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="posts" className="space-y-6">
          <Card className="gradient-card border-0 shadow-card"><CardHeader><CardTitle>Top Performing Posts</CardTitle></CardHeader><CardContent className="space-y-4">{analyticsData.topPosts.map((post:any, index:number) => (<div key={post.id} className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"><div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"><span className="text-sm font-bold text-primary">#{index + 1}</span></div><img src={post.image_url} alt={post.title} className="w-16 h-16 object-cover rounded-lg" /><div className="flex-1"><h4 className="font-medium text-foreground">{post.title}</h4><div className="flex items-center gap-2 mt-1"><Badge variant="secondary" className="text-xs">{post.category}</Badge><span className="text-sm text-muted-foreground">by {post.author?.name}</span></div></div><div className="text-right"><p className="text-lg font-bold text-foreground">{Math.floor(Math.random() * 1000 + 100)}</p><p className="text-xs text-muted-foreground">views</p></div></div>))}</CardContent></Card>
        </TabsContent>
        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="gradient-card border-0 shadow-card"><CardHeader><CardTitle>Device Breakdown</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Monitor className="w-4 h-4 text-muted-foreground" /><span className="text-sm">Desktop</span></div><div className="flex items-center gap-2"><div className="w-24 bg-muted rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{ width: `${analyticsData.deviceStats.desktop}%` }}></div></div><span className="text-sm font-medium">{analyticsData.deviceStats.desktop}%</span></div></div><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-muted-foreground" /><span className="text-sm">Mobile</span></div><div className="flex items-center gap-2"><div className="w-24 bg-muted rounded-full h-2"><div className="bg-secondary h-2 rounded-full" style={{ width: `${analyticsData.deviceStats.mobile}%` }}></div></div><span className="text-sm font-medium">{analyticsData.deviceStats.mobile}%</span></div></div><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Tablet className="w-4 h-4 text-muted-foreground" /><span className="text-sm">Tablet</span></div><div className="flex items-center gap-2"><div className="w-24 bg-muted rounded-full h-2"><div className="bg-accent h-2 rounded-full" style={{ width: `${analyticsData.deviceStats.tablet}%` }}></div></div><span className="text-sm font-medium">{analyticsData.deviceStats.tablet}%</span></div></div></CardContent></Card>
            <Card className="gradient-card border-0 shadow-card"><CardHeader><CardTitle>Traffic Sources</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Globe className="w-4 h-4 text-muted-foreground" /><span className="text-sm">Direct</span></div><div className="flex items-center gap-2"><div className="w-24 bg-muted rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{ width: `${analyticsData.trafficSources.direct}%` }}></div></div><span className="text-sm font-medium">{analyticsData.trafficSources.direct}%</span></div></div><div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-sm">Search</span></div><div className="flex items-center gap-2"><div className="w-24 bg-muted rounded-full h-2"><div className="bg-secondary h-2 rounded-full" style={{ width: `${analyticsData.trafficSources.search}%` }}></div></div><span className="text-sm font-medium">{analyticsData.trafficSources.search}%</span></div></div><div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-sm">Social</span></div><div className="flex items-center gap-2"><div className="w-24 bg-muted rounded-full h-2"><div className="bg-accent h-2 rounded-full" style={{ width: `${analyticsData.trafficSources.social}%` }}></div></div><span className="text-sm font-medium">{analyticsData.trafficSources.social}%</span></div></div><div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-sm">Referral</span></div><div className="flex items-center gap-2"><div className="w-24 bg-muted rounded-full h-2"><div className="bg-muted-foreground h-2 rounded-full" style={{ width: `${analyticsData.trafficSources.referral}%` }}></div></div><span className="text-sm font-medium">{analyticsData.trafficSources.referral}%</span></div></div></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="sources"><Card className="gradient-card border-0 shadow-card"><CardHeader><CardTitle>Traffic Sources Detail</CardTitle></CardHeader><CardContent><div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg"><div className="text-center"><Globe className="w-12 h-12 text-muted-foreground mx-auto mb-2" /><p className="text-muted-foreground">Detailed traffic source analysis would go here</p></div></div></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}

