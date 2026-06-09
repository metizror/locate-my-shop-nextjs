import { useQuery } from "@tanstack/react-query";
import { deriveExcerpt } from "@/lib/text";

async function fetchJson<T = any>(url: string, allowNotFound = false): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (res.status === 404 && allowNotFound) return null as T;
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  date_day: string;
  date_month: string;
  date_year: string;
  read_time: string;
  slug: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  author_id: string | null;
  seo_title?: string;
  seo_description?: string;
  seo_schema?: any; // jsonb payload for JSON-LD
  author?: {
    id: string;
    name: string;
    bio: string;
    avatar_url: string;
    twitter_url?: string;
    linkedin_url?: string;
    facebook_url?: string;
  };
  views?: number;
  comments?: number;
  likes?: number;
}

const normalizePost = (p: any): BlogPost => ({
  id: p.id,
  title: p.title ?? "",
  // Fall back to a derived excerpt when none was provided (e.g. heyfilo posts).
  excerpt: (p.excerpt && String(p.excerpt).trim()) || deriveExcerpt(p.content),
  content: p.content ?? "",
  image_url: p.image_url ?? "",
  category: p.category ?? "",
  date_day: p.date_day ?? "",
  date_month: p.date_month ?? "",
  date_year: p.date_year ?? "",
  read_time: p.read_time ?? "",
  slug: p.slug ?? "",
  published_at: p.published_at ?? "",
  created_at: p.created_at ?? "",
  updated_at: p.updated_at ?? "",
  user_id: p.user_id ?? null,
  author_id: p.author_id ?? null,
  seo_title: p.seo_title ?? undefined,
  seo_description: p.seo_description ?? undefined,
  seo_schema: p.seo_schema ?? undefined,
  author: p.author ?? undefined,
  views: p.views ?? undefined,
  comments: p.comments ?? undefined,
  likes: p.likes ?? undefined,
});

export interface BlogAuthor {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
  twitter_url?: string;
  linkedin_url?: string;
  facebook_url?: string;
  created_at: string;
  updated_at: string;
}

export const useBlogPosts = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const data = await fetchJson<any[]>('/api/posts');
      return (data || []).map(normalizePost);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return { 
    posts: data || [], 
    loading: isLoading, 
    error: error ? (error instanceof Error ? error.message : 'An error occurred') : null, 
    refetch 
  };
};

export const useBlogPost = (slug: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      if (!slug) return null;
      let decodedSlug = slug;
      try { decodedSlug = decodeURIComponent(slug); } catch {}

      const data = await fetchJson(
        `/api/posts/${encodeURIComponent(decodedSlug)}`,
        true
      );
      return data ? normalizePost(data) : null;
    },
    enabled: !!slug, // Only run query if slug exists
    staleTime: 5 * 60 * 1000, // 5 minutes - cache for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 minutes
  });

  return { 
    post: data || null, 
    loading: isLoading, 
    error: error ? (error instanceof Error ? error.message : 'Post not found') : null 
  };
};

export const useBlogAuthors = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['blog-authors'],
    queryFn: async () => {
      const data = await fetchJson<any[]>('/api/admin/authors');
      return (data || []).map((a: any) => ({
        id: a.id,
        name: a.name ?? "",
        bio: a.bio ?? "",
        avatar_url: a.avatar_url ?? "",
        twitter_url: a.twitter_url ?? undefined,
        linkedin_url: a.linkedin_url ?? undefined,
        facebook_url: a.facebook_url ?? undefined,
        created_at: a.created_at ?? "",
        updated_at: a.updated_at ?? "",
      }));
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - authors don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return { 
    authors: data || [], 
    loading: isLoading, 
    error: error ? (error instanceof Error ? error.message : 'An error occurred') : null, 
    refetch 
  };
};