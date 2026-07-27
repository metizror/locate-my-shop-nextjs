"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Loader2, Search } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBlogPosts, BlogPost } from "@/hooks/useBlogData";

export default function BlogPageClient() {
  const { posts, loading, error } = useBlogPosts();
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const postsPerPage = 9;

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      let filtered = [...posts];
      if (searchQuery) {
        filtered = filtered.filter(post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setFilteredPosts(filtered);
      setCurrentPage(1);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [posts, searchQuery]);

  return (
    <div className="min-h-screen">
      <main className="pt-20">
        {/* Hero is fully static — rendered in every state (loading/error/success)
            so the single <h1> is always present in the server-rendered HTML. */}
        <section
          className="relative py-24 lg:py-32 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/lovable-uploads/blog-hero-bg.jpg')`
          }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <nav className="mb-8">
                <div className="flex items-center space-x-2 text-sm">
                  <Link href="/" className="text-accent hover:text-white transition-colors">
                    Home
                  </Link>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="text-white">Blog</span>
                </div>
              </nav>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-[#f1f0f6] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <BookOpen className="h-4 w-4" />
                Blog
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Latest Insights &
                <span className="text-white"> Expert Tips</span>
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl">
                Discover expert insights, best practices, and the latest trends in store locators, local business growth, and customer engagement.
              </p>
            </div>
          </div>
        </section>

        {error ? (
          /* Error state — uses <h2> (NOT <h1>) so it never duplicates the hero h1 above. */
          <section className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Error Loading Blog</h2>
            <p className="text-muted-foreground">{error}</p>
          </section>
        ) : (
        <>
        <section className="py-4 md:py-8 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-8 md:pb-16 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {loading || isSearching ? (
                <div className="text-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">{loading ? "Loading blog posts..." : "Searching posts..."}</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <h2 className="text-2xl font-semibold mb-4">No posts found</h2>
                  <p className="text-muted-foreground mb-6">Try another search term.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage).map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                  {filteredPosts.length > postsPerPage && (
                    <div className="flex justify-center items-center gap-2 mt-8 md:mt-12">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2"
                      >
                        Previous
                      </Button>
                      {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, i) => (
                        <Button
                          key={i + 1}
                          variant={currentPage === i + 1 ? "default" : "outline"}
                          onClick={() => setCurrentPage(i + 1)}
                          className="px-3 py-2 min-w-[40px]"
                        >
                          {i + 1}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredPosts.length / postsPerPage)))}
                        disabled={currentPage === Math.ceil(filteredPosts.length / postsPerPage)}
                        className="px-3 py-2"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
        </>
        )}
      </main>
    </div>
  );
}


