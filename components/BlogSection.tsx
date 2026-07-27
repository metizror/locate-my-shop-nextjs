"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useBlogPosts, type BlogPost } from "@/hooks/useBlogData";

// Fields needed to render a blog card. Server-fetched posts (a subset of the
// full BlogPost) satisfy this, so the links can be rendered in the initial HTML.
type BlogCardPost = Pick<
  BlogPost,
  | "id"
  | "slug"
  | "title"
  | "excerpt"
  | "image_url"
  | "category"
  | "date_day"
  | "date_month"
  | "date_year"
  | "read_time"
>;

interface BlogSectionProps {
  /** Server-rendered initial posts so crawlers see the links without JS. */
  initialPosts?: BlogCardPost[];
}

const BlogSection = ({ initialPosts = [] }: BlogSectionProps) => {
  const { posts, loading, error } = useBlogPosts();
  // Prefer freshly-fetched posts once available; otherwise use the server-rendered
  // initial posts (present in SSR/initial HTML).
  const source: BlogCardPost[] = posts.length ? posts : initialPosts;
  const latestPosts = source.slice(0, 3);
  // Only show the loading/error states when we have nothing to render yet.
  const showLoading = loading && initialPosts.length === 0;
  const showError = !!error && initialPosts.length === 0 && latestPosts.length === 0;
  return (
    <section className="py-[10px] bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 pt-[20px]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <BookOpen className="h-4 w-4" />
              Blog
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Latest
              <span className="gradient-hero bg-clip-text text-transparent"> Insights</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest trends, tips, and strategies for store locators and local business growth.
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {showLoading && (
              <div className="col-span-full flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading latest articles...
              </div>
            )}
            {showError && (
              <div className="col-span-full text-center text-sm text-destructive">
                Failed to load articles. Please try again later.
              </div>
            )}
            {!showLoading && !showError && latestPosts.map((post) => (
              <Card key={post.id} className="gradient-card border-0 shadow-elegant hover:shadow-card transition-smooth group overflow-hidden relative cursor-pointer">
                <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" aria-label={post.title} />
                <div className="relative">
                  <Image 
                    src={post.image_url} 
                    alt={post.title}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    quality={80}
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date_day} {post.date_month}, {post.date_year}
                      </span>
                      <span>{post.read_time}</span>
                    </div>
                    <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all text-left"
                      asChild
                    >
                      <Link href={`/blog/${post.slug}`}>
                        Read: {post.title.split(' ').slice(0, 4).join(' ')}
                        {post.title.split(' ').length > 4 && '...'}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 shrink-0" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View All CTA */}
          <div className="text-center">
           
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;