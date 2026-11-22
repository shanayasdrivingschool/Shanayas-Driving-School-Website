import SeoManager from "@/components/SeoManager";
import { usePublicBlogPosts } from "@/lib/publicBlog";

// Loaded alongside blog routes, keeping article bodies and the blog API client
// out of the initial request for campaign pages and other static service pages.
export default function BlogSeoManager() {
  const { posts } = usePublicBlogPosts();
  return <SeoManager blogPosts={posts} />;
}
