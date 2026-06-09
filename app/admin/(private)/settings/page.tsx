"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save, Globe, Mail, Shield, BarChart3 } from "lucide-react";

interface BlogSettings { siteName: string; siteDescription: string; siteUrl: string; contactEmail: string; socialLinks: { twitter: string; facebook: string; linkedin: string; instagram: string; }; seoSettings: { metaTitle: string; metaDescription: string; ogImage: string; }; emailSettings: { enableNewsletter: boolean; smtpHost: string; smtpPort: string; smtpUser: string; }; commentSettings: { enableComments: boolean; moderateComments: boolean; allowAnonymous: boolean; }; analyticsSettings: { googleAnalyticsId: string; enableTracking: boolean; }; }

export default function SettingsPage() {
  const [settings, setSettings] = useState<BlogSettings>({ siteName: "My Blog", siteDescription: "A modern blog built with React and Supabase", siteUrl: "https://myblog.com", contactEmail: "contact@myblog.com", socialLinks: { twitter: "", facebook: "", linkedin: "", instagram: "" }, seoSettings: { metaTitle: "My Blog - Latest Insights & Tips", metaDescription: "Discover the latest insights, tips, and expert advice on our blog.", ogImage: "" }, emailSettings: { enableNewsletter: true, smtpHost: "", smtpPort: "587", smtpUser: "" }, commentSettings: { enableComments: true, moderateComments: true, allowAnonymous: false }, analyticsSettings: { googleAnalyticsId: "", enableTracking: true } });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings', { credentials: 'include' });
      if (!res.ok) { setLoading(false); return; }
      const settingsData = await res.json();
      if (settingsData) {
        setSettings({
          siteName: settingsData.site_name ?? "",
          siteDescription: settingsData.site_description ?? "",
          siteUrl: settingsData.site_url ?? "",
          contactEmail: settingsData.contact_email ?? "",
          socialLinks: (settingsData.social_links as any) ?? { twitter: "", facebook: "", linkedin: "", instagram: "" },
          seoSettings: (settingsData.seo_settings as any) ?? { metaTitle: "", metaDescription: "", ogImage: "" },
          emailSettings: (settingsData.email_settings as any) ?? { enableNewsletter: false, smtpHost: "", smtpPort: "", smtpUser: "" },
          commentSettings: (settingsData.comment_settings as any) ?? { enableComments: true, moderateComments: true, allowAnonymous: false },
          analyticsSettings: (settingsData.analytics_settings as any) ?? { googleAnalyticsId: "", enableTracking: false },
        });
      }
      setLoading(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load settings. Using default values.", variant: "destructive" });
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const settingsData = { site_name: settings.siteName, site_description: settings.siteDescription, site_url: settings.siteUrl, contact_email: settings.contactEmail, social_links: settings.socialLinks, seo_settings: settings.seoSettings, email_settings: settings.emailSettings, comment_settings: settings.commentSettings, analytics_settings: settings.analyticsSettings };
      const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(settingsData) });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to save');
      toast({ title: "Settings Saved", description: "Your blog settings have been updated successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save settings. Please try again.", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const updateSettings = (section: string, field: string, value: any) => {
    setSettings(prev => {
      const currentSection = prev[section as keyof BlogSettings];
      if (typeof currentSection === 'object' && currentSection !== null) {
        return { ...prev, [section]: { ...(currentSection as Record<string, any>), [field]: value } };
      }
      return prev;
    });
  };
  const updateRootSetting = (field: string, value: string) => { setSettings(prev => ({ ...prev, [field]: value })); };

  if (loading) {
    return (
      <div className="space-y-6"><Card className="gradient-card border-0 shadow-card"><CardContent className="p-6"><div className="animate-pulse space-y-4"><div className="h-4 bg-muted rounded w-1/4"></div><div className="h-8 bg-muted rounded w-1/2"></div><div className="h-4 bg-muted rounded w-3/4"></div></div></CardContent></Card></div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure your blog settings and preferences</p>
        </div>
        <Button onClick={saveSettings} disabled={saving} className="bg-primary hover:bg-primary-soft"><Save className="w-4 h-4 mr-2" />{saving ? "Saving..." : "Save Changes"}</Button>
      </div>
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5"><TabsTrigger value="general">General</TabsTrigger><TabsTrigger value="seo">SEO</TabsTrigger><TabsTrigger value="comments">Comments</TabsTrigger><TabsTrigger value="email">Email</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger></TabsList>
        <TabsContent value="general" className="space-y-6">
          <Card className="gradient-card border-0 shadow-card"><CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" />Site Information</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><Label htmlFor="siteName">Site Name</Label><Input id="siteName" value={settings.siteName} onChange={(e)=> updateRootSetting("siteName", e.target.value)} placeholder="Enter site name" /></div><div><Label htmlFor="siteUrl">Site URL</Label><Input id="siteUrl" value={settings.siteUrl} onChange={(e)=> updateRootSetting("siteUrl", e.target.value)} placeholder="https://yoursite.com" /></div></div><div><Label htmlFor="siteDescription">Site Description</Label><Textarea id="siteDescription" value={settings.siteDescription} onChange={(e)=> updateRootSetting("siteDescription", e.target.value)} placeholder="Brief description of your blog" rows={3} /></div><div><Label htmlFor="contactEmail">Contact Email</Label><Input id="contactEmail" type="email" value={settings.contactEmail} onChange={(e)=> updateRootSetting("contactEmail", e.target.value)} placeholder="contact@yoursite.com" /></div></CardContent></Card>
          <Card className="gradient-card border-0 shadow-card"><CardHeader><CardTitle>Social Media Links</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><Label htmlFor="twitter">Twitter</Label><Input id="twitter" value={settings.socialLinks.twitter} onChange={(e)=> updateSettings("socialLinks", "twitter", e.target.value)} placeholder="https://twitter.com/username" /></div><div><Label htmlFor="facebook">Facebook</Label><Input id="facebook" value={settings.socialLinks.facebook} onChange={(e)=> updateSettings("socialLinks", "facebook", e.target.value)} placeholder="https://facebook.com/page" /></div><div><Label htmlFor="linkedin">LinkedIn</Label><Input id="linkedin" value={settings.socialLinks.linkedin} onChange={(e)=> updateSettings("socialLinks", "linkedin", e.target.value)} placeholder="https://linkedin.com/company/name" /></div><div><Label htmlFor="instagram">Instagram</Label><Input id="instagram" value={settings.socialLinks.instagram} onChange={(e)=> updateSettings("socialLinks", "instagram", e.target.value)} placeholder="https://instagram.com/username" /></div></div></CardContent></Card>
        </TabsContent>
        <TabsContent value="seo" className="space-y-6">
          <Card className="gradient-card border-0 shadow-card"><CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" />SEO Settings</CardTitle></CardHeader><CardContent className="space-y-4"><div><Label htmlFor="metaTitle">Default Meta Title</Label><Input id="metaTitle" value={settings.seoSettings.metaTitle} onChange={(e)=> updateSettings("seoSettings", "metaTitle", e.target.value)} placeholder="Your Blog - Latest Insights" /><p className="text-xs text-muted-foreground mt-1">Recommended: 50-60 characters</p></div><div><Label htmlFor="metaDescription">Default Meta Description</Label><Textarea id="metaDescription" value={settings.seoSettings.metaDescription} onChange={(e)=> updateSettings("seoSettings", "metaDescription", e.target.value)} placeholder="Discover the latest insights, tips, and expert advice" rows={3} /><p className="text-xs text-muted-foreground mt-1">Recommended: 150-160 characters</p></div><div><Label htmlFor="ogImage">Default OG Image URL</Label><Input id="ogImage" value={settings.seoSettings.ogImage} onChange={(e)=> updateSettings("seoSettings", "ogImage", e.target.value)} placeholder="https://yoursite.com/og-image.jpg" /></div></CardContent></Card>
        </TabsContent>
        <TabsContent value="comments" className="space-y-6">
          <Card className="gradient-card border-0 shadow-card"><CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" />Comment Settings</CardTitle></CardHeader><CardContent className="space-y-6"><div className="flex items-center justify-between"><div><h4 className="font-medium">Enable Comments</h4><p className="text-sm text-muted-foreground">Allow visitors to comment on blog posts</p></div><Switch checked={settings.commentSettings.enableComments} onCheckedChange={(checked)=> updateSettings("commentSettings", "enableComments", checked)} /></div><Separator /><div className="flex items-center justify-between"><div><h4 className="font-medium">Moderate Comments</h4><p className="text-sm text-muted-foreground">Require approval before comments are published</p></div><Switch checked={settings.commentSettings.moderateComments} onCheckedChange={(checked)=> updateSettings("commentSettings", "moderateComments", checked)} /></div><Separator /><div className="flex items-center justify-between"><div><h4 className="font-medium">Allow Anonymous Comments</h4><p className="text-sm text-muted-foreground">Let users comment without logging in</p></div><Switch checked={settings.commentSettings.allowAnonymous} onCheckedChange={(checked)=> updateSettings("commentSettings", "allowAnonymous", checked)} /></div></CardContent></Card>
        </TabsContent>
        <TabsContent value="email" className="space-y-6">
          <Card className="gradient-card border-0 shadow-card"><CardHeader><CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5" />Email Settings</CardTitle></CardHeader><CardContent className="space-y-6"><div className="flex items-center justify-between"><div><h4 className="font-medium">Enable Newsletter</h4><p className="text-sm text-muted-foreground">Allow visitors to subscribe to your newsletter</p></div><Switch checked={settings.emailSettings.enableNewsletter} onCheckedChange={(checked)=> updateSettings("emailSettings", "enableNewsletter", checked)} /></div><Separator /><div className="space-y-4"><h4 className="font-medium">SMTP Configuration</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><Label htmlFor="smtpHost">SMTP Host</Label><Input id="smtpHost" value={settings.emailSettings.smtpHost} onChange={(e)=> updateSettings("emailSettings", "smtpHost", e.target.value)} placeholder="smtp.gmail.com" /></div><div><Label htmlFor="smtpPort">SMTP Port</Label><Input id="smtpPort" value={settings.emailSettings.smtpPort} onChange={(e)=> updateSettings("emailSettings", "smtpPort", e.target.value)} placeholder="587" /></div></div><div><Label htmlFor="smtpUser">SMTP Username</Label><Input id="smtpUser" value={settings.emailSettings.smtpUser} onChange={(e)=> updateSettings("emailSettings", "smtpUser", e.target.value)} placeholder="your-email@gmail.com" /></div></div></CardContent></Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-6">
          <Card className="gradient-card border-0 shadow-card"><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" />Analytics Settings</CardTitle></CardHeader><CardContent className="space-y-6"><div className="flex items-center justify-between"><div><h4 className="font-medium">Enable Analytics Tracking</h4><p className="text-sm text-muted-foreground">Track page views and user interactions</p></div><Switch checked={settings.analyticsSettings.enableTracking} onCheckedChange={(checked)=> updateSettings("analyticsSettings", "enableTracking", checked)} /></div><Separator /><div><Label htmlFor="googleAnalyticsId">Google Analytics ID</Label><Input id="googleAnalyticsId" value={settings.analyticsSettings.googleAnalyticsId} onChange={(e)=> updateSettings("analyticsSettings", "googleAnalyticsId", e.target.value)} placeholder="GA-XXXXXXXXX-X" /><p className="text-xs text-muted-foreground mt-1">Enter your Google Analytics tracking ID</p></div></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

