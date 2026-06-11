import { useFetch } from "../../helpers/hooks";
import { getBlogById, type TBlog } from "../../helpers/backend";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface BlogDetailProps {
  blogId: string;
}

const BlogDetail = ({ blogId }: BlogDetailProps) => {
  const { data: blog, isLoading, error } = useFetch<TBlog>("blog-detail", getBlogById, {
    id: blogId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog not found</h1>
        <p className="text-gray-600 mb-8">The blog post you are looking for does not exist or has been removed.</p>
        <Link
          from="/"
          to="/blog"
          params={{}}
          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-white hover:bg-red-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blogs
        </Link>
      </div>
    );
  }

  const category =
    typeof blog.category === "object"
      ? blog.category.name
      : typeof blog.category === "string"
      ? blog.category
      : "Blog";

  return (
    <main className="container mx-auto px-4 py-10 max-w-5xl">
      <Link
        from="/"
        to="/blog"
        params={{}}
        className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blogs
      </Link>

      <article className="mt-8 space-y-8 rounded-3xl bg-white p-8 shadow-sm border border-gray-200">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
              {category}
            </span>
            {blog.tags?.map((tag) => (
              <span key={(typeof tag === 'object' ? tag._id : tag) ?? String(tag)} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {typeof tag === 'object' ? tag.name : tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-bold text-gray-900">{blog.title}</h1>

          <div className="text-sm text-gray-500">
            {blog.createdAt && new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>

        {blog.image ? (
          <div className="overflow-hidden rounded-3xl border border-gray-200">
            <img src={blog.image} alt={blog.title} className="w-full object-cover" />
          </div>
        ) : null}

        <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line">
          {blog.description || "No description available."}
        </div>
      </article>
    </main>
  );
};

export default BlogDetail;
