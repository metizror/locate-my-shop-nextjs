import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ArrowRight, Eye, MessageCircle, Heart } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  date_day: string;
  date_month: string;
  date_year: string;
  read_time: string;
  slug: string;
  published_at: string;
  author?: {
    name: string;
    avatar_url: string;
  };
  views?: number;
  comments?: number;
  likes?: number;
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  const cardClass = featured 
    ? "group relative overflow-hidden gradient-card border-0 shadow-elegant hover:shadow-glow transition-smooth hover:-translate-y-2 lg:col-span-2"
    : "group relative overflow-hidden gradient-card border-0 shadow-elegant hover:shadow-card transition-smooth hover:-translate-y-1";

  const imageClass = featured
    ? "w-full h-48 md:h-64 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
    : "w-full h-40 md:h-48 object-cover transition-transform duration-700 group-hover:scale-105";

  return (
    <Card className={cardClass}>
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative data-admin-blog overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            className={imageClass}
            loading="lazy"
          />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground border-0 px-3 py-1 shadow-card">
          {post.category}
        </Badge>
        

        {/* Author Avatar (for featured posts) */}
        {featured && post.author && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-background/95 backdrop-blur-sm rounded-full p-2 shadow-card">
            <img
              src={post.author.avatar_url}
              alt={post.author.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-foreground pr-2">{post.author.name}</span>
          </div>
        )}
        </div>
      </Link>
      
      <CardContent className="p-4 md:p-6">
        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              {post.date_day} {post.date_month}, {post.date_year}
            </span>
            <span>{post.read_time}</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            {post.views && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {post.views}
              </span>
            )}
            {post.comments && (
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {post.comments}
              </span>
            )}
            {post.likes && (
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {post.likes}
              </span>
            )}
          </div>
        </div>
        
        {/* Title — H2 so the listing has a proper H1 -> H2 heading hierarchy.
            Same classes as before, so the visual size is unchanged. */}
        <h2 className={`font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight ${
          featured ? 'text-2xl lg:text-3xl' : 'text-xl'
        }`}>
          {post.title}
        </h2>
        
        {/* Excerpt */}
        <p className={`text-muted-foreground mb-6 line-clamp-3 leading-relaxed ${
          featured ? 'text-base' : 'text-sm'
        }`}>
          {post.excerpt}
        </p>
        
        {/* Read More Link */}
        <Link href={`/blog/${post.slug}`} className="group/link">
          <div className="flex items-center justify-between">
            <span className="text-primary font-medium group-hover/link:text-primary/80 transition-colors">
              Read Article
            </span>
            <ArrowRight className="w-5 h-5 text-primary group-hover/link:translate-x-1 transition-transform" />
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default BlogCard;